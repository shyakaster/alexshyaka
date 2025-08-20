# Alex Nkusi Shyaka - Personal Blog & Portfolio

A modern, minimalist blog platform showcasing insights on African technology education, youth empowerment, and building sustainable developer communities across Africa.

## 🌍 Mission

This platform serves as a hub for sharing thoughts on African tech education challenges, celebrating wins, and encouraging young Africans to become technology creators rather than consumers. Through authentic storytelling and professional insights, we aim to bridge the skills gap in Africa's tech ecosystem.

## 🚀 About

**Alex Nkusi Shyaka** is an EdTech entrepreneur and developer community builder, founder of [CodeImpact](https://codeimpact.co) - an organization dedicated to empowering young Africans with market-ready tech skills. Combining data analysis expertise with educational technology, Alex builds sustainable developer communities and works to democratize opportunity across the continent.

## 📝 Content Focus

- **African Tech Education**: Innovative approaches to teaching technology skills
- **Youth Empowerment**: Strategies for developing the next generation of African tech leaders  
- **Community Building**: Creating sustainable developer ecosystems
- **Digital Literacy**: Responsible technology use and digital citizenship
- **Market-Ready Skills**: Bridging the gap between education and industry needs

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for responsive, utility-first styling

### Backend
- **Express.js** with TypeScript for robust API development
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **Neon Database** for serverless PostgreSQL hosting
- **Google Cloud Storage** for file uploads and asset management

### Features
- **Markdown-based blog** with live preview editor
- **Password-protected admin** for content management
- **Responsive design** optimized for all devices
- **SEO-friendly** with proper meta tags and Open Graph support
- **Comment system** for community engagement
- **Social sharing** integration

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon Database account)
- Google Cloud Storage bucket (optional, for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shyakaster/alexshyaka.git
   cd alexshyaka
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and storage credentials
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── README.md
```

## 🎯 Key Features

### 🔐 Secure Content Management
- Password-protected blog editor (`/write`)
- Session-based authentication with 4-hour expiration
- Secure content creation and editing workflow

### 📖 Rich Content Experience
- Markdown-based writing with live preview
- Syntax highlighting for code blocks
- Featured images and tag categorization
- Draft and published post states

### 🌐 Professional Portfolio
- Comprehensive skills showcase
- Project portfolio with live demos
- Professional headshot and social links
- Contact information and availability status

### 📱 Mobile-First Design
- Responsive layouts for all screen sizes
- Touch-friendly navigation and interactions
- Optimized images and performance

## 🌟 CodeImpact Integration

This website prominently features [CodeImpact](https://codeimpact.co), Alex's educational technology organization that:

- Delivers industry-relevant technical skills to African youth
- Operates 12-week coding classes for teens
- Maintains a thriving developer community with 45+ registered members
- Helps developers transition to successful freelance careers
- Focuses on creating global opportunities for African talent

## 🚀 Deployment

The application is designed to run on modern hosting platforms like:
- **Replit** (current hosting)
- **Vercel** 
- **Netlify**
- **Railway**
- **Heroku**

For production deployment, ensure all environment variables are properly configured and the database is accessible.

## 🤝 Contributing

This is a personal blog and portfolio website. However, feedback and suggestions are welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Share feedback on content and user experience

## 📞 Connect

- **Website**: [alexshyaka.com](https://alexshyaka.com)
- **LinkedIn**: [ankusi](https://www.linkedin.com/in/ankusi/)
- **Twitter**: [@shyakaster](https://x.com/shyakaster)
- **GitHub**: [shyakaster](https://github.com/shyakaster)
- **Company**: [CodeImpact](https://codeimpact.co)

## 📄 License

© 2024 Alex Nkusi Shyaka. All rights reserved.

---

*Building the future of African technology education, one developer at a time.* 🚀