/**
 * Psychology-Aware AI Service
 * Integrates 10+ psychological modalities for personalized relationship interventions
 */

import OpenAI from 'openai';
import type { 
  UserPsychologyProfile, 
  CoupleePsychologyAnalysis, 
  AttachmentStyle, 
  LoveLanguage,
  TherapyModality,
  EmotionalState
} from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PsychologyContext {
  userProfile?: UserPsychologyProfile;
  partnerProfile?: UserPsychologyProfile;
  coupleAnalysis?: CoupleePsychologyAnalysis;
  recentMood?: EmotionalState;
  relationshipStage?: string;
  currentChallenges?: string[];
  preferredModalities?: TherapyModality[];
}

interface PersonalizedQuestionParams {
  context: PsychologyContext;
  previousQuestions?: string[];
  questionType?: 'daily' | 'deep_dive' | 'conflict_resolution' | 'intimacy' | 'growth';
  targetModality?: TherapyModality;
}

interface QuestionGenerationResult {
  question: string;
  modality: TherapyModality;
  explanation: string;
  followUpPrompts: string[];
  safetyConsiderations: string[];
}

export class PsychologyAwareAI {
  /**
   * Generate personalized questions based on comprehensive psychological profile
   */
  static async generatePersonalizedQuestion(
    params: PersonalizedQuestionParams
  ): Promise<QuestionGenerationResult> {
    const { context, previousQuestions = [], questionType = 'daily', targetModality } = params;
    
    const systemPrompt = this.buildSystemPrompt(context, questionType);
    const userPrompt = this.buildUserPrompt(context, previousQuestions, questionType, targetModality);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        question: result.question || this.getFallbackQuestion(questionType),
        modality: result.modality || 'gottman',
        explanation: result.explanation || '',
        followUpPrompts: result.followUpPrompts || [],
        safetyConsiderations: result.safetyConsiderations || []
      };
    } catch (error) {
      console.error('Error generating personalized question:', error);
      return this.getFallbackQuestionResult(questionType, context);
    }
  }

  /**
   * Analyze response content for psychological insights
   */
  static async analyzeResponseContent(
    content: string,
    context: PsychologyContext
  ): Promise<{
    emotionalTone: EmotionalState;
    psychologicalInsights: string[];
    recommendedInterventions: string[];
    crisisIndicators: {
      detected: boolean;
      confidence: number;
      recommendations: string[];
    };
  }> {
    const systemPrompt = `You are a clinical psychologist analyzing relationship response content. 
    Provide psychological insights while maintaining ethical boundaries and safety.
    
    User's psychological context:
    - Attachment style: ${context.userProfile?.attachment_style}
    - Primary love language: ${context.userProfile?.primary_love_language}
    - Recent emotional patterns: ${context.recentMood}
    
    Return analysis in JSON format with emotionalTone, psychologicalInsights, recommendedInterventions, and crisisIndicators.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this response: "${content}"` }
        ],
        temperature: 0.3,
        max_tokens: 400,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error analyzing response content:', error);
      return {
        emotionalTone: 'contentment' as EmotionalState,
        psychologicalInsights: [],
        recommendedInterventions: [],
        crisisIndicators: {
          detected: false,
          confidence: 0,
          recommendations: []
        }
      };
    }
  }

  /**
   * Generate couple compatibility insights
   */
  static async generateCompatibilityInsights(
    profile1: UserPsychologyProfile,
    profile2: UserPsychologyProfile
  ): Promise<{
    overallCompatibility: number;
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    modalityFocus: TherapyModality[];
  }> {
    const systemPrompt = `You are a relationship psychologist analyzing couple compatibility across multiple therapeutic modalities:
    
    1. Attachment Theory
    2. Love Languages  
    3. Gottman Method
    4. CBT patterns
    5. DBT emotional regulation
    6. EFT emotional expression
    7. ACT values alignment
    8. Positive Psychology strengths
    9. Mindfulness practices
    10. Communication styles
    
    Provide evidence-based compatibility analysis in JSON format.`;

    const userPrompt = `Analyze compatibility between:
    
    Partner 1:
    - Attachment: ${profile1.attachment_style}
    - Love Language: ${profile1.primary_love_language}
    - CBT Score: ${profile1.cbt_progress_score}
    - Emotional Regulation: ${profile1.emotional_regulation_score}
    - Values Alignment: ${profile1.values_living_score}
    
    Partner 2:
    - Attachment: ${profile2.attachment_style}
    - Love Language: ${profile2.primary_love_language}
    - CBT Score: ${profile2.cbt_progress_score}
    - Emotional Regulation: ${profile2.emotional_regulation_score}
    - Values Alignment: ${profile2.values_living_score}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating compatibility insights:', error);
      return this.getFallbackCompatibilityInsights();
    }
  }

  /**
   * Build comprehensive system prompt incorporating psychological context
   */
  private static buildSystemPrompt(context: PsychologyContext, questionType: string): string {
    return `You are a relationship therapist with expertise in multiple therapeutic modalities:
    
    CORE MODALITIES:
    1. Attachment Theory - Understanding connection patterns
    2. Love Languages - Communication of affection
    3. Gottman Method - Relationship dynamics and conflict
    4. CBT - Thought patterns and behaviors
    5. DBT - Emotional regulation and distress tolerance
    6. EFT - Emotional awareness and expression
    7. ACT - Values-based living and psychological flexibility
    8. Positive Psychology - Strengths and gratitude
    9. Mindfulness - Present-moment awareness
    10. Somatic Therapy - Body-based awareness
    
    USER PROFILE:
    - Attachment Style: ${context.userProfile?.attachment_style || 'unknown'}
    - Primary Love Language: ${context.userProfile?.primary_love_language || 'unknown'}
    - Emotional Regulation Score: ${context.userProfile?.emotional_regulation_score || 'unknown'}
    - Mindfulness Score: ${context.userProfile?.mindfulness_score || 'unknown'}
    - Recent Mood: ${context.recentMood || 'neutral'}
    
    GUIDELINES:
    - Generate ${questionType} questions that are emotionally safe
    - Use simple, accessible language (not clinical jargon)
    - Include specific modality focus when beneficial
    - Consider attachment style sensitivities
    - Respect love language preferences
    - Promote growth while ensuring emotional safety
    
    Return JSON with: question, modality, explanation, followUpPrompts, safetyConsiderations`;
  }

  /**
   * Build user prompt with specific context
   */
  private static buildUserPrompt(
    context: PsychologyContext,
    previousQuestions: string[],
    questionType: string,
    targetModality?: TherapyModality
  ): string {
    let prompt = `Generate a personalized ${questionType} question for this couple context:
    
    RELATIONSHIP CONTEXT:
    - Stage: ${context.relationshipStage || 'unknown'}
    - Current challenges: ${context.currentChallenges?.join(', ') || 'none specified'}
    `;

    if (targetModality) {
      prompt += `\nTARGET MODALITY: ${targetModality}`;
    }

    if (previousQuestions.length > 0) {
      prompt += `\nRECENT QUESTIONS (avoid similar): ${previousQuestions.slice(-3).join(', ')}`;
    }

    if (context.userProfile?.attachment_style) {
      prompt += `\nATTACHMENT CONSIDERATIONS: ${this.getAttachmentConsiderations(context.userProfile.attachment_style)}`;
    }

    if (context.userProfile?.primary_love_language) {
      prompt += `\nLOVE LANGUAGE FOCUS: ${this.getLoveLanguageConsiderations(context.userProfile.primary_love_language)}`;
    }

    return prompt;
  }

  /**
   * Get attachment-specific considerations
   */
  private static getAttachmentConsiderations(style: AttachmentStyle): string {
    const considerations = {
      secure: 'Can handle deeper emotional questions, open to vulnerability',
      anxious: 'Needs reassurance-focused questions, avoid abandonment triggers',
      avoidant: 'Prefers gradual emotional opening, respect need for autonomy',
      disorganized: 'Requires extra emotional safety, trauma-informed approach'
    };
    return considerations[style];
  }

  /**
   * Get love language-specific considerations
   */
  private static getLoveLanguageConsiderations(language: LoveLanguage): string {
    const considerations = {
      words_of_affirmation: 'Frame questions to encourage verbal appreciation',
      quality_time: 'Focus on presence and undivided attention',
      physical_touch: 'Include appropriate physical connection elements',
      acts_of_service: 'Emphasize helpful actions and practical support',
      receiving_gifts: 'Consider thoughtfulness and symbolic gestures'
    };
    return considerations[language];
  }

  /**
   * Fallback question based on question type
   */
  private static getFallbackQuestion(questionType: string): string {
    const fallbacks = {
      daily: 'What made you feel most connected to your partner today?',
      deep_dive: 'What is one thing you admire most about your partner right now?',
      conflict_resolution: 'How can you both work together to solve challenges?',
      intimacy: 'What makes you feel most loved by your partner?',
      growth: 'How can you both grow stronger together this week?'
    };
    return fallbacks[questionType as keyof typeof fallbacks] || fallbacks.daily;
  }

  /**
   * Fallback question result
   */
  private static getFallbackQuestionResult(
    questionType: string,
    context: PsychologyContext
  ): QuestionGenerationResult {
    return {
      question: this.getFallbackQuestion(questionType),
      modality: 'gottman' as TherapyModality,
      explanation: 'This question focuses on building connection and understanding.',
      followUpPrompts: [
        'Share a specific example',
        'How did this make you feel?',
        'What would you like more of?'
      ],
      safetyConsiderations: [
        'Speak from your own experience',
        'Listen without judgment',
        'Take breaks if emotions become overwhelming'
      ]
    };
  }

  /**
   * Fallback compatibility insights
   */
  private static getFallbackCompatibilityInsights() {
    return {
      overallCompatibility: 75,
      strengths: [
        'Both partners show commitment to growth',
        'Willingness to engage in relationship work',
        'Open to learning about each other'
      ],
      challenges: [
        'Different communication styles may require practice',
        'Individual growth alongside relationship growth'
      ],
      recommendations: [
        'Practice daily appreciation',
        'Regular check-ins about needs and feelings',
        'Explore love languages together'
      ],
      modalityFocus: ['gottman', 'attachment'] as TherapyModality[]
    };
  }
}

/**
 * Modality-specific question generators for different therapeutic approaches
 */
export const ModalityQuestionGenerators = {
  attachment: {
    secure: [
      'How do you create emotional safety for your partner?',
      'What makes you feel most secure in your relationship?',
      'How do you support your partner when they need comfort?'
    ],
    anxious: [
      'What helps you feel most reassured by your partner?',
      'How does your partner show you they care about you?',
      'What would help you feel more secure in your relationship?'
    ],
    avoidant: [
      'What makes it easier for you to open up emotionally?',
      'How can you show care while maintaining your independence?',
      'What helps you feel comfortable with closeness?'
    ],
    disorganized: [
      'What makes you feel safest in your relationship?',
      'How can your partner support you during difficult moments?',
      'What boundaries help you feel secure?'
    ]
  },

  love_languages: {
    words_of_affirmation: [
      'What words from your partner mean the most to you?',
      'How can your partner encourage you with their words?',
      'What would you like to hear more often from your partner?'
    ],
    quality_time: [
      'What kind of time together feels most meaningful to you?',
      'How can you create more quality moments with your partner?',
      'What distractions would you like to eliminate during your time together?'
    ],
    physical_touch: [
      'What kind of physical affection makes you feel most loved?',
      'How can you and your partner increase physical connection?',
      'What touch feels most comforting to you?'
    ],
    acts_of_service: [
      'What actions from your partner make you feel most cared for?',
      'How can you lighten your partner\'s load this week?',
      'What practical support would be most meaningful to you?'
    ],
    receiving_gifts: [
      'What thoughtful gesture would surprise you most?',
      'How can your partner show they were thinking of you?',
      'What makes a gift meaningful to you?'
    ]
  },

  gottman: [
    'How can you turn toward your partner when they need attention?',
    'What positive qualities drew you to your partner initially?',
    'How can you repair after a disagreement?',
    'What dreams do you want to support in your partner?',
    'How can you show fondness and admiration today?'
  ],

  cbt: [
    'What thought patterns help your relationship thrive?',
    'How can you challenge negative assumptions about your partner?',
    'What evidence supports positive beliefs about your relationship?',
    'How can you reframe relationship challenges as opportunities?'
  ],

  dbt: [
    'How can you practice emotional regulation during conflicts?',
    'What mindfulness techniques help your relationship?',
    'How can you validate your partner\'s emotions today?',
    'What distress tolerance skills strengthen your bond?'
  ],

  act: [
    'What values guide your relationship decisions?',
    'How can you live more authentically with your partner?',
    'What actions align with your relationship values?',
    'How can you accept your partner\'s differences with compassion?'
  ],

  mindfulness: [
    'How can you be more present with your partner today?',
    'What helps you listen mindfully to your partner?',
    'How can you bring awareness to your relationship patterns?',
    'What would change if you approached your partner with fresh eyes?'
  ]
};