import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertCommentSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";
import { z } from "zod";
import { MailService } from '@sendgrid/mail';

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize SendGrid
  const mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY!);

  // Contact form email endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Validation
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }

      const emailSubject = subject ? `${subject} - From ${name}` : `New message from ${name}`;
      
      const emailMsg = {
        to: 'alex.nkusi@codeimpact.co',
        from: email, // Use the form submitter's email as sender
        replyTo: 'alex.nkusi@codeimpact.co',
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px;">
              New Contact Form Message
            </h2>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #007acc; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Reply to:</strong> ${email}<br>
                <strong>Sent from:</strong> Alex Nkusi Portfolio Website<br>
                <strong>Time:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        `,
        text: `
New Contact Form Message

From: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}

Reply to: ${email}
Sent from: Alex Nkusi Portfolio Website
Time: ${new Date().toLocaleString()}
        `
      };

      await mailService.send(emailMsg);
      
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Admin password verification endpoint
  app.post("/api/admin/verify", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD || "codeimpact2024";
      
      if (password === adminPassword) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } catch (error) {
      console.error("Error verifying admin password:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  // This endpoint is used to serve private objects that can be accessed publicly
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      return res.sendStatus(404);
    }
  });

  // This endpoint is used to get the upload URL for an object entity
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  // Blog Posts API
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const { published, limit, offset, search } = req.query;
      
      let posts;
      if (search && typeof search === 'string') {
        posts = await storage.searchBlogPosts(search);
      } else {
        posts = await storage.getBlogPosts({
          published: published === 'true' ? true : published === 'false' ? false : undefined,
          limit: limit ? parseInt(limit as string) : undefined,
          offset: offset ? parseInt(offset as string) : undefined,
        });
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slugOrId", async (req, res) => {
    try {
      const { slugOrId } = req.params;
      
      // Try to get by slug first, then by ID
      let post = await storage.getBlogPostBySlug(slugOrId);
      if (!post) {
        post = await storage.getBlogPost(slugOrId);
      }
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Increment view count
      if (post.metadata) {
        post.metadata.views = (post.metadata.views || 0) + 1;
        await storage.updateBlogPost(post.id, { metadata: post.metadata });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid blog post data", details: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid blog post data", details: error.errors });
      }
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Handle image uploads for blog posts
  app.put("/api/blog-posts/:id/featured-image", async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const { id } = req.params;
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(
        req.body.imageURL,
      );

      const post = await storage.updateBlogPost(id, { featuredImage: objectPath });
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      res.status(200).json({
        objectPath: objectPath,
        post: post
      });
    } catch (error) {
      console.error("Error setting featured image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Comments API
  app.get("/api/blog-posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await storage.getCommentsByPostId(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/blog-posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        postId
      });
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid comment data", details: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Content import endpoint (for importing from alexshyaka.site)
  app.post("/api/import-content", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "Valid URL is required" });
      }

      // For now, return a mock response since we can't actually fetch from the external site
      // In a real implementation, you would fetch and parse the content
      res.json({ 
        message: "Content import functionality would be implemented here",
        url: url
      });
    } catch (error) {
      console.error("Error importing content:", error);
      res.status(500).json({ error: "Failed to import content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
