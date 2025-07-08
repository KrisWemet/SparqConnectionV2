import { Database } from './database';

export type User = Database['public']['Tables']['users']['Row'];
export type Couple = Database['public']['Tables']['couples']['Row'];
export type DailyQuestion = Database['public']['Tables']['daily_questions']['Row'];
export type Response = Database['public']['Tables']['responses']['Row'];
export type Reflection = Database['public']['Tables']['reflections']['Row'];
export type Quest = Database['public']['Tables']['quests']['Row'];
export type CrisisEvent = Database['public']['Tables']['crisis_events']['Row'];
export type Invitation = Database['public']['Tables']['invitations']['Row'];

// New Psychology Types
export type UserPsychologyProfile = Database['public']['Tables']['user_psychology_profiles']['Row'];
export type CoupleePsychologyAnalysis = Database['public']['Tables']['couple_psychology_analysis']['Row'];
export type PsychologyIntervention = Database['public']['Tables']['psychology_interventions']['Row'];
export type UserInterventionProgress = Database['public']['Tables']['user_intervention_progress']['Row'];
export type DailyPsychologicalCheckin = Database['public']['Tables']['daily_psychological_checkins']['Row'];
export type PsychologyAssessment = Database['public']['Tables']['psychology_assessments']['Row'];

export type AttachmentStyle = Database['public']['Enums']['attachment_style'];
export type RelationshipStatus = Database['public']['Enums']['relationship_status'];
export type QuestionCategory = Database['public']['Enums']['question_category'];
export type MoodType = Database['public']['Enums']['mood_type'];
export type CrisisSeverity = Database['public']['Enums']['crisis_severity'];
export type InvitationStatus = Database['public']['Enums']['invitation_status'];

// New Psychology Enums
export type LoveLanguage = Database['public']['Enums']['love_language'];
export type GottmanHorseman = Database['public']['Enums']['gottman_horseman'];
export type EmotionalState = Database['public']['Enums']['emotional_state'];
export type TherapyModality = Database['public']['Enums']['therapy_modality'];
export type PersonalityStrength = Database['public']['Enums']['personality_strength'];

export interface UserProfile extends User {
  couple?: Couple;
  partner?: User;
  psychology_profile?: UserPsychologyProfile;
}

export interface CoupleProfile extends Couple {
  partner1: User;
  partner2: User;
  daily_questions: DailyQuestion[];
  current_quest?: Quest;
  psychology_analysis?: CoupleePsychologyAnalysis;
}

export interface QuestionWithResponses extends DailyQuestion {
  responses: Response[];
}

export interface DashboardData {
  couple: CoupleProfile;
  health_score: number;
  current_streak: number;
  longest_streak: number;
  questions_answered: number;
  reflections_count: number;
  current_quest?: Quest;
  recent_milestones: Milestone[];
  psychology_insights?: PsychologyInsights;
}

export interface Milestone {
  id: string;
  type: 'streak' | 'quest' | 'health_score' | 'anniversary' | 'psychology_progress';
  title: string;
  description: string;
  achieved_at: string;
  icon: string;
}

export interface NotificationPreferences {
  daily_questions: boolean;
  partner_responses: boolean;
  streak_reminders: boolean;
  milestone_celebrations: boolean;
  quest_updates: boolean;
  crisis_alerts: boolean;
  psychology_checkins: boolean;
  intervention_reminders: boolean;
}

export interface OnboardingData {
  user: {
    display_name: string;
    birth_date?: string;
    attachment_style?: AttachmentStyle;
  };
  couple: {
    relationship_start_date?: string;
    relationship_status?: RelationshipStatus;
    goals?: string[];
  };
  preferences: NotificationPreferences;
  psychology_assessment?: Partial<UserPsychologyProfile>;
}

// Comprehensive Psychology Interfaces

export interface PsychologyInsights {
  attachment_compatibility: {
    score: number;
    challenges: string[];
    strengths: string[];
    recommendations: string[];
  };
  communication_patterns: {
    match_score: number;
    conflict_resolution_style: string;
    improvement_areas: string[];
  };
  growth_opportunities: {
    individual: string[];
    couple: string[];
    suggested_modalities: TherapyModality[];
  };
}

export interface AttachmentAssessment {
  questions: AttachmentQuestion[];
  scoring: AttachmentScoring;
  results: AttachmentResults;
}

export interface AttachmentQuestion {
  id: string;
  text: string;
  subscale: 'anxiety' | 'avoidance' | 'security';
  reverse_scored?: boolean;
}

export interface AttachmentScoring {
  anxiety_items: number[];
  avoidance_items: number[];
  security_items: number[];
}

export interface AttachmentResults {
  attachment_style: AttachmentStyle;
  anxiety_score: number;
  avoidance_score: number;
  security_score: number;
  description: string;
  relationship_implications: string[];
  growth_areas: string[];
}

export interface LoveLanguageAssessment {
  questions: LoveLanguageQuestion[];
  results: LoveLanguageResults;
}

export interface LoveLanguageQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    language: LoveLanguage;
  }[];
}

export interface LoveLanguageResults {
  primary: LoveLanguage;
  secondary?: LoveLanguage;
  scores: Record<LoveLanguage, number>;
  description: string;
  daily_actions: string[];
  partner_guidance: string[];
}

export interface GottmanAssessment {
  areas: {
    love_maps: GottmanArea;
    nurture_affection: GottmanArea;
    turn_towards: GottmanArea;
    positive_perspective: GottmanArea;
    manage_conflict: GottmanArea;
    make_dreams_reality: GottmanArea;
    create_shared_meaning: GottmanArea;
  };
  overall_score: number;
  relationship_stability: 'stable' | 'at_risk' | 'needs_attention';
}

export interface GottmanArea {
  score: number;
  strengths: string[];
  growth_areas: string[];
  interventions: string[];
}

export interface PsychologyInterventionWithProgress extends PsychologyIntervention {
  user_progress?: UserInterventionProgress;
  is_recommended: boolean;
  compatibility_score: number;
}

// CBT (Cognitive Behavioral Therapy) Types
export interface CBTQuestion {
  id: string;
  text: string;
  category: CognitiveDistortion;
  reverse_scored: boolean;
}

export interface CBTResults {
  cognitive_flexibility_score: number;
  primary_distortions: CognitiveDistortion[];
  category_scores: Record<string, number>;
  distortion_levels: Record<string, 'low' | 'moderate' | 'high'>;
  thought_patterns: ThoughtPattern[];
  interventions: string[];
  strengths: string[];
  growth_areas: string[];
}

export type CognitiveDistortion = 
  | 'catastrophizing'
  | 'mind_reading'
  | 'all_or_nothing'
  | 'emotional_reasoning'
  | 'personalization'
  | 'should_statements'
  | 'mental_filtering';

export type ThoughtPattern = 
  | 'worst_case_thinking'
  | 'assumption_making'
  | 'black_white_thinking'
  | 'emotion_as_fact'
  | 'self_blame'
  | 'rigid_expectations'
  | 'negative_focus';

// DBT (Dialectical Behavior Therapy) Types
export interface DBTQuestion {
  id: string;
  text: string;
  skill_area: DBTSkillArea;
  reverse_scored: boolean;
}

export interface DBTResults {
  overall_skills_score: number;
  skill_scores: Record<DBTSkillArea, number>;
  skill_levels: Record<DBTSkillArea, 'beginner' | 'developing' | 'skilled' | 'advanced'>;
  strongest_areas: DBTSkillArea[];
  development_areas: DBTSkillArea[];
  daily_practices: string[];
  crisis_skills: string[];
  relationship_skills: string[];
  growth_plan: string[];
}

export type DBTSkillArea = 
  | 'emotional_regulation'
  | 'distress_tolerance'
  | 'interpersonal_effectiveness'
  | 'mindfulness';

// EFT (Emotionally Focused Therapy) Types
export interface EFTQuestion {
  id: string;
  text: string;
  category: 'emotional_awareness' | 'emotional_expression' | 'emotional_responsiveness' | 'attachment_accessibility' | 'cycle_awareness';
  reverse_scored: boolean;
}

export interface EFTResults {
  overall_emotional_connection: number;
  category_scores: Record<string, number>;
  attachment_bond: AttachmentBond;
  emotional_cycle_pattern: EmotionalCycle;
  emotional_strengths: string[];
  growth_areas: string[];
  eft_insights: string[];
  recommended_interventions: string[];
  couple_exercises: string[];
}

export type AttachmentBond = 
  | 'secure_bond'
  | 'developing_bond'
  | 'fragile_bond'
  | 'disconnected';

export type EmotionalCycle = 
  | 'pursue_withdraw'
  | 'withdraw_withdraw'
  | 'demand_defend'
  | 'secure_cycle'
  | 'transitional';

// ACT (Acceptance and Commitment Therapy) Types
export interface ACTQuestion {
  id: string;
  text: string;
  process: ACTFlexibilityProcess;
  reverse_scored: boolean;
}

export interface ACTResults {
  overall_psychological_flexibility: number;
  process_scores: Record<ACTFlexibilityProcess, number>;
  flexibility_strengths: ACTFlexibilityProcess[];
  growth_areas: ACTFlexibilityProcess[];
  values_alignment_score: number;
  values_alignment_level: 'low' | 'moderate' | 'high' | 'very_high';
  primary_values: string[];
  act_interventions: string[];
  values_exercises: string[];
  mindfulness_practices: string[];
  flexibility_goals: string[];
}

export type ACTFlexibilityProcess = 
  | 'present_moment'
  | 'acceptance'
  | 'defusion'
  | 'self_as_context'
  | 'values'
  | 'committed_action';

export interface PersonalValue {
  id: string;
  name: string;
  description: string;
}

// Mindfulness Assessment Types
export interface MindfulnessResults {
  mindfulness_score: number;
  mindfulness_level: 'beginning' | 'developing' | 'moderate' | 'high';
  present_moment_awareness: number;
  non_judgmental_awareness: number;
  body_awareness: number;
  recommended_practices: string[];
  daily_exercises: string[];
  relationship_applications: string[];
}

// Positive Psychology Types
export interface PositivePsychologyResults {
  wellbeing_score: number;
  character_strengths: string[];
  strength_scores: Record<string, number>;
  gratitude_practices: string[];
  strength_spotting_exercises: string[];
  relationship_flourishing_activities: string[];
  growth_mindset_practices: string[];
}

export interface CharacterStrength {
  id: string;
  name: string;
  category: 'wisdom' | 'courage' | 'humanity' | 'justice' | 'temperance' | 'transcendence';
}

// Somatic Therapy Types
export interface SomaticResults {
  body_awareness_score: number;
  somatic_skills: Record<SomaticAwareness, number>;
  nervous_system_regulation: number;
  embodiment_practices: string[];
  grounding_techniques: string[];
  body_based_communication: string[];
  trauma_informed_practices: string[];
}

export type SomaticAwareness = 
  | 'body_awareness'
  | 'regulation'
  | 'attunement'
  | 'embodiment';

export interface DailyCheckinSummary {
  today: DailyPsychologicalCheckin;
  weekly_trends: {
    relationship_satisfaction: number[];
    emotional_regulation: number[];
    communication_quality: number[];
    mindfulness_minutes: number[];
  };
  insights: string[];
  recommendations: string[];
}

export interface TherapyModalityProfile {
  modality: TherapyModality;
  relevance_score: number;
  current_interventions: PsychologyIntervention[];
  progress_summary: {
    active_interventions: number;
    completed_interventions: number;
    average_effectiveness: number;
  };
  next_steps: string[];
}

// Assessment System Types
export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'likert_scale' | 'yes_no' | 'text_input';
  options?: AssessmentOption[];
  scale_min?: number;
  scale_max?: number;
  scale_labels?: { value: number; label: string }[];
  required: boolean;
  category: string;
}

export interface AssessmentOption {
  id: string;
  text: string;
  value: number;
  category?: string;
}

export interface AssessmentFlow {
  id: string;
  title: string;
  description: string;
  modalities: TherapyModality[];
  estimated_minutes: number;
  sections: AssessmentSection[];
}

export interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  completion_message?: string;
}

export interface AssessmentResponse {
  question_id: string;
  response: string | number | string[];
  timestamp: Date;
}

export interface AssessmentResults {
  assessment_id: string;
  user_id: string;
  responses: AssessmentResponse[];
  scores: Record<string, number>;
  interpretations: Record<string, string>;
  recommendations: string[];
  created_at: Date;
}

// Individual vs Couple Differentiation
export interface IndividualGrowthMetrics {
  emotional_intelligence: number;
  self_awareness: number;
  emotional_regulation: number;
  social_skills: number;
  empathy: number;
  stress_management: number;
  personal_growth_areas: string[];
  therapy_readiness: number;
}

export interface CoupleGrowthMetrics {
  communication_effectiveness: number;
  conflict_resolution_skills: number;
  intimacy_level: number;
  shared_goals_alignment: number;
  trust_level: number;
  emotional_connection: number;
  relationship_satisfaction: number;
  future_vision_alignment: number;
}