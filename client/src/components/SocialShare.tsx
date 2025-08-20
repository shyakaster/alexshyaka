import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  url: string;
  className?: string;
}

export default function SocialShare({ title, url, className }: SocialShareProps) {
  const { toast } = useToast();

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    
    let shareLink = "";
    
    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-secondary">
          Share this article:
        </div>
        <div className="flex space-x-3">
          <Button
            size="sm"
            onClick={() => handleShare("twitter")}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            data-testid="share-twitter"
          >
            <Twitter size={16} className="mr-2" />
            Twitter
          </Button>
          <Button
            size="sm"
            onClick={() => handleShare("linkedin")}
            className="bg-blue-700 hover:bg-blue-800 text-white"
            data-testid="share-linkedin"
          >
            <Linkedin size={16} className="mr-2" />
            LinkedIn
          </Button>
          <Button
            size="sm"
            onClick={() => handleShare("facebook")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="share-facebook"
          >
            <Facebook size={16} className="mr-2" />
            Facebook
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            data-testid="share-copy"
          >
            <LinkIcon size={16} className="mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
}
