# Sparq Connection Architecture Guide

Comprehensive guide to the codebase architecture, patterns, and design decisions.

## 🏗️ Architecture Overview

Sparq Connection is built as a **psychology-informed, couple-centric relationship platform** using a modern, scalable architecture that prioritizes user safety, privacy, and therapeutic value.

### Core Architecture Principles

1. **Psychology-First Design**: Every feature grounded in clinical research
2. **Couple-Centric Data Model**: All data organized around couples, not individuals
3. **Safety-Critical Systems**: Crisis detection and intervention built into core
4. **Privacy by Design**: Minimal data collection, encryption, Row-Level Security
5. **Scalable & Maintainable**: Clean patterns, TypeScript strict mode, comprehensive testing

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Next.js 15)                │
├─────────────────────────────────────────────────────────────┤
│  React Components  │  Hooks  │  Context  │  Middleware     │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Psychology   │  AI Services  │  Auth  │  Security  │ Utils │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                        │
├─────────────────────────────────────────────────────────────┤
│           Supabase Client  │  Database  │  Storage          │
├─────────────────────────────────────────────────────────────┤
│                    External Services                        │
├─────────────────────────────────────────────────────────────┤
│    OpenAI GPT-4    │  Crisis APIs  │  Email  │  Analytics   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure Deep Dive

### Root Directory
```
sparq-connection/
├── src/                    # Main application code
├── scripts/                # Database and utility scripts
├── tests/                  # End-to-end and integration tests
├── public/                 # Static assets
├── docs/                   # Additional documentation
├── .env.local.example      # Environment template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project overview
```

### Source Code Organization
```
src/
├── app/                    # Next.js App Router (Pages & API Routes)
│   ├── (auth)/            # Authentication routes group
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API route handlers
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── features/         # Feature-specific components
│   │   ├── psychology/   # Psychology assessment components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── crisis/       # Crisis intervention components
│   │   └── couples/      # Couple management components
│   ├── layouts/          # Page layout components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Core business logic
│   ├── psychology/       # 10+ psychology modalities
│   ├── ai/              # OpenAI integration
│   ├── auth/            # Authentication logic
│   ├── supabase/        # Database clients
│   ├── security/        # Encryption & safety
│   └── utils/           # Shared utilities
├── types/               # TypeScript type definitions
├── styles/              # Additional styling
└── middleware.ts        # Next.js middleware for route protection
```

## 🔧 Core Patterns & Design Decisions

### 1. Couple-Centric Data Model

**Decision**: Organize all data around couples rather than individual users.

**Implementation**:
```typescript
// Every data access goes through couple context
const { data: questions } = await supabase
  .from('daily_questions')
  .select('*')
  .eq('couple_id', coupleId); // Always filter by couple

// RLS policies enforce couple isolation
CREATE POLICY "couple_isolation" ON daily_questions
FOR ALL USING (
  couple_id IN (
    SELECT id FROM couples 
    WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
  )
);
```

**Benefits**:
- Complete data isolation between couples
- Simplified permission model
- Natural fit for relationship data
- Enables couple-level analytics

### 2. Psychology Framework Architecture

**Decision**: Implement 10+ therapeutic modalities as separate, composable modules.

**Structure**:
```
lib/psychology/
├── attachmentAssessment.ts    # ECR-R based attachment theory
├── loveLanguagesAssessment.ts # Gary Chapman's 5 love languages
├── gottmanAssessment.ts       # Gottman Method for couples
├── cbtAssessment.ts           # Cognitive Behavioral Therapy
├── dbtAssessment.ts           # Dialectical Behavior Therapy
├── eftAssessment.ts           # Emotionally Focused Therapy
├── actAssessment.ts           # Acceptance & Commitment Therapy
├── mindfulnessAssessment.ts   # Mindfulness-based interventions
├── positivePsychologyAssessment.ts # Strengths & positive psychology
├── somaticAssessment.ts       # Somatic & body-based therapy
└── index.ts                   # Central exports
```

**Implementation Pattern**:
```typescript
// Each assessment follows consistent interface
export interface PsychologyAssessment<T> {
  questions: Question[];
  scorer: AssessmentScorer<T>;
  interventions: Intervention[];
  compatibility: CompatibilityAnalyzer;
}

// Example: Attachment Assessment
export class AttachmentAssessmentScorer {
  static calculateScores(responses: Record<string, number>): AttachmentResults {
    // Research-based scoring algorithm
    // ECR-R validated scoring
    // Returns normalized 0-100 scores
  }
}
```

**Benefits**:
- Modular, maintainable psychology code
- Research-based validation for each modality
- Easy to add new therapeutic approaches
- Comprehensive couple compatibility analysis

### 3. Crisis Detection Architecture

**Decision**: Multi-layer crisis detection with immediate intervention and privacy protection.

**Implementation**:
```typescript
// Multi-layer detection system
class CrisisDetectionService {
  async detectCrisis(content: string, userId: string): Promise<CrisisResult> {
    // Layer 1: Keyword detection
    const keywordFlags = this.detectCrisisKeywords(content);
    
    // Layer 2: AI sentiment analysis
    const sentimentScore = await this.analyzeSentiment(content);
    
    // Layer 3: Behavioral pattern analysis
    const behavioralFlags = await this.analyzeBehavioralPatterns(userId);
    
    // Combine all signals
    const riskLevel = this.calculateRiskLevel({
      keywords: keywordFlags,
      sentiment: sentimentScore,
      behavioral: behavioralFlags
    });
    
    if (riskLevel >= CRISIS_THRESHOLD) {
      // Log metadata only, never content
      await this.logCrisisEvent({
        coupleId: await this.getUserCoupleId(userId),
        severity: riskLevel,
        eventHash: this.hashContent(content), // One-way hash
        intervention: true
      });
      
      return { isCrisis: true, severity: riskLevel };
    }
    
    return { isCrisis: false };
  }
}
```

**Privacy Protection**:
- Never store actual crisis content
- One-way hashing for event tracking
- Metadata-only logging
- Professional intervention protocols

### 4. AI Integration Pattern

**Decision**: Psychology-aware AI with safety guards and fallback mechanisms.

**Implementation**:
```typescript
// Psychology-informed AI service
class AIService {
  async generateDailyQuestion(
    coupleId: string,
    psychologyContext: CoupleContext
  ): Promise<Question> {
    try {
      // Build psychology-aware context
      const context = await this.buildPsychologyContext(coupleId);
      
      // Generate with psychology-informed prompts
      const question = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: this.buildPsychologyPrompt(context)
          },
          {
            role: 'user',
            content: 'Generate a relationship question based on this couple\'s psychology profile'
          }
        ]
      });
      
      // Safety validation
      const isAppropriate = await this.validateContent(question.content);
      if (!isAppropriate) {
        return this.getFallbackQuestion(context);
      }
      
      return this.formatQuestion(question.content, context);
      
    } catch (error) {
      // Always have fallback for AI failures
      return this.getFallbackQuestion(psychologyContext);
    }
  }
}
```

**Benefits**:
- Psychology-informed AI responses
- Safety validation on all AI content
- Graceful fallback for AI failures
- Research-based prompt engineering

### 5. Type-Safe Database Access

**Decision**: Complete TypeScript coverage with generated database types.

**Implementation**:
```typescript
// Generated database types from Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      // ... all 14 tables with complete type coverage
    };
    Enums: {
      attachment_style: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
      love_language: 'words_of_affirmation' | 'quality_time' | 'physical_touch' | 'acts_of_service' | 'receiving_gifts';
      // ... all psychology enums
    };
  };
};

// Type-safe database client
const supabase = createClient<Database>(url, key);

// All queries are fully typed
const { data, error } = await supabase
  .from('user_psychology_profiles')
  .select('attachment_style, primary_love_language')
  .eq('user_id', userId)
  .single(); // TypeScript knows the exact return type
```

**Benefits**:
- Compile-time error catching
- IDE autocomplete for all database operations
- Refactoring safety
- Documentation through types

## 🔐 Security Architecture

### Row Level Security (RLS)

**Implementation**: Database-level security that enforces couple isolation.

```sql
-- Users can only access their own data
CREATE POLICY "own_data_only" ON users
FOR ALL USING (auth.uid() = id);

-- Couple data access for both partners
CREATE POLICY "couple_data_access" ON daily_questions
FOR ALL USING (
  couple_id IN (
    SELECT id FROM couples 
    WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
  )
);

-- Psychology profiles: own data only
CREATE POLICY "own_psychology_profile" ON user_psychology_profiles
FOR ALL USING (user_id = auth.uid());

-- Couple analysis: both partners can view
CREATE POLICY "couple_analysis_view" ON couple_psychology_analysis
FOR SELECT USING (
  couple_id IN (
    SELECT id FROM couples 
    WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
  )
);
```

### Encryption for Sensitive Data

**Implementation**: Client-side encryption for private content.

```typescript
// Encryption utilities
import CryptoJS from 'crypto-js';

class EncryptionService {
  private getEncryptionKey(userId: string): string {
    // Derive key from user ID and app secret
    return CryptoJS.PBKDF2(userId, ENCRYPTION_SALT, {
      keySize: 256/32
    }).toString();
  }
  
  encryptContent(content: string, userId: string): string {
    const key = this.getEncryptionKey(userId);
    return CryptoJS.AES.encrypt(content, key).toString();
  }
  
  decryptContent(encryptedContent: string, userId: string): string {
    const key = this.getEncryptionKey(userId);
    const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

// Usage in reflections (private notes)
const encryptedReflection = encryptionService.encryptContent(
  reflectionText,
  userId
);
```

## 🎨 Component Architecture

### Component Hierarchy

```
App Layout (Root)
├── AuthProvider (Authentication Context)
├── CoupleProvider (Couple Context)
├── PsychologyProvider (Psychology Data Context)
└── Pages
    ├── AuthPages (Login, Signup, Reset)
    ├── OnboardingPages (Assessment Flow)
    ├── DashboardPages
    │   ├── DailyQuestion
    │   ├── PsychologyInsights
    │   ├── ProgressTracking
    │   └── CrisisIntervention
    └── ProfilePages (Settings, Psychology Profile)
```

### Component Patterns

**1. Provider Pattern for Context**
```typescript
// CoupleProvider manages couple-level state
export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load couple data on provider mount
  useEffect(() => {
    loadCoupleData();
  }, []);
  
  return (
    <CoupleContext.Provider value={{ couple, loading, refresh: loadCoupleData }}>
      {children}
    </CoupleContext.Provider>
  );
};
```

**2. Hook Pattern for Data Access**
```typescript
// Custom hooks encapsulate complex logic
export const usePsychologyProfile = (userId: string) => {
  const [profile, setProfile] = useState<PsychologyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const loadProfile = useCallback(async () => {
    const { data } = await supabase
      .from('user_psychology_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    setProfile(data);
    setLoading(false);
  }, [userId]);
  
  return { profile, loading, refresh: loadProfile };
};
```

**3. Assessment Component Pattern**
```typescript
// Consistent interface for all psychology assessments
interface AssessmentProps<T> {
  assessment: PsychologyAssessment<T>;
  onComplete: (results: T) => void;
  onProgress: (progress: number) => void;
}

export const AssessmentComponent = <T,>({ 
  assessment, 
  onComplete, 
  onProgress 
}: AssessmentProps<T>) => {
  // Consistent assessment UI across all modalities
  // Progress tracking, question presentation, results calculation
};
```

## 🚀 Performance Architecture

### Data Loading Strategies

**1. Progressive Loading**
```typescript
// Load essential data first, then enrich
const DashboardPage = () => {
  // Immediate: Basic couple data
  const { couple } = useCouple();
  
  // Progressive: Psychology insights
  const { insights } = usePsychologyInsights(couple?.id);
  
  // Background: Compatibility analysis
  const { compatibility } = useCompatibilityAnalysis(couple?.id);
  
  return (
    <Dashboard 
      couple={couple}
      insights={insights}
      compatibility={compatibility}
    />
  );
};
```

**2. Caching Strategy**
```typescript
// Cache psychology profiles (rarely change)
const psychologyProfileCache = new Map<string, PsychologyProfile>();

// Cache compatibility analysis (expensive to compute)
const compatibilityCache = new Map<string, CompatibilityAnalysis>();

// Invalidate cache on profile updates
const updatePsychologyProfile = async (userId: string, updates: Partial<PsychologyProfile>) => {
  await supabase.from('user_psychology_profiles').update(updates).eq('user_id', userId);
  psychologyProfileCache.delete(userId);
  compatibilityCache.clear(); // Invalidate all compatibility data
};
```

**3. Database Query Optimization**
```typescript
// Efficient couple data loading with joins
const loadCoupleWithPsychology = async (userId: string) => {
  const { data } = await supabase
    .from('couples')
    .select(`
      *,
      partner1:users!partner1_id(
        *,
        psychology_profile:user_psychology_profiles(*)
      ),
      partner2:users!partner2_id(
        *,
        psychology_profile:user_psychology_profiles(*)
      ),
      analysis:couple_psychology_analysis(*),
      recent_questions:daily_questions(
        *,
        responses(*, user:users(display_name))
      )
    `)
    .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
    .single();
    
  return data;
};
```

## 🔄 State Management Architecture

### Context-Based State Management

```typescript
// Global app state through context providers
App
├── AuthContext (user authentication)
├── CoupleContext (couple data and relationships)
├── PsychologyContext (psychology profiles and insights)
└── CrisisContext (crisis detection and intervention)
```

### Local State Patterns

```typescript
// Assessment state management
const useAssessmentState = <T>(assessment: PsychologyAssessment<T>) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [results, setResults] = useState<T | null>(null);
  
  const answerQuestion = (questionId: string, answer: number) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
    setCurrentQuestion(prev => prev + 1);
  };
  
  const calculateResults = () => {
    const results = assessment.scorer.calculateScores(responses);
    setResults(results);
  };
  
  return {
    currentQuestion,
    responses,
    results,
    answerQuestion,
    calculateResults,
    isComplete: currentQuestion >= assessment.questions.length
  };
};
```

## 🧪 Testing Architecture

### Testing Strategy

**1. Unit Tests**: Individual psychology modules
```typescript
// Example: Attachment assessment testing
describe('AttachmentAssessmentScorer', () => {
  it('should calculate secure attachment correctly', () => {
    const responses = {
      'anx_01': 2, // Low anxiety
      'avo_01': 2, // Low avoidance
      // ... more responses
    };
    
    const results = AttachmentAssessmentScorer.calculateScores(responses);
    
    expect(results.attachment_style).toBe('secure');
    expect(results.anxiety_score).toBeLessThan(50);
    expect(results.avoidance_score).toBeLessThan(50);
  });
});
```

**2. Integration Tests**: Database and API integration
```typescript
// Example: Couple psychology analysis
describe('Couple Psychology Integration', () => {
  it('should generate compatibility analysis for couple', async () => {
    const couple = await createTestCouple();
    const analysis = await generateCompatibilityAnalysis(couple.id);
    
    expect(analysis.attachment_compatibility_score).toBeGreaterThan(0);
    expect(analysis.overall_compatibility_score).toBeGreaterThan(0);
    expect(analysis.recommended_modalities).toBeInstanceOf(Array);
  });
});
```

**3. End-to-End Tests**: Critical user paths
```typescript
// Example: Assessment completion flow
describe('Assessment Flow E2E', () => {
  it('should complete attachment assessment and update profile', async () => {
    await page.goto('/assessments/attachment');
    
    // Answer all questions
    for (let i = 0; i < 30; i++) {
      await page.click(`[data-testid="answer-4"]`);
      await page.click(`[data-testid="next-button"]`);
    }
    
    // Verify results page
    await expect(page.locator('[data-testid="attachment-style"]')).toContainText('Secure');
    
    // Verify database update
    const profile = await getUserPsychologyProfile(testUserId);
    expect(profile.attachment_style).toBe('secure');
  });
});
```

## 📊 Analytics Architecture

### User Analytics (Privacy-Preserving)

```typescript
// Analytics that respect user privacy
interface AnalyticsEvent {
  event: string;
  couple_id_hash: string; // One-way hash, not reversible
  properties: {
    assessment_type?: string;
    completion_percentage?: number;
    session_duration?: number;
  };
  timestamp: string;
}

// Example: Assessment completion tracking
const trackAssessmentCompletion = (
  coupleId: string,
  assessmentType: string,
  completionTime: number
) => {
  analytics.track({
    event: 'assessment_completed',
    couple_id_hash: hashCoupleId(coupleId),
    properties: {
      assessment_type: assessmentType,
      completion_time_seconds: completionTime
    }
  });
};
```

## 🔧 Build & Deployment Architecture

### Build Pipeline

```bash
# Development build with Turbopack
npm run dev

# Production build optimization
npm run build
# - TypeScript compilation
# - Bundle optimization
# - Static asset optimization
# - Psychology assessment validation
# - Database schema validation

# Pre-deployment checks
npm run typecheck  # TypeScript validation
npm run lint       # Code quality
npm run test:e2e   # End-to-end testing
npm run verify-db  # Database health check
```

### Environment Configuration

```typescript
// Environment-specific configuration
const config = {
  development: {
    database: 'local_supabase',
    ai_service: 'openai_playground',
    crisis_detection: 'development_mode',
    analytics: 'disabled'
  },
  staging: {
    database: 'staging_supabase',
    ai_service: 'openai_production',
    crisis_detection: 'full_monitoring',
    analytics: 'anonymized'
  },
  production: {
    database: 'production_supabase',
    ai_service: 'openai_production',
    crisis_detection: 'full_monitoring',
    analytics: 'full_compliance'
  }
};
```

## 🎯 Design Decisions & Trade-offs

### 1. Next.js App Router vs Pages Router

**Decision**: Use App Router for better performance and developer experience.

**Trade-offs**:
- ✅ Better performance with React Server Components
- ✅ Improved routing and layouts
- ✅ Built-in loading and error states
- ❌ Newer API with less community examples
- ❌ Some third-party libraries may need updates

### 2. Supabase vs Custom Backend

**Decision**: Use Supabase for rapid development and built-in features.

**Trade-offs**:
- ✅ Built-in authentication and RLS
- ✅ Real-time subscriptions
- ✅ Automatic API generation
- ✅ Built-in storage and file handling
- ❌ Vendor lock-in
- ❌ Less control over database optimization
- ❌ Pricing scaling concerns

### 3. Client-Side vs Server-Side Psychology Calculations

**Decision**: Client-side for privacy, server-side for AI integration.

**Trade-offs**:
- ✅ Privacy: Calculations happen on user device
- ✅ Performance: No server round-trips for scoring
- ✅ Offline capability: Assessments work offline
- ❌ Code visibility: Scoring algorithms are visible
- ❌ Consistency: Harder to update scoring algorithms

### 4. Comprehensive vs Minimal Psychology Framework

**Decision**: Comprehensive 10+ modalities for clinical-grade analysis.

**Trade-offs**:
- ✅ Clinical accuracy and completeness
- ✅ Competitive differentiation
- ✅ Better couple compatibility analysis
- ✅ Professional credibility
- ❌ Higher development complexity
- ❌ Longer assessment time for users
- ❌ More challenging user experience design

## 🚀 Future Architecture Considerations

### Scalability Planning

1. **Database Scaling**
   - Read replicas for psychology profile queries
   - Partitioning for large couples table
   - Caching layer for expensive compatibility calculations

2. **AI Service Scaling**
   - Rate limiting and queuing for OpenAI requests
   - Fallback to cached responses during outages
   - Edge functions for faster AI response times

3. **Crisis Detection Scaling**
   - Real-time processing pipeline
   - Professional monitoring dashboard
   - Integration with mental health services

### Architectural Evolution

1. **Microservices Migration**
   - Psychology service (assessments and scoring)
   - AI service (question generation and analysis)
   - Crisis service (detection and intervention)
   - Notification service (real-time alerts)

2. **Mobile Apps**
   - React Native with shared psychology modules
   - Offline-first architecture for assessments
   - Push notifications for crisis intervention

3. **Professional Tools**
   - Therapist dashboard for couple insights
   - Clinical reporting and progress tracking
   - Integration with electronic health records

---

This architecture provides a solid foundation for a production-grade relationship platform that prioritizes user safety, privacy, and therapeutic value while maintaining scalability and maintainability. Every architectural decision is made with the understanding that this platform affects real relationships and must be built to the highest standards. 💕