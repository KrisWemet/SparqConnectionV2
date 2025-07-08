-- Enhanced Psychology Modalities Migration
-- Adds comprehensive psychological framework support for 10+ modalities

-- Create enhanced enums for psychological frameworks
CREATE TYPE love_language AS ENUM ('words_of_affirmation', 'quality_time', 'physical_touch', 'acts_of_service', 'receiving_gifts');
CREATE TYPE gottman_horseman AS ENUM ('criticism', 'contempt', 'defensiveness', 'stonewalling');
CREATE TYPE emotional_state AS ENUM ('joy', 'sadness', 'anger', 'fear', 'disgust', 'surprise', 'shame', 'guilt', 'excitement', 'contentment', 'anxiety', 'love');
CREATE TYPE therapy_modality AS ENUM ('cbt', 'dbt', 'eft', 'act', 'mindfulness', 'positive_psychology', 'somatic', 'narrative', 'sfbt', 'gottman', 'attachment');
CREATE TYPE personality_strength AS ENUM ('curiosity', 'judgment', 'love_of_learning', 'perspective', 'bravery', 'perseverance', 'honesty', 'zest', 'love', 'kindness', 'social_intelligence', 'teamwork', 'fairness', 'leadership', 'forgiveness', 'humility', 'prudence', 'self_regulation', 'appreciation_of_beauty', 'gratitude', 'hope', 'humor', 'spirituality');

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

-- Indexes for performance
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

-- Updated_at triggers
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

-- Comments for documentation
COMMENT ON TABLE user_psychology_profiles IS 'Comprehensive psychological profile for each user across 10+ therapeutic modalities';
COMMENT ON TABLE couple_psychology_analysis IS 'Compatibility analysis and recommendations based on both partners psychological profiles';
COMMENT ON TABLE psychology_interventions IS 'Library of evidence-based interventions from various therapeutic modalities';
COMMENT ON TABLE user_intervention_progress IS 'Tracks user progress through psychological interventions and exercises';
COMMENT ON TABLE daily_psychological_checkins IS 'Daily emotional and relationship wellness check-ins';
COMMENT ON TABLE psychology_assessments IS 'Stores responses and results from psychological assessments';