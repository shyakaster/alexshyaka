import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Edit, Plus } from "lucide-react";
import BlogPostCard from "@/components/BlogPostCard";
import { BlogPost } from "@shared/schema";
import SEO from "@/components/SEO";
import { Link } from "wouter";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const postsPerPage = 6;

  // Check admin status (same key as AdminAuth component)
  useEffect(() => {
    const checkAdminStatus = () => {
      const authStatus = localStorage.getItem('blog-admin-auth');
      const authTime = localStorage.getItem('blog-admin-auth-time');
      
      if (authStatus === 'true' && authTime) {
        const now = new Date().getTime();
        const authTimestamp = parseInt(authTime);
        // Session expires after 4 hours
        if (now - authTimestamp < 4 * 60 * 60 * 1000) {
          setIsAdmin(true);
        } else {
          // Clear expired session
          localStorage.removeItem('blog-admin-auth');
          localStorage.removeItem('blog-admin-auth-time');
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    
    // Check periodically for changes (e.g., when user logs in via editor)
    const interval = setInterval(checkAdminStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const categories = ["All Posts", "African Youth Empowerment", "Educational Innovation", "Future Leaders", "Digital Literacy", "Youth Leadership", "Technology Creation"];

  const { data: allPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts", { published: !showDrafts }],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts?published=${!showDrafts}`);
      return response.json();
    },
  });

  const { data: draftPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts", { published: false }],
    queryFn: async () => {
      const response = await fetch("/api/blog-posts?published=false");
      return response.json();
    },
    enabled: isAdmin,
  });

  const { data: searchResults = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts", { search: searchQuery }],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/blog-posts?search=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  const postsToShow = showDrafts ? draftPosts : allPosts;
  const filteredPosts = searchQuery.trim() 
    ? searchResults 
    : selectedCategory === "All Posts" 
      ? postsToShow 
      : postsToShow.filter(post => 
          (post.tags || []).some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
        );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleBookmark = (postId: string) => {
    // For now, just show a placeholder action
    console.log("Bookmarked post:", postId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
    setSearchQuery(""); // Clear search when filtering by category
  };


  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-secondary">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <SEO
        title="EdTech Dialogue - Alex Nkusi Shyaka's Blog | African Youth Empowerment & Educational Technology"
        description="Explore Alex Nkusi Shyaka's insights on educational technology, youth empowerment strategies, and transformative learning experiences across Africa's dynamic tech landscape. CodeImpact founder sharing expertise in EdTech innovation."
        keywords="EdTech Blog, Alex Nkusi Shyaka, Educational Technology, African Youth Empowerment, CodeImpact, Tech Education, African Innovation, Youth Leadership, Digital Learning, Software Development Training"
        url="https://alexshyaka.site/blog"
        type="website"
      />
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant={showDrafts ? "default" : "outline"}
                onClick={() => setShowDrafts(!showDrafts)}
                data-testid="toggle-drafts"
              >
                {showDrafts ? `Published Posts (${allPosts.length})` : `Drafts (${draftPosts.length})`}
              </Button>
            </div>
            <Link href="/write">
              <Button variant="default" data-testid="admin-new-post">
                <Plus size={16} className="mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        )}

        {/* Blog Header */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-primary" data-testid="blog-title">
            {showDrafts ? "Draft Articles" : "EdTech Dialogue"}
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto" data-testid="blog-description">
            {showDrafts 
              ? "Unpublished articles and work-in-progress content. These are only visible to admin users."
              : "Exploring educational technology innovations, youth empowerment strategies, and transformative learning experiences across Africa's dynamic tech landscape."
            }
          </p>
          
          {/* Category Filters - Only show for published posts */}
          {!showDrafts && (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category)}
                  className={selectedCategory === category ? "bg-accent text-white hover:bg-blue-600" : ""}
                  data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-3"
              data-testid="search-input"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
          </form>
        </div>

        {/* Results Summary */}
        {(searchQuery.trim() || selectedCategory !== "All Posts" || showDrafts) && (
          <div className="mb-8">
            <p className="text-secondary" data-testid="results-summary">
              {showDrafts 
                ? `Showing ${filteredPosts.length} draft${filteredPosts.length === 1 ? '' : 's'}`
                : searchQuery.trim() 
                  ? `Found ${filteredPosts.length} results for "${searchQuery}"`
                  : `Showing ${filteredPosts.length} posts in "${selectedCategory}"`
              }
            </p>
          </div>
        )}

        {/* Blog Grid */}
        {currentPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" data-testid="blog-grid">
              {currentPosts.map((post) => (
                <BlogPostCard 
                  key={post.id} 
                  post={post} 
                  onBookmark={handleBookmark}
                  showEditButton={isAdmin}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4" data-testid="pagination">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  data-testid="pagination-previous"
                >
                  <ChevronLeft size={16} className="mr-2" /> Previous
                </Button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 ${currentPage === pageNum ? "bg-accent text-white" : ""}`}
                      data-testid={`pagination-page-${pageNum}`}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  data-testid="pagination-next"
                >
                  Next <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16" data-testid="no-results">
            <h3 className="text-xl font-semibold text-primary mb-2">No posts found</h3>
            <p className="text-secondary mb-6">
              {searchQuery.trim() 
                ? "Try adjusting your search terms or browse all posts."
                : "No posts available in this category yet."
              }
            </p>
            {(searchQuery.trim() || selectedCategory !== "All Posts") && (
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Posts");
                  setCurrentPage(1);
                }}
                data-testid="clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
