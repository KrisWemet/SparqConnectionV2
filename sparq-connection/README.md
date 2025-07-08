# Sparq Connection

An AI-powered Relationship Intelligence Platform that creates personalized daily connection moments for couples. This production-grade application focuses on emotional safety, privacy, and meaningful relationship improvements.

## Core Philosophy

"We build rituals, not features. We create moments, not just products."

## Features

### 🧠 Psychology Framework (10+ Modalities)
- **Attachment Theory**: ECR-R based assessment with secure, anxious, avoidant, and disorganized styles
- **Love Languages**: Gary Chapman's 5 love languages with personalized recommendations
- **Gottman Method**: Four Horsemen detection and relationship health principles
- **CBT**: Cognitive distortion identification and thought challenging
- **DBT**: Emotional regulation and interpersonal effectiveness skills
- **EFT**: Emotion-focused therapy for deeper emotional connection
- **ACT**: Values-based therapy and psychological flexibility
- **Mindfulness**: Meditation practices and present-moment awareness
- **Positive Psychology**: Character strengths and gratitude practices
- **Somatic Therapy**: Body awareness and trauma-informed approaches

### 🤖 AI-Powered Features
- Personalized daily questions based on psychology profiles
- Crisis detection with multi-layer safety systems
- Content moderation using OpenAI's safety APIs
- Relationship health scoring and recommendations

### 🔒 Privacy & Security
- End-to-end encryption for private reflections
- Row-Level Security (RLS) for data isolation between couples
- Minimal data collection with privacy-by-design
- Crisis intervention without storing sensitive content

### 📱 User Experience
- PWA-ready for mobile installation
- Real-time synchronization between partners
- Accessibility compliant (WCAG 2.1 AA)
- Warm, supportive emotional design

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Realtime, Auth, Storage)
- **AI**: OpenAI GPT-4 with custom psychology-aware prompts
- **Infrastructure**: Vercel Edge Functions, Supabase Edge
- **Security**: Row-Level Security, crypto-js encryption

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd sparq-connection
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENCRYPTION_KEY=your-32-character-encryption-key
```

### Database Setup

1. Create a new Supabase project
2. Run the database migration:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and execute `scripts/clean-slate-migration.sql`
3. Verify deployment:
```bash
npm run verify-db
```

### Development

```bash
# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication flows
│   ├── dashboard/         # Main relationship dashboard
│   └── invite/            # Partner invitation system
├── components/
│   ├── auth/              # Authentication components
│   ├── features/          # Feature-specific components
│   │   ├── psychology/    # Psychology assessments
│   │   └── dashboard/     # Dashboard widgets
│   ├── layouts/           # Page layouts
│   └── ui/                # Reusable UI components
├── lib/
│   ├── ai/                # OpenAI integration and prompts
│   ├── auth/              # Authentication context
│   ├── psychology/        # Psychology assessment logic
│   ├── security/          # Encryption utilities
│   ├── supabase/          # Database clients
│   └── utils/             # Shared utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
└── middleware.ts          # Route protection
```

## Database Schema

### Core Tables
- `users` - User profiles with attachment styles
- `couples` - Relationship entities with health scores
- `daily_questions` - AI-generated personalized questions
- `responses` - User answers to daily questions
- `reflections` - Private encrypted journal entries
- `quests` - Guided relationship exercises

### Psychology Framework Tables
- `user_psychology_profiles` - Comprehensive profiles across 10+ modalities
- `couple_psychology_analysis` - Compatibility analysis and recommendations
- `psychology_interventions` - Evidence-based intervention library
- `psychology_assessments` - Assessment responses and scoring
- `daily_psychological_checkins` - Daily emotional wellness tracking

## Development Guidelines

### Code Quality
- TypeScript strict mode (no `any` types)
- Component-based architecture with proper prop types
- Performance-first approach with bundle analysis
- Comprehensive error handling and fallbacks

### Safety-First Development
- All user content passes through crisis detection
- Multi-layer content moderation (AI + keyword filtering)
- Privacy-by-design with minimal data collection
- Accessibility compliance (WCAG 2.1 AA)

### Psychology Integration
- Research-based assessments (ECR-R, Gottman's principles)
- Evidence-based interventions from clinical psychology
- Couple-centric data model and compatibility analysis
- Crisis intervention following mental health best practices

## Testing

```bash
# Run database verification
npm run verify-db

# Test psychology features
npm run test-features

# Run comprehensive tests (when implemented)
npm test
```

## Deployment

### Environment Variables (Production)
Ensure all production environment variables are configured:
- Supabase production URLs and keys
- OpenAI API key with appropriate limits
- Secure encryption keys (32+ characters)
- Performance monitoring tokens

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Crisis Intervention Protocol

### Detection System
1. **Keyword Monitoring** - Curated crisis keyword detection
2. **AI Sentiment Analysis** - GPT-4 emotional state analysis
3. **Behavioral Patterns** - Unusual usage pattern detection
4. **User Reporting** - Partner and self-reporting mechanisms

### Response Protocol
1. **Immediate Response** - Full-screen modal with crisis resources
2. **Local Resources** - Geo-located crisis hotlines and support
3. **Professional Help** - Therapist finder integration
4. **Privacy Protection** - No storage of crisis content (metadata only)

## Contributing

1. Follow the established code patterns and psychology framework
2. Ensure all features prioritize user safety and privacy
3. Test crisis detection and safety systems thoroughly
4. Maintain TypeScript strict mode compliance
5. Update documentation for any new psychology modalities

## License

[License details]

## Support

For technical issues or questions about the psychology framework, please refer to the project documentation or contact the development team.

---

**Remember**: This application affects real relationships and handles sensitive emotional data. Every feature must prioritize user safety, privacy, accessibility, and emotional well-being.