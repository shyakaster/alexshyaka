import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type Comment, type InsertComment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog post methods
  getBlogPosts(options?: { published?: boolean; limit?: number; offset?: number }): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  searchBlogPosts(query: string): Promise<BlogPost[]>;

  // Comment methods
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private comments: Map<string, Comment> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create some sample blog posts for demonstration
    const samplePosts: BlogPost[] = [
      {
        id: "1",
        title: "The Evolution of JavaScript Frameworks: What's Next?",
        slug: "evolution-javascript-frameworks-whats-next",
        content: `# The Evolution of JavaScript Frameworks: What's Next?

The JavaScript ecosystem has evolved dramatically over the past decade, with new frameworks and libraries emerging regularly. As we look toward the future, it's essential to understand not just where we've been, but where we're heading.

## The Current Landscape

Today's frontend development is dominated by a few key players: **React** continues to lead in adoption, **Vue.js** offers an approachable alternative, and **Angular** remains strong in enterprise environments. However, newer frameworks like **Svelte** and **Solid.js** are gaining traction with their compile-time optimizations and innovative approaches to reactivity.

> "The best framework is the one that gets out of your way and lets you build great user experiences efficiently."

## Performance-First Frameworks

One of the most significant trends we're seeing is the shift toward performance-first frameworks. Svelte's compile-time approach eliminates the need for a virtual DOM, while Solid.js uses fine-grained reactivity to minimize re-renders.

\`\`\`javascript
// Svelte's reactive approach
let count = 0;
$: doubled = count * 2;

// Solid.js fine-grained reactivity
const [count, setCount] = createSignal(0);
const doubled = createMemo(() => count() * 2);
\`\`\`

## What's Next?

Looking ahead, I expect to see continued innovation in several areas:

- **Edge Computing Integration:** Frameworks designed for edge environments will become mainstream
- **AI-Powered Development:** Tools that understand and generate framework-specific code
- **Zero-Bundle Architectures:** Native ES modules and HTTP/2 enabling new deployment strategies

The JavaScript framework landscape will continue to evolve, but the future looks bright. We're moving toward more efficient, developer-friendly tools that don't compromise on performance or user experience.`,
        excerpt: "Exploring the current landscape of JavaScript frameworks and emerging trends that will shape frontend development in the coming years.",
        featuredImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        tags: ["JavaScript", "React", "Frameworks"],
        published: true,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
        metadata: {
          readTime: 8,
          views: 1200,
          author: "Alex Shyaka"
        }
      },
      {
        id: "2",
        title: "RESTful API Design: Principles and Best Practices",
        slug: "restful-api-design-principles-best-practices",
        content: `# RESTful API Design: Principles and Best Practices

A comprehensive guide to designing clean, maintainable REST APIs. Covering HTTP methods, status codes, resource naming, and documentation best practices.

## Core Principles

REST (Representational State Transfer) is an architectural style that defines a set of constraints for creating web services. When designing RESTful APIs, it's important to follow these core principles...`,
        excerpt: "A comprehensive guide to designing clean, maintainable REST APIs covering HTTP methods, status codes, and best practices.",
        featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        tags: ["API", "REST", "Backend"],
        published: true,
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-03-12"),
        metadata: {
          readTime: 6,
          views: 890,
          author: "Alex Shyaka"
        }
      },
      {
        id: "3",
        title: "Database Performance Optimization Techniques",
        slug: "database-performance-optimization-techniques",
        content: `# Database Performance Optimization Techniques

Learn how to identify performance bottlenecks and optimize your database queries. Covering indexing strategies, query optimization, and monitoring tools.

## Understanding Performance Bottlenecks

Database performance issues can stem from various sources...`,
        excerpt: "Learn how to identify performance bottlenecks and optimize your database queries with indexing strategies and monitoring tools.",
        featuredImage: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        tags: ["Database", "Performance", "SQL"],
        published: true,
        createdAt: new Date("2024-03-08"),
        updatedAt: new Date("2024-03-08"),
        metadata: {
          readTime: 10,
          views: 1500,
          author: "Alex Shyaka"
        }
      }
    ];

    samplePosts.forEach(post => {
      this.blogPosts.set(post.id, post);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog post methods
  async getBlogPosts(options?: { published?: boolean; limit?: number; offset?: number }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    if (options?.published !== undefined) {
      posts = posts.filter(post => post.published === options.published);
    }
    
    // Sort by creation date (newest first)
    posts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (options?.offset) {
      posts = posts.slice(options.offset);
    }
    
    if (options?.limit) {
      posts = posts.slice(0, options.limit);
    }
    
    return posts;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const blogPost: BlogPost = {
      ...post,
      id,
      createdAt: now,
      updatedAt: now,
      tags: post.tags || [],
      excerpt: post.excerpt || null,
      published: post.published || false,
      featuredImage: post.featuredImage || null,
      metadata: {
        readTime: (post.metadata as any)?.readTime || 0,
        views: (post.metadata as any)?.views || 0,
        author: (post.metadata as any)?.author || "Alex Shyaka"
      }
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    
    const updated: BlogPost = {
      ...existing,
      ...post,
      id,
      updatedAt: new Date(),
      tags: post.tags || existing.tags,
      metadata: {
        readTime: (post.metadata as any)?.readTime || existing.metadata?.readTime || 0,
        views: (post.metadata as any)?.views || existing.metadata?.views || 0,
        author: (post.metadata as any)?.author || existing.metadata?.author || "Alex Shyaka"
      }
    };
    
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.blogPosts.values()).filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
(post.tags || []).some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Comment methods
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const newComment: Comment = {
      ...comment,
      id,
      createdAt: new Date()
    };
    this.comments.set(id, newComment);
    return newComment;
  }
}

export const storage = new MemStorage();
