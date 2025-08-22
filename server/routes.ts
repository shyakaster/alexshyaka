import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertCommentSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";
import { z } from "zod";
import { MailService } from '@sendgrid/mail';
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve sitemap.xml with correct content-type
  app.get("/sitemap.xml", (req, res) => {
    res.set('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Homepage -->
  <url>
    <loc>https://alexshyaka.site/</loc>
    <lastmod>2025-08-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Blog Index -->
  <url>
    <loc>https://alexshyaka.site/blog</loc>
    <lastmod>2025-08-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Blog Posts -->
  <url>
    <loc>https://alexshyaka.site/blog/building-market-ready-tech-skills-african-graduates</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://alexshyaka.site/blog/our-learning-journey-building-future-tech-leaders</loc>
    <lastmod>2021-09-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://alexshyaka.site/blog/attention-economy-affecting-teens-part-one</loc>
    <lastmod>2021-02-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://alexshyaka.site/blog/building-technology-community-uganda-global-practitioners</loc>
    <lastmod>2020-12-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
</urlset>`);
  });

  // Serve robots.txt with correct content-type
  app.get("/robots.txt", (req, res) => {
    const robotsPath = path.join(process.cwd(), "client/public/robots.txt");
    
    if (fs.existsSync(robotsPath)) {
      res.set('Content-Type', 'text/plain');
      res.sendFile(robotsPath);
    } else {
      res.status(404).send("Robots.txt not found");
    }
  });
  // Dynamic sitemap generation endpoint
  app.get("/api/sitemap", async (req, res) => {
    try {
      res.set('Content-Type', 'application/xml');
      
      // Get all published blog posts
      const posts = await storage.getBlogPosts({ published: true });
      
      // Generate sitemap XML
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- Homepage -->
  <url>
    <loc>https://alexshyaka.site/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Blog Index -->
  <url>
    <loc>https://alexshyaka.site/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

      // Add blog posts
      for (const post of posts) {
        const lastmod = new Date(post.updatedAt || post.createdAt).toISOString().split('T')[0];
        sitemap += `
  
  <!-- ${post.title} -->
  <url>
    <loc>https://alexshyaka.site/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }

      sitemap += `
  
</urlset>`;

      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Initialize SendGrid
  const mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY!);

  // Contact form endpoint - temporary storage solution
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Validation
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }

      // Store the message temporarily (for now, just log it)
      const contactMessage = {
        name,
        email,
        subject: subject || 'No subject',
        message,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };

      // Log the contact message for now (you can retrieve from server logs)
      console.log("=== NEW CONTACT FORM SUBMISSION ===");
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: ${contactMessage.subject}`);
      console.log(`Message: ${message}`);
      console.log(`Time: ${new Date().toLocaleString()}`);
      console.log("=====================================");

      // Try to send email but don't fail if it doesn't work
      try {
        if (process.env.SENDGRID_API_KEY) {
          const emailMsg = {
            to: 'alex.nkusi@codeimpact.co',
            from: 'alex.nkusi@codeimpact.co',
            replyTo: email,
            subject: `${contactMessage.subject} - From ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px;">
                  New Contact Form Message
                </h2>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>From:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subject:</strong> ${contactMessage.subject}</p>
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
            `
          };
          await mailService.send(emailMsg);
          console.log("Email sent successfully via SendGrid");
        }
      } catch (emailError) {
        console.error("Email sending failed, but form submission logged:", emailError);
      }
      
      res.json({ success: true, message: "Message received successfully! I'll get back to you soon." });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Failed to submit message" });
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
      
      // Auto-generate slug from title if not provided
      if (!validatedData.slug && validatedData.title) {
        validatedData.slug = validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim();
      }
      
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
