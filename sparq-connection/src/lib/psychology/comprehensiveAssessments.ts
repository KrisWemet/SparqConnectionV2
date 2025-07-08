/**
 * Comprehensive Psychology Assessments
 * Simplified implementations of Mindfulness, Positive Psychology, and Somatic Therapy
 * for the Sparq Connection relationship platform
 */

import type { 
  MindfulnessResults, 
  PositivePsychologyResults, 
  SomaticResults,
  CharacterStrength,
  SomaticAwareness
} from '@/types';

// MINDFULNESS ASSESSMENT
export const MINDFULNESS_QUESTIONS = [
  { id: 'mind_01', text: 'I pay attention to how emotions feel in my body during relationship interactions.', reverse: false },
  { id: 'mind_02', text: 'I notice when my mind wanders during conversations with my partner.', reverse: false },
  { id: 'mind_03', text: 'I can observe my thoughts and feelings without being overwhelmed by them.', reverse: false },
  { id: 'mind_04', text: 'I tend to rush through activities without being fully present.', reverse: true },
  { id: 'mind_05', text: 'I am aware of my breathing when I feel stressed about my relationship.', reverse: false },
  { id: 'mind_06', text: 'I notice the small details in my interactions with my partner.', reverse: false },
  { id: 'mind_07', text: 'I often react automatically without thinking during conflicts.', reverse: true },
  { id: 'mind_08', text: 'I can step back and observe my relationship patterns.', reverse: false }
];

export function scoreMindfulnessAssessment(responses: Record<string, number>): MindfulnessResults {
  let totalScore = 0;
  let validResponses = 0;

  for (const question of MINDFULNESS_QUESTIONS) {
    const response = responses[question.id];
    if (response !== undefined) {
      const score = question.reverse ? (8 - response) : response;
      totalScore += score;
      validResponses++;
    }
  }

  const averageScore = validResponses > 0 ? totalScore / validResponses : 0;
  const mindfulnessScore = Math.round(averageScore * 100 / 7);

  const level = 
    mindfulnessScore >= 80 ? 'high' :
    mindfulnessScore >= 60 ? 'moderate' :
    mindfulnessScore >= 40 ? 'developing' : 'beginning';

  return {
    mindfulness_score: mindfulnessScore,
    mindfulness_level: level,
    present_moment_awareness: Math.round(mindfulnessScore * 0.9), // Slightly lower for specific skill
    non_judgmental_awareness: Math.round(mindfulnessScore * 0.95),
    body_awareness: Math.round(mindfulnessScore * 0.85),
    recommended_practices: getMindfulnessPractices(level),
    daily_exercises: getDailyMindfulnessExercises(level),
    relationship_applications: getMindfulnessRelationshipApps(level)
  };
}

function getMindfulnessPractices(level: string): string[] {
  const practices = {
    beginning: [
      'Start with 3-5 minute breathing meditations',
      'Practice mindful listening with your partner for 2 minutes daily',
      'Body scan before important conversations',
      'Mindful eating together once per week'
    ],
    developing: [
      '10-15 minute daily meditation practice',
      'Mindful walking or movement together',
      'Present-moment check-ins during the day',
      'Mindful appreciation practice'
    ],
    moderate: [
      'Longer meditation sessions (20+ minutes)',
      'Mindfulness during conflict resolution',
      'Teaching mindfulness to your partner',
      'Integrating mindfulness into daily routines'
    ],
    high: [
      'Advanced mindfulness practices',
      'Mindful leadership in your relationship',
      'Creating mindful rituals together',
      'Supporting others in mindfulness development'
    ]
  };
  return practices[level as keyof typeof practices] || practices.beginning;
}

function getDailyMindfulnessExercises(level: string): string[] {
  return [
    'Morning intention setting with your partner',
    'Mindful transition rituals between activities',
    'Evening gratitude and reflection practice',
    'Mindful physical affection',
    'Present-moment appreciation breaks'
  ];
}

function getMindfulnessRelationshipApps(level: string): string[] {
  return [
    'Mindful listening without planning responses',
    'Present-moment awareness during conflicts',
    'Mindful expression of emotions',
    'Non-judgmental observation of relationship patterns',
    'Mindful decision-making about relationship issues'
  ];
}

// POSITIVE PSYCHOLOGY ASSESSMENT
export const CHARACTER_STRENGTHS: CharacterStrength[] = [
  { id: 'appreciation_of_beauty', name: 'Appreciation of Beauty', category: 'transcendence' },
  { id: 'bravery', name: 'Bravery', category: 'courage' },
  { id: 'creativity', name: 'Creativity', category: 'wisdom' },
  { id: 'curiosity', name: 'Curiosity', category: 'wisdom' },
  { id: 'fairness', name: 'Fairness', category: 'justice' },
  { id: 'forgiveness', name: 'Forgiveness', category: 'temperance' },
  { id: 'gratitude', name: 'Gratitude', category: 'transcendence' },
  { id: 'honesty', name: 'Honesty', category: 'courage' },
  { id: 'hope', name: 'Hope', category: 'transcendence' },
  { id: 'humility', name: 'Humility', category: 'temperance' },
  { id: 'humor', name: 'Humor', category: 'transcendence' },
  { id: 'judgment', name: 'Judgment', category: 'wisdom' },
  { id: 'kindness', name: 'Kindness', category: 'humanity' },
  { id: 'leadership', name: 'Leadership', category: 'justice' },
  { id: 'love', name: 'Love', category: 'humanity' },
  { id: 'love_of_learning', name: 'Love of Learning', category: 'wisdom' },
  { id: 'perseverance', name: 'Perseverance', category: 'courage' },
  { id: 'perspective', name: 'Perspective', category: 'wisdom' },
  { id: 'prudence', name: 'Prudence', category: 'temperance' },
  { id: 'self_regulation', name: 'Self-Regulation', category: 'temperance' },
  { id: 'social_intelligence', name: 'Social Intelligence', category: 'humanity' },
  { id: 'spirituality', name: 'Spirituality', category: 'transcendence' },
  { id: 'teamwork', name: 'Teamwork', category: 'justice' },
  { id: 'zest', name: 'Zest', category: 'courage' }
];

export const POSITIVE_PSYCHOLOGY_QUESTIONS = [
  { id: 'pos_01', text: 'I regularly notice things I\'m grateful for in my relationship.', strength: 'gratitude' },
  { id: 'pos_02', text: 'I show kindness to my partner in small ways daily.', strength: 'kindness' },
  { id: 'pos_03', text: 'I approach relationship challenges with hope and optimism.', strength: 'hope' },
  { id: 'pos_04', text: 'I find humor and joy in my relationship regularly.', strength: 'humor' },
  { id: 'pos_05', text: 'I express love and affection authentically.', strength: 'love' },
  { id: 'pos_06', text: 'I persist through relationship difficulties with determination.', strength: 'perseverance' },
  { id: 'pos_07', text: 'I am honest and authentic with my partner.', strength: 'honesty' },
  { id: 'pos_08', text: 'I appreciate beauty and excellence in our relationship.', strength: 'appreciation_of_beauty' },
  { id: 'pos_09', text: 'I approach our relationship with curiosity and openness.', strength: 'curiosity' },
  { id: 'pos_10', text: 'I bring energy and enthusiasm to our relationship.', strength: 'zest' }
];

export function scorePositivePsychologyAssessment(responses: Record<string, number>): PositivePsychologyResults {
  const strengthScores: Record<string, number> = {};
  
  // Calculate scores for each strength
  for (const question of POSITIVE_PSYCHOLOGY_QUESTIONS) {
    const response = responses[question.id];
    if (response !== undefined) {
      const score = response * 100 / 7; // Convert to 0-100 scale
      strengthScores[question.strength] = Math.round(score);
    }
  }
  
  // Identify top strengths (scores > 70)
  const topStrengths = Object.entries(strengthScores)
    .filter(([, score]) => score > 70)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([strength]) => strength);
  
  // Calculate overall wellbeing score
  const averageScore = Object.values(strengthScores).reduce((sum, score) => sum + score, 0) / Object.values(strengthScores).length;
  
  return {
    wellbeing_score: Math.round(averageScore),
    character_strengths: topStrengths,
    strength_scores: strengthScores,
    gratitude_practices: getGratitudePractices(),
    strength_spotting_exercises: getStrengthSpottingExercises(topStrengths),
    relationship_flourishing_activities: getFlourishingActivities(),
    growth_mindset_practices: getGrowthMindsetPractices()
  };
}

function getGratitudePractices(): string[] {
  return [
    'Daily gratitude sharing with your partner',
    'Weekly relationship appreciation ritual',
    'Gratitude journaling for relationship moments',
    'Thank you notes or messages to your partner',
    'Gratitude meditation together'
  ];
}

function getStrengthSpottingExercises(topStrengths: string[]): string[] {
  return [
    'Identify and appreciate your partner\'s strengths daily',
    'Share how you see your partner using their strengths',
    'Create opportunities for each other to use top strengths',
    'Celebrate strength-based accomplishments together',
    'Develop new ways to apply your strengths in the relationship'
  ];
}

function getFlourishingActivities(): string[] {
  return [
    'Set and pursue meaningful goals together',
    'Engage in activities that create flow states',
    'Build positive relationships with other couples',
    'Practice acts of kindness together',
    'Create meaningful rituals and traditions'
  ];
}

function getGrowthMindsetPractices(): string[] {
  return [
    'View challenges as opportunities to grow together',
    'Celebrate effort and progress, not just outcomes',
    'Learn from relationship mistakes without harsh judgment',
    'Support each other\'s learning and development',
    'Embrace feedback as a gift for growth'
  ];
}

// SOMATIC THERAPY ASSESSMENT
export const SOMATIC_QUESTIONS = [
  { id: 'som_01', text: 'I notice physical sensations when I feel emotions about my relationship.', area: 'body_awareness' },
  { id: 'som_02', text: 'I can feel tension in my body when my partner and I are in conflict.', area: 'body_awareness' },
  { id: 'som_03', text: 'I use breathing techniques to calm my nervous system during stress.', area: 'regulation' },
  { id: 'som_04', text: 'I can sense when my partner is tense or relaxed through their body language.', area: 'attunement' },
  { id: 'som_05', text: 'I notice how physical affection affects my emotional state.', area: 'body_awareness' },
  { id: 'som_06', text: 'I can tell when I need to move my body to release emotional energy.', area: 'regulation' },
  { id: 'som_07', text: 'I pay attention to how my posture affects my confidence in relationships.', area: 'embodiment' },
  { id: 'som_08', text: 'I can ground myself physically when feeling anxious about my relationship.', area: 'regulation' }
];

export function scoreSomaticAssessment(responses: Record<string, number>): SomaticResults {
  const areaScores: Record<SomaticAwareness, number> = {
    body_awareness: 0,
    regulation: 0,
    attunement: 0,
    embodiment: 0
  };
  
  const areaCounts: Record<SomaticAwareness, number> = {
    body_awareness: 0,
    regulation: 0,
    attunement: 0,
    embodiment: 0
  };
  
  // Calculate scores by area
  for (const question of SOMATIC_QUESTIONS) {
    const response = responses[question.id];
    if (response !== undefined) {
      const area = question.area as SomaticAwareness;
      areaScores[area] += response;
      areaCounts[area]++;
    }
  }
  
  // Convert to 0-100 scale
  for (const area of Object.keys(areaScores) as SomaticAwareness[]) {
    if (areaCounts[area] > 0) {
      areaScores[area] = Math.round((areaScores[area] / areaCounts[area]) * 100 / 7);
    }
  }
  
  const overallScore = Math.round(Object.values(areaScores).reduce((sum, score) => sum + score, 0) / Object.values(areaScores).length);
  
  return {
    body_awareness_score: overallScore,
    somatic_skills: areaScores,
    nervous_system_regulation: areaScores.regulation,
    embodiment_practices: getEmbodimentPractices(),
    grounding_techniques: getGroundingTechniques(),
    body_based_communication: getBodyBasedCommunication(),
    trauma_informed_practices: getTraumaInformedPractices()
  };
}

function getEmbodimentPractices(): string[] {
  return [
    'Body scan meditation together',
    'Movement or dance as emotional expression',
    'Breathing exercises for nervous system regulation',
    'Progressive muscle relaxation',
    'Mindful touch and physical affection'
  ];
}

function getGroundingTechniques(): string[] {
  return [
    'Feel your feet on the ground during difficult conversations',
    'Use 5-4-3-2-1 sensory grounding technique',
    'Hold hands or hug for nervous system co-regulation',
    'Take three deep breaths together before discussing problems',
    'Use cold water or ice for acute stress response'
  ];
}

function getBodyBasedCommunication(): string[] {
  return [
    'Notice and communicate your body sensations',
    'Use posture and movement to express emotions',
    'Practice conscious breathing during conflicts',
    'Share physical comfort when partner is distressed',
    'Use body language awareness for better communication'
  ];
}

function getTraumaInformedPractices(): string[] {
  return [
    'Create physical safety and predictability',
    'Respect boundaries around touch and space',
    'Use grounding techniques during triggers',
    'Practice gentle, consensual physical connection',
    'Support nervous system healing through co-regulation'
  ];
}