import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Portfolio", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Write", path: "/write" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary hover:text-accent transition-colors" data-testid="logo">
              Alex Shyaka
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors pb-1",
                    isActive(item.path)
                      ? "text-primary border-b-2 border-accent"
                      : "text-secondary hover:text-primary"
                  )}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/shyakaster" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors"
              data-testid="social-github"
            >
              <i className="fab fa-github text-lg"></i>
            </a>
            <a 
              href="https://www.linkedin.com/in/ankusi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors"
              data-testid="social-linkedin"
            >
              <i className="fab fa-linkedin text-lg"></i>
            </a>
            <a 
              href="https://x.com/shyakaster" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-colors"
              data-testid="social-x"
            >
              <i className="fab fa-x-twitter text-lg"></i>
            </a>
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive(item.path) ? "text-accent" : "text-secondary hover:text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
