/**
 * Gottman Method Assessment System
 * Based on Dr. John Gottman's research on relationship prediction and the Seven Principles
 * Includes Four Horsemen detection and Sound Relationship House assessment
 */

import { GottmanAssessment, GottmanArea, GottmanHorseman } from '@/types';

// Gottman's Seven Principles assessment questions
export const GOTTMAN_ASSESSMENT_QUESTIONS = {
  love_maps: [
    {
      id: 'lm_01',
      text: 'I know my partner\'s current stresses and worries.',
      reverse_scored: false
    },
    {
      id: 'lm_02',
      text: 'I can name my partner\'s best friends.',
      reverse_scored: false
    },
    {
      id: 'lm_03',
      text: 'I know what my partner\'s current goals are.',
      reverse_scored: false
    },
    {
      id: 'lm_04',
      text: 'I am familiar with my partner\'s religious beliefs and philosophy.',
      reverse_scored: false
    },
    {
      id: 'lm_05',
      text: 'I can name my partner\'s favorite movie or book.',
      reverse_scored: false
    },
    {
      id: 'lm_06',
      text: 'I know my partner\'s biggest fears and worries.',
      reverse_scored: false
    },
    {
      id: 'lm_07',
      text: 'I know what my partner\'s ideal vacation would be.',
      reverse_scored: false
    },
    {
      id: 'lm_08',
      text: 'I know my partner\'s current favorite way to spend an evening.',
      reverse_scored: false
    }
  ],
  
  nurture_affection: [
    {
      id: 'na_01',
      text: 'I often tell my partner that I love them.',
      reverse_scored: false
    },
    {
      id: 'na_02',
      text: 'I regularly show physical affection to my partner.',
      reverse_scored: false
    },
    {
      id: 'na_03',
      text: 'I express appreciation for things my partner does.',
      reverse_scored: false
    },
    {
      id: 'na_04',
      text: 'I notice and comment on positive things about my partner.',
      reverse_scored: false
    },
    {
      id: 'na_05',
      text: 'I feel appreciated by my partner.',
      reverse_scored: false
    },
    {
      id: 'na_06',
      text: 'My partner and I are affectionate with each other.',
      reverse_scored: false
    },
    {
      id: 'na_07',
      text: 'I feel loved and cared for in this relationship.',
      reverse_scored: false
    },
    {
      id: 'na_08',
      text: 'Romance is definitely alive in our relationship.',
      reverse_scored: false
    }
  ],

  turn_towards: [
    {
      id: 'tt_01',
      text: 'When my partner tries to get my attention, I usually respond positively.',
      reverse_scored: false
    },
    {
      id: 'tt_02',
      text: 'I am interested in my partner\'s daily experiences.',
      reverse_scored: false
    },
    {
      id: 'tt_03',
      text: 'My partner and I have good conversations.',
      reverse_scored: false
    },
    {
      id: 'tt_04',
      text: 'I feel my partner is interested in my thoughts and feelings.',
      reverse_scored: false
    },
    {
      id: 'tt_05',
      text: 'When my partner shares something with me, I listen carefully.',
      reverse_scored: false
    },
    {
      id: 'tt_06',
      text: 'My partner responds positively when I try to get their attention.',
      reverse_scored: false
    },
    {
      id: 'tt_07',
      text: 'We enjoy each other\'s company.',
      reverse_scored: false
    },
    {
      id: 'tt_08',
      text: 'I feel emotionally connected to my partner.',
      reverse_scored: false
    }
  ],

  positive_perspective: [
    {
      id: 'pp_01',
      text: 'I generally feel positive about my relationship.',
      reverse_scored: false
    },
    {
      id: 'pp_02',
      text: 'I believe my partner has good intentions, even during conflicts.',
      reverse_scored: false
    },
    {
      id: 'pp_03',
      text: 'I focus more on my partner\'s positive qualities than negative ones.',
      reverse_scored: false
    },
    {
      id: 'pp_04',
      text: 'I give my partner the benefit of the doubt.',
      reverse_scored: false
    },
    {
      id: 'pp_05',
      text: 'I feel optimistic about our future together.',
      reverse_scored: false
    },
    {
      id: 'pp_06',
      text: 'When problems arise, I believe we can work through them.',
      reverse_scored: false
    },
    {
      id: 'pp_07',
      text: 'I feel grateful for my partner and our relationship.',
      reverse_scored: false
    },
    {
      id: 'pp_08',
      text: 'I look forward to spending time with my partner.',
      reverse_scored: false
    }
  ],

  manage_conflict: [
    {
      id: 'mc_01',
      text: 'We can discuss our differences without it becoming a big fight.',
      reverse_scored: false
    },
    {
      id: 'mc_02',
      text: 'When we argue, we are able to resolve things.',
      reverse_scored: false
    },
    {
      id: 'mc_03',
      text: 'I can express my needs without attacking my partner.',
      reverse_scored: false
    },
    {
      id: 'mc_04',
      text: 'My partner and I compromise during disagreements.',
      reverse_scored: false
    },
    {
      id: 'mc_05',
      text: 'We rarely bring up past issues during current conflicts.',
      reverse_scored: false
    },
    {
      id: 'mc_06',
      text: 'I avoid criticism and contempt during disagreements.',
      reverse_scored: false
    },
    {
      id: 'mc_07',
      text: 'We take breaks when discussions get too heated.',
      reverse_scored: false
    },
    {
      id: 'mc_08',
      text: 'After conflicts, we repair and reconnect well.',
      reverse_scored: false
    }
  ],

  make_dreams_reality: [
    {
      id: 'mdr_01',
      text: 'My partner supports my personal goals and dreams.',
      reverse_scored: false
    },
    {
      id: 'mdr_02',
      text: 'I feel comfortable sharing my dreams with my partner.',
      reverse_scored: false
    },
    {
      id: 'mdr_03',
      text: 'We work together to make our individual dreams happen.',
      reverse_scored: false
    },
    {
      id: 'mdr_04',
      text: 'I encourage my partner to pursue their goals.',
      reverse_scored: false
    },
    {
      id: 'mdr_05',
      text: 'We have shared dreams and goals for our future.',
      reverse_scored: false
    },
    {
      id: 'mdr_06',
      text: 'I feel my partner believes in me and my abilities.',
      reverse_scored: false
    },
    {
      id: 'mdr_07',
      text: 'We help each other grow as individuals.',
      reverse_scored: false
    },
    {
      id: 'mdr_08',
      text: 'My partner doesn\'t try to change my fundamental dreams.',
      reverse_scored: false
    }
  ],

  create_shared_meaning: [
    {
      id: 'csm_01',
      text: 'We share similar values about what\'s important in life.',
      reverse_scored: false
    },
    {
      id: 'csm_02',
      text: 'We have created meaningful traditions together.',
      reverse_scored: false
    },
    {
      id: 'csm_03',
      text: 'We have a shared vision for our future.',
      reverse_scored: false
    },
    {
      id: 'csm_04',
      text: 'We agree on what makes life meaningful.',
      reverse_scored: false
    },
    {
      id: 'csm_05',
      text: 'Our relationship has a spiritual dimension that we both value.',
      reverse_scored: false
    },
    {
      id: 'csm_06',
      text: 'We share similar goals for our family life.',
      reverse_scored: false
    },
    {
      id: 'csm_07',
      text: 'We have created our own unique culture as a couple.',
      reverse_scored: false
    },
    {
      id: 'csm_08',
      text: 'We support each other\'s roles and responsibilities.',
      reverse_scored: false
    }
  ]
};

// Four Horsemen detection keywords and patterns
export const FOUR_HORSEMEN_PATTERNS = {
  criticism: {
    keywords: [
      'you always', 'you never', 'you are', 'you don\'t', 'you can\'t',
      'what\'s wrong with you', 'you should', 'you shouldn\'t',
      'typical', 'again', 'every time'
    ],
    patterns: [
      /you\s+(always|never)\s+/gi,
      /what'?s\s+wrong\s+with\s+you/gi,
      /you\s+(are|should|don'?t|can'?t)\s+/gi,
      /typical\s+you/gi,
      /here\s+we\s+go\s+again/gi
    ],
    description: 'Attacking your partner\'s character or personality rather than addressing specific behavior'
  },
  contempt: {
    keywords: [
      'stupid', 'idiot', 'moron', 'pathetic', 'worthless', 'loser',
      'ridiculous', 'whatever', 'seriously?', 'unbelievable',
      'grow up', 'get real', 'drama queen', 'crybaby'
    ],
    patterns: [
      /.*\s+(stupid|idiot|moron|pathetic|worthless|loser)\s+.*/gi,
      /seriously\?+/gi,
      /whatever\.*/gi,
      /grow\s+up/gi,
      /get\s+real/gi,
      /oh\s+please/gi
    ],
    description: 'Attacking your partner from a position of superiority with sarcasm, cynicism, or mean-spirited humor'
  },
  defensiveness: {
    keywords: [
      'it\'s not my fault', 'you\'re wrong', 'that\'s not true', 'no i didn\'t',
      'you\'re the one', 'i didn\'t', 'but you', 'you started',
      'you made me', 'if you hadn\'t'
    ],
    patterns: [
      /it'?s\s+not\s+my\s+fault/gi,
      /you'?re\s+wrong/gi,
      /that'?s\s+not\s+true/gi,
      /no\s+i\s+didn'?t/gi,
      /but\s+you\s+/gi,
      /you\s+made\s+me/gi,
      /if\s+you\s+hadn'?t/gi
    ],
    description: 'Playing the victim or counter-attacking instead of taking responsibility'
  },
  stonewalling: {
    keywords: [
      'fine', 'whatever', 'i don\'t care', 'nothing', 'forget it',
      'i\'m done', 'leave me alone', 'not talking', 'silence'
    ],
    patterns: [
      /^fine\.?$/gi,
      /^whatever\.?$/gi,
      /i\s+don'?t\s+care/gi,
      /^nothing\.?$/gi,
      /forget\s+it/gi,
      /i'?m\s+done/gi,
      /leave\s+me\s+alone/gi
    ],
    description: 'Withdrawing emotionally and shutting down during conflict'
  }
};

// Assessment scoring and interpretation
export class GottmanAssessmentScorer {
  static calculateGottmanScores(responses: Record<string, number>): GottmanAssessment {
    const areas = {
      love_maps: this.calculateAreaScore(responses, GOTTMAN_ASSESSMENT_QUESTIONS.love_maps, 'love_maps'),
      nurture_affection: this.calculateAreaScore(responses, GOTTMAN_ASSESSMENT_QUESTIONS.nurture_affection, 'nurture_affection'),
      turn_towards: this.calculateAreaScore(responses, GOTTMAN_ASSESSMENT_QUESTIONS.turn_towards, 'turn_towards'),
      positive_perspective: this.calculateAreaScore(responses, GOTTMAN_ASSESSMENT_QUESTIONS.positive_perspective, 'positive_perspective'),
      manage_conflict: this.calculateAreaScore(responses, GOTTMAN_ASSESSMENT_QUESTIONS.manage_conflict, 'manage_conflict'),
      make_dreams_reality: this.calculateAreaScore(responses, GOTTMAN_ASSESSMENT_QUESTIONS.make_dreams_reality, 'make_dreams_reality'),
      create_shared_meaning: this.calculateAreaScore(responses, GOTTMAN_ASSESSMENT_QUESTIONS.create_shared_meaning, 'create_shared_meaning')
    };

    const overallScore = Object.values(areas).reduce((sum, area) => sum + area.score, 0) / 7;
    const relationshipStability = this.determineRelationshipStability(overallScore, areas);

    return {
      areas,
      overall_score: Math.round(overallScore),
      relationship_stability: relationshipStability
    };
  }

  private static calculateAreaScore(
    responses: Record<string, number>,
    questions: Array<{ id: string; text: string; reverse_scored: boolean }>,
    areaKey: string
  ): GottmanArea {
    let totalScore = 0;
    let validResponses = 0;

    for (const question of questions) {
      const response = responses[question.id];
      if (response !== undefined) {
        const score = question.reverse_scored ? (8 - response) : response;
        totalScore += score;
        validResponses++;
      }
    }

    const averageScore = validResponses > 0 ? totalScore / validResponses : 0;
    const percentageScore = Math.round((averageScore / 7) * 100);

    return {
      score: percentageScore,
      strengths: this.getAreaStrengths(areaKey, percentageScore),
      growth_areas: this.getAreaGrowthAreas(areaKey, percentageScore),
      interventions: this.getAreaInterventions(areaKey, percentageScore)
    };
  }

  private static determineRelationshipStability(
    overallScore: number,
    areas: Record<string, GottmanArea>
  ): 'stable' | 'at_risk' | 'needs_attention' {
    // High risk indicators
    const criticalAreas = ['positive_perspective', 'manage_conflict'];
    const lowCriticalScores = criticalAreas.some(area => areas[area].score < 50);
    
    if (overallScore >= 70 && !lowCriticalScores) {
      return 'stable';
    } else if (overallScore >= 50 && !lowCriticalScores) {
      return 'at_risk';
    } else {
      return 'needs_attention';
    }
  }

  private static getAreaStrengths(area: string, score: number): string[] {
    const allStrengths = {
      love_maps: [
        'Good awareness of partner\'s inner world',
        'Understanding of partner\'s current life',
        'Knowledge of partner\'s values and beliefs',
        'Awareness of partner\'s goals and dreams'
      ],
      nurture_affection: [
        'Regular expressions of love and appreciation',
        'Physical affection and romance',
        'Positive emotional climate',
        'Mutual admiration and respect'
      ],
      turn_towards: [
        'Responsive to partner\'s bids for connection',
        'Good daily communication habits',
        'Emotional attunement and interest',
        'Strong friendship foundation'
      ],
      positive_perspective: [
        'Optimistic view of the relationship',
        'Assumes positive intent from partner',
        'Focus on partner\'s good qualities',
        'Hope for the future together'
      ],
      manage_conflict: [
        'Effective conflict resolution skills',
        'Ability to compromise and negotiate',
        'Avoids the Four Horsemen',
        'Good repair and recovery after fights'
      ],
      make_dreams_reality: [
        'Supports partner\'s individual goals',
        'Encourages personal growth',
        'Works together on shared dreams',
        'Believes in each other\'s potential'
      ],
      create_shared_meaning: [
        'Shared values and life philosophy',
        'Meaningful traditions and rituals',
        'Common vision for the future',
        'Spiritual or deeper connection'
      ]
    };

    const strengths = allStrengths[area as keyof typeof allStrengths] || [];
    
    if (score >= 80) {
      return strengths;
    } else if (score >= 60) {
      return strengths.slice(0, 2);
    } else {
      return strengths.slice(0, 1);
    }
  }

  private static getAreaGrowthAreas(area: string, score: number): string[] {
    const allGrowthAreas = {
      love_maps: [
        'Learn more about partner\'s current stresses',
        'Ask about partner\'s dreams and aspirations',
        'Understand partner\'s values and beliefs better',
        'Stay updated on partner\'s changing inner world'
      ],
      nurture_affection: [
        'Express appreciation more frequently',
        'Increase physical affection and romance',
        'Show love in partner\'s preferred way',
        'Create more positive moments together'
      ],
      turn_towards: [
        'Respond more positively to partner\'s bids',
        'Show more interest in daily experiences',
        'Put away distractions during conversations',
        'Ask more questions about partner\'s thoughts'
      ],
      positive_perspective: [
        'Focus more on partner\'s positive qualities',
        'Assume positive intent during conflicts',
        'Practice gratitude for the relationship',
        'Build hope for the future together'
      ],
      manage_conflict: [
        'Avoid criticism and contempt',
        'Take responsibility instead of being defensive',
        'Practice active listening during disagreements',
        'Learn to take breaks when emotions escalate'
      ],
      make_dreams_reality: [
        'Ask about and support partner\'s goals',
        'Share your own dreams more openly',
        'Work together on mutual aspirations',
        'Encourage individual growth and development'
      ],
      create_shared_meaning: [
        'Discuss values and what\'s meaningful to each of you',
        'Create new traditions and rituals together',
        'Develop a shared vision for your future',
        'Explore spiritual or philosophical connections'
      ]
    };

    const growthAreas = allGrowthAreas[area as keyof typeof allGrowthAreas] || [];
    
    if (score < 50) {
      return growthAreas;
    } else if (score < 70) {
      return growthAreas.slice(0, 2);
    } else {
      return growthAreas.slice(0, 1);
    }
  }

  private static getAreaInterventions(area: string, score: number): string[] {
    const allInterventions = {
      love_maps: [
        'Love Map questionnaire exercises',
        'Daily check-ins about each other\'s world',
        'Regular updates about life changes',
        'Mindful conversation practices'
      ],
      nurture_affection: [
        'Daily appreciation exercises',
        'Physical affection challenges',
        'Regular date nights and romance',
        'Love language practice'
      ],
      turn_towards: [
        'Attention and responsiveness training',
        'Active listening practice',
        'Phone-free conversation time',
        'Emotional check-in rituals'
      ],
      positive_perspective: [
        'Gratitude journal for relationship',
        'Positive reframing exercises',
        'Strengths focus activities',
        'Hope and vision building'
      ],
      manage_conflict: [
        'Four Horsemen antidotes training',
        'Taking breaks during conflict',
        'I-statements and softer startups',
        'Repair and recovery practices'
      ],
      make_dreams_reality: [
        'Dreams and aspirations sharing',
        'Goal-setting as a couple',
        'Individual growth support',
        'Life vision exercises'
      ],
      create_shared_meaning: [
        'Values clarification exercises',
        'Tradition and ritual creation',
        'Future visioning activities',
        'Meaning-making conversations'
      ]
    };

    const interventions = allInterventions[area as keyof typeof allInterventions] || [];
    
    if (score < 50) {
      return interventions;
    } else if (score < 70) {
      return interventions.slice(0, 2);
    } else {
      return [interventions[0]];
    }
  }
}

// Four Horsemen detection for text analysis
export class FourHorsemenDetector {
  static analyzeText(text: string): {
    horsemen: GottmanHorseman[];
    confidence: number;
    suggestions: string[];
  } {
    const detectedHorsemen: GottmanHorseman[] = [];
    let totalMatches = 0;
    
    const lowerText = text.toLowerCase();
    
    // Check for each horseman
    Object.entries(FOUR_HORSEMEN_PATTERNS).forEach(([horseman, data]) => {
      let matches = 0;
      
      // Check keywords
      data.keywords.forEach(keyword => {
        if (lowerText.includes(keyword.toLowerCase())) {
          matches++;
        }
      });
      
      // Check patterns
      data.patterns.forEach(pattern => {
        const patternMatches = (text.match(pattern) || []).length;
        matches += patternMatches;
      });
      
      if (matches > 0) {
        detectedHorsemen.push(horseman as GottmanHorseman);
        totalMatches += matches;
      }
    });
    
    // Calculate confidence based on matches and text length
    const confidence = Math.min(totalMatches / Math.max(text.split(' ').length / 10, 1), 1);
    
    const suggestions = this.getSuggestions(detectedHorsemen);
    
    return {
      horsemen: detectedHorsemen,
      confidence,
      suggestions
    };
  }
  
  private static getSuggestions(horsemen: GottmanHorseman[]): string[] {
    const suggestions: string[] = [];
    
    if (horsemen.includes('criticism')) {
      suggestions.push('Try using "I" statements instead of "you" statements');
      suggestions.push('Focus on specific behaviors rather than character attacks');
    }
    
    if (horsemen.includes('contempt')) {
      suggestions.push('Take a break to cool down before continuing');
      suggestions.push('Remember your partner\'s positive qualities');
      suggestions.push('Avoid sarcasm and mean-spirited humor');
    }
    
    if (horsemen.includes('defensiveness')) {
      suggestions.push('Try to understand your partner\'s perspective');
      suggestions.push('Take some responsibility for the issue');
      suggestions.push('Ask questions to clarify instead of defending');
    }
    
    if (horsemen.includes('stonewalling')) {
      suggestions.push('Let your partner know you need a break');
      suggestions.push('Schedule a time to return to the conversation');
      suggestions.push('Practice self-soothing techniques');
    }
    
    return suggestions;
  }
}

// Gottman-specific interventions and exercises
export const GOTTMAN_INTERVENTIONS = {
  love_maps: {
    title: 'Building Love Maps',
    exercises: [
      {
        name: 'Love Map Questions',
        description: 'Ask each other questions about inner worlds, dreams, and daily life',
        duration: 15,
        instructions: [
          'Take turns asking love map questions',
          'Listen without judgment',
          'Ask follow-up questions to learn more',
          'Update your knowledge regularly'
        ]
      },
      {
        name: 'Daily Check-ins',
        description: 'Brief conversations about each other\'s day and inner world',
        duration: 10,
        instructions: [
          'Ask about the best and worst parts of each other\'s day',
          'Share any worries or stresses',
          'Discuss upcoming plans or goals',
          'Listen with empathy and curiosity'
        ]
      }
    ]
  },
  
  nurture_affection: {
    title: 'Nurturing Fondness and Admiration',
    exercises: [
      {
        name: 'Daily Appreciation',
        description: 'Express gratitude and appreciation for your partner',
        duration: 5,
        instructions: [
          'Share one thing you appreciate about your partner',
          'Be specific about what they did or who they are',
          'Express how it made you feel',
          'Receive appreciation graciously'
        ]
      },
      {
        name: 'Fondness and Admiration Exercises',
        description: 'Remember and share positive memories and qualities',
        duration: 20,
        instructions: [
          'Share a favorite memory of your partner',
          'Describe a quality you admire about them',
          'Talk about why you fell in love with them',
          'Express gratitude for their presence in your life'
        ]
      }
    ]
  },
  
  manage_conflict: {
    title: 'Managing Conflict Constructively',
    exercises: [
      {
        name: 'Soft Startup Practice',
        description: 'Learn to bring up issues gently and constructively',
        duration: 15,
        instructions: [
          'Start with something positive',
          'State your feelings using "I" statements',
          'Describe the situation without blame',
          'Express what you need positively'
        ]
      },
      {
        name: 'Four Horsemen Antidotes',
        description: 'Practice alternatives to criticism, contempt, defensiveness, and stonewalling',
        duration: 20,
        instructions: [
          'Replace criticism with complaints about specific behaviors',
          'Build fondness and admiration to counter contempt',
          'Take responsibility instead of being defensive',
          'Self-soothe when feeling overwhelmed'
        ]
      }
    ]
  }
};