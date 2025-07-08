# Contributing to Sparq Connection

Welcome to Sparq Connection! This guide will help you get up to speed quickly and contribute effectively to our AI-powered Relationship Intelligence Platform.

## 🚀 Quick Start Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Git configured with your credentials
- [ ] Basic understanding of React/Next.js and TypeScript
- [ ] Supabase account created
- [ ] OpenAI API access (optional for basic development)

### Setup (15 minutes)
1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd sparq-connection
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Database Setup**
   - Create new Supabase project
   - Go to SQL Editor in Supabase Dashboard
   - Copy/paste `scripts/clean-slate-migration.sql` and run
   - Verify: `npm run verify-db`

4. **Start Development**
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```

5. **Verify Everything Works**
   ```bash
   npm run typecheck  # Should pass
   npm run lint       # Should pass
   npm run test-features  # Should show ✅ for all features
   ```

## 🏗️ Project Architecture Overview

### Core Philosophy
**"We build psychology-informed rituals, not features. We create therapeutic moments, not just products."**

### Tech Stack
- **Frontend**: Next.js 15 + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **AI**: OpenAI GPT-4 with psychology-aware prompts
- **Psychology**: 10+ therapeutic modalities with research-based assessments

### Project Structure
```
src/
├── app/                    # Next.js App Router (pages)
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── features/          # Feature-specific components
│   │   ├── psychology/    # Psychology assessments
│   │   └── dashboard/     # Main dashboard
│   ├── layouts/           # Page layouts
│   └── ui/                # Reusable UI components
├── lib/                   # Core business logic
│   ├── psychology/        # 10+ psychology modalities
│   ├── ai/                # OpenAI integration
│   ├── supabase/          # Database clients
│   ├── auth/              # Authentication
│   └── security/          # Encryption utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
└── middleware.ts          # Route protection
```

## 🧠 Psychology Framework Understanding

### What Makes This Special
Sparq Connection implements 10+ evidence-based therapeutic modalities:

1. **Attachment Theory** - ECR-R based assessment measuring security, anxiety, avoidance
2. **Love Languages** - Gary Chapman's 5 languages with compatibility analysis
3. **Gottman Method** - Four Horsemen detection and relationship principles
4. **CBT** - Cognitive distortion identification and thought challenging
5. **DBT** - Emotional regulation and interpersonal effectiveness
6. **EFT** - Emotion-focused therapy for attachment bonds
7. **ACT** - Values-based therapy and psychological flexibility
8. **Mindfulness** - Present-moment awareness and meditation practices
9. **Positive Psychology** - Character strengths and gratitude practices
10. **Somatic Therapy** - Body awareness and trauma-informed approaches

### For Non-Psychology Developers
- Each modality has its own assessment file in `src/lib/psychology/`
- Assessments are research-based with citations in comments
- Scoring algorithms are validated against clinical standards
- Couple compatibility engine analyzes all modalities together
- See `PSYCHOLOGY.md` for detailed explanations

## 💾 Database Architecture

### Key Concepts
- **Couple-Centric**: All data organized around couples, not individuals
- **Row-Level Security**: Complete data isolation between couples
- **Psychology-Informed**: Schema supports comprehensive psychological frameworks
- **Privacy-First**: Sensitive data encrypted, crisis data as metadata only

### Core Tables
```sql
users                        # Individual user profiles
couples                      # Relationship entities
user_psychology_profiles     # Individual psychology across 10+ modalities
couple_psychology_analysis   # Compatibility analysis and recommendations
psychology_assessments       # Assessment responses and scoring
daily_questions             # AI-generated personalized questions
responses                   # User answers to questions
```

### Working with Psychology Data
```typescript
// Example: Getting user psychology profile
const { data: profile } = await supabase
  .from('user_psychology_profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

// Profile includes all 10+ modalities:
// - attachment_style, attachment_security_score
// - primary_love_language, love_language_scores
// - gottman_assessment_score, four_horsemen_tendencies
// - cognitive_distortions, cbt_progress_score
// - emotional_regulation_score, mindfulness_score
// etc.
```

## 🔄 Development Workflow

### Daily Development
1. **Start Development**
   ```bash
   npm run dev          # Start with Turbopack
   ```

2. **Code Quality Checks**
   ```bash
   npm run typecheck    # TypeScript validation
   npm run lint         # ESLint checking
   npm run format       # Prettier formatting
   ```

3. **Database Verification**
   ```bash
   npm run verify-db    # Check database state
   npm run test-features # Test psychology features
   ```

### Git Workflow
1. **Branch Naming**: `feature/psychology-dashboard`, `fix/attachment-scoring`, `docs/api-documentation`
2. **Commit Messages**: Clear, descriptive commits
   ```
   feat: Add DBT emotional regulation assessment
   fix: Resolve attachment compatibility scoring bug
   docs: Update psychology framework documentation
   ```
3. **Pull Requests**: Include testing checklist and psychology validation

### Code Standards
- **TypeScript Strict**: No `any` types allowed
- **Component Patterns**: Functional components with hooks
- **Psychology Safety**: All assessments must be research-based
- **Error Handling**: Graceful fallbacks for AI and database operations
- **Accessibility**: WCAG 2.1 AA compliance required

## 🧪 Testing Approach

### Manual Testing Checklist
- [ ] Authentication flow works
- [ ] Couple invitation system functional
- [ ] Psychology assessments load and score correctly
- [ ] Database queries perform under 100ms
- [ ] Crisis detection doesn't trigger false positives
- [ ] TypeScript compiles without errors

### Psychology Assessment Testing
- [ ] Each assessment loads all questions
- [ ] Scoring algorithms produce expected ranges
- [ ] Compatibility analysis generates recommendations
- [ ] Progress tracking updates correctly

### Database Testing
```bash
npm run verify-db     # Confirms all 14 tables exist
npm run test-features # Tests psychology framework functionality
```

## 🔒 Security & Privacy Guidelines

### Data Handling
- **Minimal Collection**: Only collect necessary data
- **Encryption**: Use encryption utilities for sensitive content
- **RLS Policies**: Ensure couples can only access their own data
- **Crisis Safety**: Never store actual crisis content, only metadata

### Psychology Ethics
- **Research-Based**: All assessments must have clinical validation
- **Consent**: Clear consent for psychology data collection
- **Professional Standards**: Follow psychological research ethics
- **Clinical Appropriateness**: AI outputs must be therapeutically appropriate

## 🎯 Common Development Tasks

### Adding a New Psychology Assessment
1. **Research**: Validate the assessment has clinical backing
2. **Questions**: Create questions array with proper scoring
3. **Types**: Add TypeScript types to `src/types/`
4. **Component**: Build React assessment component
5. **Scoring**: Implement research-based scoring algorithm
6. **Integration**: Add to comprehensive assessment flow
7. **Database**: Update psychology profile schema if needed

### Modifying Database Schema
1. **Migration**: Create new migration file in `supabase/migrations/`
2. **Types**: Update TypeScript types in `src/types/database.ts`
3. **RLS**: Ensure proper row-level security policies
4. **Testing**: Verify with `npm run verify-db`

### Working with AI Features
1. **Prompts**: Use structured prompts with safety guards
2. **Context**: Include couple psychology profiles in context
3. **Validation**: Implement content moderation
4. **Fallbacks**: Always have non-AI backup options

## 🚨 Crisis Intervention Protocol

### For Developers
- **Never Remove**: Crisis detection is safety-critical
- **Testing**: Use safe test content, never real crisis keywords
- **Validation**: Crisis detection changes require team review
- **Documentation**: Any changes must be documented

### How It Works
1. **Multi-Layer Detection**: Keywords + AI sentiment + behavioral patterns
2. **Immediate Response**: Full-screen modal with resources
3. **Privacy Protection**: Only metadata logged, never content
4. **Professional Routing**: Connect to local mental health services

## 📚 Learning Resources

### Psychology Background
- **Attachment Theory**: "Attached" by Amir Levine
- **Gottman Method**: "Seven Principles for Making Marriage Work"
- **Love Languages**: "The 5 Love Languages" by Gary Chapman
- **CBT/DBT**: Basic understanding of cognitive-behavioral approaches

### Technical Resources
- **Next.js 15**: [Official Documentation](https://nextjs.org/docs)
- **Supabase**: [Database and Auth Guides](https://supabase.com/docs)
- **TypeScript**: [Handbook](https://www.typescriptlang.org/docs/)
- **Framer Motion**: [Animation Library](https://www.framer.com/motion/)

## 🤝 Getting Help

### Quick Questions
- Check existing documentation first (README, Planning, PRD)
- Look for similar patterns in existing code
- Use TypeScript types to understand data structures

### Stuck on Psychology Features?
- Review assessment files in `src/lib/psychology/`
- Check database schema for expected data structure
- Run `npm run test-features` to verify system state

### Need Review?
- Psychology changes: Request psychology framework review
- Database changes: Verify with `npm run verify-db`
- AI features: Ensure safety validation included

## 🎉 Welcome to the Team!

Remember: You're not just building an app, you're creating a tool that helps real couples improve their relationships using evidence-based psychology. Every feature should prioritize user safety, privacy, and meaningful therapeutic value.

**Core Values**:
1. **User Safety**: Crisis intervention and emotional safety first
2. **Privacy**: Minimal data collection, strong encryption
3. **Research-Based**: Evidence-based psychology, not opinions
4. **Accessibility**: Inclusive design for all users
5. **Quality**: Production-grade code that affects real relationships

Ready to build something meaningful? Start with `npm run dev` and explore the psychology assessments - they're the heart of what makes Sparq Connection special! 🚀