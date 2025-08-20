import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import alexProfileImage from "@assets/alex-new_1755685299395.jpeg";

// Import partnership images
import andelaImg from "@assets/Image_fx (10)_1755692572025.jpg";
import tungaImg from "@assets/Image_fx (11)_1755692572027.jpg";
import kanzuImg from "@assets/Image_fx (12)_1755692572028.jpg";
import outboxImg from "@assets/Image_fx (13)_1755692572028.jpg";
import stuternImg from "@assets/Image_fx_1755692572029.jpg";
import codeimpactImg from "@assets/Image_fx (17)_1755692843178.jpg";

// Import new blog thumbnails
import blogThumb1 from "@assets/Image_fx (15)_1755693909853.jpg";
import blogThumb2 from "@assets/Image_fx (16)_1755693909857.jpg";

// Import new profile image for blog author
import alexAuthorImage from "@assets/FB_IMG_1755674215490_1755694347500.jpg";

// Create image mapping for blog posts
export const getResolvedImagePath = (imagePath: string): string => {
  const imageMap: Record<string, string> = {
    "/src/assets/Image_fx (15)_1755693909853.jpg": blogThumb1,
    "/src/assets/Image_fx (16)_1755693909857.jpg": blogThumb2,
  };
  
  return imageMap[imagePath] || imagePath;
};

// Export Alex's author image for blog posts
export { alexAuthorImage };

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
      title: "EdTech Data Analysis & Insights",
      description: "Expert in educational data analysis, learning outcome modeling, and impact measurement to optimize tech education programs and student success.",
      icon: "fas fa-chart-line",
      color: "bg-accent/10 text-accent",
      tags: ["Educational Analytics", "Learning Outcomes", "Impact Measurement", "Program Optimization"]
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
      description: "Global Remote Talent Platform",
      details: "Collaborating with Andela to develop world-class African software engineers through comprehensive training programs and global placement opportunities.",
      image: andelaImg,
      tags: ["Global Talent", "Software Engineering", "Remote Work"],
      website: "https://www.andela.com/",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "Tunga",
      description: "Tech Talent Marketplace",
      details: "Partnering with Tunga to connect skilled African developers with international tech companies and innovative project opportunities.",
      image: tungaImg,
      tags: ["Tech Marketplace", "Developer Network", "International Projects"],
      website: "https://tunga.io/",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "KanzuCode",
      description: "Coding Bootcamp Excellence",
      details: "Strategic alliance with KanzuCode to deliver intensive coding bootcamps that transform beginners into professional software developers.",
      image: kanzuImg,
      tags: ["Bootcamp Training", "Full-Stack Development", "Career Transformation"],
      website: "https://kanzucode.com/",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Outbox Uganda",
      description: "Innovation Hub & Incubator",
      details: "Collaborating with Outbox to nurture tech innovation and entrepreneurship across Uganda's vibrant startup ecosystem.",
      image: outboxImg,
      tags: ["Innovation Hub", "Startup Incubation", "Tech Entrepreneurship"],
      website: "https://outboxuganda.org/",
      color: "from-teal-500 to-green-500"
    },
    {
      title: "Stutern",
      description: "Career Acceleration Platform",
      details: "Partnering with Stutern to accelerate tech career growth through structured learning paths and industry-aligned skill development.",
      image: stuternImg,
      tags: ["Career Growth", "Skill Development", "Professional Training"],
      website: "https://stutern.com/",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "CodeImpact",
      description: "Youth Empowerment Initiative",
      details: "Leading CodeImpact's mission to empower young Africans with market-ready tech skills through practical education, mentorship, and sustainable community building across the continent.",
      image: codeimpactImg,
      tags: ["Youth Empowerment", "Tech Education", "Community Building"],
      website: "https://codeimpact.co/",
      color: "from-emerald-500 to-cyan-500"
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
                <i className="fab fa-x-twitter text-2xl"></i>
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
                alt="Alex Nkusi Shyaka - EdTech professional and CodeImpact founder specializing in African youth empowerment through technology education" 
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
              EdTech professional skilled in data analysis, passionate about empowering underserved youth with market-ready tech skills.
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
            <h2 className="text-5xl font-bold text-primary mb-6" data-testid="partnerships-title">
              Strategic <span className="text-accent">Partnerships</span>
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed" data-testid="partnerships-description">
              Collaborating with Africa's leading tech organizations to democratize access to world-class technology education and create pathways to global opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="group" data-testid={`partner-card-${index}`}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200">
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${partner.color}`}></div>
                  
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={partner.image}
                      alt={`${partner.title} - Strategic partnership organization focused on African tech talent development and youth empowerment`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      data-testid={`partner-image-${index}`}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${partner.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300" data-testid={`partner-title-${index}`}>
                        {partner.title}
                      </h3>
                      <p className="text-accent font-semibold text-sm uppercase tracking-wide" data-testid={`partner-description-${index}`}>
                        {partner.description}
                      </p>
                    </div>
                    
                    <p className="text-secondary leading-relaxed text-sm" data-testid={`partner-details-${index}`}>
                      {partner.details}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {partner.tags.map((tag) => (
                        <Badge 
                          key={tag}
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 text-xs"
                          data-testid={`partner-tag-${tag}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Visit Website Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <a 
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gradient-to-r ${partner.color} text-white font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
                        data-testid={`partner-website-${index}`}
                      >
                        Visit Website
                        <i className="fas fa-external-link-alt ml-2 text-sm"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Statistics */}
          <div className="mt-16 bg-gradient-to-r from-accent/5 to-blue-500/5 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">6</div>
                <div className="text-secondary font-medium">Partner Organizations</div>
                <div className="text-xs text-gray-500">Leading African tech companies</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">1000+</div>
                <div className="text-secondary font-medium">Students Impacted</div>
                <div className="text-xs text-gray-500">Across multiple programs</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">4</div>
                <div className="text-secondary font-medium">Countries Reached</div>
                <div className="text-xs text-gray-500">Uganda, Kenya, Rwanda, Nigeria</div>
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
                      src={getResolvedImagePath(post.featuredImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300")}
                      alt={`${post.title} - Educational technology blog post by Alex Nkusi Shyaka covering African youth development and tech skills`}
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
