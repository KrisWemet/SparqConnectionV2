/**
 * ACT (Acceptance and Commitment Therapy) Assessment System
 * Focuses on psychological flexibility, values alignment, and mindful action
 * in relationship contexts based on ACT principles
 */

import type { ACTResults, ACTQuestion, ACTFlexibilityProcess, PersonalValue } from '@/types';

// ACT assessment questions across the six core flexibility processes
export const ACT_QUESTIONS: ACTQuestion[] = [
  // Present Moment Awareness (Mindfulness)
  {
    id: 'act_01',
    text: 'I am fully present when spending time with my partner.',
    process: 'present_moment',
    reverse_scored: false
  },
  {
    id: 'act_02',
    text: 'I often find my mind wandering during conversations with my partner.',
    process: 'present_moment',
    reverse_scored: true
  },
  {
    id: 'act_03',
    text: 'I notice when I\'m not being present in my relationship.',
    process: 'present_moment',
    reverse_scored: false
  },
  {
    id: 'act_04',
    text: 'I can focus on what\'s happening right now in our relationship.',
    process: 'present_moment',
    reverse_scored: false
  },

  // Acceptance
  {
    id: 'act_05',
    text: 'I can accept difficult emotions in my relationship without fighting them.',
    process: 'acceptance',
    reverse_scored: false
  },
  {
    id: 'act_06',
    text: 'I struggle against uncomfortable feelings about my relationship.',
    process: 'acceptance',
    reverse_scored: true
  },
  {
    id: 'act_07',
    text: 'I allow myself to feel whatever comes up about my relationship.',
    process: 'acceptance',
    reverse_scored: false
  },
  {
    id: 'act_08',
    text: 'I try to avoid or push away negative emotions about my partner.',
    process: 'acceptance',
    reverse_scored: true
  },

  // Cognitive Defusion (Observing Thoughts)
  {
    id: 'act_09',
    text: 'I can observe my thoughts about my relationship without being controlled by them.',
    process: 'defusion',
    reverse_scored: false
  },
  {
    id: 'act_10',
    text: 'I get caught up in negative thoughts about my partner.',
    process: 'defusion',
    reverse_scored: true
  },
  {
    id: 'act_11',
    text: 'I recognize that my thoughts about my relationship are just thoughts, not facts.',
    process: 'defusion',
    reverse_scored: false
  },
  {
    id: 'act_12',
    text: 'I step back and observe my mind during relationship conflicts.',
    process: 'defusion',
    reverse_scored: false
  },

  // Self as Context (Observer Self)
  {
    id: 'act_13',
    text: 'I have a stable sense of who I am in my relationship.',
    process: 'self_as_context',
    reverse_scored: false
  },
  {
    id: 'act_14',
    text: 'My sense of self depends on how well my relationship is going.',
    process: 'self_as_context',
    reverse_scored: true
  },
  {
    id: 'act_15',
    text: 'I can observe my relationship experiences without losing myself.',
    process: 'self_as_context',
    reverse_scored: false
  },
  {
    id: 'act_16',
    text: 'I maintain my identity while being close to my partner.',
    process: 'self_as_context',
    reverse_scored: false
  },

  // Values Clarity and Alignment
  {
    id: 'act_17',
    text: 'I am clear about what matters most to me in relationships.',
    process: 'values',
    reverse_scored: false
  },
  {
    id: 'act_18',
    text: 'I act according to my values even when it\'s difficult in my relationship.',
    process: 'values',
    reverse_scored: false
  },
  {
    id: 'act_19',
    text: 'I often do things in my relationship that go against what I value.',
    process: 'values',
    reverse_scored: true
  },
  {
    id: 'act_20',
    text: 'My relationship choices align with my deepest values.',
    process: 'values',
    reverse_scored: false
  },

  // Committed Action
  {
    id: 'act_21',
    text: 'I take action toward my relationship goals even when I feel afraid.',
    process: 'committed_action',
    reverse_scored: false
  },
  {
    id: 'act_22',
    text: 'I avoid doing things in my relationship when they feel uncomfortable.',
    process: 'committed_action',
    reverse_scored: true
  },
  {
    id: 'act_23',
    text: 'I persist in working on my relationship even when progress is slow.',
    process: 'committed_action',
    reverse_scored: false
  },
  {
    id: 'act_24',
    text: 'I follow through on commitments I make to my partner.',
    process: 'committed_action',
    reverse_scored: false
  }
];

// Core relationship values for assessment
export const RELATIONSHIP_VALUES: PersonalValue[] = [
  { id: 'love', name: 'Love', description: 'Expressing and receiving love deeply' },
  { id: 'trust', name: 'Trust', description: 'Building and maintaining trust' },
  { id: 'honesty', name: 'Honesty', description: 'Being truthful and authentic' },
  { id: 'commitment', name: 'Commitment', description: 'Dedicating yourself to the relationship' },
  { id: 'growth', name: 'Growth', description: 'Growing individually and together' },
  { id: 'fun', name: 'Fun', description: 'Enjoying life and playing together' },
  { id: 'intimacy', name: 'Intimacy', description: 'Emotional and physical closeness' },
  { id: 'respect', name: 'Respect', description: 'Treating each other with dignity' },
  { id: 'support', name: 'Support', description: 'Being there for each other' },
  { id: 'independence', name: 'Independence', description: 'Maintaining individual identity' },
  { id: 'adventure', name: 'Adventure', description: 'Exploring and trying new things together' },
  { id: 'stability', name: 'Stability', description: 'Creating a secure, predictable foundation' },
  { id: 'communication', name: 'Communication', description: 'Open, honest dialogue' },
  { id: 'compassion', name: 'Compassion', description: 'Showing kindness and understanding' },
  { id: 'spirituality', name: 'Spirituality', description: 'Sharing spiritual or meaningful practices' }
];

// ACT assessment scorer
export class ACTAssessmentScorer {
  static calculateScores(
    responses: Record<string, number>,
    valueRankings?: Record<string, number>
  ): ACTResults {
    const processes: ACTFlexibilityProcess[] = [
      'present_moment', 'acceptance', 'defusion', 'self_as_context', 'values', 'committed_action'
    ];
    
    const processScores: Record<ACTFlexibilityProcess, number> = {} as Record<ACTFlexibilityProcess, number>;
    
    // Calculate scores for each psychological flexibility process
    for (const process of processes) {
      const processQuestions = ACT_QUESTIONS.filter(q => q.process === process);
      let totalScore = 0;
      let validResponses = 0;
      
      for (const question of processQuestions) {
        const response = responses[question.id];
        if (response !== undefined) {
          const score = question.reverse_scored ? (8 - response) : response;
          totalScore += score;
          validResponses++;
        }
      }
      
      const averageScore = validResponses > 0 ? totalScore / validResponses : 0;
      processScores[process] = Math.round(averageScore * 100 / 7); // Convert to 0-100 scale
    }
    
    // Calculate overall psychological flexibility score
    const overallFlexibility = Math.round(
      Object.values(processScores).reduce((sum, score) => sum + score, 0) / processes.length
    );
    
    // Identify strengths and growth areas
    const sortedProcesses = Object.entries(processScores).sort(([, a], [, b]) => b - a);
    const strengths = sortedProcesses.slice(0, 2).map(([process]) => process as ACTFlexibilityProcess);
    const growthAreas = sortedProcesses.slice(-2).map(([process]) => process as ACTFlexibilityProcess);
    
    // Calculate values alignment score
    const valuesScore = processScores.values;
    const valuesAlignmentLevel = this.determineValuesAlignment(valuesScore);
    
    // Identify primary values from rankings
    const primaryValues = valueRankings ? 
      Object.entries(valueRankings)
        .sort(([, a], [, b]) => a - b) // Lower rank = higher priority
        .slice(0, 5)
        .map(([value]) => value) : [];
    
    return {
      overall_psychological_flexibility: overallFlexibility,
      process_scores: processScores,
      flexibility_strengths: strengths,
      growth_areas: growthAreas,
      values_alignment_score: valuesScore,
      values_alignment_level: valuesAlignmentLevel,
      primary_values: primaryValues,
      act_interventions: this.generateInterventions(processScores, growthAreas),
      values_exercises: this.generateValuesExercises(primaryValues, valuesScore),
      mindfulness_practices: this.generateMindfulnessPractices(processScores),
      flexibility_goals: this.generateFlexibilityGoals(growthAreas, processScores)
    };
  }
  
  private static determineValuesAlignment(valuesScore: number): 'low' | 'moderate' | 'high' | 'very_high' {
    if (valuesScore >= 85) return 'very_high';
    if (valuesScore >= 70) return 'high';
    if (valuesScore >= 50) return 'moderate';
    return 'low';
  }
  
  private static generateInterventions(
    processScores: Record<ACTFlexibilityProcess, number>,
    growthAreas: ACTFlexibilityProcess[]
  ): string[] {
    const interventions: string[] = [];
    
    for (const area of growthAreas) {
      switch (area) {
        case 'present_moment':
          interventions.push('Practice mindful presence during daily interactions with your partner');
          interventions.push('Use the 5-4-3-2-1 grounding technique during relationship stress');
          break;
        case 'acceptance':
          interventions.push('Practice allowing difficult emotions without trying to change them');
          interventions.push('Use the RAIN technique (Recognize, Allow, Investigate, Nurture)');
          break;
        case 'defusion':
          interventions.push('Label thoughts as "having the thought that..." during conflicts');
          interventions.push('Practice observing your mental chatter without believing every thought');
          break;
        case 'self_as_context':
          interventions.push('Develop a stable sense of self independent of relationship outcomes');
          interventions.push('Practice self-compassion and maintaining identity within relationships');
          break;
        case 'values':
          interventions.push('Clarify and prioritize your core relationship values');
          interventions.push('Make daily choices that align with your identified values');
          break;
        case 'committed_action':
          interventions.push('Set specific, values-based goals for your relationship');
          interventions.push('Take small daily actions toward your relationship goals');
          break;
      }
    }
    
    return interventions.slice(0, 6); // Limit to top 6 interventions
  }
  
  private static generateValuesExercises(primaryValues: string[], valuesScore: number): string[] {
    const exercises: string[] = [];
    
    if (valuesScore < 60) {
      exercises.push('Complete a comprehensive values clarification exercise');
      exercises.push('Write about why your top values matter to you personally');
    }
    
    exercises.push('Rate how well you\'re living your values daily (1-10 scale)');
    exercises.push('Plan one values-based action for your relationship each week');
    
    if (primaryValues.length > 0) {
      exercises.push(`Focus especially on living your top value: ${primaryValues[0]}`);
    }
    
    exercises.push('Share your core values with your partner and discuss alignment');
    
    return exercises;
  }
  
  private static generateMindfulnessPractices(
    processScores: Record<ACTFlexibilityProcess, number>
  ): string[] {
    const practices: string[] = [];
    
    if (processScores.present_moment < 60) {
      practices.push('5-minute daily mindfulness meditation');
      practices.push('Mindful listening practice with your partner');
    }
    
    practices.push('Body scan before important relationship conversations');
    practices.push('Mindful appreciation - notice three things you appreciate about your partner daily');
    
    if (processScores.acceptance < 60) {
      practices.push('Loving-kindness meditation for yourself and your partner');
    }
    
    if (processScores.defusion < 60) {
      practices.push('Observing thoughts meditation - watch thoughts without judgment');
    }
    
    return practices.slice(0, 5);
  }
  
  private static generateFlexibilityGoals(
    growthAreas: ACTFlexibilityProcess[],
    processScores: Record<ACTFlexibilityProcess, number>
  ): string[] {
    const goals: string[] = [];
    
    for (const area of growthAreas) {
      const currentScore = processScores[area];
      const targetScore = Math.min(currentScore + 20, 90); // Aim for 20-point improvement, max 90
      
      switch (area) {
        case 'present_moment':
          goals.push(`Increase present-moment awareness from ${currentScore} to ${targetScore}`);
          break;
        case 'acceptance':
          goals.push(`Improve acceptance of difficult emotions from ${currentScore} to ${targetScore}`);
          break;
        case 'defusion':
          goals.push(`Enhance cognitive defusion skills from ${currentScore} to ${targetScore}`);
          break;
        case 'self_as_context':
          goals.push(`Strengthen stable sense of self from ${currentScore} to ${targetScore}`);
          break;
        case 'values':
          goals.push(`Increase values clarity and alignment from ${currentScore} to ${targetScore}`);
          break;
        case 'committed_action':
          goals.push(`Improve committed action toward goals from ${currentScore} to ${targetScore}`);
          break;
      }
    }
    
    return goals;
  }
}

// ACT-specific interventions and exercises
export const ACT_INTERVENTIONS = {
  present_moment: {
    daily_practices: [
      'Mindful morning ritual with your partner',
      'Present-moment check-ins during conversations',
      '5-4-3-2-1 grounding technique when feeling disconnected',
      'Mindful appreciation practice'
    ],
    exercises: [
      'Mindful listening exercise - 5 minutes of full presence',
      'Present-moment awareness during physical affection',
      'Mindful walking or activity together',
      'Notice and return to the present when mind wanders'
    ]
  },
  
  acceptance: {
    daily_practices: [
      'Allow difficult emotions without immediate problem-solving',
      'Practice self-compassion during relationship challenges',
      'Accept your partner\'s emotions without trying to fix them',
      'RAIN technique for difficult emotions'
    ],
    exercises: [
      'Loving-kindness meditation for yourself and your partner',
      'Acceptance of imperfection in yourself and your relationship',
      'Sitting with discomfort exercise',
      'Radical acceptance practice during conflicts'
    ]
  },
  
  defusion: {
    daily_practices: [
      'Label thoughts as "I\'m having the thought that..."',
      'Notice when you\'re caught in mental stories about your partner',
      'Practice observing thoughts without believing them',
      'Use humor to defuse from sticky thoughts'
    ],
    exercises: [
      'Thoughts on leaves meditation',
      'Silly voices technique for negative thoughts',
      'Mindful observation of mental chatter',
      'Defusion from relationship "shoulds" and "musts"'
    ]
  },
  
  self_as_context: {
    daily_practices: [
      'Connect with your observing self during emotional moments',
      'Maintain sense of identity while being intimate',
      'Practice self-compassion and stable self-regard',
      'Balance autonomy and connection'
    ],
    exercises: [
      'Observer self meditation',
      'Identity values exercise - who are you at your core?',
      'Self-compassion break during relationship stress',
      'Perspective-taking exercise - observe your experience'
    ]
  },
  
  values: {
    daily_practices: [
      'Make one choice aligned with your core values',
      'Check decisions against your relationship values',
      'Share your values through actions, not just words',
      'Reflect on values alignment at end of day'
    ],
    exercises: [
      'Values card sort for relationship priorities',
      'Values eulogy - how do you want to be remembered as a partner?',
      'Values-based goal setting for your relationship',
      'Values and barriers exploration'
    ]
  },
  
  committed_action: {
    daily_practices: [
      'Take one small step toward relationship goals',
      'Follow through on commitments to your partner',
      'Persist through discomfort toward values-based actions',
      'Plan specific actions aligned with relationship values'
    ],
    exercises: [
      'SMART goals setting for relationship growth',
      'Values-based action planning',
      'Commitment and barrier identification',
      'Behavioral activation for relationship engagement'
    ]
  }
};

// Helper function to get personalized ACT recommendations
export function getACTRecommendations(
  results: ACTResults,
  partnerResults?: ACTResults
): {
  weeklyFocus: string;
  dailyPractices: string[];
  valuesWork: string[];
  flexibilityGoals: string[];
  coupleExercises: string[];
} {
  const primaryGrowthArea = results.growth_areas[0];
  const interventions = ACT_INTERVENTIONS[primaryGrowthArea];
  
  const weeklyFocus = `Focus on ${primaryGrowthArea.replace('_', ' ')} - ${getProcessDescription(primaryGrowthArea)}`;
  
  const recommendations = {
    weeklyFocus,
    dailyPractices: interventions.daily_practices.slice(0, 3),
    valuesWork: results.values_exercises.slice(0, 3),
    flexibilityGoals: results.flexibility_goals.slice(0, 2),
    coupleExercises: ['Values sharing conversation', 'Mindful appreciation practice']
  };
  
  // Add partner-specific recommendations
  if (partnerResults) {
    const sharedGrowthAreas = results.growth_areas.filter(area => 
      partnerResults.growth_areas.includes(area)
    );
    
    if (sharedGrowthAreas.length > 0) {
      recommendations.coupleExercises.push(`Both work on ${sharedGrowthAreas[0].replace('_', ' ')} together`);
    }
    
    const sharedValues = results.primary_values.filter(value => 
      partnerResults.primary_values.includes(value)
    );
    
    if (sharedValues.length > 0) {
      recommendations.coupleExercises.push(`Explore shared value: ${sharedValues[0]}`);
    }
  }
  
  return recommendations;
}

// Helper function to get process descriptions
function getProcessDescription(process: ACTFlexibilityProcess): string {
  const descriptions = {
    present_moment: 'Being fully present and aware in your relationship',
    acceptance: 'Allowing difficult emotions and experiences without struggle',
    defusion: 'Observing thoughts without being controlled by them',
    self_as_context: 'Maintaining a stable sense of self while being intimate',
    values: 'Living according to what matters most to you in relationships',
    committed_action: 'Taking consistent action toward your relationship goals'
  };
  
  return descriptions[process];
}