/**
 * CBT (Cognitive Behavioral Therapy) Assessment System
 * Focuses on identifying thought patterns, cognitive distortions, and behavioral cycles
 * in relationship dynamics
 */

import type { CBTResults, CBTQuestion, CognitiveDistortion, ThoughtPattern } from '@/types';

// CBT assessment questions focusing on relationship-specific thought patterns
export const CBT_QUESTIONS: CBTQuestion[] = [
  // Catastrophizing patterns
  {
    id: 'cbt_01',
    text: 'When my partner seems distant, I immediately think our relationship is in trouble.',
    category: 'catastrophizing',
    reverse_scored: false
  },
  {
    id: 'cbt_02', 
    text: 'If my partner doesn\'t respond to my text quickly, I assume they\'re upset with me.',
    category: 'catastrophizing',
    reverse_scored: false
  },
  {
    id: 'cbt_03',
    text: 'I can usually find logical explanations for my partner\'s behavior.',
    category: 'catastrophizing',
    reverse_scored: true
  },

  // Mind reading patterns
  {
    id: 'cbt_04',
    text: 'I often think I know what my partner is thinking without asking them.',
    category: 'mind_reading',
    reverse_scored: false
  },
  {
    id: 'cbt_05',
    text: 'I assume my partner should know how I\'m feeling without me telling them.',
    category: 'mind_reading',
    reverse_scored: false
  },
  {
    id: 'cbt_06',
    text: 'I check with my partner before assuming what they mean.',
    category: 'mind_reading',
    reverse_scored: true
  },

  // All-or-nothing thinking
  {
    id: 'cbt_07',
    text: 'When we have a disagreement, I think our whole relationship is problematic.',
    category: 'all_or_nothing',
    reverse_scored: false
  },
  {
    id: 'cbt_08',
    text: 'I see my partner as either perfect or terrible, with little in between.',
    category: 'all_or_nothing',
    reverse_scored: false
  },
  {
    id: 'cbt_09',
    text: 'I can see both my partner\'s strengths and areas for growth.',
    category: 'all_or_nothing',
    reverse_scored: true
  },

  // Emotional reasoning
  {
    id: 'cbt_10',
    text: 'If I feel unloved, I assume my partner doesn\'t love me.',
    category: 'emotional_reasoning',
    reverse_scored: false
  },
  {
    id: 'cbt_11',
    text: 'My emotions about the relationship are always accurate indicators of reality.',
    category: 'emotional_reasoning',
    reverse_scored: false
  },
  {
    id: 'cbt_12',
    text: 'I recognize that my feelings might not always reflect the actual situation.',
    category: 'emotional_reasoning',
    reverse_scored: true
  },

  // Personalization
  {
    id: 'cbt_13',
    text: 'When my partner is in a bad mood, I assume it\'s because of something I did.',
    category: 'personalization',
    reverse_scored: false
  },
  {
    id: 'cbt_14',
    text: 'I blame myself for most problems in our relationship.',
    category: 'personalization',
    reverse_scored: false
  },
  {
    id: 'cbt_15',
    text: 'I understand that my partner\'s moods can be influenced by many factors.',
    category: 'personalization',
    reverse_scored: true
  },

  // Should statements
  {
    id: 'cbt_16',
    text: 'I often think about how my partner "should" behave in our relationship.',
    category: 'should_statements',
    reverse_scored: false
  },
  {
    id: 'cbt_17',
    text: 'I get frustrated when my partner doesn\'t meet my expectations.',
    category: 'should_statements',
    reverse_scored: false
  },
  {
    id: 'cbt_18',
    text: 'I accept that my partner and I have different ways of showing love.',
    category: 'should_statements',
    reverse_scored: true
  },

  // Mental filtering
  {
    id: 'cbt_19',
    text: 'I tend to focus on the negative things in our relationship.',
    category: 'mental_filtering',
    reverse_scored: false
  },
  {
    id: 'cbt_20',
    text: 'When my partner does something nice, I dismiss it as not that important.',
    category: 'mental_filtering',
    reverse_scored: false
  },
  {
    id: 'cbt_21',
    text: 'I make an effort to notice and appreciate positive moments with my partner.',
    category: 'mental_filtering',
    reverse_scored: true
  }
];

// CBT assessment scorer
export class CBTAssessmentScorer {
  static calculateScores(responses: Record<string, number>): CBTResults {
    const categories = ['catastrophizing', 'mind_reading', 'all_or_nothing', 'emotional_reasoning', 'personalization', 'should_statements', 'mental_filtering'];
    
    const categoryScores: Record<string, number> = {};
    const distortionLevels: Record<string, 'low' | 'moderate' | 'high'> = {};
    
    // Calculate scores for each cognitive distortion category
    for (const category of categories) {
      const categoryQuestions = CBT_QUESTIONS.filter(q => q.category === category);
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
      
      // Determine distortion level
      if (averageScore <= 2.5) {
        distortionLevels[category] = 'low';
      } else if (averageScore <= 4.5) {
        distortionLevels[category] = 'moderate';
      } else {
        distortionLevels[category] = 'high';
      }
    }
    
    // Calculate overall cognitive flexibility score (inverse of distortion)
    const overallDistortion = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / categories.length;
    const cognitiveFlexibilityScore = Math.round(100 - overallDistortion);
    
    // Identify primary distortions (highest scores)
    const primaryDistortions = Object.entries(categoryScores)
      .filter(([_, score]) => score > 60)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([category, _]) => category as CognitiveDistortion);
    
    return {
      cognitive_flexibility_score: cognitiveFlexibilityScore,
      primary_distortions: primaryDistortions,
      category_scores: categoryScores,
      distortion_levels: distortionLevels,
      thought_patterns: this.identifyThoughtPatterns(categoryScores),
      interventions: this.generateInterventions(primaryDistortions, cognitiveFlexibilityScore),
      strengths: this.identifyStrengths(categoryScores),
      growth_areas: this.identifyGrowthAreas(primaryDistortions)
    };
  }
  
  private static identifyThoughtPatterns(categoryScores: Record<string, number>): ThoughtPattern[] {
    const patterns: ThoughtPattern[] = [];
    
    if (categoryScores.catastrophizing > 70) {
      patterns.push('worst_case_thinking');
    }
    if (categoryScores.mind_reading > 70) {
      patterns.push('assumption_making');
    }
    if (categoryScores.all_or_nothing > 70) {
      patterns.push('black_white_thinking');
    }
    if (categoryScores.emotional_reasoning > 70) {
      patterns.push('emotion_as_fact');
    }
    if (categoryScores.personalization > 70) {
      patterns.push('self_blame');
    }
    if (categoryScores.should_statements > 70) {
      patterns.push('rigid_expectations');
    }
    if (categoryScores.mental_filtering > 70) {
      patterns.push('negative_focus');
    }
    
    return patterns;
  }
  
  private static generateInterventions(
    primaryDistortions: CognitiveDistortion[], 
    flexibilityScore: number
  ): string[] {
    const interventions: string[] = [];
    
    if (flexibilityScore < 50) {
      interventions.push('Daily thought record practice to identify and challenge negative thoughts');
      interventions.push('Mindfulness meditation to create space between thoughts and reactions');
    }
    
    for (const distortion of primaryDistortions) {
      switch (distortion) {
        case 'catastrophizing':
          interventions.push('Practice asking "What\'s the most likely outcome?" instead of worst-case scenarios');
          break;
        case 'mind_reading':
          interventions.push('Use "I" statements and ask clarifying questions instead of assuming');
          break;
        case 'all_or_nothing':
          interventions.push('Look for the gray areas and practice seeing partial positives');
          break;
        case 'emotional_reasoning':
          interventions.push('Fact-check your emotions: "I feel X, but what\'s the evidence?"');
          break;
        case 'personalization':
          interventions.push('Consider external factors that might influence your partner\'s behavior');
          break;
        case 'should_statements':
          interventions.push('Replace "should" with "prefer" or "would like" in your thoughts');
          break;
        case 'mental_filtering':
          interventions.push('Daily gratitude practice to balance focus on positives');
          break;
      }
    }
    
    return interventions;
  }
  
  private static identifyStrengths(categoryScores: Record<string, number>): string[] {
    const strengths: string[] = [];
    
    if (categoryScores.catastrophizing < 40) {
      strengths.push('Realistic thinking and problem-solving approach');
    }
    if (categoryScores.mind_reading < 40) {
      strengths.push('Good communication and verification skills');
    }
    if (categoryScores.all_or_nothing < 40) {
      strengths.push('Balanced perspective and nuanced thinking');
    }
    if (categoryScores.emotional_reasoning < 40) {
      strengths.push('Ability to separate emotions from facts');
    }
    if (categoryScores.personalization < 40) {
      strengths.push('Healthy boundaries and realistic responsibility');
    }
    if (categoryScores.should_statements < 40) {
      strengths.push('Flexible expectations and acceptance');
    }
    if (categoryScores.mental_filtering < 40) {
      strengths.push('Balanced attention to positives and negatives');
    }
    
    return strengths.length > 0 ? strengths : ['Open to growth and self-awareness'];
  }
  
  private static identifyGrowthAreas(primaryDistortions: CognitiveDistortion[]): string[] {
    const growthAreas: string[] = [];
    
    for (const distortion of primaryDistortions) {
      switch (distortion) {
        case 'catastrophizing':
          growthAreas.push('Developing realistic thinking patterns');
          break;
        case 'mind_reading':
          growthAreas.push('Improving communication and clarification skills');
          break;
        case 'all_or_nothing':
          growthAreas.push('Practicing nuanced, balanced perspectives');
          break;
        case 'emotional_reasoning':
          growthAreas.push('Learning to separate feelings from facts');
          break;
        case 'personalization':
          growthAreas.push('Building healthy boundaries and realistic responsibility');
          break;
        case 'should_statements':
          growthAreas.push('Developing flexible expectations and acceptance');
          break;
        case 'mental_filtering':
          growthAreas.push('Cultivating balanced attention and gratitude');
          break;
      }
    }
    
    return growthAreas;
  }
}

// CBT-specific interventions and exercises
export const CBT_INTERVENTIONS = {
  catastrophizing: {
    techniques: [
      'Probability estimation: Ask "What\'s the actual likelihood of this happening?"',
      'Evidence gathering: List evidence for and against your feared outcome',
      'Best/worst/most likely: Consider three scenarios instead of just the worst',
      'Decatastrophizing: "Even if this happens, how would I cope?"'
    ],
    exercises: [
      'Daily thought record for catastrophic thoughts',
      'Worry time: Schedule 15 minutes daily for worrying, dismiss worries outside this time',
      'Create a "cope ahead" plan for your most feared relationship scenarios'
    ]
  },
  
  mind_reading: {
    techniques: [
      'Fact vs. interpretation: Separate what you observe from what you assume',
      'Alternative explanations: Generate 3 different reasons for your partner\'s behavior',
      'Direct communication: Ask instead of assuming',
      'Empathy check: Consider your partner\'s perspective and current stressors'
    ],
    exercises: [
      'Daily assumption tracking: Notice when you\'re mind-reading',
      'Clarification practice: Ask "What do you mean by..." or "Help me understand..."',
      'Perspective-taking exercise: Write your partner\'s possible viewpoint'
    ]
  },
  
  all_or_nothing: {
    techniques: [
      'Gray area thinking: Look for the middle ground',
      'Percentage thinking: Rate situations on a 0-100% scale instead of all/nothing',
      'Both/and thinking: "My partner can be loving AND have bad days"',
      'Progress recognition: Notice partial improvements and small steps'
    ],
    exercises: [
      'Daily gray area journal: Find one nuanced perspective daily',
      'Relationship positives list: Notice mixed or partial positive interactions',
      'Progress tracking: Celebrate small improvements in relationship patterns'
    ]
  },
  
  emotional_reasoning: {
    techniques: [
      'Fact-checking emotions: "I feel X, but what\'s the evidence?"',
      'Emotion vs. reality check: "My feelings are valid, but are they accurate?"',
      'Mood awareness: Notice how different moods affect your perceptions',
      'External validation: Check your perceptions with trusted friends or your partner'
    ],
    exercises: [
      'Emotion-fact separation log: Daily practice distinguishing feelings from facts',
      'Mood tracking: Notice how your relationship perceptions change with your mood',
      'Reality testing: Before reacting, gather evidence for your emotional conclusions'
    ]
  },
  
  personalization: {
    techniques: [
      'Responsibility pie chart: Divide responsibility among all relevant factors',
      'External factor brainstorming: List non-personal reasons for events',
      'Influence vs. control: Focus on what you can actually influence',
      'Partner empathy: Consider their independent experiences and stressors'
    ],
    exercises: [
      'Daily responsibility check: Question automatic self-blame',
      'External factor list: When upset, list 5 non-personal explanations',
      'Influence mapping: Identify what\'s in your control vs. not in relationship issues'
    ]
  },
  
  should_statements: {
    techniques: [
      'Language swap: Replace "should" with "prefer," "would like," or "hope"',
      'Expectation reality check: Are your expectations realistic and fair?',
      'Flexibility practice: Accept different ways of showing love and care',
      'Value vs. rule distinction: Focus on underlying values rather than rigid rules'
    ],
    exercises: [
      'Should statement log: Track and reframe "should" thoughts daily',
      'Expectation inventory: List relationship expectations and evaluate their fairness',
      'Preference expression: Practice stating preferences without demands'
    ]
  },
  
  mental_filtering: {
    techniques: [
      'Balanced thinking: For every negative, find one positive',
      'Full picture review: Actively look for what\'s going well',
      'Gratitude practice: Daily appreciation for relationship positives',
      'Attention training: Consciously redirect focus to balanced observations'
    ],
    exercises: [
      'Daily relationship gratitude: Three things you appreciate about your partner',
      'Positive interaction tracking: Notice and record positive moments',
      'Balanced day review: Each evening, note both challenges and positives'
    ]
  }
};

// Helper function to get personalized CBT recommendations
export function getCBTRecommendations(
  results: CBTResults,
  partnerResults?: CBTResults
): {
  individualWork: string[];
  coupleWork: string[];
  weeklyPractices: string[];
} {
  const individualWork: string[] = [];
  const coupleWork: string[] = [];
  const weeklyPractices: string[] = [];
  
  // Individual recommendations based on primary distortions
  for (const distortion of results.primary_distortions) {
    const interventions = CBT_INTERVENTIONS[distortion];
    individualWork.push(interventions.techniques[0]); // Primary technique
    weeklyPractices.push(interventions.exercises[0]); // Primary exercise
  }
  
  // Couple work recommendations
  if (results.cognitive_flexibility_score < 70) {
    coupleWork.push('Practice daily check-ins using "I feel" statements');
    coupleWork.push('Weekly thought challenging exercises together');
  }
  
  if (results.primary_distortions.includes('mind_reading')) {
    coupleWork.push('Clarification practice: Ask before assuming your partner\'s thoughts');
  }
  
  if (results.primary_distortions.includes('catastrophizing')) {
    coupleWork.push('Reality-check catastrophic thoughts together');
  }
  
  // Partner-specific recommendations
  if (partnerResults) {
    const commonDistortions = results.primary_distortions.filter(d => 
      partnerResults.primary_distortions.includes(d)
    );
    
    if (commonDistortions.length > 0) {
      coupleWork.push(`Both work on ${commonDistortions[0]} patterns together`);
    }
  }
  
  return {
    individualWork: individualWork.length > 0 ? individualWork : ['Continue developing self-awareness'],
    coupleWork: coupleWork.length > 0 ? coupleWork : ['Practice daily appreciation and positive communication'],
    weeklyPractices: weeklyPractices.length > 0 ? weeklyPractices : ['Daily thought record practice']
  };
}