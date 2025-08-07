# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development
- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build the Next.js application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Common Development Tasks
- Run development server: `npm run dev` (uses Turbopack for faster builds)
- Build production: `npm run build`
- Check linting: `npm run lint`

## Code Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL) with comprehensive type definitions
- **Authentication**: Supabase Auth with middleware-based session management
- **Styling**: Tailwind CSS with shadcn/ui components
- **Monitoring**: Sentry for error tracking and performance monitoring
- **Analytics**: Vercel Analytics
- **Deep Linking**: Branch.io SDK for mobile app integration

### Project Structure
```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API routes (REST endpoints)
│   │   ├── v2/           # Version 2 API endpoints (current)
│   │   └── ...           # Legacy API endpoints
│   ├── (pages)/          # App pages (home, privacy, terms, etc.)
│   └── layout.tsx        # Root layout with theme provider
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── ...              # Custom components
├── utils/               # Utility functions
│   ├── supabase/        # Supabase client configuration
│   └── ...              # Other utilities
└── lib/                 # Shared libraries
```

### Database Architecture
The application uses Supabase with extensive type definitions in `types_db.ts`. Key database concepts:

- **Dual Schema**: Both legacy (`users`, `posts`, `replies`) and v2 (`users_v2`, `posts_v2`, `replies_v2`) tables
- **Geographic Features**: PostGIS for location-based queries with functions like `get_posts_v2_in_circle`
- **User System**: Anonymous posting with user tracking, referral system, and trust scores
- **Content Moderation**: Automated moderation with scoring and manual review workflows
- **Reactions**: Like/dislike system for posts and replies
- **Viewing Circles**: Location-based content filtering system

### API Architecture
- **REST API**: All endpoints in `src/app/api/` using Next.js route handlers
- **Version 2 Focus**: Primary development on `/api/v2/` endpoints
- **Authentication**: Bearer token-based auth with Supabase middleware
- **Geographic Features**: Location randomization (200m radius) for privacy
- **Content Validation**: Built-in content filtering and validation

### Key Components
- **Authentication Middleware**: `middleware.ts` handles session management
- **Database Client**: `src/utils/supabase/server.ts` for server-side operations
- **Theme System**: Dark mode support with `next-themes`
- **Location Services**: Geographic utilities in `src/utils/geolocation.ts`

### Content & Moderation
- **Anonymous Posts**: Users can post "secrets" with location randomization
- **Content Validation**: Character limits, social media handle filtering
- **Moderation System**: Automated scoring with manual review capabilities
- **Trust Scores**: User reputation system based on flagged content

### Mobile Integration
- **Branch.io**: Deep linking for mobile app integration
- **Screenshot Protection**: Detection and lockout system for screenshot attempts
- **Push Notifications**: Expo push token management

## Development Guidelines

### API Development
- Use v2 endpoints for new features (`/api/v2/`)
- Always validate authentication tokens
- Implement proper error handling with generic error messages
- Use typed Supabase client with database type definitions

### Database Operations
- Use server-side Supabase client for API routes
- Leverage database functions for complex geographic queries
- Follow existing patterns for user authentication and data access

### Geographic Features
- Posts are automatically randomized within 200m for privacy
- Use PostGIS functions for location-based queries
- Consider viewing circles for content filtering

### Security Considerations
- All API routes require authentication
- Content validation prevents harmful submissions
- Geographic randomization protects user privacy
- Screenshot detection prevents content theft

## Environment Variables Required
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

## Key Files to Understand
- `types_db.ts` - Complete database type definitions
- `middleware.ts` - Authentication middleware
- `src/utils/supabase/server.ts` - Server-side database client
- `src/app/api/v2/posts/create/route.ts` - Example API route with validation