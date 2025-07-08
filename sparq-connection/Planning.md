# Sparq Connection - Technical Planning Document

## Project Overview

Sparq Connection is an AI-powered Relationship Intelligence Platform that creates personalized daily connection moments for couples. This document outlines our technical implementation approach, architecture decisions, and development roadmap.

## Architecture Decisions

### 1. Technology Stack

**Frontend:**
- **Next.js 15** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **TailwindCSS v4** for utility-first styling with design system
- **Framer Motion** for delightful animations and micro-interactions

**Backend:**
- **Supabase** for PostgreSQL database, authentication, realtime, and storage
- **Row Level Security (RLS)** for couple-centric data isolation
- **PostgreSQL Functions** for complex business logic

**AI Integration:**
- **OpenAI GPT-4 Turbo** for question generation and content moderation
- **Structured prompts** with version control and safety guards
- **Crisis detection** using multiple AI models and keyword analysis

**Infrastructure:**
- **Vercel** for hosting with edge functions
- **Supabase Cloud** for managed database and backend services
- **Environment-based configuration** for development, staging, production

### 2. Psychology Framework Implementation

#### 10+ Therapeutic Modalities
```
Attachment Theory → ECR-R Assessment → Security/Anxiety/Avoidance Scores
Love Languages → Gary Chapman's Framework → Primary/Secondary Language Identification
Gottman Method → Four Horsemen Detection → Relationship Health Scoring
CBT → Cognitive Distortion Identification → Thought Challenging Interventions
DBT → Emotional Regulation Skills → Interpersonal Effectiveness Training
EFT → Emotion-Focused Therapy → Attachment Bond Strengthening
ACT → Values-Based Therapy → Psychological Flexibility Building
Mindfulness → Present-Moment Awareness → Meditation and Body Practices
Positive Psychology → Character Strengths → Gratitude and Appreciation
Somatic Therapy → Body Awareness → Trauma-Informed Approaches
```

#### Assessment System Architecture
- **Research-Based Questions**: ECR-R, Gottman's principles, validated instruments
- **Dynamic Scoring**: Real-time calculation of compatibility metrics
- **Personalized Recommendations**: Evidence-based interventions tailored to couple profiles
- **Progress Tracking**: Individual and couple growth over time

### 3. Database Schema Design

#### Core Entity Relationships
```
Users (1) ↔ (1) Couples (1) ↔ (many) DailyQuestions
  ↓                ↓                    ↓
UserPsychologyProfiles  Quests    Responses
  ↓                ↓                    
CrisisEvents  Invitations
  ↓
CouplePsychologyAnalysis
```

#### Psychology Framework Tables
- **user_psychology_profiles**: Comprehensive profiles across 10+ modalities
- **couple_psychology_analysis**: Compatibility analysis and recommendations
- **psychology_interventions**: Evidence-based intervention library
- **psychology_assessments**: Assessment responses and scoring
- **daily_psychological_checkins**: Daily emotional wellness tracking

#### Key Design Principles
- **Couple-Centric Architecture**: All data is associated with couples, not individual users
- **Privacy by Design**: Reflections are encrypted, crisis events store only metadata
- **Psychology-Informed**: Schema supports comprehensive psychological frameworks
- **Research-Based**: Tables support validated psychological assessments

### 4. AI Architecture

#### Psychology-Aware Question Generation
1. **Context Collection**: Gather couple's psychology profiles, attachment styles, compatibility scores
2. **Modality Selection**: Choose appropriate therapeutic approach based on couple needs
3. **Prompt Construction**: Use evidence-based psychology prompts with safety guards
4. **AI Generation**: OpenAI GPT-4 with psychology-informed temperature control
5. **Content Validation**: Multiple safety checks and clinical appropriateness
6. **Personalization**: Adapt based on couple's progress and intervention goals

#### Crisis Intervention System
1. **Multi-Layer Detection**: Keywords + sentiment analysis + behavioral patterns
2. **Psychology Assessment**: Risk evaluation using clinical frameworks
3. **Immediate Response**: Full-screen modal with crisis resources
4. **Professional Routing**: Connect to local mental health services
5. **Privacy Protection**: Log only metadata, never content
6. **Follow-up System**: Check-ins following crisis intervention protocols

### 5. Performance Strategy

#### Frontend Optimization
- **Psychology Bundle Splitting**: Lazy-load assessment modules
- **Assessment Caching**: Cache completed assessments and scores
- **Progressive Enhancement**: Core functionality works without JavaScript
- **PWA Implementation**: Offline support for daily check-ins

#### Backend Optimization
- **Psychology Indexes**: Optimized queries for compatibility analysis
- **Assessment Caching**: Redis cache for complex psychology calculations
- **Batch Processing**: Efficient couple compatibility computations
- **Realtime Subscriptions**: Live updates for partner progress

#### Target Performance Metrics
- **Assessment Load**: <1s for psychology assessment startup
- **Compatibility Analysis**: <500ms for couple analysis generation
- **Database Queries**: <100ms for psychology profile lookups
- **Crisis Detection**: <200ms for safety system response

## Development Phases

### Phase 1: Foundation ✅ COMPLETED
- [x] Next.js 15 + TypeScript project setup
- [x] Supabase backend initialization
- [x] Complete database schema with psychology framework
- [x] 10+ therapeutic modalities implementation
- [x] TypeScript types for all psychological frameworks
- [x] Assessment components and scoring logic
- [x] Psychology-aware AI service foundation

### Phase 2: Core Authentication & Psychology ✅ COMPLETED  
- [x] Supabase Auth integration
- [x] Couple invitation system
- [x] Comprehensive psychology assessment flow
- [x] Attachment theory assessment (ECR-R based)
- [x] Love languages assessment and compatibility
- [x] User psychology profile creation and management

### Phase 3: Advanced Psychology Features ✅ COMPLETED
- [x] Gottman Method integration with Four Horsemen detection
- [x] CBT assessment and intervention system
- [x] DBT emotional regulation framework
- [x] EFT emotion-focused therapy integration
- [x] ACT values-based therapy system
- [x] Mindfulness and somatic therapy assessments
- [x] Positive psychology character strengths
- [x] Couple compatibility analysis engine

### Phase 4: AI Integration & Safety (Weeks 17-20)
- [ ] Psychology-informed daily question generation
- [ ] Crisis detection with clinical validation
- [ ] Content moderation with therapeutic appropriateness
- [ ] Personalized intervention recommendations
- [ ] AI-powered relationship health insights

### Phase 5: User Experience & Launch (Weeks 21-28)
- [ ] Enhanced psychology dashboard with insights
- [ ] Progressive intervention system
- [ ] Couples growth tracking and visualization
- [ ] Professional therapist referral integration
- [ ] Clinical validation and safety testing

## Psychology Framework Status

### ✅ Completed Modalities
1. **Attachment Theory**: ECR-R assessment with security/anxiety/avoidance scoring
2. **Love Languages**: Gary Chapman's framework with compatibility analysis
3. **Gottman Method**: Four Horsemen detection and relationship principles
4. **CBT**: Cognitive distortion identification and thought challenging
5. **DBT**: Emotional regulation and interpersonal effectiveness
6. **EFT**: Emotion-focused therapy for attachment bonds
7. **ACT**: Values-based therapy and psychological flexibility
8. **Mindfulness**: Meditation practices and present-moment awareness
9. **Positive Psychology**: Character strengths and gratitude practices
10. **Somatic Therapy**: Body awareness and trauma-informed approaches

### 🔄 Integration Status
- [x] **Database Schema**: All psychology tables deployed and verified
- [x] **Assessment Components**: React components for all 10+ modalities
- [x] **Scoring Algorithms**: Research-based scoring for each framework
- [x] **TypeScript Types**: Complete type safety for psychology data
- [x] **Compatibility Engine**: Couple analysis across all modalities
- [ ] **AI Integration**: Psychology-aware question generation (next phase)
- [ ] **Clinical Validation**: Professional review of assessment accuracy

## Security Considerations

### Data Protection
- **Psychology Data Encryption**: AES-256 for sensitive psychological profiles
- **Assessment Privacy**: Individual results encrypted until couple consent
- **Clinical Confidentiality**: Crisis data handled per HIPAA-like standards
- **Research Ethics**: All assessments follow psychological research ethics

### Privacy Implementation
- **Couple Isolation**: Strict RLS ensures complete data separation
- **Assessment Consent**: Clear consent for psychology data collection
- **Intervention Opt-out**: Users can decline specific therapeutic approaches
- **Data Portability**: Export all psychology data in standard formats

### AI Safety
- **Clinical Appropriateness**: All AI outputs validated for therapeutic safety
- **Crisis Detection**: Multi-layer system with immediate professional routing
- **Intervention Ethics**: AI recommendations follow clinical best practices
- **Bias Prevention**: Regular auditing of AI outputs for therapeutic bias

## Current Status & Next Priorities

### ✅ Recently Completed (Major Achievement)
- **Complete Psychology Framework**: 10+ therapeutic modalities fully implemented
- **Database Deployment**: Clean slate migration with all tables successfully created
- **Assessment System**: Research-based assessments for all modalities ready
- **Compatibility Engine**: Couple analysis across psychological dimensions
- **Type Safety**: Complete TypeScript integration for psychology framework
- **Verification System**: Database and feature testing scripts operational

### 🎯 Immediate Next Steps
1. **AI Integration**: Connect psychology profiles to personalized question generation
2. **Crisis System**: Implement clinical-grade crisis detection and intervention
3. **User Experience**: Polish psychology assessment flow and results presentation
4. **Professional Integration**: Build therapist referral and professional consultation features

### 📊 Framework Readiness
- **Database**: 14/14 tables deployed ✅
- **Psychology Modalities**: 10/10 implemented ✅  
- **Assessment Components**: 10/10 built ✅
- **Scoring Systems**: 10/10 validated ✅
- **TypeScript Coverage**: 100% type-safe ✅
- **Testing**: Database and features verified ✅

## Success Metrics

### Technical KPIs
- **Psychology Performance**: <1s assessment startup, <500ms scoring
- **Database Performance**: <100ms psychology profile queries
- **AI Response**: <1.2s for psychology-informed question generation
- **Safety Response**: <200ms crisis detection and intervention

### Clinical KPIs
- **Assessment Accuracy**: >90% correlation with validated instruments
- **Intervention Effectiveness**: >80% user-reported improvement
- **Crisis Detection**: >95% sensitivity for mental health crisis indicators
- **Professional Integration**: <24hr response for crisis referrals

### User Experience KPIs
- **Assessment Completion**: >85% finish comprehensive psychology evaluation
- **Couple Compatibility**: >75% accuracy in predicting relationship satisfaction
- **Growth Tracking**: Measurable improvement in relationship metrics over 90 days
- **Safety Confidence**: >95% user trust in crisis intervention system

---

*Last Updated: January 2025*  
*Status: Psychology Framework Complete - Ready for AI Integration Phase*
*Next Review: Weekly sprint planning*