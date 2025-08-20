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

  // Function to convert markdown links to clickable HTML links
  const renderTextWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add the link
      const [, linkText, linkUrl] = match;
      const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-accent hover:underline font-medium"
        >
          {linkText}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 1 ? parts : text;
  };

  const skills = [
    {
      title: "Financial Analysis & Modeling",
      description: "Expert in statistical analysis, data modeling, risk assessment, and A/B testing for investment strategies and decision-making.",
      icon: "fas fa-chart-line",
      color: "bg-accent/10 text-accent",
      tags: ["Financial Modeling", "Risk Assessment", "Statistical Analysis", "A/B Testing"]
    },
    {
      title: "Technical Proficiency", 
      description: "Advanced SQL, Python programming, and data visualization tools to extract actionable insights from complex datasets.",
      icon: "fas fa-database",
      color: "bg-green-100 text-green-600",
      tags: ["SQL", "Python", "Power BI", "Tableau", "Excel"]
    },
    {
      title: "Mentoring & Community Building",
      description: "Founder of CodeImpact, mentoring aspiring developers and building sustainable tech communities across Africa.",
      icon: "fas fa-users", 
      color: "bg-purple-100 text-purple-600",
      tags: ["Developer Mentoring", "Community Building", "Youth Development", "Education"],
      hasLink: true
    }
  ];

  const partners = [
    {
      title: "Andela",
      description: "Technical Curriculum Development",
      details: "Partnered with Andela to develop comprehensive technical curricula that prepare African developers for global opportunities in software engineering and technology leadership.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["Curriculum", "Technical Training", "Global Opportunities"],
      website: "#"
    },
    {
      title: "Tunga",
      description: "Learning Platform Content",
      details: "Collaborated with Tunga to create engaging learning platform content that connects African software developers with international clients and projects.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["Platform Development", "Content Creation", "Remote Work"],
      website: "#"
    },
    {
      title: "KanzuCode",
      description: "Software Engineer Training",
      details: "Strategic partnership with KanzuCode to deliver intensive software engineer training programs focused on practical skills and industry-ready development practices.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["Software Engineering", "Intensive Training", "Practical Skills"],
      website: "#"
    },
    {
      title: "Outbox",
      description: "Curriculum Development",
      details: "Working with Outbox to design innovative curriculum development strategies that bridge the gap between academic learning and real-world application in technology.",
      image: "https://images.unsplash.com/photo-1553028826-f4804a6dfd3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["Innovation", "Curriculum Design", "Academic Bridge"],
      website: "#"
    },
    {
      title: "Stutern",
      description: "Technical Learning Development",
      details: "Partnering with Stutern to advance technical learning development programs that accelerate career growth for African tech talent in emerging markets.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
      tags: ["Career Growth", "Technical Development", "Emerging Markets"],
      website: "#"
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
                EdTech Entrepreneur & Developer Community Builder
              </h1>
              <p className="text-xl text-secondary leading-relaxed max-w-lg" data-testid="hero-description">
                Founder of <a href="https://codeimpact.co" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">CodeImpact</a>, passionate about empowering young Africans with market-ready tech skills. Combining data analysis expertise with educational technology to build sustainable developer communities and bridge the skills gap in Africa's tech ecosystem.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="bg-accent text-white hover:bg-blue-600"
                data-testid="button-view-work"
                onClick={() => {
                  const projectsSection = document.getElementById('projects-section');
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View My Work
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-secondary">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span data-testid="availability-status">Available for projects</span>
              </div>
              <span data-testid="location">Based in London, UK</span>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-6">
              <a 
                href="https://www.linkedin.com/in/ankusi/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-secondary hover:text-accent transition-colors duration-200"
                data-testid="social-linkedin"
              >
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
              <a 
                href="https://x.com/shyakaster" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-secondary hover:text-accent transition-colors duration-200"
                data-testid="social-twitter"
              >
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a 
                href="https://github.com/shyakaster" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-secondary hover:text-accent transition-colors duration-200"
                data-testid="social-github"
              >
                <i className="fab fa-github text-2xl"></i>
              </a>
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
                  {skill.hasLink ? (
                    <>
                      Founder of{' '}
                      <a 
                        href="https://codeimpact.co" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-accent hover:underline font-medium"
                      >
                        CodeImpact
                      </a>
                      , mentoring aspiring developers and building sustainable tech communities across Africa.
                    </>
                  ) : (
                    skill.description
                  )}
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

      {/* CodeImpact Partnerships */}
      <section id="projects-section" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl font-bold text-primary" data-testid="partnerships-title">CodeImpact Partnerships</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto" data-testid="partnerships-description">
              Strategic collaborations with leading African tech organizations to scale impact and empower youth across the continent.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="group" data-testid={`partner-card-${index}`}>
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img 
                    src={partner.image}
                    alt={partner.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    data-testid={`partner-image-${index}`}
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary" data-testid={`partner-title-${index}`}>
                    {partner.title}
                  </h3>
                  <p className="text-accent font-medium mb-2" data-testid={`partner-description-${index}`}>
                    {partner.description}
                  </p>
                  <p className="text-secondary text-sm" data-testid={`partner-details-${index}`}>
                    {partner.details}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {partner.tags.map((tag) => (
                      <Badge 
                        key={tag}
                        className="bg-accent/10 text-accent"
                        data-testid={`partner-tag-${tag}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4">
                    <a 
                      href={partner.website} 
                      className="text-accent hover:text-blue-600 font-medium inline-flex items-center"
                      data-testid={`partner-website-${index}`}
                    >
                      Learn More <i className="fas fa-external-link-alt ml-1 text-sm"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-accent">5+</div>
                <div className="text-secondary">Partner Organizations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">1000+</div>
                <div className="text-secondary">Students Impacted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">3</div>
                <div className="text-secondary">Countries Reached</div>
              </div>
            </div>
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
                    {renderTextWithLinks(post.excerpt || post.content.substring(0, 100) + "...")}
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
