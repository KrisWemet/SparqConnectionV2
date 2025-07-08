/**
 * Comprehensive Attachment Assessment System
 * Based on the Experiences in Close Relationships-Revised (ECR-R) scale
 * and Adult Attachment Interview research
 */

import { AttachmentQuestion, AttachmentResults, AttachmentStyle } from '@/types';

// Research-based attachment assessment questions
// Based on ECR-R and validated attachment research
export const ATTACHMENT_QUESTIONS: AttachmentQuestion[] = [
  // Anxiety subscale questions
  {
    id: 'anx_01',
    text: 'I worry about being abandoned by my romantic partner.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_02',
    text: 'I need a lot of reassurance from my partner.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_03',
    text: 'I fear my partner doesn\'t care about me as much as I care about them.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_04',
    text: 'I get frustrated when my partner is not available when I need them.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_05',
    text: 'I worry that romantic partners won\'t care about me as much as I care about them.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_06',
    text: 'My desire to be very close sometimes scares people away.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_07',
    text: 'I worry about being alone in my relationship.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_08',
    text: 'When I show my feelings for romantic partners, I\'m afraid they will not feel the same about me.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_09',
    text: 'I rarely worry about my partner leaving me.',
    subscale: 'anxiety',
    reverse_scored: true
  },
  {
    id: 'anx_10',
    text: 'My romantic partner makes me doubt myself.',
    subscale: 'anxiety',
    reverse_scored: false
  },
  {
    id: 'anx_11',
    text: 'I do not often worry about being abandoned.',
    subscale: 'anxiety',
    reverse_scored: true
  },
  {
    id: 'anx_12',
    text: 'I find that my partner(s) don\'t want to get as close as I would like.',
    subscale: 'anxiety',
    reverse_scored: false
  },

  // Avoidance subscale questions
  {
    id: 'avo_01',
    text: 'I prefer not to show a partner how I feel deep down.',
    subscale: 'avoidance',
    reverse_scored: false
  },
  {
    id: 'avo_02',
    text: 'I find it difficult to depend on romantic partners.',
    subscale: 'avoidance',
    reverse_scored: false
  },
  {
    id: 'avo_03',
    text: 'I don\'t feel comfortable opening up to romantic partners.',
    subscale: 'avoidance',
    reverse_scored: false
  },
  {
    id: 'avo_04',
    text: 'I prefer not to show others how I feel deep down.',
    subscale: 'avoidance',
    reverse_scored: false
  },
  {
    id: 'avo_05',
    text: 'I find it relatively easy to get close to my partner.',
    subscale: 'avoidance',
    reverse_scored: true
  },
  {
    id: 'avo_06',
    text: 'It\'s not difficult for me to get close to my partner.',
    subscale: 'avoidance',
    reverse_scored: true
  },
  {
    id: 'avo_07',
    text: 'I usually discuss my problems and concerns with my partner.',
    subscale: 'avoidance',
    reverse_scored: true
  },
  {
    id: 'avo_08',
    text: 'It helps to turn to my romantic partner in times of need.',
    subscale: 'avoidance',
    reverse_scored: true
  },
  {
    id: 'avo_09',
    text: 'I tell my partner just about everything.',
    subscale: 'avoidance',
    reverse_scored: true
  },
  {
    id: 'avo_10',
    text: 'I talk things over with my partner.',
    subscale: 'avoidance',
    reverse_scored: true
  },
  {
    id: 'avo_11',
    text: 'I am very comfortable being close to romantic partners.',
    subscale: 'avoidance',
    reverse_scored: true
  },
  {
    id: 'avo_12',
    text: 'I find it easy to depend on romantic partners.',
    subscale: 'avoidance',
    reverse_scored: true
  },

  // Security subscale questions (additional for comprehensive assessment)
  {
    id: 'sec_01',
    text: 'I feel confident that my partner loves me.',
    subscale: 'security',
    reverse_scored: false
  },
  {
    id: 'sec_02',
    text: 'I can easily share my thoughts and feelings with my partner.',
    subscale: 'security',
    reverse_scored: false
  },
  {
    id: 'sec_03',
    text: 'I feel comfortable depending on my romantic partner.',
    subscale: 'security',
    reverse_scored: false
  },
  {
    id: 'sec_04',
    text: 'I trust that my partner will be there for me when I need them.',
    subscale: 'security',
    reverse_scored: false
  },
  {
    id: 'sec_05',
    text: 'I feel safe being emotionally vulnerable with my partner.',
    subscale: 'security',
    reverse_scored: false
  },
  {
    id: 'sec_06',
    text: 'I can express my needs clearly to my partner.',
    subscale: 'security',
    reverse_scored: false
  },
  {
    id: 'sec_07',
    text: 'I feel valued and appreciated by my partner.',
    subscale: 'security',
    reverse_scored: false
  },
  {
    id: 'sec_08',
    text: 'I can handle conflict with my partner constructively.',
    subscale: 'security',
    reverse_scored: false
  }
];

// Scoring algorithm based on validated research
export class AttachmentAssessmentScorer {
  static calculateScores(responses: Record<string, number>): AttachmentResults {
    const anxietyItems = ATTACHMENT_QUESTIONS.filter(q => q.subscale === 'anxiety');
    const avoidanceItems = ATTACHMENT_QUESTIONS.filter(q => q.subscale === 'avoidance');
    const securityItems = ATTACHMENT_QUESTIONS.filter(q => q.subscale === 'security');

    // Calculate raw scores (1-7 scale)
    const anxietyScore = this.calculateSubscaleScore(responses, anxietyItems);
    const avoidanceScore = this.calculateSubscaleScore(responses, avoidanceItems);
    const securityScore = this.calculateSubscaleScore(responses, securityItems);

    // Determine attachment style based on anxiety and avoidance dimensions
    const attachmentStyle = this.determineAttachmentStyle(anxietyScore, avoidanceScore);

    // Generate personalized results
    const results: AttachmentResults = {
      attachment_style: attachmentStyle,
      anxiety_score: Math.round(anxietyScore * 100 / 7), // Convert to 0-100 scale
      avoidance_score: Math.round(avoidanceScore * 100 / 7),
      security_score: Math.round(securityScore * 100 / 7),
      description: this.getAttachmentDescription(attachmentStyle),
      relationship_implications: this.getRelationshipImplications(attachmentStyle),
      growth_areas: this.getGrowthAreas(attachmentStyle, anxietyScore, avoidanceScore)
    };

    return results;
  }

  private static calculateSubscaleScore(
    responses: Record<string, number>,
    items: AttachmentQuestion[]
  ): number {
    let totalScore = 0;
    let validResponses = 0;

    for (const item of items) {
      const response = responses[item.id];
      if (response !== undefined) {
        const score = item.reverse_scored ? (8 - response) : response;
        totalScore += score;
        validResponses++;
      }
    }

    return validResponses > 0 ? totalScore / validResponses : 0;
  }

  private static determineAttachmentStyle(
    anxietyScore: number,
    avoidanceScore: number
  ): AttachmentStyle {
    // Research-based cutoff points (using 4.0 as midpoint on 1-7 scale)
    const anxietyThreshold = 4.0;
    const avoidanceThreshold = 4.0;

    if (anxietyScore < anxietyThreshold && avoidanceScore < avoidanceThreshold) {
      return 'secure';
    } else if (anxietyScore >= anxietyThreshold && avoidanceScore < avoidanceThreshold) {
      return 'anxious';
    } else if (anxietyScore < anxietyThreshold && avoidanceScore >= avoidanceThreshold) {
      return 'avoidant';
    } else {
      return 'disorganized';
    }
  }

  private static getAttachmentDescription(style: AttachmentStyle): string {
    const descriptions = {
      secure: "You tend to be comfortable with intimacy and autonomy. You find it relatively easy to get close to others and are comfortable depending on them. You don't worry too much about being abandoned or about someone getting too close to you.",
      anxious: "You want to be very close to your romantic partners, but you worry that others don't feel the same way about you. You sometimes worry that your partner doesn't really love you or might leave you. You desire a lot of closeness, attention, and reassurance from your partner.",
      avoidant: "You are comfortable without close emotional relationships. It's important to you to feel independent and self-sufficient, and you prefer not to depend on others or have others depend on you. You don't worry about being alone or having others not accept you.",
      disorganized: "You have mixed feelings about close relationships. You want emotionally close relationships, but you find it difficult to trust others completely or to depend on them. You worry that you will be hurt if you allow yourself to become too close to others."
    };
    return descriptions[style];
  }

  private static getRelationshipImplications(style: AttachmentStyle): string[] {
    const implications = {
      secure: [
        "Tend to have satisfying, long-lasting relationships",
        "Communicate needs and feelings effectively",
        "Handle conflict constructively",
        "Provide emotional support to partners",
        "Maintain individual identity within relationships"
      ],
      anxious: [
        "May seek excessive reassurance from partners",
        "Can be sensitive to partner's moods and behaviors",
        "May fear abandonment or rejection",
        "Tend to be very emotionally expressive",
        "May have difficulty with partner's need for space"
      ],
      avoidant: [
        "May have difficulty with emotional intimacy",
        "Tend to value independence over connection",
        "May minimize the importance of close relationships",
        "Can be uncomfortable with partner's emotional needs",
        "May withdraw during conflict or stress"
      ],
      disorganized: [
        "May have unpredictable relationship patterns",
        "Can struggle with emotional regulation",
        "May have conflicting desires for closeness and distance",
        "May benefit from trauma-informed therapy approaches",
        "Can develop more secure patterns with support"
      ]
    };
    return implications[style];
  }

  private static getGrowthAreas(
    style: AttachmentStyle,
    anxietyScore: number,
    avoidanceScore: number
  ): string[] {
    const growthAreas = {
      secure: [
        "Continue developing emotional intelligence",
        "Support partner's growth and development",
        "Model healthy relationship behaviors",
        "Practice gratitude and appreciation"
      ],
      anxious: [
        "Practice self-soothing techniques",
        "Develop individual interests and friendships",
        "Work on building self-esteem and self-worth",
        "Learn to communicate needs without seeking excessive reassurance",
        "Practice mindfulness to manage relationship anxiety"
      ],
      avoidant: [
        "Practice emotional expression and vulnerability",
        "Work on identifying and sharing feelings",
        "Learn to recognize and respond to partner's emotional needs",
        "Develop comfort with interdependence",
        "Practice staying present during emotional conversations"
      ],
      disorganized: [
        "Consider working with a trauma-informed therapist",
        "Practice emotional regulation techniques",
        "Work on developing a coherent narrative about relationships",
        "Learn to recognize and manage emotional triggers",
        "Focus on building self-compassion and emotional safety"
      ]
    };

    const areas = [...growthAreas[style]];

    // Add specific recommendations based on scores
    if (anxietyScore > 5.0) {
      areas.push("Focus on anxiety management and self-regulation");
    }
    if (avoidanceScore > 5.0) {
      areas.push("Work on increasing emotional openness and vulnerability");
    }

    return areas;
  }
}

// Attachment-specific interventions and recommendations
export const ATTACHMENT_INTERVENTIONS = {
  secure: {
    maintenance: [
      "Continue practicing gratitude for your relationship",
      "Share appreciation with your partner regularly",
      "Support your partner's growth and independence",
      "Model secure behaviors for your partner"
    ],
    growth: [
      "Explore deeper levels of emotional intimacy",
      "Work on being an even better emotional support",
      "Practice advanced communication skills",
      "Consider couple enrichment activities"
    ]
  },
  anxious: {
    immediate: [
      "Practice deep breathing when feeling anxious about the relationship",
      "Use self-soothing techniques instead of seeking immediate reassurance",
      "Journal about your feelings before discussing with partner",
      "Engage in individual activities that build self-worth"
    ],
    longTerm: [
      "Develop a strong sense of individual identity",
      "Work with a therapist on attachment healing",
      "Practice mindfulness meditation",
      "Build a support network beyond your romantic relationship",
      "Learn about anxiety management techniques"
    ]
  },
  avoidant: {
    immediate: [
      "Practice naming your emotions daily",
      "Set a goal to share one feeling with your partner each day",
      "Notice when you're withdrawing and gently re-engage",
      "Ask your partner about their emotional needs"
    ],
    longTerm: [
      "Work with a therapist on emotional expression",
      "Practice vulnerability in small, safe steps",
      "Learn about the benefits of interdependence",
      "Explore your early attachment experiences",
      "Join a support group or therapy group focused on intimacy"
    ]
  },
  disorganized: {
    immediate: [
      "Focus on emotional safety and regulation",
      "Use grounding techniques during emotional overwhelm",
      "Communicate your attachment needs to your partner",
      "Practice self-compassion when relationships feel difficult"
    ],
    longTerm: [
      "Work with a trauma-informed therapist",
      "Explore your attachment history and patterns",
      "Learn emotional regulation skills (DBT, mindfulness)",
      "Consider EMDR or other trauma therapies",
      "Build a secure attachment through therapy relationship"
    ]
  }
};

// Helper function to get couple compatibility insights
export function getAttachmentCompatibility(
  partner1Style: AttachmentStyle,
  partner2Style: AttachmentStyle
): {
  compatibilityScore: number;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
} {
  const compatibility = ATTACHMENT_COMPATIBILITY_MATRIX[partner1Style][partner2Style];
  return compatibility;
}

// Research-based compatibility matrix
const ATTACHMENT_COMPATIBILITY_MATRIX = {
  secure: {
    secure: {
      compatibilityScore: 95,
      strengths: [
        "Both partners feel safe and supported",
        "Excellent communication and conflict resolution",
        "High relationship satisfaction and stability",
        "Mutual growth and support"
      ],
      challenges: [
        "May occasionally take the relationship for granted",
        "Could benefit from intentional relationship enrichment"
      ],
      recommendations: [
        "Continue regular check-ins and appreciation",
        "Explore new ways to deepen intimacy",
        "Consider relationship enrichment activities"
      ]
    },
    anxious: {
      compatibilityScore: 80,
      strengths: [
        "Secure partner provides stability and reassurance",
        "Anxious partner brings emotional expressiveness",
        "Potential for anxious partner to become more secure",
        "Strong emotional connection"
      ],
      challenges: [
        "Anxious partner may need more reassurance than secure partner naturally gives",
        "Risk of secure partner feeling overwhelmed by anxiety"
      ],
      recommendations: [
        "Secure partner should provide extra reassurance during anxious periods",
        "Anxious partner should work on self-soothing techniques",
        "Both should learn about attachment styles"
      ]
    },
    avoidant: {
      compatibilityScore: 75,
      strengths: [
        "Secure partner models emotional openness",
        "Avoidant partner provides independence and stability",
        "Potential for avoidant partner to become more secure",
        "Balanced relationship dynamic"
      ],
      challenges: [
        "Avoidant partner may struggle with secure partner's need for closeness",
        "Risk of emotional distance developing over time"
      ],
      recommendations: [
        "Avoidant partner should practice emotional expression",
        "Secure partner should respect avoidant partner's need for space",
        "Both should work on finding balance between closeness and independence"
      ]
    },
    disorganized: {
      compatibilityScore: 70,
      strengths: [
        "Secure partner provides stability and safety",
        "Potential for healing and growth",
        "Secure partner can model healthy attachment behaviors"
      ],
      challenges: [
        "Disorganized partner may have unpredictable emotional needs",
        "Secure partner may feel overwhelmed by complexity"
      ],
      recommendations: [
        "Consider couples therapy with trauma-informed approach",
        "Disorganized partner may benefit from individual therapy",
        "Focus on building emotional safety and regulation"
      ]
    }
  },
  anxious: {
    secure: {
      compatibilityScore: 80,
      strengths: [
        "Secure partner provides stability and reassurance",
        "Anxious partner brings emotional expressiveness",
        "Potential for anxious partner to become more secure"
      ],
      challenges: [
        "Anxious partner may need more reassurance than secure partner naturally gives"
      ],
      recommendations: [
        "Secure partner should provide extra reassurance",
        "Anxious partner should work on self-soothing"
      ]
    },
    anxious: {
      compatibilityScore: 60,
      strengths: [
        "High emotional intensity and connection",
        "Both understand need for reassurance",
        "Strong emotional bond"
      ],
      challenges: [
        "Risk of emotional overwhelm and drama",
        "May trigger each other's anxieties",
        "Difficulty providing mutual reassurance when both are anxious"
      ],
      recommendations: [
        "Both partners should develop individual coping strategies",
        "Learn anxiety management techniques together",
        "Consider couples therapy to break anxious cycles"
      ]
    },
    avoidant: {
      compatibilityScore: 45,
      strengths: [
        "Can learn from each other's different approaches",
        "Potential for growth if both are committed"
      ],
      challenges: [
        "Classic anxious-avoidant trap - pursuit and withdrawal",
        "Anxious partner's needs may trigger avoidant partner's withdrawal",
        "High risk of relationship dissatisfaction"
      ],
      recommendations: [
        "Both need to understand their attachment patterns",
        "Anxious partner: reduce pursuit and develop independence",
        "Avoidant partner: practice emotional availability",
        "Couples therapy highly recommended"
      ]
    },
    disorganized: {
      compatibilityScore: 40,
      strengths: [
        "Both understand emotional intensity",
        "Potential for mutual healing"
      ],
      challenges: [
        "High emotional volatility",
        "Risk of triggering each other's insecurities",
        "Difficulty providing mutual stability"
      ],
      recommendations: [
        "Both should focus on individual healing first",
        "Trauma-informed couples therapy essential",
        "Learn emotional regulation techniques"
      ]
    }
  },
  avoidant: {
    secure: {
      compatibilityScore: 75,
      strengths: [
        "Secure partner models emotional openness",
        "Balanced dynamic between independence and connection"
      ],
      challenges: [
        "Avoidant partner may struggle with emotional intimacy"
      ],
      recommendations: [
        "Avoidant partner should practice emotional expression",
        "Secure partner should respect need for space"
      ]
    },
    anxious: {
      compatibilityScore: 45,
      strengths: [
        "Can learn from each other if committed to growth"
      ],
      challenges: [
        "Classic pursue-withdraw dynamic",
        "High conflict potential"
      ],
      recommendations: [
        "Understand attachment cycles",
        "Anxious partner: develop independence",
        "Avoidant partner: practice availability"
      ]
    },
    avoidant: {
      compatibilityScore: 65,
      strengths: [
        "Both value independence and autonomy",
        "Low conflict due to similar needs for space",
        "Mutual respect for boundaries"
      ],
      challenges: [
        "Risk of emotional distance and detachment",
        "May lack emotional intimacy and connection",
        "Difficulty during times requiring emotional support"
      ],
      recommendations: [
        "Both should practice emotional expression",
        "Schedule regular relationship check-ins",
        "Work on building emotional intimacy gradually"
      ]
    },
    disorganized: {
      compatibilityScore: 50,
      strengths: [
        "Avoidant partner may provide stability",
        "Both may understand need for emotional space"
      ],
      challenges: [
        "Avoidant partner may withdraw from disorganized partner's needs",
        "Risk of emotional neglect"
      ],
      recommendations: [
        "Disorganized partner needs individual trauma work",
        "Avoidant partner should learn about trauma responses"
      ]
    }
  },
  disorganized: {
    secure: {
      compatibilityScore: 70,
      strengths: [
        "Secure partner provides stability and healing potential"
      ],
      challenges: [
        "Unpredictable emotional needs may overwhelm secure partner"
      ],
      recommendations: [
        "Trauma-informed therapy approach",
        "Focus on building emotional safety"
      ]
    },
    anxious: {
      compatibilityScore: 40,
      strengths: [
        "Both understand emotional intensity"
      ],
      challenges: [
        "High emotional volatility and instability"
      ],
      recommendations: [
        "Individual healing work essential",
        "Trauma-informed couples therapy"
      ]
    },
    avoidant: {
      compatibilityScore: 50,
      strengths: [
        "Avoidant partner may provide some stability"
      ],
      challenges: [
        "Risk of emotional neglect and withdrawal"
      ],
      recommendations: [
        "Trauma work for disorganized partner",
        "Emotional availability training for avoidant partner"
      ]
    },
    disorganized: {
      compatibilityScore: 35,
      strengths: [
        "Mutual understanding of complex emotional needs",
        "Potential for healing together if both committed"
      ],
      challenges: [
        "High risk of emotional chaos and instability",
        "May trigger each other's trauma responses",
        "Difficulty providing mutual stability and support"
      ],
      recommendations: [
        "Individual trauma therapy for both partners is essential",
        "Trauma-informed couples therapy when individually stable",
        "Focus on emotional regulation and safety first",
        "Consider temporary separation for individual healing if needed"
      ]
    }
  }
};