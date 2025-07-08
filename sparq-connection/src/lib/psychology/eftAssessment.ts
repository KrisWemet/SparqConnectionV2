/**
 * EFT (Emotionally Focused Therapy) Assessment System
 * Focuses on emotional awareness, expression, and attachment-based couple dynamics
 * Based on Sue Johnson's approach to couples therapy
 */

import type { EFTResults, EFTQuestion, AttachmentBond, EmotionalCycle } from '@/types';

// EFT assessment questions focusing on emotional awareness and couple dynamics
export const EFT_QUESTIONS: EFTQuestion[] = [
  // Emotional Awareness
  {
    id: 'eft_01',
    text: 'I am aware of my emotions as they arise in my relationship.',
    category: 'emotional_awareness',
    reverse_scored: false
  },
  {
    id: 'eft_02',
    text: 'I can identify the specific emotions I feel during conflicts with my partner.',
    category: 'emotional_awareness',
    reverse_scored: false
  },
  {
    id: 'eft_03',
    text: 'I often feel confused about what I\'m actually feeling in my relationship.',
    category: 'emotional_awareness',
    reverse_scored: true
  },
  {
    id: 'eft_04',
    text: 'I notice my emotional reactions before they become overwhelming.',
    category: 'emotional_awareness',
    reverse_scored: false
  },
  {
    id: 'eft_05',
    text: 'I can distinguish between surface emotions and deeper feelings.',
    category: 'emotional_awareness',
    reverse_scored: false
  },

  // Emotional Expression
  {
    id: 'eft_06',
    text: 'I can express my vulnerable emotions to my partner.',
    category: 'emotional_expression',
    reverse_scored: false
  },
  {
    id: 'eft_07',
    text: 'I hold back my true feelings to avoid conflict.',
    category: 'emotional_expression',
    reverse_scored: true
  },
  {
    id: 'eft_08',
    text: 'I feel safe sharing my deepest emotions with my partner.',
    category: 'emotional_expression',
    reverse_scored: false
  },
  {
    id: 'eft_09',
    text: 'I can express anger without attacking my partner.',
    category: 'emotional_expression',
    reverse_scored: false
  },
  {
    id: 'eft_10',
    text: 'I share my fears and insecurities with my partner.',
    category: 'emotional_expression',
    reverse_scored: false
  },

  // Emotional Responsiveness
  {
    id: 'eft_11',
    text: 'I respond with empathy when my partner shares emotions.',
    category: 'emotional_responsiveness',
    reverse_scored: false
  },
  {
    id: 'eft_12',
    text: 'I get defensive when my partner expresses difficult emotions.',
    category: 'emotional_responsiveness',
    reverse_scored: true
  },
  {
    id: 'eft_13',
    text: 'I can comfort my partner when they are upset.',
    category: 'emotional_responsiveness',
    reverse_scored: false
  },
  {
    id: 'eft_14',
    text: 'I validate my partner\'s emotions even when I don\'t understand them.',
    category: 'emotional_responsiveness',
    reverse_scored: false
  },
  {
    id: 'eft_15',
    text: 'I am emotionally available when my partner needs support.',
    category: 'emotional_responsiveness',
    reverse_scored: false
  },

  // Attachment Accessibility
  {
    id: 'eft_16',
    text: 'I feel emotionally connected to my partner most of the time.',
    category: 'attachment_accessibility',
    reverse_scored: false
  },
  {
    id: 'eft_17',
    text: 'I often feel emotionally distant from my partner.',
    category: 'attachment_accessibility',
    reverse_scored: true
  },
  {
    id: 'eft_18',
    text: 'My partner and I can reach each other emotionally.',
    category: 'attachment_accessibility',
    reverse_scored: false
  },
  {
    id: 'eft_19',
    text: 'I feel like my partner is emotionally available to me.',
    category: 'attachment_accessibility',
    reverse_scored: false
  },
  {
    id: 'eft_20',
    text: 'We can find our way back to connection after conflict.',
    category: 'attachment_accessibility',
    reverse_scored: false
  },

  // Cycle Awareness
  {
    id: 'eft_21',
    text: 'I understand the negative patterns my partner and I get stuck in.',
    category: 'cycle_awareness',
    reverse_scored: false
  },
  {
    id: 'eft_22',
    text: 'I can see how my actions trigger negative responses in my partner.',
    category: 'cycle_awareness',
    reverse_scored: false
  },
  {
    id: 'eft_23',
    text: 'We get caught in the same fight over and over.',
    category: 'cycle_awareness',
    reverse_scored: true
  },
  {
    id: 'eft_24',
    text: 'I can step out of negative cycles when they start.',
    category: 'cycle_awareness',
    reverse_scored: false
  },
  {
    id: 'eft_25',
    text: 'I understand how my partner\'s behavior affects me emotionally.',
    category: 'cycle_awareness',
    reverse_scored: false
  }
];

// EFT assessment scorer
export class EFTAssessmentScorer {
  static calculateScores(responses: Record<string, number>): EFTResults {
    const categories = ['emotional_awareness', 'emotional_expression', 'emotional_responsiveness', 'attachment_accessibility', 'cycle_awareness'];
    const categoryScores: Record<string, number> = {};
    
    // Calculate scores for each category
    for (const category of categories) {
      const categoryQuestions = EFT_QUESTIONS.filter(q => q.category === category);
      let totalScore = 0;
      let validResponses = 0;
      
      for (const question of categoryQuestions) {
        const response = responses[question.id];
        if (response !== undefined) {
          const score = question.reverse_scored ? (8 - response) : response;
          totalScore += score;
          validResponses++;
        }
      }
      
      const averageScore = validResponses > 0 ? totalScore / validResponses : 0;
      categoryScores[category] = Math.round(averageScore * 100 / 7); // Convert to 0-100 scale
    }
    
    // Calculate overall emotional connection score
    const overallScore = Math.round(
      Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / categories.length
    );
    
    // Determine attachment bond strength
    const bondStrength = this.determineAttachmentBond(categoryScores);
    
    // Identify emotional cycle pattern
    const emotionalCycle = this.identifyEmotionalCycle(categoryScores);
    
    // Generate insights and interventions
    const insights = this.generateInsights(categoryScores, bondStrength);
    const interventions = this.generateInterventions(categoryScores, emotionalCycle);
    
    return {
      overall_emotional_connection: overallScore,
      category_scores: categoryScores,
      attachment_bond: bondStrength,
      emotional_cycle_pattern: emotionalCycle,
      emotional_strengths: this.identifyStrengths(categoryScores),
      growth_areas: this.identifyGrowthAreas(categoryScores),
      eft_insights: insights,
      recommended_interventions: interventions,
      couple_exercises: this.generateCoupleExercises(categoryScores)
    };
  }
  
  private static determineAttachmentBond(categoryScores: Record<string, number>): AttachmentBond {
    const accessibilityScore = categoryScores.attachment_accessibility || 0;
    const responsivenessScore = categoryScores.emotional_responsiveness || 0;
    const expressionScore = categoryScores.emotional_expression || 0;
    
    const bondScore = (accessibilityScore + responsivenessScore + expressionScore) / 3;
    
    if (bondScore >= 80) {
      return 'secure_bond';
    } else if (bondScore >= 60) {
      return 'developing_bond';
    } else if (bondScore >= 40) {
      return 'fragile_bond';
    } else {
      return 'disconnected';
    }
  }
  
  private static identifyEmotionalCycle(categoryScores: Record<string, number>): EmotionalCycle {
    const cycleAwarenessScore = categoryScores.cycle_awareness || 0;
    const responsivenessScore = categoryScores.emotional_responsiveness || 0;
    const accessibilityScore = categoryScores.attachment_accessibility || 0;
    
    if (cycleAwarenessScore < 40 && responsivenessScore < 40) {
      return 'pursue_withdraw';
    } else if (accessibilityScore < 40 && categoryScores.emotional_expression < 40) {
      return 'withdraw_withdraw';
    } else if (cycleAwarenessScore < 50) {
      return 'demand_defend';
    } else if (cycleAwarenessScore >= 70 && responsivenessScore >= 70) {
      return 'secure_cycle';
    } else {
      return 'transitional';
    }
  }
  
  private static identifyStrengths(categoryScores: Record<string, number>): string[] {
    const strengths: string[] = [];
    
    if (categoryScores.emotional_awareness >= 70) {
      strengths.push('Strong emotional self-awareness');
    }
    if (categoryScores.emotional_expression >= 70) {
      strengths.push('Ability to express emotions authentically');
    }
    if (categoryScores.emotional_responsiveness >= 70) {
      strengths.push('Empathetic and responsive to partner\'s emotions');
    }
    if (categoryScores.attachment_accessibility >= 70) {
      strengths.push('Strong emotional connection and accessibility');
    }
    if (categoryScores.cycle_awareness >= 70) {
      strengths.push('Good awareness of relationship patterns');
    }
    
    return strengths.length > 0 ? strengths : ['Willingness to work on emotional connection'];
  }
  
  private static identifyGrowthAreas(categoryScores: Record<string, number>): string[] {
    const growthAreas: string[] = [];
    
    if (categoryScores.emotional_awareness < 60) {
      growthAreas.push('Developing greater emotional self-awareness');
    }
    if (categoryScores.emotional_expression < 60) {
      growthAreas.push('Learning to express vulnerable emotions safely');
    }
    if (categoryScores.emotional_responsiveness < 60) {
      growthAreas.push('Becoming more emotionally responsive to partner');
    }
    if (categoryScores.attachment_accessibility < 60) {
      growthAreas.push('Building emotional accessibility and connection');
    }
    if (categoryScores.cycle_awareness < 60) {
      growthAreas.push('Understanding and changing negative interaction cycles');
    }
    
    return growthAreas;
  }
  
  private static generateInsights(categoryScores: Record<string, number>, bondStrength: AttachmentBond): string[] {
    const insights: string[] = [];
    
    switch (bondStrength) {
      case 'secure_bond':
        insights.push('You have a strong emotional bond with good mutual responsiveness');
        insights.push('Continue nurturing your emotional connection through daily practices');
        break;
      case 'developing_bond':
        insights.push('Your emotional bond is developing with room for strengthening');
        insights.push('Focus on increasing emotional accessibility and responsiveness');
        break;
      case 'fragile_bond':
        insights.push('Your emotional bond needs attention and care to strengthen');
        insights.push('Work on creating safety for vulnerable emotional expression');
        break;
      case 'disconnected':
        insights.push('There\'s significant emotional disconnection that needs addressing');
        insights.push('Start with building basic emotional safety and awareness');
        break;
    }
    
    if (categoryScores.cycle_awareness < 50) {
      insights.push('Understanding your negative interaction cycles is key to change');
    }
    
    return insights;
  }
  
  private static generateInterventions(categoryScores: Record<string, number>, cycle: EmotionalCycle): string[] {
    const interventions: string[] = [];
    
    // Cycle-specific interventions
    switch (cycle) {
      case 'pursue_withdraw':
        interventions.push('The pursuing partner: Practice self-soothing and giving space');
        interventions.push('The withdrawing partner: Practice small steps toward emotional engagement');
        break;
      case 'withdraw_withdraw':
        interventions.push('Both partners: Take turns initiating emotional connection');
        interventions.push('Schedule regular emotional check-ins to prevent disconnection');
        break;
      case 'demand_defend':
        interventions.push('Practice expressing needs without criticism or blame');
        interventions.push('Focus on sharing underlying emotions rather than positions');
        break;
      case 'secure_cycle':
        interventions.push('Maintain your positive cycle through daily emotional connection');
        interventions.push('Help other couples by modeling secure attachment behaviors');
        break;
      case 'transitional':
        interventions.push('Continue building awareness of your interaction patterns');
        interventions.push('Practice new responses when old patterns emerge');
        break;
    }
    
    // Category-specific interventions
    if (categoryScores.emotional_awareness < 60) {
      interventions.push('Daily emotion identification and journaling practice');
    }
    if (categoryScores.emotional_expression < 60) {
      interventions.push('Practice expressing one vulnerable emotion daily');
    }
    if (categoryScores.emotional_responsiveness < 60) {
      interventions.push('Focus on validation before problem-solving');
    }
    
    return interventions.slice(0, 5); // Limit to top 5 interventions
  }
  
  private static generateCoupleExercises(categoryScores: Record<string, number>): string[] {
    const exercises: string[] = [];
    
    // Always include core EFT exercises
    exercises.push('Daily emotional temperature check-ins');
    exercises.push('Practice the "Hold Me Tight" conversation');
    
    if (categoryScores.cycle_awareness < 60) {
      exercises.push('Map your negative cycle together');
      exercises.push('Practice stepping out of the cycle when it starts');
    }
    
    if (categoryScores.emotional_expression < 60) {
      exercises.push('Share one fear or vulnerability weekly');
      exercises.push('Practice expressing primary emotions under secondary emotions');
    }
    
    if (categoryScores.attachment_accessibility < 60) {
      exercises.push('Create rituals for emotional connection');
      exercises.push('Practice accessibility - being emotionally available when needed');
    }
    
    return exercises.slice(0, 6); // Limit to 6 exercises
  }
}

// EFT-specific interventions organized by stage and focus
export const EFT_INTERVENTIONS = {
  stage1_cycle_deescalation: {
    awareness: [
      'Identify your negative interaction cycle',
      'Recognize emotional triggers and responses',
      'Understand how you contribute to the cycle',
      'Practice observing the cycle without judgment'
    ],
    techniques: [
      'The "demon dialogues" - criticism/defense, demand/withdraw, freeze/flee',
      'Mapping your cycle: What happens? How do you feel? What do you do?',
      'Externalization: "The cycle is the problem, not your partner"',
      'Time-outs when the cycle escalates'
    ]
  },
  
  stage2_accessing_emotions: {
    awareness: [
      'Identify primary emotions underneath secondary reactions',
      'Explore attachment fears and longings',
      'Understand emotional triggers from past experiences',
      'Develop emotional vocabulary and expression skills'
    ],
    techniques: [
      'Empty chair technique for accessing emotions',
      'Emotion identification exercises',
      'Exploring the story behind the emotion',
      'Practicing vulnerable emotional expression'
    ]
  },
  
  stage3_integration: {
    awareness: [
      'Create new interaction patterns',
      'Develop secure attachment behaviors',
      'Build lasting emotional connection',
      'Maintain positive cycles'
    ],
    techniques: [
      'Hold Me Tight conversations',
      'Creating new positive cycles',
      'Developing secure attachment rituals',
      'Forgiveness and renewal processes'
    ]
  }
};

// EFT conversation starters and emotional prompts
export const EFT_CONVERSATION_STARTERS = {
  emotional_awareness: [
    'Right now, I\'m feeling... and what I need is...',
    'When this happens between us, I feel... underneath my anger/frustration',
    'My deepest fear in our relationship is...',
    'What I long for most from you is...'
  ],
  
  cycle_awareness: [
    'When we get stuck, I usually... and then you...',
    'I notice our pattern starting when...',
    'What if we tried... instead of our usual pattern?',
    'I can see how my... triggers your...'
  ],
  
  attachment_building: [
    'I feel most connected to you when...',
    'I feel safest with you when...',
    'What I appreciate most about you is...',
    'When I think about us, I feel hopeful because...'
  ],
  
  repair_and_reconnection: [
    'I miss... about us',
    'I want to repair... between us',
    'I take responsibility for... in our cycle',
    'What I need to feel close to you again is...'
  ]
};

// Helper function to get personalized EFT recommendations
export function getEFTRecommendations(
  results: EFTResults,
  partnerResults?: EFTResults
): {
  stage: 'cycle_awareness' | 'emotion_access' | 'integration';
  individualWork: string[];
  coupleWork: string[];
  conversationStarters: string[];
  weeklyFocus: string;
} {
  // Determine EFT stage based on scores
  let stage: 'cycle_awareness' | 'emotion_access' | 'integration' = 'cycle_awareness';
  
  if (results.category_scores.cycle_awareness >= 60) {
    if (results.category_scores.emotional_expression >= 60) {
      stage = 'integration';
    } else {
      stage = 'emotion_access';
    }
  }
  
  const individualWork: string[] = [];
  const coupleWork: string[] = [];
  
  // Stage-specific recommendations
  switch (stage) {
    case 'cycle_awareness':
      individualWork.push('Practice identifying your emotions during conflicts');
      individualWork.push('Notice your typical responses in the negative cycle');
      coupleWork.push('Map your negative interaction cycle together');
      coupleWork.push('Practice calling out the cycle when it starts');
      break;
      
    case 'emotion_access':
      individualWork.push('Explore primary emotions underneath your reactions');
      individualWork.push('Practice expressing vulnerable emotions safely');
      coupleWork.push('Share one fear or longing weekly');
      coupleWork.push('Practice emotional validation and responsiveness');
      break;
      
    case 'integration':
      individualWork.push('Maintain emotional awareness and expression');
      individualWork.push('Continue developing secure attachment behaviors');
      coupleWork.push('Create positive interaction cycles');
      coupleWork.push('Develop daily connection rituals');
      break;
  }
  
  const conversationStarters = EFT_CONVERSATION_STARTERS[
    stage === 'cycle_awareness' ? 'cycle_awareness' :
    stage === 'emotion_access' ? 'emotional_awareness' :
    'attachment_building'
  ];
  
  const weeklyFocus = 
    stage === 'cycle_awareness' ? 'Understanding and interrupting negative cycles' :
    stage === 'emotion_access' ? 'Accessing and expressing primary emotions' :
    'Building secure attachment and positive cycles';
  
  return {
    stage,
    individualWork,
    coupleWork,
    conversationStarters,
    weeklyFocus
  };
}