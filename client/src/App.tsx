import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Portfolio from "@/pages/Portfolio";
import Blog from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPost";
import Editor from "@/pages/Editor";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/write" component={Editor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
