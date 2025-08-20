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
    // Create real blog posts from CodeImpact content
    const realPosts: BlogPost[] = [
      {
        id: "1",
        title: "Building Market-Ready Tech Skills for African Graduates",
        slug: "building-market-ready-tech-skills-african-graduates",
        content: `# Building Market-Ready Tech Skills for African Graduates

CodeImpact is in the business of delivering market-ready tech skills for job-seeking graduates in the age range of 18-35.

## How do we plan to achieve this?

We shall achieve this by running cohort-based training programs that will typically run for 4-6 months with the aim of helping the cohort graduates to land a job in the tech space locally and internationally.

The Andela developer landscape survey 2020 determined that **70 percent of African software engineers work remotely**. This is huge because with the high unemployment of up to 70 percent among the youth in Uganda, working remotely removes the geographical barrier to work and releases previously unavailable opportunities.

## Our secret sauce

Our team is comprised of experienced professionals in the development and mentorship of software engineers. We have a breadth of experience building engineering teams for **Andela**, **OutBox**, **Stutern**, **Talent Centric**, and **KanzuCode**.

We manage boot camps and build technical curricula for companies that are looking to train and hire software engineers and have done this excellently for the aforementioned companies for the last 2 years with stellar results.

## We want to take this to scale

Taking Uganda as a use case; we have about **400K students graduating** from high school and university every year. The challenge with most of these graduates is they graduate with no job-ready skills. Our education system does not prepare them for the workplace with practical skills, and this costs a lot for the employers to have to retrain and equip them with the necessary skills.

We close this gap by working with a breadth of experienced software practitioners who have the job skills that they need to train and mentor passionate software developers that look to acquire a job in tech.

We are currently working with a team of **50+ experienced software engineers** in different fields(Web and Mobile development, Data Science and DevOps, etc) who will be mentoring our cohorts in the tools and expertise they need in the workplace.

## Clear outcomes

We are clear on the outcomes that we shall judge ourselves on and the overarching one is making sure our cohort graduates have the skills that the tech job market demands and that they have the mentorship necessary to secure one.

We work with strategic partners like **Waape** who are our placement partners. Waape is responsible for making sure our learners are placed into internship and eventually full-time placements in tech jobs both locally and internationally.

Through our developer community, we shall continue to mentor and grow our members' tech readiness for jobs. We shall do this through community outreaches in universities and high schools, conducting online webinars, and working with our strategic partners to achieve our goal of a **100K strong developer community** in two years.

Finally, our developer community will be a place where members will recommend each other for jobs, work on projects together, start businesses together, and generally grow together in the tech space.`,
        excerpt: "How CodeImpact delivers market-ready tech skills through cohort-based training programs, aiming to bridge the skills gap for African graduates in the tech space.",
        featuredImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        tags: ["EdTech", "African Tech", "Community Building", "Skills Development"],
        published: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        metadata: {
          readTime: 5,
          views: 850,
          author: "Alex Nkusi Shyaka"
        }
      },
      {
        id: "2",
        title: "Our Learning Journey: Building Future Tech Leaders",
        slug: "our-learning-journey-building-future-tech-leaders",
        content: `# Our Learning Journey: Building Future Tech Leaders

*Published by alex shyaka on September 11, 2021*

Our learning journey is core to our teens coding program and we endeavour to make sure that we constantly tweak and improve it so that we can have a seamless program.

## The Two-Week Introduction

We kick off with a **free two week program** and this is designed to introduce the learners to the concept of critical thinking and problem solving using computer science concepts. We use visual programming tools that are suited for the 8+ years to 12 years age bracket.

## The 8-Week Core Program

After the two week program, we kick off with an **8 week program** that focuses on front end web development technologies like **HTML** (Hyper Text Markup Language) and **CSS** (Cascading style sheets).

HTML is one of the major fundamental languages of the web because at the end of day everything gets converted into HTML before it is displayed in our browsers.

CSS gives web pages the look and feel and is focussed on aesthetics and enhances a good user interface and user experience design.

## JavaScript: Bringing Applications to Life

Our last phase focuses on **JavaScript**, the de-facto language of the web. JavaScript also known as JS adds interactivity to a web application and gives it life. Mastering the language will enable our learners to build web applications that can store, retrieve, delete, and update information in databases. They will be able to build tools that people can actually use.

At this level the learners get to work on projects, work in groups and present their work to their peers and to the parents at graduation day. Through the 8 weeks we also have skill sessions on soft skills and technical skills. This is so we can mold a **wholesome, well balanced developer** that can work independently on diverse teams in different geographical locations.

## Interactive and Project-Based Learning

Our curriculum is designed to be interactive and project based. Our facilitators record videos and share with the learners before the class, so the learners can watch and come to the class ready to ask questions and engage the facilitator. This approach makes the class a lot more interactive and fun and this increases the stickiness of the knowledge.

## The Developer Community

I have always grappled with; then what, when they finish the coding program? So, we started the **developer community**. This community is free for all to join and it is the place where a lot of growth will happen.

Through the community we mentor and guide the learners to work on projects together, start companies together and recommend each other for jobs. It is where they will grow their network of technology enthusiasts and practitioners that they will always fall back on when they are ready for the job market or for the business of tech startups.

All graduates of our program that have demonstrated the passion to learn and grow have an opportunity to join CodeImpact as interns where they will work on real-world client projects.

## Our Mission

Our job is to mentor technology leaders for tomorrow, and the onus is on us as tech entrepreneurs, parents and well wishers to get onboard and be strong stakeholders in our passion and desire to be technology players and not just consumers.

CodeImpact has started the long journey, and with all hands on deck, we will provide the opportunity where it lacks, because we are well aware that **talent is evenly distributed but opportunity is not!**`,
        excerpt: "An inside look at CodeImpact's structured learning journey, from visual programming to JavaScript mastery, designed to build wholesome developers for the global tech space.",
        featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        tags: ["Education", "Curriculum", "Youth Development", "Programming"],
        published: true,
        createdAt: new Date("2021-09-11"),
        updatedAt: new Date("2021-09-11"),
        metadata: {
          readTime: 7,
          views: 1200,
          author: "Alex Nkusi Shyaka"
        }
      },
      {
        id: "3",
        title: "The Attention Economy and How It's Affecting Our Teens",
        slug: "attention-economy-affecting-teens-part-one",
        content: `# The Attention Economy and How It's Affecting Our Teens - Part One

*Published by alex shyaka on February 20, 2021*

I have recently developed an urge to have a closer look at this topic especially now that there is a lot of discussion about how much data the 5 big tech companies (commonly referred to as **FAANG** - Facebook, Apple, Amazon, Netflix, and Google) are collecting from us. 

The question that comes to mind is: How much damage is the attention economy causing to us but most especially to our young ones who are still in their formative stages of life.

## What Can We Do as Parents?

We have to be comfortable with learning new things. It takes some initiative by parents to make time from their busy schedules to try and understand what their kids are doing online and how that might impact their formative years.

### 1. Show Interest

Start by showing **interest** in what your child is doing by asking questions. Listen carefully and then do your own research about what you are hearing. Technology is ubiquitous and gaming is at the center of what our children spend most of their time on.

It is possible for kids to play games with their contemporaries all over the world. Use the internet to research a little bit about what games your child is playing, you do not have to write a research paper about it. Just be informed enough so that you can ask relevant questions when having a conversation with your child.

This will act as an indicator to your child that you are interested. Make your child a partner and do not act like the police probing a criminal case.

You have to build an **environment of trust**, where your child feels like responsible gaming (just an example) is good for everyone in the household. Discuss the pros and cons of it all.

### 2. Be a Little Savvy

This comes back to interest but a step further to understand how you can find out what your child is doing online. There are very many tools you can use to protect your children but also to understand what they spend time on when you notice some suspicious behavior.

Make sure your child understands that you have the capability to check but again we do not want to spy but to guide.

### 3. Live by Example

Practice what you preach in the way that you use technology yourself, especially in the home. Do you scroll through social media on the dinner table? Do you binge-watch series over the weekend? 

**Actions speak louder than words** and our children watch our actions way more than what we say.

## Moving Forward

The three points I have touched on are the tip of the iceberg. I will be delving into this topic in more detail in the coming months and I will have discussions on it on my podcast, **Digitalhustle africa**.

Follow us on twitter as well @DHApodcast. If this is something you are interested in please share and like so it can reach many people. Your response will be the indicator of whether this worthwhile a topic to delve into.`,
        excerpt: "Exploring how the attention economy impacts our teenagers and practical strategies parents can use to guide their children's technology use responsibly.",
        featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        tags: ["Digital Parenting", "Attention Economy", "Youth", "Technology"],
        published: true,
        createdAt: new Date("2021-02-20"),
        updatedAt: new Date("2021-02-20"),
        metadata: {
          readTime: 6,
          views: 950,
          author: "Alex Nkusi Shyaka"
        }
      },
      {
        id: "4",
        title: "Building a Technology Community That Harnesses Global Practitioners",
        slug: "building-technology-community-uganda-global-practitioners",
        content: `# A CodeImpact Case for Building a Technology Community in Uganda

*Published by alex shyaka on December 2, 2020*

CodeImpact believes in the power of technology and what it can do to change lives and impact communities. In Africa where youth unemployment is high, technology is part of the answer to change the status quo.

## Our Vision for African Tech

We believe that introducing technology early to our children will put them in a better place to compete favorably with their counterparts all over the world.

In a world where technology has demystified geographical barriers, **jobs are no longer defined by location but by the availability of talent**.

As Africans, we need to build a critical mass of technology leaders and practitioners so that our generations to come can be global players in the technology space.

## Why Coding as a Literacy Skill?

CodeImpact was born out of the desire to raise our stake as Africans in the technology space globally and therefore equipping our children with the skills they need is imperative for our sustainable growth. We could have picked any other space to focus on but we chose **coding as a literacy skill** for teenagers.

Like Steve Jobs said: **"Coding or computer programming teaches you how to think."** Most of our education system does not teach us how to think but instead focuses on cramming facts and reproducing them to pass a test. We think differently at CodeImpact.

## Our Learning Philosophy

We encourage our learners to **think and tinker** and endeavor to create a space where people are free to fail and learn from their mistakes. We do not castigate failure but rather encourage it because it is the only sure way to mastery.

We run weekend coding programs for teenagers and also pre-teens who feel confident and are eager to learn and grow.

Our program runs for a period of **12 weeks** and in those weeks our learners are facilitated to learn and collaborate on projects. Our facilitators are available throughout the week to offer support in-case some learners need clarity on topics or are experiencing challenges on their weekly projects.

## Building Towards One Million

Ultimately our main goal is to build a **community of over one million technology practitioners and leaders** that will continue to learn from each other, build projects together, start companies together and recommend opportunities to each other.

All learners that go through this 12-week program will immediately be legible to join this community and we shall have a strong support system to keep the community active, vibrant, and relevant in the global technology space.

## The Long Journey Ahead

Our job is to mentor technology leaders for tomorrow, and the onus is on us as tech entrepreneurs, parents and well wishers to get onboard and be strong stakeholders in our passion and desire to be technology players and not just consumers.

CodeImpact has started the long journey, and with all hands on deck, we will provide the opportunity where it lacks, because we are well aware that **talent is evenly distributed but opportunity is not!**`,
        excerpt: "CodeImpact's vision for building a million-strong technology community in Africa, focusing on coding as a literacy skill to create global tech leaders.",
        featuredImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
        tags: ["Community Building", "African Tech", "Vision", "Technology Education"],
        published: true,
        createdAt: new Date("2020-12-02"),
        updatedAt: new Date("2020-12-02"),
        metadata: {
          readTime: 8,
          views: 1100,
          author: "Alex Nkusi Shyaka"
        }
      }
    ];

    realPosts.forEach(post => {
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
