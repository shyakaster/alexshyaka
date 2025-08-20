import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ObjectUploader } from "@/components/ObjectUploader";
import { 
  Bold, 
  Italic, 
  Heading, 
  Link as LinkIcon, 
  Image, 
  Code, 
  Quote, 
  List, 
  Upload,
  Save,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  title: string;
  setTitle: (title: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
  content: string;
  setContent: (content: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  onSave: () => void;
  onPreview: () => void;
  isSaving?: boolean;
  className?: string;
}

export default function MarkdownEditor({
  title,
  setTitle,
  slug,
  setSlug,
  content,
  setContent,
  tags,
  setTags,
  onSave,
  onPreview,
  isSaving = false,
  className
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tagInput, setTagInput] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const insertMarkdown = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = selectedText || placeholder;
    const newText = prefix + replacement + suffix;
    
    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown("**", "**", "bold text"), title: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", "*", "italic text"), title: "Italic" },
    { icon: Heading, action: () => insertMarkdown("## ", "", "Heading"), title: "Heading" },
    { type: "separator" },
    { icon: LinkIcon, action: () => insertMarkdown("[", "](url)", "link text"), title: "Link" },
    { icon: Image, action: () => insertMarkdown("![", "](image-url)", "alt text"), title: "Image" },
    { icon: Code, action: () => insertMarkdown("`", "`", "code"), title: "Inline Code" },
    { type: "separator" },
    { icon: Quote, action: () => insertMarkdown("> ", "", "quote"), title: "Quote" },
    { icon: List, action: () => insertMarkdown("- ", "", "list item"), title: "List" },
  ];

  const handleGetUploadParameters = async () => {
    const response = await fetch("/api/objects/upload", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const imageUrl = uploadedFile.uploadURL;
      const fileName = uploadedFile.name || "image";
      insertMarkdown(`![${fileName}](${imageUrl})`, "", "");
    }
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full", className)}>
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-primary">Editor</h2>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              data-testid="button-save"
            >
              <Save size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreview}
              data-testid="button-preview"
            >
              <Eye size={16} />
            </Button>
          </div>
        </div>
        
        {/* Post Metadata */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Post Title..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-lg font-semibold"
              data-testid="input-title"
            />
          </div>
          
          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              type="text"
              placeholder="post-slug-url"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="text-sm"
              data-testid="input-slug"
            />
          </div>
          
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                  data-testid={`tag-${tag}`}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <Input
              id="tags"
              type="text"
              placeholder="Add tags (press Enter or comma to add)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="text-sm"
              data-testid="input-tags"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {toolbarButtons.map((button, index) => {
            if (button.type === "separator") {
              return <Separator key={index} orientation="vertical" className="h-8" />;
            }
            
            const IconComponent = button.icon!;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={button.title}
                className="p-2"
                data-testid={`toolbar-${button.title?.toLowerCase()}`}
              >
                <IconComponent size={16} />
              </Button>
            );
          })}
          
          <Separator orientation="vertical" className="h-8" />
          
          <ObjectUploader
            maxNumberOfFiles={1}
            maxFileSize={10485760}
            onGetUploadParameters={handleGetUploadParameters}
            onComplete={handleUploadComplete}
            buttonClassName="p-2 h-8"
          >
            <Upload size={16} />
          </ObjectUploader>
        </div>
      </div>

      {/* Text Editor */}
      <div className="flex-1 p-4">
        <Textarea
          ref={textareaRef}
          className="w-full h-full resize-none border-0 focus:outline-none font-mono text-sm leading-relaxed"
          placeholder="Write your post in markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          data-testid="textarea-content"
        />
      </div>
    </div>
  );
}
