# Social Media Downloader

## Project Overview
A polished social media content downloader with modern UI, multi-platform support, and comprehensive download management. The application features a sidebar navigation with different platform tools and a main content area that changes based on the selected platform.

## Project Architecture
- **Frontend**: React with Vite, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Storage**: In-memory storage (MemStorage) for development
- **Routing**: Wouter for frontend routing
- **State Management**: React Query for server state, React hooks for client state
- **Styling**: Tailwind CSS with shadcn/ui components, dark mode support

## Features
- Multi-platform support: TikTok, Instagram, YouTube, X (Twitter)
- Clean sidebar navigation with platform-specific tools
- Download forms with different input types (username, URL, hashtag, keyword)
- Download status tracking and progress display
- Bulk download capabilities with ZIP packaging
- Excel report generation for downloaded content metadata

## User Preferences
- Use X logo and branding for Twitter (updated from legacy Twitter branding)
- Modern, clean UI design with proper color schemes per platform
- Comprehensive download management interface

## Recent Changes
- Initial project setup with fullstack JavaScript architecture
- Updated to use X branding instead of Twitter (2024-08-20)
- Enhanced TikTok bulk download feature: removed download limits for bulk profile downloads, automatically downloads all user videos, improved UI messaging and button states (2024-08-20)

## Technical Decisions
- Using React Query for API calls and caching
- Shadcn/ui components for consistent design system
- TypeScript for type safety across frontend and backend
- Express.js backend for API endpoints and file handling
