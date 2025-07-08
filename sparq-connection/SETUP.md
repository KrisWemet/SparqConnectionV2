# Sparq Connection Setup Guide

Complete environment setup and configuration guide for developers.

## 🚀 Quick Start (15 minutes)

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended
- **Supabase Account** - [Sign up](https://supabase.com/)
- **OpenAI API Key** - [Get API key](https://openai.com/api/) (optional for basic development)

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd sparq-connection

# Install dependencies
npm install

# Verify installation
npm run typecheck
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your credentials
# Use your preferred editor (VS Code, vim, etc.)
code .env.local
```

### 3. Database Setup
```bash
# Create new Supabase project at https://supabase.com/dashboard
# Get your project URL and anon key from Settings > API

# Run database migration
# Go to Supabase Dashboard > SQL Editor
# Copy/paste contents of scripts/clean-slate-migration.sql
# Click "Run" to execute

# Verify database setup
npm run verify-db
```

### 4. Start Development
```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# You should see the Sparq Connection login page
```

### 5. Verify Everything Works
```bash
# Check TypeScript
npm run typecheck

# Check linting
npm run lint

# Test database features
npm run test-features
```

## 🔧 Detailed Environment Setup

### Environment Variables Reference

Create `.env.local` with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (optional for basic development)
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Sparq Connection"

# Security Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Crisis Detection Configuration (optional)
CRISIS_WEBHOOK_URL=your_crisis_webhook_url
CRISIS_NOTIFICATION_EMAIL=your_email@example.com
```

### Getting Supabase Credentials

1. **Create Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose organization and name your project
   - Wait for project creation (2-3 minutes)

2. **Get API Keys**
   - Go to Settings > API
   - Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Set Up Database**
   - Go to SQL Editor
   - Copy/paste `scripts/clean-slate-migration.sql`
   - Click "Run" to execute
   - Verify all 14 tables are created

### Getting OpenAI API Key

1. **Create Account**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in
   - Add payment method (required for API access)

2. **Generate API Key**
   - Go to API Keys section
   - Click "Create new secret key"
   - Copy key → `OPENAI_API_KEY`
   - Keep this key secure!

### Security Configuration

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Or use online generator
# Copy result → NEXTAUTH_SECRET
```

## 🗄️ Database Configuration

### Migration Process

The database uses a single migration file for clean deployment:

```bash
# File: scripts/clean-slate-migration.sql
# This creates all 14 tables with proper relationships

# Tables created:
# - users (user profiles)
# - couples (relationship entities)
# - user_psychology_profiles (individual psychology data)
# - couple_psychology_analysis (compatibility analysis)
# - psychology_assessments (assessment history)
# - daily_questions (AI-generated questions)
# - responses (user answers)
# - reflections (private encrypted notes)
# - quests (guided exercises)
# - crisis_events (crisis detection logs)
# - invitations (partner invitation system)
# - psychology_interventions (therapeutic exercises)
# - user_intervention_progress (progress tracking)
# - daily_psychological_checkins (daily mood/progress)
```

### Database Verification

```bash
# Check database state
npm run verify-db

# Expected output:
# ✅ Database connection successful
# ✅ All 14 tables exist
# ✅ All psychology enums exist
# ✅ Row Level Security enabled
# ✅ Database ready for development
```

### Common Database Issues

**Issue**: "relation does not exist"
```bash
# Solution: Run the migration
# Go to Supabase Dashboard > SQL Editor
# Execute scripts/clean-slate-migration.sql
```

**Issue**: "permission denied"
```bash
# Solution: Check RLS policies
# Ensure user is authenticated
# Verify couple_id relationships
```

**Issue**: "column does not exist"
```bash
# Solution: Database schema mismatch
# Re-run migration to ensure latest schema
```

## 🔐 Authentication Setup

### Supabase Auth Configuration

1. **Enable Auth Providers**
   - Go to Authentication > Providers
   - Enable "Email" provider
   - Configure redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback`

2. **Email Templates**
   - Go to Authentication > Email Templates
   - Customize confirmation and reset emails
   - Use your app branding

3. **Security Settings**
   - Set password requirements
   - Configure session timeout
   - Enable email confirmation

### Row Level Security

RLS is automatically configured by the migration:

```sql
-- Example RLS policy
CREATE POLICY "Users can only access their own data" ON users
  FOR ALL USING (auth.uid() = id);

-- Couples can access shared data
CREATE POLICY "Couple data access" ON daily_questions
  FOR ALL USING (
    couple_id IN (
      SELECT id FROM couples 
      WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
    )
  );
```

## 🧠 Psychology Framework Setup

### Assessment Files

All psychology assessments are in `src/lib/psychology/`:

```
src/lib/psychology/
├── attachmentAssessment.ts    # Attachment theory (ECR-R)
├── loveLanguagesAssessment.ts # Love languages
├── gottmanAssessment.ts       # Gottman method
├── cbtAssessment.ts           # Cognitive behavioral therapy
├── dbtAssessment.ts           # Dialectical behavior therapy
├── eftAssessment.ts           # Emotionally focused therapy
├── actAssessment.ts           # Acceptance commitment therapy
├── mindfulnessAssessment.ts   # Mindfulness practices
├── positivePsychologyAssessment.ts # Positive psychology
├── somaticAssessment.ts       # Somatic therapy
└── index.ts                   # Central exports
```

### Assessment Validation

```bash
# Test psychology features
npm run test-features

# Expected output:
# ✅ Attachment Assessment: 30 questions loaded
# ✅ Love Languages Assessment: 30 questions loaded
# ✅ Gottman Assessment: 25 questions loaded
# ✅ All 10+ modalities functioning
# ✅ Scoring algorithms validated
```

## 🤖 AI Integration Setup

### OpenAI Configuration

```typescript
// File: src/lib/ai/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Psychology-aware prompt templates
const PSYCHOLOGY_PROMPTS = {
  attachment: "Generate a question for a couple with attachment styles...",
  crisis: "Analyze this content for crisis indicators...",
  // ... more prompts
};
```

### AI Safety Configuration

```typescript
// Crisis detection settings
const CRISIS_CONFIG = {
  keywords: ['suicide', 'harm', 'abuse', ...], // Curated crisis terms
  sentiment_threshold: 0.3, // Negative sentiment threshold
  intervention_required: true, // Always intervene on crisis
  log_content: false, // Never log actual crisis content
};
```

### AI Feature Testing

```bash
# Test AI features (requires OpenAI key)
npm run test:ai

# Without OpenAI key, the app uses fallback questions
# Crisis detection still works with keyword matching
```

## 📱 Development Tools

### Essential VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "supabase.supabase-vscode",
    "ms-vscode.vscode-json"
  ]
}
```

### Development Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Type checking
npm run typecheck

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Database utilities
npm run verify-db
npm run test-features

# Testing
npm run test:e2e
npm run test:e2e:critical
```

### Debugging Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

## 🔒 Security Setup

### Environment Security

```bash
# Never commit .env.local
echo ".env.local" >> .gitignore

# Use strong secrets
# Generate random strings for sensitive keys
openssl rand -base64 32
```

### Crisis Detection Setup

```typescript
// Crisis detection configuration
const CRISIS_CONFIG = {
  // Enable crisis detection
  enabled: true,
  
  // Immediate intervention threshold
  high_risk_threshold: 0.8,
  
  // Professional resources
  crisis_hotline: "988", // National Suicide Prevention Lifeline
  
  // Notification settings
  notify_team: true,
  notify_email: process.env.CRISIS_NOTIFICATION_EMAIL,
  
  // Privacy protection
  log_content: false, // Never log crisis content
  log_metadata: true, // Log timestamp and severity only
};
```

## 🚨 Troubleshooting

### Common Setup Issues

**Issue**: `npm install` fails
```bash
# Solution: Check Node.js version
node --version  # Should be 18+

# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Database connection fails
```bash
# Solution: Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase project is active
# Check API keys in Supabase dashboard
```

**Issue**: TypeScript errors
```bash
# Solution: Update types
npm run typecheck

# Check for missing dependencies
npm install --save-dev @types/node
```

**Issue**: "Module not found"
```bash
# Solution: Check imports
# Ensure all psychology modules are properly exported
# Check src/lib/psychology/index.ts
```

### Development Tips

1. **Use Database Verification**
   ```bash
   npm run verify-db  # Check database state
   ```

2. **Monitor Psychology Features**
   ```bash
   npm run test-features  # Verify psychology assessments
   ```

3. **Check Build Process**
   ```bash
   npm run build  # Ensure production build works
   ```

4. **Validate Environment**
   ```bash
   npm run typecheck  # Check TypeScript
   npm run lint       # Check code style
   ```

## 📊 Performance Configuration

### Next.js Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true, // Enable Turbopack for faster builds
  },
  images: {
    domains: ['supabase.co'], // Allow Supabase images
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};
```

### Database Performance

```sql
-- Indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_couples_partners ON couples(partner1_id, partner2_id);
CREATE INDEX idx_questions_couple_date ON daily_questions(couple_id, date);
CREATE INDEX idx_responses_question_user ON responses(question_id, user_id);
```

## 🎯 Ready to Develop!

Your development environment is now configured with:

- ✅ **Database**: 14 tables with psychology framework
- ✅ **Authentication**: Supabase Auth with RLS
- ✅ **AI Integration**: OpenAI for psychology-aware features
- ✅ **Crisis Detection**: Multi-layer safety system
- ✅ **Development Tools**: TypeScript, ESLint, Prettier
- ✅ **Psychology Framework**: 10+ therapeutic modalities

### Next Steps

1. **Explore the Codebase**
   - Read `CONTRIBUTING.md` for development workflow
   - Check `API.md` for database schema
   - Review `PSYCHOLOGY.md` for framework understanding

2. **Start Building**
   - Run `npm run dev` to start development
   - Open `http://localhost:3000` in your browser
   - Start with authentication flow

3. **Test Everything**
   - Complete user registration
   - Try psychology assessments
   - Test couple invitation system
   - Verify crisis detection (safely)

Remember: You're building a production-grade relationship platform that affects real couples. Every feature should prioritize user safety, privacy, and meaningful therapeutic value. 💕

Happy coding! 🚀