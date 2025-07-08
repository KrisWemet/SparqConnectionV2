-- ================================
-- SPARQ CONNECTION - CLEAN SLATE MIGRATION
-- ================================
-- This script drops existing tables and recreates the complete schema
-- Use this when existing tables have incompatible schemas
-- 
-- Execute this entire script in the Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard/project/hvblduhuyochkctxzkye/sql/new
-- 2. Copy and paste this entire file
-- 3. Click "Run" to execute clean migration
-- ================================

-- ================================
-- DROP EXISTING TABLES (CASCADE)
-- ================================

-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS psychology_assessments CASCADE;
DROP TABLE IF EXISTS daily_psychological_checkins CASCADE;
DROP TABLE IF EXISTS user_intervention_progress CASCADE;
DROP TABLE IF EXISTS couple_psychology_analysis CASCADE;
DROP TABLE IF EXISTS user_psychology_profiles CASCADE;
DROP TABLE IF EXISTS psychology_interventions CASCADE;
DROP TABLE IF EXISTS crisis_events CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS reflections CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS daily_questions CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS couples CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types/enums
DROP TYPE IF EXISTS personality_strength CASCADE;
DROP TYPE IF EXISTS therapy_modality CASCADE;
DROP TYPE IF EXISTS emotional_state CASCADE;
DROP TYPE IF EXISTS gottman_horseman CASCADE;
DROP TYPE IF EXISTS love_language CASCADE;
DROP TYPE IF EXISTS invitation_status CASCADE;
DROP TYPE IF EXISTS crisis_severity CASCADE;
DROP TYPE IF EXISTS mood_type CASCADE;
DROP TYPE IF EXISTS question_category CASCADE;
DROP TYPE IF EXISTS relationship_status CASCADE;
DROP TYPE IF EXISTS attachment_style CASCADE;

-- ================================
-- CREATE CUSTOM TYPES/ENUMS
-- ================================

-- Core enums
CREATE TYPE attachment_style AS ENUM ('secure', 'anxious', 'avoidant', 'disorganized');
CREATE TYPE relationship_status AS ENUM ('dating', 'engaged', 'married', 'partnership');
CREATE TYPE question_category AS ENUM ('values', 'memories', 'future', 'intimacy', 'conflict', 'gratitude');
CREATE TYPE mood_type AS ENUM ('happy', 'sad', 'anxious', 'excited', 'confused', 'grateful', 'frustrated');
CREATE TYPE crisis_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');

-- Psychology framework enums
CREATE TYPE love_language AS ENUM ('words_of_affirmation', 'quality_time', 'physical_touch', 'acts_of_service', 'receiving_gifts');
CREATE TYPE gottman_horseman AS ENUM ('criticism', 'contempt', 'defensiveness', 'stonewalling');
CREATE TYPE emotional_state AS ENUM ('joy', 'sadness', 'anger', 'fear', 'disgust', 'surprise', 'shame', 'guilt', 'excitement', 'contentment', 'anxiety', 'love');
CREATE TYPE therapy_modality AS ENUM ('cbt', 'dbt', 'eft', 'act', 'mindfulness', 'positive_psychology', 'somatic', 'narrative', 'sfbt', 'gottman', 'attachment');
CREATE TYPE personality_strength AS ENUM ('curiosity', 'judgment', 'love_of_learning', 'perspective', 'bravery', 'perseverance', 'honesty', 'zest', 'love', 'kindness', 'social_intelligence', 'teamwork', 'fairness', 'leadership', 'forgiveness', 'humility', 'prudence', 'self_regulation', 'appreciation_of_beauty', 'gratitude', 'hope', 'humor', 'spirituality');

-- ================================
-- CORE TABLES (MIGRATION 001)
-- ================================

-- Users table
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

-- Couples table
CREATE TABLE couples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship_start_date DATE,
    relationship_status relationship_status,
    health_score INTEGER DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    goals TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(partner1_id, partner2_id),
    CHECK (partner1_id != partner2_id)
);

-- Invitations table
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code TEXT NOT NULL UNIQUE,
    couple_id UUID REFERENCES couples(id) ON DELETE SET NULL,
    email TEXT,
    status invitation_status DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily questions table
CREATE TABLE daily_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    category question_category NOT NULL,
    ai_generated BOOLEAN DEFAULT TRUE,
    source_context JSONB,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(couple_id, date)
);

-- Responses table
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    sentiment_score DECIMAL(3,2),
    mood mood_type,
    is_shared BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(question_id, user_id)
);

-- Reflections table (private journal entries)
CREATE TABLE reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_encrypted TEXT NOT NULL,
    tags TEXT[],
    mood mood_type,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests table (relationship exercises)
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions JSONB NOT NULL,
    category TEXT NOT NULL,
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    estimated_minutes INTEGER,
    completion_criteria JSONB,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crisis events table (metadata only for safety)
CREATE TABLE crisis_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    severity crisis_severity NOT NULL,
    event_hash TEXT NOT NULL, -- Hash of content, not content itself
    keywords_detected TEXT[],
    intervention_triggered BOOLEAN DEFAULT FALSE,
    follow_up_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- PSYCHOLOGY FRAMEWORK TABLES (MIGRATION 004)
-- ================================

-- Enhanced user psychological profile table
CREATE TABLE user_psychology_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Attachment Theory (Enhanced)
    attachment_style attachment_style NOT NULL,
    attachment_security_score INTEGER CHECK (attachment_security_score >= 0 AND attachment_security_score <= 100),
    attachment_anxiety_score INTEGER CHECK (attachment_anxiety_score >= 0 AND attachment_anxiety_score <= 100),
    attachment_avoidance_score INTEGER CHECK (attachment_avoidance_score >= 0 AND attachment_avoidance_score <= 100),
    
    -- Love Languages
    primary_love_language love_language NOT NULL,
    secondary_love_language love_language,
    love_language_scores JSONB, -- Detailed scores for all 5 languages
    
    -- Gottman Method
    gottman_assessment_score INTEGER CHECK (gottman_assessment_score >= 0 AND gottman_assessment_score <= 100),
    four_horsemen_tendencies JSONB, -- Scores for each horseman
    gottman_strengths TEXT[],
    
    -- CBT Profile
    cognitive_distortions TEXT[], -- Common patterns identified
    cbt_progress_score INTEGER DEFAULT 50 CHECK (cbt_progress_score >= 0 AND cbt_progress_score <= 100),
    thought_challenging_skills INTEGER DEFAULT 50 CHECK (thought_challenging_skills >= 0 AND thought_challenging_skills <= 100),
    
    -- DBT Skills
    emotional_regulation_score INTEGER DEFAULT 50 CHECK (emotional_regulation_score >= 0 AND emotional_regulation_score <= 100),
    distress_tolerance_score INTEGER DEFAULT 50 CHECK (distress_tolerance_score >= 0 AND distress_tolerance_score <= 100),
    interpersonal_effectiveness_score INTEGER DEFAULT 50 CHECK (interpersonal_effectiveness_score >= 0 AND interpersonal_effectiveness_score <= 100),
    mindfulness_score INTEGER DEFAULT 50 CHECK (mindfulness_score >= 0 AND mindfulness_score <= 100),
    
    -- EFT Profile
    emotional_awareness_score INTEGER DEFAULT 50 CHECK (emotional_awareness_score >= 0 AND emotional_awareness_score <= 100),
    emotional_expression_score INTEGER DEFAULT 50 CHECK (emotional_expression_score >= 0 AND emotional_expression_score <= 100),
    attachment_injury_areas TEXT[],
    
    -- ACT Profile
    psychological_flexibility_score INTEGER DEFAULT 50 CHECK (psychological_flexibility_score >= 0 AND psychological_flexibility_score <= 100),
    core_values JSONB, -- User's identified core values
    values_living_score INTEGER DEFAULT 50 CHECK (values_living_score >= 0 AND values_living_score <= 100),
    
    -- Positive Psychology
    character_strengths personality_strength[],
    gratitude_practice_frequency INTEGER DEFAULT 0 CHECK (gratitude_practice_frequency >= 0 AND gratitude_practice_frequency <= 7),
    life_satisfaction_score INTEGER DEFAULT 50 CHECK (life_satisfaction_score >= 0 AND life_satisfaction_score <= 100),
    
    -- Somatic/Body Awareness
    body_awareness_score INTEGER DEFAULT 50 CHECK (body_awareness_score >= 0 AND body_awareness_score <= 100),
    somatic_preferences JSONB, -- Touch, movement, breathing preferences
    trauma_informed_needs BOOLEAN DEFAULT FALSE,
    
    -- Narrative Therapy
    relationship_narrative JSONB, -- User's relationship story themes
    preferred_narrative_identity TEXT,
    externalized_problems TEXT[],
    
    -- Solution-Focused
    relationship_goals JSONB, -- Specific, measurable goals
    scaling_scores JSONB, -- Various life areas on 1-10 scale
    exceptions_catalog JSONB, -- Times when problems weren't present
    
    -- Mindfulness Profile
    meditation_experience TEXT CHECK (meditation_experience IN ('none', 'beginner', 'intermediate', 'advanced')),
    mindfulness_practice_frequency INTEGER DEFAULT 0 CHECK (mindfulness_practice_frequency >= 0 AND mindfulness_practice_frequency <= 7),
    preferred_mindfulness_techniques TEXT[],
    
    -- Meta Information
    assessment_completion_percentage INTEGER DEFAULT 0 CHECK (assessment_completion_percentage >= 0 AND assessment_completion_percentage <= 100),
    last_assessment_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Couple compatibility analysis table
CREATE TABLE couple_psychology_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    
    -- Attachment Compatibility
    attachment_compatibility_score INTEGER CHECK (attachment_compatibility_score >= 0 AND attachment_compatibility_score <= 100),
    attachment_challenges JSONB, -- Specific areas to work on
    attachment_strengths JSONB, -- Natural compatibility areas
    
    -- Communication Patterns
    communication_style_match INTEGER DEFAULT 50 CHECK (communication_style_match >= 0 AND communication_style_match <= 100),
    conflict_resolution_compatibility INTEGER DEFAULT 50 CHECK (conflict_resolution_compatibility >= 0 AND conflict_resolution_compatibility <= 100),
    emotional_expression_alignment INTEGER DEFAULT 50 CHECK (emotional_expression_alignment >= 0 AND emotional_expression_alignment <= 100),
    
    -- Love Language Compatibility
    love_language_compatibility_score INTEGER CHECK (love_language_compatibility_score >= 0 AND love_language_compatibility_score <= 100),
    love_language_recommendations JSONB,
    
    -- Values Alignment (ACT)
    core_values_alignment INTEGER DEFAULT 50 CHECK (core_values_alignment >= 0 AND core_values_alignment <= 100),
    shared_values TEXT[],
    values_conflicts JSONB,
    
    -- Strengths Complementarity
    strengths_compatibility INTEGER DEFAULT 50 CHECK (strengths_compatibility >= 0 AND strengths_compatibility <= 100),
    complementary_strengths TEXT[],
    shared_strengths TEXT[],
    
    -- Growth Areas
    recommended_modalities therapy_modality[],
    priority_focus_areas TEXT[],
    suggested_interventions JSONB,
    
    -- Progress Tracking
    overall_compatibility_score INTEGER CHECK (overall_compatibility_score >= 0 AND overall_compatibility_score <= 100),
    compatibility_trend INTEGER DEFAULT 0 CHECK (compatibility_trend >= -10 AND compatibility_trend <= 10), -- Monthly change
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(couple_id)
);

-- Psychological interventions and exercises table
CREATE TABLE psychology_interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Intervention Details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions JSONB NOT NULL, -- Step-by-step instructions
    modality therapy_modality NOT NULL,
    
    -- Targeting
    target_issues TEXT[], -- What problems this addresses
    required_skills TEXT[], -- Prerequisites
    contraindications TEXT[], -- When not to use
    
    -- Personalization
    attachment_styles attachment_style[], -- Which attachment styles benefit most
    relationship_stages TEXT[], -- dating, engaged, married, etc.
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    
    -- Timing and Structure
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    frequency_per_week INTEGER CHECK (frequency_per_week >= 1 AND frequency_per_week <= 7),
    total_sessions INTEGER, -- For multi-session interventions
    
    -- Metadata
    evidence_base TEXT, -- Research supporting this intervention
    created_by TEXT DEFAULT 'system',
    is_active BOOLEAN DEFAULT TRUE,
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User intervention completion tracking
CREATE TABLE user_intervention_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    intervention_id UUID NOT NULL REFERENCES psychology_interventions(id) ON DELETE CASCADE,
    
    -- Progress Tracking
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused', 'discontinued')) DEFAULT 'not_started',
    current_session INTEGER DEFAULT 1,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Effectiveness Tracking
    pre_intervention_score INTEGER CHECK (pre_intervention_score >= 1 AND pre_intervention_score <= 10),
    current_score INTEGER CHECK (current_score >= 1 AND current_score <= 10),
    post_intervention_score INTEGER CHECK (post_intervention_score >= 1 AND post_intervention_score <= 10),
    
    -- User Feedback
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    perceived_helpfulness INTEGER CHECK (perceived_helpfulness >= 1 AND perceived_helpfulness <= 10),
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE,
    last_session_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, intervention_id)
);

-- Daily emotional and psychological check-ins
CREATE TABLE daily_psychological_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Emotional State
    primary_emotion emotional_state,
    emotion_intensity INTEGER CHECK (emotion_intensity >= 1 AND emotion_intensity <= 10),
    secondary_emotions emotional_state[],
    
    -- Relationship Metrics
    relationship_satisfaction INTEGER CHECK (relationship_satisfaction >= 1 AND relationship_satisfaction <= 10),
    connection_feeling INTEGER CHECK (connection_feeling >= 1 AND connection_feeling <= 10),
    communication_quality INTEGER CHECK (communication_quality >= 1 AND communication_quality <= 10),
    conflict_level INTEGER CHECK (conflict_level >= 1 AND conflict_level <= 10),
    
    -- Modality-Specific Check-ins
    mindfulness_minutes INTEGER DEFAULT 0,
    gratitude_items TEXT[],
    values_alignment_today INTEGER CHECK (values_alignment_today >= 1 AND values_alignment_today <= 10),
    emotional_regulation_success INTEGER CHECK (emotional_regulation_success >= 1 AND emotional_regulation_success <= 10),
    
    -- Notes
    personal_notes TEXT,
    wins_today TEXT[],
    challenges_today TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- Psychological assessment responses
CREATE TABLE psychology_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL, -- 'attachment', 'love_languages', 'gottman', etc.
    
    -- Assessment Data
    questions_responses JSONB NOT NULL, -- Question ID -> Response mapping
    raw_scores JSONB, -- Subscale scores before interpretation
    interpreted_results JSONB, -- Final results with explanations
    
    -- Metadata
    assessment_version TEXT DEFAULT '1.0',
    completion_time_seconds INTEGER,
    is_complete BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- FUNCTIONS AND TRIGGERS
-- ================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_couples_updated_at BEFORE UPDATE ON couples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reflections_updated_at BEFORE UPDATE ON reflections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_psychology_profiles_updated_at BEFORE UPDATE ON user_psychology_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_couple_psychology_analysis_updated_at BEFORE UPDATE ON couple_psychology_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_psychology_interventions_updated_at BEFORE UPDATE ON psychology_interventions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_intervention_progress_updated_at BEFORE UPDATE ON user_intervention_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_psychology_assessments_updated_at BEFORE UPDATE ON psychology_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Core table indexes
CREATE INDEX idx_couples_partner1 ON couples(partner1_id);
CREATE INDEX idx_couples_partner2 ON couples(partner2_id);
CREATE INDEX idx_daily_questions_couple_date ON daily_questions(couple_id, date);
CREATE INDEX idx_responses_question_id ON responses(question_id);
CREATE INDEX idx_responses_user_id ON responses(user_id);
CREATE INDEX idx_reflections_user_created ON reflections(user_id, created_at);
CREATE INDEX idx_quests_couple_category ON quests(couple_id, category);
CREATE INDEX idx_crisis_events_couple_created ON crisis_events(couple_id, created_at);

-- Psychology framework indexes
CREATE INDEX idx_user_psychology_profiles_user_id ON user_psychology_profiles(user_id);
CREATE INDEX idx_couple_psychology_analysis_couple_id ON couple_psychology_analysis(couple_id);
CREATE INDEX idx_psychology_interventions_modality ON psychology_interventions(modality);
CREATE INDEX idx_psychology_interventions_difficulty ON psychology_interventions(difficulty_level);
CREATE INDEX idx_user_intervention_progress_user_id ON user_intervention_progress(user_id);
CREATE INDEX idx_user_intervention_progress_couple_id ON user_intervention_progress(couple_id);
CREATE INDEX idx_user_intervention_progress_status ON user_intervention_progress(status);
CREATE INDEX idx_daily_psychological_checkins_user_date ON daily_psychological_checkins(user_id, date);
CREATE INDEX idx_daily_psychological_checkins_couple_date ON daily_psychological_checkins(couple_id, date);
CREATE INDEX idx_psychology_assessments_user_type ON psychology_assessments(user_id, assessment_type);

-- ================================
-- ROW LEVEL SECURITY
-- ================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_psychology_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_psychology_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychology_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_intervention_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_psychological_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychology_assessments ENABLE ROW LEVEL SECURITY;

-- ================================
-- RLS POLICIES
-- ================================

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their partner's profile" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE (partner1_id = auth.uid() AND partner2_id = users.id)
               OR (partner2_id = auth.uid() AND partner1_id = users.id)
        )
    );

-- Couples policies
CREATE POLICY "Users can view their couple" ON couples
    FOR SELECT USING (partner1_id = auth.uid() OR partner2_id = auth.uid());

CREATE POLICY "Users can update their couple" ON couples
    FOR UPDATE USING (partner1_id = auth.uid() OR partner2_id = auth.uid());

CREATE POLICY "Users can create couples" ON couples
    FOR INSERT WITH CHECK (partner1_id = auth.uid() OR partner2_id = auth.uid());

-- Invitations policies
CREATE POLICY "Users can view invitations they sent" ON invitations
    FOR SELECT USING (inviter_id = auth.uid());

CREATE POLICY "Users can create invitations" ON invitations
    FOR INSERT WITH CHECK (inviter_id = auth.uid());

CREATE POLICY "Users can update their invitations" ON invitations
    FOR UPDATE USING (inviter_id = auth.uid());

-- Daily questions policies
CREATE POLICY "Users can view questions for their couple" ON daily_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = daily_questions.couple_id 
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

CREATE POLICY "Users can create questions for their couple" ON daily_questions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = daily_questions.couple_id 
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

-- Responses policies
CREATE POLICY "Users can view responses to their couple's questions" ON responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM daily_questions dq
            JOIN couples c ON c.id = dq.couple_id
            WHERE dq.id = responses.question_id
            AND (c.partner1_id = auth.uid() OR c.partner2_id = auth.uid())
        )
    );

CREATE POLICY "Users can create their own responses" ON responses
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own responses" ON responses
    FOR UPDATE USING (user_id = auth.uid());

-- Reflections policies (private)
CREATE POLICY "Users can only access their own reflections" ON reflections
    FOR ALL USING (user_id = auth.uid());

-- Quests policies
CREATE POLICY "Users can view quests for their couple" ON quests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = quests.couple_id 
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

CREATE POLICY "Users can update quests for their couple" ON quests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = quests.couple_id 
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

-- Crisis events policies (metadata only)
CREATE POLICY "Users can view crisis events for their couple" ON crisis_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = crisis_events.couple_id 
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

-- Psychology framework policies

-- User psychology profiles (private to user)
CREATE POLICY "Users can only access their own psychology profile" ON user_psychology_profiles
    FOR ALL USING (user_id = auth.uid());

-- Couple psychology analysis (accessible to both partners)
CREATE POLICY "Users can view their couple's psychology analysis" ON couple_psychology_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples 
            WHERE couples.id = couple_psychology_analysis.couple_id 
            AND (partner1_id = auth.uid() OR partner2_id = auth.uid())
        )
    );

-- Psychology interventions (public read, system write)
CREATE POLICY "Users can view available interventions" ON psychology_interventions
    FOR SELECT USING (is_active = true);

-- User intervention progress (private to user)
CREATE POLICY "Users can access their own intervention progress" ON user_intervention_progress
    FOR ALL USING (user_id = auth.uid());

-- Daily psychological check-ins (private to user)
CREATE POLICY "Users can access their own check-ins" ON daily_psychological_checkins
    FOR ALL USING (user_id = auth.uid());

-- Psychology assessments (private to user)
CREATE POLICY "Users can access their own assessments" ON psychology_assessments
    FOR ALL USING (user_id = auth.uid());

-- ================================
-- HELPER FUNCTIONS
-- ================================

-- Function to get couple ID for a user
CREATE OR REPLACE FUNCTION get_user_couple_id(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM couples 
        WHERE partner1_id = user_uuid OR partner2_id = user_uuid
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get partner ID for a user
CREATE OR REPLACE FUNCTION get_partner_id(user_uuid UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT 
            CASE 
                WHEN partner1_id = user_uuid THEN partner2_id
                WHEN partner2_id = user_uuid THEN partner1_id
                ELSE NULL
            END
        FROM couples 
        WHERE partner1_id = user_uuid OR partner2_id = user_uuid
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate relationship health score
CREATE OR REPLACE FUNCTION calculate_health_score(couple_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    response_count INTEGER;
    recent_responses INTEGER;
    avg_sentiment DECIMAL;
    streak_bonus INTEGER;
    health_score INTEGER;
BEGIN
    -- Count total responses
    SELECT COUNT(*) INTO response_count
    FROM responses r
    JOIN daily_questions dq ON dq.id = r.question_id
    WHERE dq.couple_id = couple_uuid;

    -- Count responses in last 7 days
    SELECT COUNT(*) INTO recent_responses
    FROM responses r
    JOIN daily_questions dq ON dq.id = r.question_id
    WHERE dq.couple_id = couple_uuid
    AND r.created_at >= NOW() - INTERVAL '7 days';

    -- Calculate average sentiment
    SELECT AVG(sentiment_score) INTO avg_sentiment
    FROM responses r
    JOIN daily_questions dq ON dq.id = r.question_id
    WHERE dq.couple_id = couple_uuid
    AND r.sentiment_score IS NOT NULL;

    -- Get current streak bonus
    SELECT current_streak INTO streak_bonus
    FROM couples
    WHERE id = couple_uuid;

    -- Calculate health score (base 50, +/- adjustments)
    health_score := 50;
    
    -- Activity bonus (up to +20)
    health_score := health_score + LEAST(20, recent_responses * 3);
    
    -- Sentiment bonus (up to +20)
    IF avg_sentiment IS NOT NULL THEN
        health_score := health_score + ROUND((avg_sentiment - 0.5) * 40);
    END IF;
    
    -- Streak bonus (up to +10)
    health_score := health_score + LEAST(10, streak_bonus);
    
    -- Ensure within bounds
    health_score := GREATEST(0, LEAST(100, health_score));
    
    RETURN health_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
BEGIN
    RETURN upper(substr(encode(gen_random_bytes(6), 'base64'), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Function to handle crisis detection
CREATE OR REPLACE FUNCTION log_crisis_event(
    couple_uuid UUID,
    content_hash TEXT,
    detected_keywords TEXT[],
    severity_level crisis_severity
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO crisis_events (
        couple_id,
        severity,
        event_hash,
        keywords_detected,
        intervention_triggered
    ) VALUES (
        couple_uuid,
        severity_level,
        content_hash,
        detected_keywords,
        TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create daily question for couple
CREATE OR REPLACE FUNCTION get_or_create_daily_question(couple_uuid UUID, question_date DATE)
RETURNS daily_questions AS $$
DECLARE
    existing_question daily_questions;
    new_question daily_questions;
BEGIN
    -- Try to get existing question
    SELECT * INTO existing_question
    FROM daily_questions
    WHERE couple_id = couple_uuid AND date = question_date;
    
    IF FOUND THEN
        RETURN existing_question;
    ELSE
        -- Create new question (placeholder - will be replaced by AI generation)
        INSERT INTO daily_questions (couple_id, question_text, category, date)
        VALUES (
            couple_uuid,
            'What made you smile today?',
            'gratitude',
            question_date
        )
        RETURNING * INTO new_question;
        
        RETURN new_question;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE user_psychology_profiles IS 'Comprehensive psychological profile for each user across 10+ therapeutic modalities';
COMMENT ON TABLE couple_psychology_analysis IS 'Compatibility analysis and recommendations based on both partners psychological profiles';
COMMENT ON TABLE psychology_interventions IS 'Library of evidence-based interventions from various therapeutic modalities';
COMMENT ON TABLE user_intervention_progress IS 'Tracks user progress through psychological interventions and exercises';
COMMENT ON TABLE daily_psychological_checkins IS 'Daily emotional and relationship wellness check-ins';
COMMENT ON TABLE psychology_assessments IS 'Stores responses and results from psychological assessments';

-- ================================
-- COMPLETION MESSAGE
-- ================================

DO $$
BEGIN
    RAISE NOTICE '=====================================';
    RAISE NOTICE 'SPARQ CONNECTION CLEAN MIGRATION COMPLETE!';
    RAISE NOTICE '=====================================';
    RAISE NOTICE 'All tables and enums created from scratch.';
    RAISE NOTICE 'Psychology framework with 10+ modalities is ready.';
    RAISE NOTICE 'Complete schema with RLS policies deployed.';
    RAISE NOTICE 'Run verification script to confirm success.';
    RAISE NOTICE '=====================================';
END $$;