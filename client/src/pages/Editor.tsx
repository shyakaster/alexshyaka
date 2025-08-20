import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "@/components/MarkdownEditor";
import AdminAuth from "@/components/AdminAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insertBlogPostSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Eye, Settings, Upload } from "lucide-react";

export default function Editor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [importUrl, setImportUrl] = useState("");

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const validatedData = insertBlogPostSchema.parse(postData);
      return apiRequest("POST", "/api/blog-posts", validatedData);
    },
    onSuccess: async (response) => {
      const post = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Post saved!",
        description: `Your post "${post.title}" has been ${published ? "published" : "saved as draft"}.`,
      });
      if (published) {
        setLocation(`/blog/${post.slug}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save post",
        description: error.message || "There was an error saving your post.",
        variant: "destructive",
      });
    },
  });

  const importContentMutation = useMutation({
    mutationFn: async (url: string) => {
      return apiRequest("POST", "/api/import-content", { url });
    },
    onSuccess: () => {
      toast({
        title: "Content import initiated",
        description: "Content import functionality would be implemented here.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Import failed",
        description: error.message || "There was an error importing content.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required", 
        description: "Please write some content for your post.",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      tags,
      published,
      metadata: {
        readTime: Math.ceil(content.split(/\s+/).length / 200), // Estimate 200 words per minute
        author: "Alex Shyaka"
      }
    };

    createPostMutation.mutate(postData);
  };

  const handlePreview = () => {
    setActiveTab("preview");
  };

  const handleImport = () => {
    if (!importUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to import content from.",
        variant: "destructive",
      });
      return;
    }
    importContentMutation.mutate(importUrl.trim());
  };

  const generateExcerpt = () => {
    if (content.trim()) {
      const plainText = content.replace(/[#*`\[\]()]/g, '').substring(0, 200);
      setExcerpt(plainText + (plainText.length >= 200 ? "..." : ""));
    }
  };

  return (
    <AdminAuth>
      <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2" data-testid="editor-title">
            Write New Post
          </h1>
          <p className="text-secondary">Create and publish your technical content with our markdown editor.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="write" className="flex items-center space-x-2" data-testid="tab-write">
              <FileText size={16} />
              <span>Write</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2" data-testid="tab-preview">
              <Eye size={16} />
              <span>Preview</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2" data-testid="tab-settings">
              <Settings size={16} />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MarkdownEditor
                  title={title}
                  setTitle={setTitle}
                  slug={slug}
                  setSlug={setSlug}
                  content={content}
                  setContent={setContent}
                  tags={tags}
                  setTags={setTags}
                  onSave={handleSave}
                  onPreview={handlePreview}
                  isSaving={createPostMutation.isPending}
                  className="h-[calc(100vh-300px)]"
                />
              </div>
              
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published">Publish immediately</Label>
                      <Switch
                        id="published"
                        checked={published}
                        onCheckedChange={setPublished}
                        data-testid="switch-published"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSave} 
                      disabled={createPostMutation.isPending}
                      className="w-full"
                      data-testid="button-save-post"
                    >
                      {createPostMutation.isPending 
                        ? "Saving..." 
                        : published 
                          ? "Publish Post" 
                          : "Save Draft"
                      }
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handlePreview}
                      className="w-full"
                      data-testid="button-preview-post"
                    >
                      Preview Post
                    </Button>
                  </CardContent>
                </Card>

                {/* Content Import */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Upload size={18} />
                      <span>Import Content</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="import-url">Import from alexshyaka.site</Label>
                      <Input
                        id="import-url"
                        type="url"
                        placeholder="https://alexshyaka.site/post-url"
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        data-testid="input-import-url"
                      />
                    </div>
                    <Button 
                      onClick={handleImport}
                      disabled={importContentMutation.isPending}
                      variant="outline"
                      className="w-full"
                      data-testid="button-import-content"
                    >
                      {importContentMutation.isPending ? "Importing..." : "Import Content"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Post Stats */}
                {content && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Post Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Words:</span>
                        <span data-testid="word-count">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Characters:</span>
                        <span data-testid="char-count">{content.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. read time:</span>
                        <span data-testid="read-time">{Math.ceil(content.split(/\s+/).length / 200)} min</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {title ? (
                <article className="prose prose-lg max-w-none">
                  <header className="space-y-6 mb-8">
                    <h1 className="text-4xl font-bold text-primary" data-testid="preview-title">
                      {title}
                    </h1>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} className="bg-accent/10 text-accent" data-testid={`preview-tag-${tag}`}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {excerpt && (
                      <p className="text-xl text-secondary italic" data-testid="preview-excerpt">
                        {excerpt}
                      </p>
                    )}
                  </header>
                  
                  <div data-testid="preview-content">
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
                      }}
                    >
                      {content || "*Start writing to see preview...*"}
                    </ReactMarkdown>
                  </div>
                </article>
              ) : (
                <div className="text-center py-16">
                  <p className="text-secondary text-lg">Start writing to see your post preview</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <textarea
                      id="excerpt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      rows={4}
                      placeholder="Brief description of your post..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      data-testid="textarea-excerpt"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={generateExcerpt}
                        data-testid="button-generate-excerpt"
                      >
                        Generate from content
                      </Button>
                      <span className="text-sm text-secondary">{excerpt.length}/200</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published-setting">Published</Label>
                    <Switch
                      id="published-setting"
                      checked={published}
                      onCheckedChange={setPublished}
                      data-testid="switch-published-setting"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      type="text"
                      placeholder="SEO title (defaults to post title)"
                      data-testid="input-meta-title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <textarea
                      id="meta-description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      rows={3}
                      placeholder="SEO description (defaults to excerpt)"
                      data-testid="textarea-meta-description"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AdminAuth>
  );
}
