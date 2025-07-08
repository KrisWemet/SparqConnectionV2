# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sparq Connection** is an AI-powered Relationship Intelligence Platform that creates personalized daily connection moments for couples. This is a production-grade application focused on emotional safety, privacy, and meaningful relationship improvements.

**Core Philosophy**: "We build rituals, not features. We create moments, not just products."

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Development Workflow
Always run these commands before committing:
1. `npm run lint:fix` - Fix linting issues
2. `npm run format` - Format code
3. `npm run typecheck` - Check TypeScript types

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Realtime + Auth + Storage)
- **AI**: OpenAI GPT-4 for question generation and crisis detection
- **UI/UX**: Framer Motion for animations, custom component library
- **State Management**: React hooks with Supabase real-time subscriptions

### Key Technical Decisions
- **Couple-Centric Data Model**: All data organized around couples, not individual users
- **Row-Level Security**: Implemented at database level for data isolation
- **End-to-End Encryption**: Private reflections encrypted using crypto-js
- **Crisis Detection**: Multi-layer safety system with keyword + AI sentiment analysis
- **PWA-Ready**: Offline support and installable on mobile devices

## Core Database Schema

### Primary Tables
- `users` - Individual user profiles with attachment styles
- `couples` - Relationship entities with health scores and streaks
- `daily_questions` - AI-generated questions categorized by type
- `responses` - User answers to questions (shared or private)
- `reflections` - Private encrypted journal entries
- `quests` - Guided relationship exercises
- `crisis_events` - Crisis detection logs (metadata only)
- `invitations` - Partner invitation system

### Key Relationships
- Users belong to couples (many-to-many through couples table)
- Questions are generated per couple
- Responses link users to questions
- All data isolated by couple_id using RLS

## File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── auth/              # Authentication components
│   ├── features/          # Feature-specific components
│   ├── layouts/           # Page layouts
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── ai/                # OpenAI integration
│   ├── auth/              # Auth context and providers
│   ├── security/          # Encryption utilities
│   ├── supabase/          # Database clients
│   └── utils/             # Shared utilities
├── middleware.ts          # Next.js middleware
├── types/                 # TypeScript definitions
└── styles/                # Additional styles
```

## AI Integration

### OpenAI Services
- **Question Generation**: Personalized daily questions based on attachment styles, relationship stage, and history
- **Crisis Detection**: Multi-layer safety system analyzing content for crisis indicators
- **Content Moderation**: Using OpenAI's moderation API for safety

### Key AI Classes
- `AIService.generateDailyQuestion()` - Creates personalized questions
- `AIService.detectCrisis()` - Analyzes content for crisis indicators
- `AIService.moderateContent()` - Content safety checks

## Security & Privacy

### Data Protection
- **Encryption**: Private reflections encrypted using crypto-js
- **RLS**: Row-Level Security policies isolate couple data
- **Crisis Logging**: Only metadata stored, never actual crisis content
- **Environment Variables**: All sensitive keys in environment variables

### Authentication
- Supabase Auth with email/password
- Session management with auto-refresh
- Protected routes using middleware

## Development Guidelines

### Code Quality
- **TypeScript Strict Mode**: No `any` types allowed
- **Component Patterns**: Reusable, accessible React components
- **Error Handling**: Graceful fallbacks for all AI and database operations
- **Performance**: Lazy loading, image optimization, bundle analysis

### Safety-First Development
- **Crisis Detection**: All user content passes through safety checks
- **Content Moderation**: Multi-layer approach with AI + keyword filtering
- **Privacy**: Minimal data collection, encryption for sensitive content
- **Accessibility**: WCAG 2.1 AA compliance required

### Feature Development Pattern
1. **Plan**: Consider couple-centric data model and privacy implications
2. **Implement**: Use existing patterns from similar features
3. **Test**: Verify safety systems and data isolation
4. **Monitor**: Check performance and user safety metrics

## Environment Setup

### Required Environment Variables
```
# Core Application
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# MCP Servers (Optional but Recommended)
DATABASE_URL=your_postgres_connection_string
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
BRAVE_SEARCH_API_KEY=your_brave_search_api_key
```

### Database Setup
- Supabase project with provided schema
- RLS policies must be enabled
- Migrations located in `supabase/migrations/`

### MCP Server Setup
- Run `./.mcp/setup.sh` to install MCP packages
- MCP configuration available in `.mcp/config.json`
- Documentation in `.mcp/README.md`
- Test with `npm run mcp:test`

## Key Patterns

### Couple-Centric Components
Always filter data by couple_id and respect RLS policies:
```typescript
const { data: questions } = await supabase
  .from('daily_questions')
  .select('*')
  .eq('couple_id', coupleId);
```

### Crisis Detection Integration
All user content should pass through safety checks:
```typescript
const crisisResult = await AIService.detectCrisis({ content });
if (crisisResult.isCrisisDetected) {
  // Trigger crisis intervention flow
}
```

### Encryption for Private Content
Use encryption utilities for sensitive data:
```typescript
import { encryptContent } from '@/lib/security/encryption';
const encrypted = encryptContent(reflectionText);
```

## MCP Enhanced Capabilities

### Available MCP Servers
- **PostgreSQL MCP**: Advanced database operations and schema management
- **Sequential Thinking MCP**: Enhanced AI reasoning for relationship guidance
- **Puppeteer MCP**: Automated testing of critical user journeys
- **Google Maps MCP**: Location-based crisis resources and therapist finder
- **Brave Search MCP**: Finding relationship experts and therapy resources

### MCP Usage Examples
```typescript
// Using PostgreSQL MCP for complex psychology queries
await postgresql.query({
  sql: `SELECT * FROM user_psychology_profiles WHERE attachment_style = $1`,
  params: ['anxious']
});

// Using Sequential Thinking MCP for crisis assessment
await sequentialThinking.analyze({
  prompt: "Assess relationship crisis indicators",
  context: userMessage
});

// Using Google Maps MCP for crisis resources
await googleMaps.findNearby({
  query: "crisis counseling centers",
  location: userLocation,
  radius: 25000
});
```

## Testing Strategy

### Critical Paths to Test
- Authentication and couple pairing
- Crisis detection accuracy
- Data isolation between couples
- AI question generation
- Real-time synchronization

### Performance Targets
- Page load: < 2s
- AI response: < 1.2s
- Database queries: < 100ms

## Monitoring & Observability

### Key Metrics
- Daily active couples
- Question response rates
- Crisis detection accuracy
- Relationship health score improvements
- Feature adoption rates

### Error Handling
- Graceful degradation for AI services
- Fallback questions when AI fails
- User-friendly error messages
- Comprehensive logging for debugging

## Crisis Intervention Protocol

### Detection System
1. **Keyword Monitoring**: Curated crisis keyword list
2. **AI Sentiment Analysis**: GPT-4 analysis of emotional state
3. **Behavioral Patterns**: Unusual usage patterns
4. **User Reporting**: Partner or self-reporting mechanisms

### Response Protocol
1. **Immediate Response**: Full-screen modal with resources
2. **Local Resources**: Geo-located crisis hotlines
3. **Professional Help**: Therapist finder integration
4. **Follow-up**: Check-in system without storing sensitive data
5. **Team Notification**: Alert development team through secure channels

### Privacy Protection
- **No Content Storage**: Never store actual crisis content
- **Metadata Only**: Log only timestamp, couple_id hash, and severity
- **Encryption**: All communications encrypted in transit and at rest
- **Access Controls**: Minimal team access to production data

## Remember

This application affects real relationships and handles sensitive emotional data. Every feature must prioritize:
1. **User Safety**: Crisis detection and intervention
2. **Privacy**: Minimal data collection and strong encryption
3. **Accessibility**: Inclusive design for all users
4. **Performance**: Consumer-app quality expectations
5. **Emotional Safety**: Warm, supportive user experience

When in doubt, always err on the side of user safety and privacy.