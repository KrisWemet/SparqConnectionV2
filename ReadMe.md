# Sparq Connection

> *We build rituals, not features. We create moments, not just products.*

Sparq Connection is an AI-powered Relationship Intelligence Platform that creates personalized daily connection moments for couples. Built on science-backed relationship research and powered by adaptive AI, we're establishing a new category of **Proactive Relationship Health**.

## <� Mission

Turn everyday moments into opportunities for partners to communicate, grow, and reconnect through personalized AI-driven experiences that evolve with each couple's unique dynamics.

## =� Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Supabase Account** (for database and auth)
- **OpenAI API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sparq-connection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=your-openai-api-key
   ENCRYPTION_KEY=your-32-character-encryption-key
   ```

4. **Database Setup**
   ```bash
   # Run migrations in your Supabase SQL editor
   # Execute files in order:
   # 1. supabase/migrations/001_initial_schema.sql
   # 2. supabase/migrations/002_row_level_security.sql
   # 3. supabase/migrations/003_functions.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## <� Architecture

### Technology Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS v4, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **AI**: OpenAI GPT-4 Turbo
- **Deployment**: Vercel + Supabase Cloud
- **Monitoring**: Sentry, PostHog, Logflare

### Core Features

- > **AI-Powered Daily Questions** - Personalized relationship prompts
- =� **Real-time Responses** - Synchronized couple experiences
- =� **Private Reflections** - End-to-end encrypted personal journals
- =� **Health Dashboard** - Relationship metrics and progress tracking
- <� **Connection Quests** - Guided relationship improvement exercises
- =� **Crisis Intervention** - AI-powered safety and resource system
- =� **PWA Support** - Offline-first mobile experience

### Database Schema

```mermaid
erDiagram
    Users ||--|| Couples : belongs_to
    Couples ||--o{ DailyQuestions : has_many
    DailyQuestions ||--o{ Responses : has_many
    Users ||--o{ Reflections : has_many
    Couples ||--o{ Quests : has_many
    Users ||--o{ Invitations : creates
    Couples ||--o{ CrisisEvents : may_have
```

## =� Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run typecheck    # Run TypeScript type checking
```

### Code Quality

- **TypeScript Strict Mode** - Zero `any` types allowed
- **ESLint + Prettier** - Automated code formatting and linting
- **Husky + lint-staged** - Pre-commit hooks for quality assurance
- **Path Aliases** - Clean imports with `@/` prefix

### Project Structure

```
src/
   app/                 # Next.js App Router pages
   components/
      ui/             # Reusable UI components
      features/       # Feature-specific components
      layouts/        # Page layouts
   lib/
      supabase/       # Database client and utilities
      ai/             # OpenAI integration
      security/       # Encryption and validation
      utils/          # Shared utilities
   hooks/              # Custom React hooks
   types/              # TypeScript type definitions
   styles/             # Global styles
```

## = Security & Privacy

### Data Protection

- **End-to-End Encryption** - Private reflections encrypted before storage
- **Row Level Security** - Database-level access control
- **Data Minimization** - Only essential information stored
- **GDPR Compliance** - Data export and deletion capabilities

### AI Safety

- **Content Moderation** - Multi-layer content filtering
- **Crisis Detection** - Automated risk assessment with human oversight
- **Prompt Safety** - Structured prompts with safety guards
- **Privacy Protection** - No personal content stored in AI logs

## =� Monitoring & Analytics

### Performance Targets

- **Page Load**: <2s on 3G connection
- **AI Response**: <1.2s for question generation
- **Database Queries**: <100ms for dashboard updates
- **Uptime**: 99.9% availability

### Key Metrics

- **Engagement**: Daily question response rate >80%
- **Retention**: 90-day couple retention >70%
- **Health Impact**: +15 points relationship score at 90 days
- **Safety**: Crisis detection accuracy >90%

## =� Deployment

### Vercel Deployment

1. **Connect Repository** to Vercel
2. **Configure Environment Variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push to main

### Supabase Setup

1. **Create Project** in Supabase dashboard
2. **Run Migrations** in SQL editor
3. **Configure RLS** policies
4. **Set up Auth** providers

### Environment Variables

```env
# Required for all environments
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
ENCRYPTION_KEY=

# Optional
NEXT_PUBLIC_APP_URL=
SENTRY_DSN=
POSTHOG_KEY=
```

## =� Testing

### Testing Strategy

- **Unit Tests** - Jest for utility functions and business logic
- **Integration Tests** - Database operations and API endpoints
- **E2E Tests** - Playwright for complete user journeys
- **Performance Tests** - Lighthouse CI for performance regression

### Running Tests

```bash
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:coverage  # Run tests with coverage report
```

## > Contributing

### Development Workflow

1. **Create Feature Branch** from `main`
2. **Implement Changes** following coding standards
3. **Write Tests** for new functionality
4. **Update Documentation** as needed
5. **Create Pull Request** with detailed description

### Coding Standards

- Follow existing code patterns and conventions
- Write meaningful commit messages
- Include tests for new features
- Update documentation for API changes
- Ensure TypeScript strict compliance

## =� Documentation

### Additional Resources

- [Technical Planning](./Planning.md) - Architecture decisions and technical roadmap
- [Task Management](./tasks.md) - Sprint planning and task tracking
- [Database Schema](./supabase/migrations/) - Complete database structure
- [PRD](./PRD.md) - Product requirements and specifications

### API Documentation

Core database functions and their usage:

```typescript
// Get couple data for a user
const couple = await get_user_couple(userId);

// Accept invitation and create couple
const coupleId = await accept_invitation(inviteCode, accepterId);

// Update relationship streak
await update_couple_streak(coupleId);

// Calculate health score
const score = await calculate_health_score(coupleId);
```

## = Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase connection
npm run typecheck
```

**AI Integration Issues**
```bash
# Check OpenAI API key
echo $OPENAI_API_KEY

# Test API connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

**Build Issues**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## =� License

This project is proprietary and confidential. All rights reserved.

## =� Support

For technical issues or questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting guide above

---

**Built with d for stronger relationships**

*Sparq Connection Team - Turning moments into memories, one question at a time.*