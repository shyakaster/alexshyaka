import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, Edit } from "lucide-react";
import { BlogPost } from "@shared/schema";
import { getResolvedImagePath, alexAuthorImage } from "@/pages/Portfolio";

interface BlogPostCardProps {
  post: BlogPost;
  onBookmark?: (postId: string) => void;
  showEditButton?: boolean;
}

export default function BlogPostCard({ post, onBookmark, showEditButton = false }: BlogPostCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

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

  const getCategoryColor = (tag: string) => {
    const colors: Record<string, string> = {
      "JavaScript": "bg-yellow-500",
      "React": "bg-blue-500", 
      "API": "bg-green-500",
      "Database": "bg-purple-500",
      "Design": "bg-pink-500",
      "DevOps": "bg-orange-500",
      "Testing": "bg-indigo-500",
    };
    return colors[tag] || "bg-gray-500";
  };

  return (
    <article 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
      data-testid={`blog-card-${post.id}`}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="relative overflow-hidden rounded-t-xl">
          <img 
            src={getResolvedImagePath(post.featuredImage || "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300")} 
            alt={`${post.title} - Educational technology blog post featuring African youth engaged in hands-on learning and technology skills development`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`blog-image-${post.id}`}
          />
          {post.tags && post.tags.length > 0 && (
            <div className="absolute top-4 left-4">
              <Badge 
                className={`${getCategoryColor(post.tags[0])} text-white`}
                data-testid={`blog-tag-${post.tags[0]}`}
              >
                {post.tags[0]}
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2 text-sm text-secondary">
          <span data-testid={`blog-date-${post.id}`}>
            {formatDate(post.createdAt)}
          </span>
          <span>•</span>
          <span data-testid={`blog-readtime-${post.id}`}>
            {post.metadata?.readTime || 5} min read
          </span>
          {post.metadata?.views && (
            <>
              <span>•</span>
              <span data-testid={`blog-views-${post.id}`}>
                {post.metadata.views} views
              </span>
            </>
          )}
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-secondary line-clamp-3" data-testid={`blog-excerpt-${post.id}`}>
          {renderTextWithLinks(post.excerpt || post.content.substring(0, 150) + "...")}
        </p>
        
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <img 
                src={alexAuthorImage} 
                alt="Alex Nkusi Shyaka - EdTech professional and CodeImpact founder, thoughtful pose with glasses in professional headshot"
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback className="bg-accent/10 text-accent text-sm">
                AS
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-secondary" data-testid={`blog-author-${post.id}`}>
              {post.metadata?.author || "Alex Shyaka"}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {showEditButton && (
              <Link href={`/edit/${post.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary hover:text-accent hover:bg-accent/10"
                  data-testid={`edit-button-${post.id}`}
                >
                  <Edit size={16} />
                </Button>
              </Link>
            )}
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onBookmark(post.id);
                }}
                className="text-secondary hover:text-accent"
                data-testid={`button-bookmark-${post.id}`}
              >
                <Bookmark size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
