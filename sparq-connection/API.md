# Sparq Connection API Documentation

This document provides comprehensive API and database documentation for developers working with Sparq Connection's psychology-informed relationship platform.

## 🗄️ Database Schema Overview

### Architecture Philosophy
- **Couple-Centric Design**: All data organized around couples, not individual users
- **Psychology-Informed**: Schema supports 10+ therapeutic modalities
- **Privacy-First**: Sensitive data encrypted, minimal collection
- **Row-Level Security**: Complete data isolation between couples

### Database Relationships
```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│    Users    │────▶│   Couples   │────▶│ Daily Questions  │
│             │     │             │     │                  │
│ - id        │     │ - id        │     │ - couple_id      │
│ - email     │     │ - partner1  │     │ - question_text  │
│ - name      │     │ - partner2  │     │ - category       │
│ - attachment│     │ - health    │     │ - date           │
└─────────────┘     └─────────────┘     └──────────────────┘
       │                     │                     │
       │                     │                     ▼
       │                     │            ┌─────────────┐
       │                     │            │ Responses   │
       │                     │            │             │
       │                     │            │ - question  │
       │                     │            │ - user_id   │
       │                     │            │ - text      │
       │                     │            │ - sentiment │
       │                     │            └─────────────┘
       │                     │
       ▼                     ▼
┌─────────────────────┐ ┌─────────────────────┐
│ User Psychology     │ │ Couple Psychology   │
│ Profiles            │ │ Analysis            │
│                     │ │                     │
│ - 10+ Modalities    │ │ - Compatibility     │
│ - Assessment Scores │ │ - Recommendations   │
│ - Progress Tracking │ │ - Growth Areas      │
└─────────────────────┘ └─────────────────────┘
```

## 📊 Core Tables

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    birth_date DATE,
    attachment_style attachment_style,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Usage**:
```typescript
// Get user profile
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

// Update user profile
const { data } = await supabase
  .from('users')
  .update({ 
    display_name: 'New Name',
    attachment_style: 'secure' 
  })
  .eq('id', userId);
```

### Couples Table
```sql
CREATE TABLE couples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner1_id UUID NOT NULL REFERENCES users(id),
    partner2_id UUID NOT NULL REFERENCES users(id),
    relationship_start_date DATE,
    relationship_status relationship_status,
    health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    goals TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Usage**:
```typescript
// Get couple data
const { data: couple } = await supabase
  .from('couples')
  .select(`
    *,
    partner1:users!partner1_id(*),
    partner2:users!partner2_id(*)
  `)
  .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
  .single();

// Update relationship health
const { data } = await supabase
  .from('couples')
  .update({ 
    health_score: newScore,
    current_streak: newStreak 
  })
  .eq('id', coupleId);
```

## 🧠 Psychology Framework Tables

### User Psychology Profiles
```sql
CREATE TABLE user_psychology_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Attachment Theory (ECR-R based)
    attachment_style attachment_style NOT NULL,
    attachment_security_score INTEGER,
    attachment_anxiety_score INTEGER,
    attachment_avoidance_score INTEGER,
    
    -- Love Languages (Gary Chapman)
    primary_love_language love_language NOT NULL,
    secondary_love_language love_language,
    love_language_scores JSONB,
    
    -- Gottman Method
    gottman_assessment_score INTEGER,
    four_horsemen_tendencies JSONB,
    gottman_strengths TEXT[],
    
    -- CBT Profile
    cognitive_distortions TEXT[],
    cbt_progress_score INTEGER DEFAULT 50,
    thought_challenging_skills INTEGER DEFAULT 50,
    
    -- DBT Skills
    emotional_regulation_score INTEGER DEFAULT 50,
    distress_tolerance_score INTEGER DEFAULT 50,
    interpersonal_effectiveness_score INTEGER DEFAULT 50,
    mindfulness_score INTEGER DEFAULT 50,
    
    -- EFT Profile
    emotional_awareness_score INTEGER DEFAULT 50,
    emotional_expression_score INTEGER DEFAULT 50,
    attachment_injury_areas TEXT[],
    
    -- ACT Profile
    psychological_flexibility_score INTEGER DEFAULT 50,
    core_values JSONB,
    values_living_score INTEGER DEFAULT 50,
    
    -- Additional modalities...
    character_strengths personality_strength[],
    gratitude_practice_frequency INTEGER DEFAULT 0,
    body_awareness_score INTEGER DEFAULT 50,
    meditation_experience TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

**Usage**:
```typescript
// Get comprehensive psychology profile
const { data: profile } = await supabase
  .from('user_psychology_profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

// Update attachment scores after assessment
const { data } = await supabase
  .from('user_psychology_profiles')
  .upsert({
    user_id: userId,
    attachment_style: 'secure',
    attachment_security_score: 85,
    attachment_anxiety_score: 25,
    attachment_avoidance_score: 30
  });
```

### Couple Psychology Analysis
```sql
CREATE TABLE couple_psychology_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES couples(id),
    
    -- Attachment Compatibility
    attachment_compatibility_score INTEGER,
    attachment_challenges JSONB,
    attachment_strengths JSONB,
    
    -- Communication Patterns
    communication_style_match INTEGER DEFAULT 50,
    conflict_resolution_compatibility INTEGER DEFAULT 50,
    emotional_expression_alignment INTEGER DEFAULT 50,
    
    -- Love Language Compatibility
    love_language_compatibility_score INTEGER,
    love_language_recommendations JSONB,
    
    -- Values Alignment (ACT)
    core_values_alignment INTEGER DEFAULT 50,
    shared_values TEXT[],
    values_conflicts JSONB,
    
    -- Strengths Complementarity
    strengths_compatibility INTEGER DEFAULT 50,
    complementary_strengths TEXT[],
    shared_strengths TEXT[],
    
    -- Growth Areas
    recommended_modalities therapy_modality[],
    priority_focus_areas TEXT[],
    suggested_interventions JSONB,
    
    -- Progress Tracking
    overall_compatibility_score INTEGER,
    compatibility_trend INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(couple_id)
);
```

**Usage**:
```typescript
// Get couple compatibility analysis
const { data: analysis } = await supabase
  .from('couple_psychology_analysis')
  .select('*')
  .eq('couple_id', coupleId)
  .single();

// Generate new compatibility analysis
const compatibility = await generateCompatibilityAnalysis(partner1Profile, partner2Profile);
const { data } = await supabase
  .from('couple_psychology_analysis')
  .upsert({
    couple_id: coupleId,
    attachment_compatibility_score: compatibility.attachment,
    love_language_compatibility_score: compatibility.loveLanguages,
    overall_compatibility_score: compatibility.overall,
    recommended_modalities: compatibility.recommendations
  });
```

## 📝 Assessment and Tracking Tables

### Psychology Assessments
```sql
CREATE TABLE psychology_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    assessment_type TEXT NOT NULL, -- 'attachment', 'love_languages', 'gottman', etc.
    questions_responses JSONB NOT NULL,
    raw_scores JSONB,
    interpreted_results JSONB,
    assessment_version TEXT DEFAULT '1.0',
    completion_time_seconds INTEGER,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Daily Psychological Check-ins
```sql
CREATE TABLE daily_psychological_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    couple_id UUID NOT NULL REFERENCES couples(id),
    date DATE NOT NULL,
    primary_emotion emotional_state,
    emotion_intensity INTEGER CHECK (emotion_intensity >= 1 AND emotion_intensity <= 10),
    relationship_satisfaction INTEGER,
    connection_feeling INTEGER,
    communication_quality INTEGER,
    mindfulness_minutes INTEGER DEFAULT 0,
    gratitude_items TEXT[],
    values_alignment_today INTEGER,
    personal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);
```

## 🔄 Common Query Patterns

### Getting Complete User Data
```typescript
async function getCompleteUserProfile(userId: string) {
  const { data } = await supabase
    .from('users')
    .select(`
      *,
      psychology_profile:user_psychology_profiles(*),
      couple:couples!couples_partner1_id_fkey(
        *,
        partner1:users!partner1_id(*),
        partner2:users!partner2_id(*),
        analysis:couple_psychology_analysis(*)
      )
    `)
    .eq('id', userId)
    .single();
    
  return data;
}
```

### Daily Question and Response Flow
```typescript
// Get today's question for couple
async function getTodaysQuestion(coupleId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data } = await supabase
    .from('daily_questions')
    .select(`
      *,
      responses(
        *,
        user:users(display_name, avatar_url)
      )
    `)
    .eq('couple_id', coupleId)
    .eq('date', today)
    .single();
    
  return data;
}

// Submit response to question
async function submitResponse(questionId: string, userId: string, responseText: string) {
  const { data } = await supabase
    .from('responses')
    .upsert({
      question_id: questionId,
      user_id: userId,
      response_text: responseText,
      created_at: new Date().toISOString()
    });
    
  return data;
}
```

### Psychology Progress Tracking
```typescript
// Get user's psychology progress over time
async function getPsychologyProgress(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data } = await supabase
    .from('daily_psychological_checkins')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });
    
  return data;
}
```

## 🔒 Row Level Security (RLS) Policies

### Key Security Patterns

**Couple Data Access**:
```sql
-- Users can only access data for their couple
CREATE POLICY "couple_access" ON daily_questions
FOR ALL USING (
  couple_id IN (
    SELECT id FROM couples 
    WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
  )
);
```

**Individual Psychology Data**:
```sql
-- Users can only access their own psychology profile
CREATE POLICY "own_psychology_profile" ON user_psychology_profiles
FOR ALL USING (user_id = auth.uid());
```

**Shared Analysis Data**:
```sql
-- Both partners can view couple analysis
CREATE POLICY "couple_analysis_access" ON couple_psychology_analysis
FOR SELECT USING (
  couple_id IN (
    SELECT id FROM couples 
    WHERE partner1_id = auth.uid() OR partner2_id = auth.uid()
  )
);
```

## 🤖 AI Integration Points

### Context Building for AI
```typescript
async function buildAIContext(coupleId: string) {
  // Get both partners' psychology profiles
  const { data: couple } = await supabase
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
      recent_responses:responses(
        *,
        question:daily_questions(category, question_text)
      )
    `)
    .eq('id', coupleId)
    .single();
    
  return {
    attachmentStyles: [
      couple.partner1.psychology_profile.attachment_style,
      couple.partner2.psychology_profile.attachment_style
    ],
    loveLanguages: [
      couple.partner1.psychology_profile.primary_love_language,
      couple.partner2.psychology_profile.primary_love_language
    ],
    compatibilityScore: couple.analysis.overall_compatibility_score,
    recentTopics: couple.recent_responses.map(r => r.question.category)
  };
}
```

## 📊 Analytics and Metrics

### Relationship Health Calculation
```typescript
async function calculateRelationshipHealth(coupleId: string) {
  // Get recent activity
  const { data: recentResponses } = await supabase
    .from('responses')
    .select(`
      *,
      question:daily_questions!inner(couple_id)
    `)
    .eq('question.couple_id', coupleId)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
  // Get psychology compatibility
  const { data: analysis } = await supabase
    .from('couple_psychology_analysis')
    .select('overall_compatibility_score')
    .eq('couple_id', coupleId)
    .single();
    
  // Calculate health score
  const activityScore = Math.min(recentResponses.length * 10, 50);
  const compatibilityScore = analysis.overall_compatibility_score || 50;
  const healthScore = Math.round((activityScore + compatibilityScore) / 2);
  
  return healthScore;
}
```

## 🚨 Crisis Detection Patterns

### Safe Content Monitoring
```typescript
async function checkContentSafety(content: string, userId: string) {
  // Never store actual crisis content
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  
  // Multi-layer detection
  const keywordFlags = detectCrisisKeywords(content);
  const sentimentScore = await analyzeSentiment(content);
  
  if (keywordFlags.length > 0 || sentimentScore < 0.3) {
    // Log only metadata
    await supabase
      .from('crisis_events')
      .insert({
        couple_id: await getUserCoupleId(userId),
        severity: determineSeverity(keywordFlags, sentimentScore),
        event_hash: hash,
        keywords_detected: keywordFlags,
        intervention_triggered: true
      });
      
    return { isCrisis: true, severity: 'high' };
  }
  
  return { isCrisis: false };
}
```

## 🔧 Database Utilities

### Helper Functions
```typescript
// Get user's couple ID
async function getUserCoupleId(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('couples')
    .select('id')
    .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
    .single();
    
  return data?.id || null;
}

// Get partner's user ID
async function getPartnerId(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('couples')
    .select('partner1_id, partner2_id')
    .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
    .single();
    
  if (!data) return null;
  return data.partner1_id === userId ? data.partner2_id : data.partner1_id;
}

// Check if users are in same couple
async function arePartners(userId1: string, userId2: string): Promise<boolean> {
  const { data } = await supabase
    .from('couples')
    .select('id')
    .or(`and(partner1_id.eq.${userId1},partner2_id.eq.${userId2}),and(partner1_id.eq.${userId2},partner2_id.eq.${userId1})`)
    .single();
    
  return !!data;
}
```

## 📈 Performance Considerations

### Query Optimization
- **Indexes**: All foreign keys and frequently queried columns indexed
- **Batch Operations**: Use upsert for multiple updates
- **Selective Fields**: Only query needed columns with select()
- **Pagination**: Use limit() and offset() for large datasets

### Caching Strategies
- **Psychology Profiles**: Cache after assessment completion
- **Compatibility Analysis**: Cache and regenerate monthly
- **Daily Questions**: Cache with Redis for 24 hours
- **Health Scores**: Calculate and cache daily

---

This API documentation provides the foundation for working with Sparq Connection's psychology-informed database. All queries should respect RLS policies and prioritize user privacy and safety.