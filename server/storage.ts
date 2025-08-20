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

CodeImpact specializes in delivering industry-relevant technical skills to African graduates aged 18-35, addressing the critical skills gap that exists between traditional education and market demands.

## Our Strategic Approach

We achieve this transformation through intensive, cohort-based training programs spanning 4-6 months, specifically designed to equip graduates with the competencies required for success in the global technology sector, both locally and internationally.

The 2020 Andela Developer Landscape Survey revealed that **70 percent of African software engineers work remotely**—a paradigm shift that eliminates geographical barriers and unlocks unprecedented opportunities for African talent. In regions like Uganda, where youth unemployment reaches 70 percent, remote work capabilities represent a gateway to economic empowerment and global competitiveness.

## Our Competitive Advantage

Our leadership team comprises seasoned professionals with extensive experience in software engineering development and mentorship. We bring collective expertise from building engineering teams at prominent organizations including **Andela**, **OutBox**, **Stutern**, **Talent Centric**, and **KanzuCode**.

Over the past two years, we have successfully managed bootcamps and developed comprehensive technical curricula for companies seeking to train and recruit software engineers, consistently delivering exceptional results across our partner organizations.

## Scaling for Continental Impact

Consider Uganda's educational landscape: approximately **400,000 students graduate** from high schools and universities annually. The fundamental challenge lies in the disconnect between academic preparation and workplace requirements—graduates often lack the practical, job-ready skills that employers demand.

CodeImpact bridges this critical gap by connecting aspiring developers with experienced software practitioners who possess real-world expertise. Our mentorship network includes **50+ seasoned software engineers** specializing in diverse domains including Web Development, Mobile Development, Data Science, and DevOps.

## Measurable Outcomes and Strategic Partnerships

We maintain clear accountability standards, with our primary metric being the successful placement of graduates in technology roles that match market demands. Our comprehensive approach ensures graduates not only acquire technical proficiency but also develop the soft skills essential for success in diverse, global engineering teams.

Through our strategic partnership with **Waape**, our designated placement partner, we facilitate seamless transitions from training to employment, securing both internship opportunities and full-time positions in technology companies across local and international markets.

## Building Africa's Tech Community

Our vision extends beyond individual success stories. Through our developer community initiative, we will continue nurturing technical excellence through university and high school outreach programs, online webinars, and strategic partnerships. Our ambitious goal: cultivating a **100,000-strong developer community** within two years.

This community serves as more than a professional network—it's an ecosystem where members collaborate on projects, co-found technology companies, and create opportunities for one another, fostering sustainable growth within Africa's technology landscape.

*At CodeImpact, we recognize that while talent is evenly distributed across Africa, opportunity is not. We are committed to changing this narrative.*`,
        excerpt: "CodeImpact's strategic approach to delivering industry-relevant technical skills to African graduates, bridging the critical gap between traditional education and global market demands.",
        featuredImage: "/src/assets/Image_fx (2)_1755686598397.jpg",
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

*Alex Nkusi Shyaka | September 11, 2021*

The educational journey at CodeImpact represents the cornerstone of our youth development program. We continuously refine our methodology to ensure seamless knowledge transfer and optimal learning outcomes for young African minds entering the technology space.

## Foundation Phase: Cognitive Development Through Computing

Our program commences with a **complimentary two-week introduction** designed to cultivate critical thinking and problem-solving capabilities through fundamental computer science concepts. We employ age-appropriate visual programming environments specifically tailored for learners aged 8-12 years, establishing a solid foundation for computational thinking.

## Core Development Phase: Web Technologies Mastery

Following the introductory phase, learners progress to our **comprehensive eight-week program** focusing on frontend web development fundamentals: **HTML** (HyperText Markup Language) and **CSS** (Cascading Style Sheets).

HTML serves as the architectural foundation of web communication—every digital interaction ultimately translates to HTML before rendering in browsers, making it an essential literacy skill for the digital age.

CSS transforms static content into engaging user experiences, focusing on aesthetics, interface design, and user experience optimization—critical skills for creating compelling digital solutions that resonate with African audiences and global markets.

## Advanced Development: JavaScript and Real-World Applications

The culminating phase centers on **JavaScript**—the universal language of web interactivity. JavaScript proficiency enables our learners to create dynamic, data-driven applications capable of storing, retrieving, updating, and managing information across databases.

This advanced stage emphasizes practical application through collaborative project development, peer presentations, and culminating demonstrations for families and stakeholders during graduation ceremonies. Our holistic approach integrates technical skill development with soft skills training, preparing **well-rounded developers** capable of thriving in diverse, international technology teams.

## Pedagogical Innovation: Interactive and Project-Centric Learning

Our curriculum employs a flipped classroom methodology where facilitators create pre-session video content, enabling learners to arrive prepared for interactive engagement and deeper exploration. This approach maximizes classroom efficiency, enhances knowledge retention, and fosters collaborative learning environments.

## Sustainable Growth: The Developer Community Ecosystem

The transition from program completion to professional readiness represents a critical juncture in our learners' development journey. Our **developer community** provides ongoing support, networking opportunities, and collaborative project engagement—ensuring continuous growth beyond formal instruction.

This community facilitates peer-to-peer learning, startup incubation, professional referrals, and network expansion among technology enthusiasts and industry practitioners. Distinguished graduates demonstrating exceptional passion and commitment earn opportunities to join CodeImpact as interns, gaining hands-on experience with real-world client projects.

## Vision for African Technology Leadership

Our mission transcends individual skill development—we cultivate tomorrow's technology leaders. Success requires collective commitment from entrepreneurs, educators, parents, and stakeholders who share our vision of transforming Africa from a technology consumer market to a global innovation hub.

CodeImpact has embarked on this transformational journey, and through unified effort, we will democratize opportunity across the continent. Our foundational belief remains unwavering: **talent is evenly distributed, but opportunity is not**—we exist to change this reality.`,
        excerpt: "Explore CodeImpact's innovative educational methodology—from foundational computational thinking to advanced web development—designed to cultivate Africa's next generation of technology leaders.",
        featuredImage: "/src/assets/Image_fx (1)_1755686598397.jpg",
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
        content: `# The Attention Economy and How It's Affecting Our Teens

*Alex Nkusi Shyaka | February 20, 2021*

The proliferation of digital technology across Africa presents both unprecedented opportunities and significant challenges for our youth. As major technology corporations—commonly referred to as **FAANG** (Facebook, Apple, Amazon, Netflix, and Google)—increasingly capture and monetize user attention, we must examine the implications for African families and our children's developmental journey.

This analysis becomes particularly critical as Africa experiences rapid digital adoption, with young people often serving as early adopters of new technologies without adequate guidance or digital literacy frameworks.

## Strategic Approaches for African Parents

Navigating the digital landscape requires intentional engagement and continuous learning. African parents must embrace technology literacy as an essential parenting skill, dedicating time to understand the digital environments their children inhabit.

### 1. Cultivating Genuine Interest and Engagement

Develop authentic curiosity about your child's digital activities through purposeful questioning and active listening. Technology permeates every aspect of modern life, with gaming often serving as the primary digital engagement for young people.

Contemporary gaming enables African youth to collaborate with peers globally, breaking down geographical barriers and creating international connections. Research your child's preferred games and platforms—not exhaustively, but sufficiently to engage in meaningful conversations.

This approach demonstrates genuine interest while positioning you as a collaborative partner rather than an investigative authority. Establish an **environment of mutual trust** where responsible technology use becomes a family value, encouraging open dialogue about digital experiences and their implications.

### 2. Developing Digital Literacy and Awareness

Expand beyond surface-level interest to develop practical understanding of digital monitoring and protection tools. Numerous resources exist to help parents understand their children's online activities while maintaining appropriate boundaries.

Transparency remains crucial—ensure your children understand your technological capabilities while emphasizing guidance over surveillance. The goal is cultivating responsible digital citizenship, not invasive monitoring.

### 3. Modeling Responsible Digital Behavior

Practice intentional technology use within your household. Consider your own digital habits: Do you engage with social media during family meals? Do you consume entertainment content excessively during weekends?

**Actions consistently outweigh words in parental influence**—children observe and internalize parental behavior patterns more readily than verbal instructions.

## Fostering Healthy Digital Communities in Africa

These foundational strategies represent the beginning of comprehensive digital parenting approaches. As Africa's digital landscape continues evolving, families require ongoing education and community support to navigate these challenges effectively.

Our commitment at CodeImpact extends beyond technical education to include digital citizenship and responsible technology use—essential skills for Africa's youth as they engage with global digital communities.

*This discussion continues through our Digital Hustle Africa podcast (@DHApodcast), where we explore technology's impact on African communities and provide practical guidance for families navigating the digital age.*`,

        excerpt: "An in-depth analysis of the attention economy's impact on African youth, with practical strategies for parents to guide responsible technology use in rapidly digitalizing communities.",
        featuredImage: "/src/assets/Image_fx (5)_1755686598397.jpg",
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
        content: `# Building a Technology Community That Harnesses Global Practitioners

*Alex Nkusi Shyaka | December 2, 2020*

CodeImpact's mission centers on leveraging technology's transformative potential to create sustainable economic opportunities and community development across Africa. In regions where youth unemployment reaches critical levels, strategic technology adoption represents a fundamental pathway to economic empowerment and global competitiveness.

## Strategic Vision for African Technology Leadership

Our approach prioritizes early technology introduction, positioning African youth to compete effectively in global markets. We recognize that contemporary technology has fundamentally transformed employment paradigms—**professional opportunities now depend on skill availability rather than geographical proximity**.

To establish Africa as a significant player in the global technology ecosystem, we must cultivate substantial communities of technology leaders and practitioners who can mentor subsequent generations and drive continental innovation.

## Programming as Essential Literacy

CodeImpact's founding principle centers on elevating Africa's position within the global technology landscape. Among various educational pathways, we deliberately selected **programming as a fundamental literacy skill** for teenagers and young adults.

Steve Jobs' insight remains profoundly relevant: **"Coding teaches you how to think."** Traditional African educational systems often emphasize memorization and regurgitation over critical thinking and problem-solving—a paradigm we actively challenge through our methodology.

## Pedagogical Philosophy: Embracing Failure as Growth

Our learning environment encourages **experimentation and creative problem-solving**, fostering spaces where learners can experience failure as a natural component of mastery. We reject punitive approaches to mistakes, instead celebrating them as essential learning opportunities.

Our weekend programming initiatives serve teenagers and confident pre-teens who demonstrate enthusiasm for technological learning and personal development.

The **12-week intensive program** emphasizes collaborative learning and project-based development, with dedicated facilitator support available throughout the week for individualized guidance and challenge resolution.

## Scaling Impact: The Million-Person Vision

Our ultimate objective involves cultivating a **one-million-strong community of African technology practitioners and leaders** who will engage in continuous mutual learning, collaborative project development, entrepreneurial ventures, and professional networking.

Program graduates automatically qualify for community membership, supported by robust infrastructure designed to maintain engagement, relevance, and global connectivity within the technology sector.

## Continental Transformation Through Collective Action

Our responsibility extends beyond individual skill development—we cultivate tomorrow's technology leadership. Success requires unified commitment from entrepreneurs, educators, parents, and community stakeholders who share our vision of transforming Africa from a technology consumption market to a global innovation hub.

CodeImpact has initiated this transformational journey. Through coordinated effort and shared commitment, we will democratize technological opportunity across the continent, guided by our fundamental conviction: **talent distribution is universal, but opportunity distribution is not**—we exist to correct this imbalance.

*Join us in building Africa's technological future, one community at a time.*`,
        excerpt: "CodeImpact's strategic vision for building a million-strong African technology community, emphasizing programming literacy and collaborative learning to drive continental innovation.",
        featuredImage: "/src/assets/Image_fx (7)_1755686598398.jpg",
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
