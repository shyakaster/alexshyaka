import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import alexProfileImage from "@assets/alex-new_1755685299395.jpeg";

export default function Portfolio() {
  const { data: latestPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog-posts?published=true&limit=3");
      return response.json();
    },
  });

  const skills = [
    {
      title: "Frontend Development",
      description: "Creating responsive, interactive user interfaces with modern frameworks and best practices.",
      icon: "fas fa-code",
      color: "bg-accent/10 text-accent",
      tags: ["React", "TypeScript", "Next.js", "Tailwind"]
    },
    {
      title: "Backend Development", 
      description: "Building scalable APIs and robust server-side applications with cloud infrastructure.",
      icon: "fas fa-server",
      color: "bg-green-100 text-green-600",
      tags: ["Node.js", "Python", "PostgreSQL", "AWS"]
    },
    {
      title: "Technical Writing",
      description: "Crafting clear, engaging technical content that makes complex concepts accessible.",
      icon: "fas fa-pen-nib", 
      color: "bg-purple-100 text-purple-600",
      tags: ["Documentation", "Tutorials", "Blogging", "SEO"]
    }
  ];

  const projects = [
    {
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard. Built with React, Node.js, and PostgreSQL.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["React", "Node.js", "Stripe API"],
      liveUrl: "#",
      codeUrl: "#"
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, team workspaces, and productivity analytics. Features drag-and-drop functionality and mobile responsiveness.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["Vue.js", "Socket.io", "MongoDB"],
      liveUrl: "#",
      codeUrl: "#"
    }
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight" data-testid="hero-title">
                Full-Stack Developer & Technical Writer
              </h1>
              <p className="text-xl text-secondary leading-relaxed max-w-lg" data-testid="hero-description">
                Building scalable web applications and sharing knowledge through thoughtful technical content. Currently crafting digital experiences at the intersection of design and code.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="bg-accent text-white hover:bg-blue-600"
                data-testid="button-view-work"
              >
                View My Work
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                data-testid="button-download-cv"
              >
                Download CV
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-secondary">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span data-testid="availability-status">Available for projects</span>
              </div>
              <span data-testid="location">Based in Kigali, Rwanda</span>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <img 
                src={alexProfileImage} 
                alt="Alex Shyaka - Professional headshot" 
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="hero-image"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl font-bold text-primary" data-testid="skills-title">Skills & Expertise</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto" data-testid="skills-description">
              A comprehensive toolkit for building modern web applications and creating compelling technical content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                data-testid={`skill-card-${index}`}
              >
                <div className={`w-12 h-12 ${skill.color} rounded-lg flex items-center justify-center mb-6`}>
                  <i className={`${skill.icon} text-xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-4" data-testid={`skill-title-${index}`}>
                  {skill.title}
                </h3>
                <p className="text-secondary mb-6" data-testid={`skill-description-${index}`}>
                  {skill.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      data-testid={`skill-tag-${tag}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl font-bold text-primary" data-testid="projects-title">Featured Projects</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto" data-testid="projects-description">
              A selection of recent work showcasing technical expertise and creative problem-solving.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {projects.map((project, index) => (
              <div key={index} className="group" data-testid={`project-card-${index}`}>
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    data-testid={`project-image-${index}`}
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-primary" data-testid={`project-title-${index}`}>
                    {project.title}
                  </h3>
                  <p className="text-secondary" data-testid={`project-description-${index}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge 
                        key={tag}
                        className="bg-accent/10 text-accent"
                        data-testid={`project-tag-${tag}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <a 
                      href={project.liveUrl} 
                      className="text-accent hover:text-blue-600 font-medium"
                      data-testid={`project-live-${index}`}
                    >
                      View Project
                    </a>
                    <a 
                      href={project.codeUrl} 
                      className="text-secondary hover:text-primary"
                      data-testid={`project-code-${index}`}
                    >
                      <i className="fab fa-github mr-1"></i> Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              data-testid="button-view-all-projects"
            >
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-4" data-testid="blog-preview-title">
                Latest from the Blog
              </h2>
              <p className="text-lg text-secondary" data-testid="blog-preview-description">
                Insights on web development, technology trends, and lessons learned.
              </p>
            </div>
            <Link href="/blog">
              <Button variant="link" className="text-accent hover:text-blue-600 font-medium" data-testid="button-view-all-posts">
                View All Posts →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article 
                key={post.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                data-testid={`preview-post-${post.id}`}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img 
                      src={post.featuredImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`preview-post-image-${post.id}`}
                    />
                  </div>
                </Link>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-secondary">
                    <span data-testid={`preview-post-date-${post.id}`}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </span>
                    <span>•</span>
                    <span data-testid={`preview-post-readtime-${post.id}`}>
                      {post.metadata?.readTime || 5} min read
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-semibold text-primary group-hover:text-accent transition-colors" data-testid={`preview-post-title-${post.id}`}>
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-secondary" data-testid={`preview-post-excerpt-${post.id}`}>
                    {post.excerpt || post.content.substring(0, 100) + "..."}
                  </p>
                  <Link href={`/blog/${post.slug}`}>
                    <span className="text-accent hover:text-blue-600 font-medium inline-block" data-testid={`preview-post-link-${post.id}`}>
                      Read More →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
