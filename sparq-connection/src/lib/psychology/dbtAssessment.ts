/**
 * DBT (Dialectical Behavior Therapy) Assessment System
 * Focuses on emotional regulation, distress tolerance, interpersonal effectiveness,
 * and mindfulness skills in relationship contexts
 */

import type { DBTResults, DBTQuestion, DBTSkillArea } from '@/types';

// DBT assessment questions across four core skill areas
export const DBT_QUESTIONS: DBTQuestion[] = [
  // Emotional Regulation
  {
    id: 'dbt_01',
    text: 'I can identify what I\'m feeling when emotions arise in my relationship.',
    skill_area: 'emotional_regulation',
    reverse_scored: false
  },
  {
    id: 'dbt_02',
    text: 'When I\'m upset with my partner, I often react impulsively.',
    skill_area: 'emotional_regulation',
    reverse_scored: true
  },
  {
    id: 'dbt_03',
    text: 'I can calm myself down when I\'m feeling overwhelmed in my relationship.',
    skill_area: 'emotional_regulation',
    reverse_scored: false
  },
  {
    id: 'dbt_04',
    text: 'My emotions about my relationship often feel out of control.',
    skill_area: 'emotional_regulation',
    reverse_scored: true
  },
  {
    id: 'dbt_05',
    text: 'I practice techniques to manage my emotions when they get intense.',
    skill_area: 'emotional_regulation',
    reverse_scored: false
  },
  {
    id: 'dbt_06',
    text: 'I understand what triggers my emotional reactions with my partner.',
    skill_area: 'emotional_regulation',
    reverse_scored: false
  },

  // Distress Tolerance
  {
    id: 'dbt_07',
    text: 'When my partner and I are in conflict, I can tolerate the discomfort without making it worse.',
    skill_area: 'distress_tolerance',
    reverse_scored: false
  },
  {
    id: 'dbt_08',
    text: 'I do things that make relationship problems worse when I\'m upset.',
    skill_area: 'distress_tolerance',
    reverse_scored: true
  },
  {
    id: 'dbt_09',
    text: 'I can accept difficult emotions without trying to escape them immediately.',
    skill_area: 'distress_tolerance',
    reverse_scored: false
  },
  {
    id: 'dbt_10',
    text: 'When I\'m in relationship distress, I engage in behaviors I later regret.',
    skill_area: 'distress_tolerance',
    reverse_scored: true
  },
  {
    id: 'dbt_11',
    text: 'I have healthy ways to cope when my relationship feels difficult.',
    skill_area: 'distress_tolerance',
    reverse_scored: false
  },
  {
    id: 'dbt_12',
    text: 'I can sit with uncertainty about my relationship without panicking.',
    skill_area: 'distress_tolerance',
    reverse_scored: false
  },

  // Interpersonal Effectiveness
  {
    id: 'dbt_13',
    text: 'I can ask for what I need in my relationship clearly and directly.',
    skill_area: 'interpersonal_effectiveness',
    reverse_scored: false
  },
  {
    id: 'dbt_14',
    text: 'I often give in to my partner even when it\'s important to me to stand my ground.',
    skill_area: 'interpersonal_effectiveness',
    reverse_scored: true
  },
  {
    id: 'dbt_15',
    text: 'I can say no to my partner when I need to without feeling guilty.',
    skill_area: 'interpersonal_effectiveness',
    reverse_scored: false
  },
  {
    id: 'dbt_16',
    text: 'I maintain my values and boundaries in my relationship.',
    skill_area: 'interpersonal_effectiveness',
    reverse_scored: false
  },
  {
    id: 'dbt_17',
    text: 'I know how to repair our relationship after a conflict.',
    skill_area: 'interpersonal_effectiveness',
    reverse_scored: false
  },
  {
    id: 'dbt_18',
    text: 'I can balance being true to myself with being considerate of my partner.',
    skill_area: 'interpersonal_effectiveness',
    reverse_scored: false
  },

  // Mindfulness
  {
    id: 'dbt_19',
    text: 'I notice my thoughts and feelings without being overwhelmed by them.',
    skill_area: 'mindfulness',
    reverse_scored: false
  },
  {
    id: 'dbt_20',
    text: 'When I\'m with my partner, I often find my mind wandering to other things.',
    skill_area: 'mindfulness',
    reverse_scored: true
  },
  {
    id: 'dbt_21',
    text: 'I can observe my emotions during relationship conflicts without being consumed by them.',
    skill_area: 'mindfulness',
    reverse_scored: false
  },
  {
    id: 'dbt_22',
    text: 'I practice being present and aware in my relationship interactions.',
    skill_area: 'mindfulness',
    reverse_scored: false
  },
  {
    id: 'dbt_23',
    text: 'I can step back and observe my relationship patterns without judgment.',
    skill_area: 'mindfulness',
    reverse_scored: false
  },
  {
    id: 'dbt_24',
    text: 'I am aware of my automatic reactions to my partner\'s behavior.',
    skill_area: 'mindfulness',
    reverse_scored: false
  }
];

// DBT assessment scorer
export class DBTAssessmentScorer {
  static calculateScores(responses: Record<string, number>): DBTResults {
    const skillAreas: DBTSkillArea[] = ['emotional_regulation', 'distress_tolerance', 'interpersonal_effectiveness', 'mindfulness'];
    const skillScores: Record<DBTSkillArea, number> = {} as Record<DBTSkillArea, number>;
    const skillLevels: Record<DBTSkillArea, 'beginner' | 'developing' | 'skilled' | 'advanced'> = {} as Record<DBTSkillArea, 'beginner' | 'developing' | 'skilled' | 'advanced'>;
    
    // Calculate scores for each skill area
    for (const skillArea of skillAreas) {
      const areaQuestions = DBT_QUESTIONS.filter(q => q.skill_area === skillArea);
      let totalScore = 0;
      let validResponses = 0;
      
      for (const question of areaQuestions) {
        const response = responses[question.id];
        if (response !== undefined) {
          const score = question.reverse_scored ? (8 - response) : response;
          totalScore += score;
          validResponses++;
        }
      }
      
      const averageScore = validResponses > 0 ? totalScore / validResponses : 0;
      skillScores[skillArea] = Math.round(averageScore * 100 / 7); // Convert to 0-100 scale
      
      // Determine skill level
      if (averageScore <= 3) {
        skillLevels[skillArea] = 'beginner';
      } else if (averageScore <= 4.5) {
        skillLevels[skillArea] = 'developing';
      } else if (averageScore <= 6) {
        skillLevels[skillArea] = 'skilled';
      } else {
        skillLevels[skillArea] = 'advanced';
      }
    }
    
    // Calculate overall DBT skills score
    const overallScore = Math.round(
      Object.values(skillScores).reduce((sum, score) => sum + score, 0) / skillAreas.length
    );
    
    // Identify strongest and weakest areas
    const sortedSkills = Object.entries(skillScores).sort(([, a], [, b]) => b - a);
    const strongestAreas = sortedSkills.slice(0, 2).map(([area]) => area as DBTSkillArea);
    const developmentAreas = sortedSkills.slice(-2).map(([area]) => area as DBTSkillArea);
    
    return {
      overall_skills_score: overallScore,
      skill_scores: skillScores,
      skill_levels: skillLevels,
      strongest_areas: strongestAreas,
      development_areas: developmentAreas,
      daily_practices: this.generateDailyPractices(developmentAreas, skillLevels),
      crisis_skills: this.generateCrisisSkills(skillScores),
      relationship_skills: this.generateRelationshipSkills(skillScores),
      growth_plan: this.generateGrowthPlan(skillLevels, developmentAreas)
    };
  }
  
  private static generateDailyPractices(
    developmentAreas: DBTSkillArea[], 
    skillLevels: Record<DBTSkillArea, 'beginner' | 'developing' | 'skilled' | 'advanced'>
  ): string[] {
    const practices: string[] = [];
    
    for (const area of developmentAreas) {
      const level = skillLevels[area];
      const areaPractices = DBT_DAILY_PRACTICES[area][level];
      practices.push(...areaPractices.slice(0, 2)); // Take first 2 practices per area
    }
    
    // Always include at least one mindfulness practice
    if (!developmentAreas.includes('mindfulness')) {
      practices.push('Daily 5-minute mindfulness practice');
    }
    
    return practices.slice(0, 4); // Limit to 4 daily practices
  }
  
  private static generateCrisisSkills(skillScores: Record<DBTSkillArea, number>): string[] {
    const skills: string[] = [];
    
    if (skillScores.distress_tolerance < 50) {
      skills.push('TIPP technique for intense emotions (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation)');
      skills.push('STOP skill when feeling overwhelmed (Stop, Take a breath, Observe, Proceed mindfully)');
    }
    
    if (skillScores.emotional_regulation < 50) {
      skills.push('PLEASE skill for emotional vulnerability (treat PhysicaL illness, balance Eating, avoid mood-Altering substances, balance Sleep, get Exercise)');
    }
    
    skills.push('Radical acceptance when you can\'t change the situation');
    skills.push('Self-soothing with your five senses during difficult moments');
    
    return skills;
  }
  
  private static generateRelationshipSkills(skillScores: Record<DBTSkillArea, number>): string[] {
    const skills: string[] = [];
    
    if (skillScores.interpersonal_effectiveness < 60) {
      skills.push('DEAR MAN for making requests (Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate)');
      skills.push('GIVE for maintaining relationships (Gentle, Interested, Validate, Easy manner)');
    }
    
    if (skillScores.emotional_regulation < 60) {
      skills.push('Opposite action when emotions don\'t fit the facts');
      skills.push('Emotion regulation through checking the facts');
    }
    
    skills.push('Validation skills for your partner\'s emotions');
    skills.push('Mindful listening without planning your response');
    
    return skills;
  }
  
  private static generateGrowthPlan(
    skillLevels: Record<DBTSkillArea, 'beginner' | 'developing' | 'skilled' | 'advanced'>,
    developmentAreas: DBTSkillArea[]
  ): string[] {
    const plan: string[] = [];
    
    for (const area of developmentAreas) {
      const level = skillLevels[area];
      const nextSteps = DBT_GROWTH_PROGRESSION[area][level];
      plan.push(`${area.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${nextSteps.next_focus}`);
    }
    
    return plan;
  }
}

// DBT daily practices organized by skill area and level
export const DBT_DAILY_PRACTICES = {
  emotional_regulation: {
    beginner: [
      'Practice naming your emotions 3 times daily',
      'Use the STOP skill when emotions feel intense',
      'Track your emotions on a simple 1-10 scale'
    ],
    developing: [
      'Daily emotion diary with triggers and responses',
      'Practice opposite action once daily',
      'Use temperature change for emotional regulation'
    ],
    skilled: [
      'Advanced emotion regulation through checking the facts',
      'Practice emotion surfing - riding the wave without reacting',
      'Teach emotion regulation skills to your partner'
    ],
    advanced: [
      'Model emotional regulation in challenging situations',
      'Help your partner develop their emotional awareness',
      'Practice emotional mastery in conflict situations'
    ]
  },
  
  distress_tolerance: {
    beginner: [
      'Practice 4-7-8 breathing for 5 minutes daily',
      'Use ice cubes or cold water when overwhelmed',
      'Create a distraction list for difficult moments'
    ],
    developing: [
      'Daily radical acceptance practice',
      'Use the TIPP technique during conflicts',
      'Practice distress tolerance without making problems worse'
    ],
    skilled: [
      'Advanced distress tolerance during relationship challenges',
      'Teach distress tolerance skills to your partner',
      'Practice willingness and acceptance in difficult times'
    ],
    advanced: [
      'Model distress tolerance in crisis situations',
      'Help others develop distress tolerance skills',
      'Maintain equanimity during major relationship stressors'
    ]
  },
  
  interpersonal_effectiveness: {
    beginner: [
      'Practice using "I" statements daily',
      'Ask for one thing you need each day',
      'Say no to one request without over-explaining'
    ],
    developing: [
      'Use DEAR MAN technique for important requests',
      'Practice GIVE skills in daily interactions',
      'Balance priorities: relationship, objectives, self-respect'
    ],
    skilled: [
      'Advanced interpersonal effectiveness in conflicts',
      'Teach communication skills to your partner',
      'Navigate complex relationship negotiations'
    ],
    advanced: [
      'Model effective communication in challenging situations',
      'Help others develop interpersonal skills',
      'Maintain relationships while achieving objectives'
    ]
  },
  
  mindfulness: {
    beginner: [
      '5-minute daily mindfulness meditation',
      'Practice one-mindfully during routine activities',
      'Notice when your mind wanders and gently return to the present'
    ],
    developing: [
      '10-15 minute daily meditation practice',
      'Mindful listening during conversations with your partner',
      'Practice observe, describe, participate skills'
    ],
    skilled: [
      'Advanced mindfulness during relationship interactions',
      'Teach mindfulness skills to your partner',
      'Practice mindfulness in emotionally charged situations'
    ],
    advanced: [
      'Model mindful presence in all interactions',
      'Help others develop mindfulness practice',
      'Maintain mindful awareness during relationship crises'
    ]
  }
};

// Growth progression paths for each skill area
export const DBT_GROWTH_PROGRESSION = {
  emotional_regulation: {
    beginner: {
      next_focus: 'Learn to identify and name emotions accurately',
      timeline: '2-4 weeks',
      key_skills: ['Emotion identification', 'Basic self-soothing']
    },
    developing: {
      next_focus: 'Practice emotion regulation techniques consistently',
      timeline: '1-3 months',
      key_skills: ['Opposite action', 'Checking the facts', 'PLEASE skills']
    },
    skilled: {
      next_focus: 'Master advanced emotion regulation in relationships',
      timeline: '3-6 months',
      key_skills: ['Emotion surfing', 'Mastery over intense emotions']
    },
    advanced: {
      next_focus: 'Teach and model emotional regulation for others',
      timeline: 'Ongoing',
      key_skills: ['Teaching skills', 'Crisis leadership']
    }
  },
  
  distress_tolerance: {
    beginner: {
      next_focus: 'Build basic distress tolerance skills',
      timeline: '2-4 weeks',
      key_skills: ['TIPP technique', 'Basic self-soothing', 'Distraction']
    },
    developing: {
      next_focus: 'Practice tolerating distress without making it worse',
      timeline: '1-3 months',
      key_skills: ['Radical acceptance', 'Willingness', 'Crisis survival']
    },
    skilled: {
      next_focus: 'Master distress tolerance in relationship challenges',
      timeline: '3-6 months',
      key_skills: ['Advanced acceptance', 'Relationship crisis skills']
    },
    advanced: {
      next_focus: 'Model distress tolerance in crisis situations',
      timeline: 'Ongoing',
      key_skills: ['Crisis leadership', 'Teaching tolerance skills']
    }
  },
  
  interpersonal_effectiveness: {
    beginner: {
      next_focus: 'Learn basic assertiveness and boundary skills',
      timeline: '2-4 weeks',
      key_skills: ['Basic assertiveness', 'Simple requests', 'Saying no']
    },
    developing: {
      next_focus: 'Practice structured interpersonal skills',
      timeline: '1-3 months',
      key_skills: ['DEAR MAN', 'GIVE', 'FAST', 'Relationship balance']
    },
    skilled: {
      next_focus: 'Master complex interpersonal situations',
      timeline: '3-6 months',
      key_skills: ['Conflict resolution', 'Complex negotiations']
    },
    advanced: {
      next_focus: 'Teach interpersonal effectiveness to others',
      timeline: 'Ongoing',
      key_skills: ['Teaching communication', 'Relationship mentoring']
    }
  },
  
  mindfulness: {
    beginner: {
      next_focus: 'Establish daily mindfulness practice',
      timeline: '2-4 weeks',
      key_skills: ['Basic meditation', 'Present moment awareness']
    },
    developing: {
      next_focus: 'Apply mindfulness to relationship interactions',
      timeline: '1-3 months',
      key_skills: ['Mindful communication', 'Emotional awareness']
    },
    skilled: {
      next_focus: 'Master mindfulness in challenging situations',
      timeline: '3-6 months',
      key_skills: ['Crisis mindfulness', 'Advanced awareness']
    },
    advanced: {
      next_focus: 'Teach mindfulness and model present-moment living',
      timeline: 'Ongoing',
      key_skills: ['Teaching mindfulness', 'Mindful leadership']
    }
  }
};

// Helper function to get personalized DBT recommendations
export function getDBTRecommendations(
  results: DBTResults,
  partnerResults?: DBTResults
): {
  dailyPractice: string[];
  weeklyGoals: string[];
  crisisSkills: string[];
  coupleWork: string[];
} {
  const recommendations = {
    dailyPractice: results.daily_practices,
    weeklyGoals: results.growth_plan,
    crisisSkills: results.crisis_skills.slice(0, 3),
    coupleWork: results.relationship_skills.slice(0, 3)
  };
  
  // Add partner-specific recommendations if available
  if (partnerResults) {
    const bothNeedEmotionalRegulation = 
      results.skill_scores.emotional_regulation < 60 && 
      partnerResults.skill_scores.emotional_regulation < 60;
    
    if (bothNeedEmotionalRegulation) {
      recommendations.coupleWork.push('Practice emotional regulation skills together daily');
    }
    
    const bothNeedCommunication = 
      results.skill_scores.interpersonal_effectiveness < 60 && 
      partnerResults.skill_scores.interpersonal_effectiveness < 60;
    
    if (bothNeedCommunication) {
      recommendations.coupleWork.push('Use DEAR MAN structure for important conversations');
    }
  }
  
  return recommendations;
}