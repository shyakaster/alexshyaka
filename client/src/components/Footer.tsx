import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Footer() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/ankusi/",
      icon: "fab fa-linkedin-in",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-100"
    },
    {
      name: "X",
      url: "https://x.com/shyakaster",
      icon: "fab fa-twitter", 
      color: "hover:text-gray-800",
      bgColor: "hover:bg-gray-100"
    },
    {
      name: "GitHub",
      url: "https://github.com/shyakaster",
      icon: "fab fa-github",
      color: "hover:text-gray-800",
      bgColor: "hover:bg-gray-100"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Section - About & Social */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">
                Let's Build the Future of 
                <span className="text-accent"> African Tech</span>
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Founder of <a href="https://codeimpact.co" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">CodeImpact</a>, 
                empowering young Africans with market-ready tech skills and building sustainable developer communities across the continent.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold">Connect With Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 ${social.bgColor} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                    data-testid={`social-${social.name.toLowerCase()}`}
                    title={`Follow me on ${social.name}`}
                  >
                    <i className={`${social.icon} text-xl ${social.color} transition-colors duration-300`}></i>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>@shyakaster</span>
                <span>•</span>
                <span>Kampala, Uganda</span>
                <span>•</span>
                <span>CodeImpact Founder</span>
              </div>
            </div>

            {/* CodeImpact Link */}
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <h4 className="font-semibold text-accent mb-2">CodeImpact</h4>
              <p className="text-gray-300 text-sm mb-3">
                Empowering the next generation of African tech leaders through practical education and mentorship.
              </p>
              <a 
                href="https://codeimpact.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-accent hover:text-blue-400 font-medium transition-colors duration-300"
              >
                Visit CodeImpact
                <i className="fas fa-external-link-alt ml-2 text-xs"></i>
              </a>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Get In Touch</h3>
              <p className="text-gray-300">
                Have a project idea, partnership opportunity, or just want to chat about African tech? I'd love to hear from you!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-accent"
                    data-testid="input-name"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-accent"
                    data-testid="input-email"
                    required
                  />
                </div>
              </div>

              <div>
                <Input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-accent"
                  data-testid="input-subject"
                />
              </div>

              <div>
                <Textarea
                  name="message"
                  placeholder="Your Message *"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-accent resize-none"
                  data-testid="textarea-message"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-accent hover:bg-blue-600 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105"
                data-testid="button-send-message"
              >
                {contactMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Message
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-gray-400 text-sm">
              <p>Or email me directly at</p>
              <a 
                href="mailto:alex.nkusi@codeimpact.co" 
                className="text-accent hover:text-blue-400 font-medium transition-colors duration-300"
                data-testid="email-direct"
              >
                alex.nkusi@codeimpact.co
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Alex Nkusi. Built with passion for African tech education.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made in Uganda 🇺🇬</span>
              <span>•</span>
              <span>CodeImpact Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}