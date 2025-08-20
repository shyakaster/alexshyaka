# Overview

This is a full-stack blog platform built with React, TypeScript, Express.js, and PostgreSQL. The application features a portfolio/personal website with an integrated blog system that supports content creation, publishing, and commenting. The platform includes a markdown-based editor for writing posts, file upload capabilities via Google Cloud Storage, and a responsive design using shadcn/ui components.

# User Preferences

Preferred communication style: Simple, everyday language.

# Development Workflow

## Git Workflow and Checkpoints
The project uses a structured git workflow with automated checkpoint creation and meaningful commit messages. All development work is committed locally with descriptive messages before manual deployment to GitHub.

### Git Workflow Scripts
- **`./scripts/git-checkpoint.sh`**: Interactive script for creating structured commits with meaningful messages
- **`./scripts/git-status.sh`**: Comprehensive overview of git repository status and recent commits  
- **`./scripts/deploy-prep.sh`**: Pre-deployment checklist and validation

### Commit Message Structure
Commits follow a structured format:
- **Type**: feat, fix, style, content, refactor, config, docs
- **Description**: Brief summary of changes
- **Details**: Optional detailed explanation
- **Checkpoint timestamp**: Automatic timestamp for tracking

### Deployment Process
1. Make changes and test locally
2. Create checkpoint: `./scripts/git-checkpoint.sh`
3. Verify status: `./scripts/git-status.sh`
4. Prepare for deployment: `./scripts/deploy-prep.sh`
5. Push to GitHub: `git push`
6. Deploy via Replit (automatic if connected to GitHub)

# System Architecture

## Frontend Architecture
The client-side is built as a Single Page Application (SPA) using React 18 with TypeScript. The application uses Wouter for client-side routing, providing a lightweight alternative to React Router. State management is handled through TanStack Query (React Query) for server state and React's built-in state management for local component state.

The UI is constructed using shadcn/ui components built on top of Radix UI primitives, styled with Tailwind CSS. This approach provides accessible, customizable components with consistent design patterns. The styling system uses CSS custom properties for theming and maintains a responsive design across different screen sizes.

## Backend Architecture
The server runs on Express.js with TypeScript, following a RESTful API design pattern. The application uses a modular route structure that separates concerns between blog posts, comments, file uploads, and object storage. The server includes middleware for request logging, error handling, and JSON/URL-encoded body parsing.

The backend implements an in-memory storage layer (MemStorage) as the primary data access interface, which can be easily swapped for database implementations. This abstraction allows for flexible data persistence strategies while maintaining consistent API contracts.

## Data Storage Solutions
The schema is defined using Drizzle ORM with PostgreSQL as the target database. The data model includes three main entities: users, blog posts, and comments. Blog posts support rich metadata including tags, publication status, featured images, and custom metadata fields for analytics.

The application uses Neon Database (@neondatabase/serverless) as the PostgreSQL provider, configured through Drizzle's migration system. Database schemas are shared between client and server through a common schema file, ensuring type safety across the full stack.

## File Upload and Storage
File uploads are handled through Google Cloud Storage integration using a presigned URL approach. The system includes an ObjectUploader component built on Uppy.js that provides drag-and-drop functionality, progress tracking, and direct-to-cloud uploads.

The object storage service includes access control mechanisms through custom ACL policies stored as object metadata. This allows for flexible permission management on uploaded files, supporting use cases like private content and group-based access.

## Content Management
The blog system features a markdown-based editor with live preview capabilities. Posts support draft and published states, SEO-friendly slug generation, and tag-based categorization. The editor includes toolbar shortcuts for common markdown formatting and integrates with the file upload system for image embedding.

Content rendering uses ReactMarkdown for converting markdown to HTML with syntax highlighting support. The system includes search functionality across published posts and supports pagination for better performance with large content volumes.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database provider for data persistence
- **Drizzle ORM**: Type-safe database toolkit for schema management and queries

## Cloud Storage
- **Google Cloud Storage**: Object storage service for file uploads and asset management
- **Google Cloud IAM**: Authentication and authorization for storage access

## UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## File Upload
- **Uppy.js**: File upload library with progress tracking and cloud storage integration
- **@uppy/aws-s3**: AWS S3 (compatible with Google Cloud Storage) upload plugin

## Development Tools
- **Vite**: Build tool and development server for fast development experience
- **TypeScript**: Static typing for improved developer experience and code quality
- **TanStack Query**: Data fetching and caching library for server state management

## Content Processing
- **ReactMarkdown**: Markdown to React component conversion for blog post rendering
- **React Hook Form**: Form management library with validation support
- **Zod**: Schema validation library for type-safe data validation