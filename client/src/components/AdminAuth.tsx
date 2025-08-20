import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('blog-admin-auth');
    const authTime = localStorage.getItem('blog-admin-auth-time');
    
    if (authStatus === 'true' && authTime) {
      const now = new Date().getTime();
      const authTimestamp = parseInt(authTime);
      // Session expires after 4 hours
      if (now - authTimestamp < 4 * 60 * 60 * 1000) {
        setIsAuthenticated(true);
      } else {
        // Clear expired session
        localStorage.removeItem('blog-admin-auth');
        localStorage.removeItem('blog-admin-auth-time');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('blog-admin-auth', 'true');
        localStorage.setItem('blog-admin-auth-time', new Date().getTime().toString());
        toast({
          title: "Access granted",
          description: "Welcome to the blog admin panel.",
        });
      } else {
        toast({
          title: "Access denied",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('blog-admin-auth');
    localStorage.removeItem('blog-admin-auth-time');
    toast({
      title: "Logged out",
      description: "You have been logged out from the admin panel.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
              <p className="text-secondary text-sm">
                Enter the admin password to access the blog editor
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">Admin Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      required
                      data-testid="admin-password-input"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-secondary" />
                      ) : (
                        <Eye className="h-4 w-4 text-secondary" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="admin-login-button"
                >
                  {isLoading ? "Verifying..." : "Access Admin Panel"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          data-testid="admin-logout-button"
        >
          Logout
        </Button>
      </div>
      {children}
    </div>
  );
}