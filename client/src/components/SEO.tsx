import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  structuredData?: object;
}

export default function SEO({
  title = "Alex Nkusi Shyaka - EdTech Professional & CodeImpact Founder",
  description = "Alex Nkusi Shyaka is an EdTech professional and founder of CodeImpact, empowering young Africans with market-ready tech skills. Based in Kampala, Uganda.",
  keywords = "Alex Nkusi Shyaka, Alex Shyaka, CodeImpact, EdTech, Educational Technology, African Youth, Tech Skills, Uganda",
  image = "https://alexshyaka.site/og-image.jpg",
  url = "https://alexshyaka.site/",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Alex Nkusi Shyaka",
  structuredData
}: SEOProps) {

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:url', url, true);

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      updateMetaTag('article:author', author, true);
      updateMetaTag('article:section', 'EdTech', true);
      updateMetaTag('article:tag', keywords.split(', ')[0], true);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, author, structuredData]);

  return null;
}

// Structured data generators
export const generatePersonStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alex Nkusi Shyaka",
  "alternateName": ["Alex Shyaka", "Alex Nkusi"],
  "description": "EdTech professional and founder of CodeImpact, specializing in empowering young Africans with market-ready technology skills",
  "url": "https://alexshyaka.site",
  "image": "https://alexshyaka.site/assets/alex-profile.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/ankusi/",
    "https://x.com/shyakaster",
    "https://github.com/shyakaster",
    "https://codeimpact.co"
  ],
  "jobTitle": "EdTech Professional & Founder",
  "worksFor": {
    "@type": "Organization",
    "name": "CodeImpact",
    "url": "https://codeimpact.co"
  },
  "alumniOf": {
    "@type": "Organization",
    "name": "Various Educational Institutions"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kampala",
    "addressRegion": "Central Region",
    "addressCountry": "Uganda"
  },
  "nationality": "Uganda",
  "knowsAbout": [
    "Educational Technology",
    "Software Engineering",
    "Youth Development",
    "African Tech Ecosystem",
    "Developer Training",
    "Community Building"
  ],
  "email": "alex.nkusi@codeimpact.co"
});

export const generateBlogPostStructuredData = (post: any) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.excerpt || post.content.substring(0, 160),
  "image": post.featuredImage ? `https://alexshyaka.site${post.featuredImage}` : "https://alexshyaka.site/og-image.jpg",
  "datePublished": post.createdAt,
  "dateModified": post.updatedAt || post.createdAt,
  "author": {
    "@type": "Person",
    "name": "Alex Nkusi Shyaka",
    "url": "https://alexshyaka.site"
  },
  "publisher": {
    "@type": "Person",
    "name": "Alex Nkusi Shyaka",
    "url": "https://alexshyaka.site"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://alexshyaka.site/blog/${post.slug}`
  },
  "keywords": post.tags?.join(', ') || "",
  "articleSection": "EdTech",
  "inLanguage": "en-US"
});

export const generateWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Alex Nkusi Shyaka - EdTech Professional",
  "alternateName": "Alex Shyaka Portfolio",
  "url": "https://alexshyaka.site",
  "description": "Portfolio and blog of Alex Nkusi Shyaka, EdTech professional and CodeImpact founder specializing in African youth empowerment through technology education",
  "author": {
    "@type": "Person",
    "name": "Alex Nkusi Shyaka"
  },
  "publisher": {
    "@type": "Person",
    "name": "Alex Nkusi Shyaka"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://alexshyaka.site/blog?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});