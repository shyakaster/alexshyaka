import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import SocialShare from "@/components/SocialShare";
import { BlogPost, Comment, insertCommentSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getResolvedImagePath, alexAuthorImage } from "@/pages/Portfolio";
import SEO, { generateBlogPostStructuredData } from "@/components/SEO";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentForm, setCommentForm] = useState({
    author: "",
    email: "",
    content: ""
  });

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const { data: post, isLoading: postLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog-posts", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${slug}`);
      if (!response.ok) {
        throw new Error("Post not found");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ["/api/blog-posts", post?.id, "comments"],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${post!.id}/comments`);
      return response.json();
    },
    enabled: !!post?.id,
  });

  const commentMutation = useMutation({
    mutationFn: async (commentData: typeof commentForm) => {
      const validatedData = insertCommentSchema.parse({
        ...commentData,
        postId: post!.id
      });
      return apiRequest("POST", `/api/blog-posts/${post!.id}/comments`, validatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts", post?.id, "comments"] });
      setCommentForm({ author: "", email: "", content: "" });
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to post comment",
        description: error.message || "There was an error posting your comment.",
        variant: "destructive",
      });
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.author.trim() || !commentForm.email.trim() || !commentForm.content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    commentMutation.mutate(commentForm);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "bg-purple-100 text-purple-600",
      "bg-green-100 text-green-600", 
      "bg-orange-100 text-orange-600",
      "bg-blue-100 text-blue-600",
      "bg-pink-100 text-pink-600"
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (postLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-secondary">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Post Not Found</h1>
          <p className="text-secondary mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button data-testid="back-to-blog">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = `${window.location.origin}/blog/${post.slug}`;

  return (
    <div className="pt-24">
      <SEO
        title={`${post.title} - Alex Nkusi Shyaka | EdTech Blog`}
        description={post.excerpt || post.content.substring(0, 160).replace(/[#*]/g, '')}
        keywords={`${post.tags?.join(', ')}, Alex Nkusi Shyaka, EdTech, CodeImpact, African Youth`}
        image={post.featuredImage ? `https://alexshyaka.site${getResolvedImagePath(post.featuredImage)}` : "https://alexshyaka.site/og-image.jpg"}
        url={`https://alexshyaka.site/blog/${post.slug}`}
        type="article"
        publishedTime={new Date(post.createdAt).toISOString()}
        modifiedTime={new Date(post.updatedAt || post.createdAt).toISOString()}
        structuredData={generateBlogPostStructuredData(post)}
      />
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Post Header */}
        <header className="space-y-8 mb-12">
          <div className="flex items-center space-x-2 text-sm text-secondary">
            <Link href="/blog" className="hover:text-accent transition-colors" data-testid="breadcrumb-blog">
              Blog
            </Link>
            <ChevronRight size={16} />
            <span data-testid="breadcrumb-category">
              {post.tags && post.tags.length > 0 ? post.tags[0] : "Article"}
            </span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight" data-testid="post-title">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-secondary">
              <div className="flex items-center">
                <Avatar className="w-10 h-10">
                  <img 
                    src={alexAuthorImage} 
                    alt="Alex Nkusi Shyaka - EdTech professional and CodeImpact founder, thoughtful pose with glasses in professional headshot"
                    className="w-full h-full object-cover rounded-full"
                    style={{ objectPosition: '50% 25%' }}
                  />
                  <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                    AS
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex items-center space-x-4">
                <span data-testid="post-date">{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span data-testid="post-readtime">{post.metadata?.readTime || 5} min read</span>
                {post.metadata?.views && (
                  <>
                    <span>•</span>
                    <span data-testid="post-views">{post.metadata.views} views</span>
                  </>
                )}
              </div>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(post.tags || []).map((tag) => (
                  <Badge 
                    key={tag} 
                    className="bg-accent/10 text-accent"
                    data-testid={`post-tag-${tag}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-12">
            <img 
              src={getResolvedImagePath(post.featuredImage)}
              alt={`${post.title} - Featured image showing African students engaged in technology learning and educational innovation activities`}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
              data-testid="post-featured-image"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12" data-testid="post-content">
          <ReactMarkdown
            components={{
              h1: (props: any) => <h1 className="text-3xl font-bold text-primary mt-12 mb-6">{props.children}</h1>,
              h2: (props: any) => <h2 className="text-2xl font-bold text-primary mt-10 mb-4">{props.children}</h2>,
              h3: (props: any) => <h3 className="text-xl font-semibold text-primary mt-8 mb-3">{props.children}</h3>,
              p: (props: any) => <p className="text-secondary leading-relaxed mb-6">{props.children}</p>,
              blockquote: (props: any) => (
                <blockquote className="border-l-4 border-accent bg-gray-50 p-6 my-8 italic text-lg">
                  {props.children}
                </blockquote>
              ),
              code: (props: any) => {
                const {children, className} = props;
                const isInline = !className;
                if (isInline) {
                  return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>;
                }
                return (
                  <div className="bg-gray-900 rounded-xl p-6 my-8">
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              },
              ul: (props: any) => {
                // Get the raw markdown to detect bullet type
                const rawText = post?.content || '';
                const listMatch = rawText.match(/^(\s*)([-\*\+]|\d+\.|\w+\))/m);
                const bulletType = listMatch ? listMatch[2] : '-';
                
                let bulletClass = '';
                if (bulletType === '-') bulletClass = 'list-disc';
                else if (bulletType === '*') bulletClass = 'list-star';
                else if (bulletType === '+') bulletClass = 'list-plus';
                else if (/\d+\./.test(bulletType)) bulletClass = 'list-decimal';
                else if (/\w+\)/.test(bulletType)) bulletClass = 'list-alpha';
                
                return <ul className={`space-y-3 text-secondary mb-6 ${bulletClass} ml-6`}>{props.children}</ul>;
              },
              ol: (props: any) => <ol className="space-y-3 text-secondary mb-6 list-decimal ml-6">{props.children}</ol>,
              li: (props: any) => (
                <li className="text-secondary leading-relaxed">
                  {props.children}
                </li>
              ),
              a: (props: any) => {
                const { href, children, ...rest } = props;
                // Check if it's an external link
                const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
                return (
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-accent hover:underline font-medium"
                    {...rest}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Social Sharing */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <SocialShare 
            title={post.title} 
            url={currentUrl}
            data-testid="social-share"
          />
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-primary" data-testid="comments-title">
              Comments ({comments.length})
            </h3>
            
            {/* Comment Form */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-primary mb-4">Leave a Comment</h4>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Name *</Label>
                    <Input
                      id="author"
                      type="text"
                      placeholder="Your Name"
                      value={commentForm.author}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, author: e.target.value }))}
                      required
                      data-testid="comment-author"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your Email"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      data-testid="comment-email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">Comment *</Label>
                  <Textarea
                    id="content"
                    placeholder="Your comment..."
                    rows={4}
                    value={commentForm.content}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                    required
                    data-testid="comment-content"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={commentMutation.isPending}
                  data-testid="submit-comment"
                >
                  {commentMutation.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            </div>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto mb-2"></div>
                <p className="text-secondary text-sm">Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6" data-testid="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className={`${getRandomColor(comment.author)} text-sm font-semibold`}>
                          {getInitials(comment.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-primary" data-testid={`comment-author-${comment.id}`}>
                            {comment.author}
                          </span>
                          <span className="text-sm text-secondary" data-testid={`comment-date-${comment.id}`}>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-secondary" data-testid={`comment-content-${comment.id}`}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8" data-testid="no-comments">
                <p className="text-secondary">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
