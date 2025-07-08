/**
 * Love Languages Assessment System
 * Based on Gary Chapman's research and validated instruments
 */

import { LoveLanguage, LoveLanguageQuestion, LoveLanguageResults } from '@/types';

// Research-based love languages assessment questions
export const LOVE_LANGUAGE_QUESTIONS: LoveLanguageQuestion[] = [
  {
    id: 'q1',
    text: 'I feel most loved when...',
    options: [
      {
        id: 'q1_a',
        text: 'My partner tells me they love me and appreciate me',
        language: 'words_of_affirmation'
      },
      {
        id: 'q1_b',
        text: 'My partner helps me with tasks or does something practical for me',
        language: 'acts_of_service'
      },
      {
        id: 'q1_c',
        text: 'My partner gives me their undivided attention',
        language: 'quality_time'
      },
      {
        id: 'q1_d',
        text: 'My partner surprises me with a thoughtful gift',
        language: 'receiving_gifts'
      },
      {
        id: 'q1_e',
        text: 'My partner gives me a hug, holds my hand, or shows physical affection',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q2',
    text: 'What would hurt me most in a relationship?',
    options: [
      {
        id: 'q2_a',
        text: 'My partner criticizing me or speaking harshly to me',
        language: 'words_of_affirmation'
      },
      {
        id: 'q2_b',
        text: 'My partner constantly asking me to do things for them',
        language: 'acts_of_service'
      },
      {
        id: 'q2_c',
        text: 'My partner being distracted or not listening when I talk',
        language: 'quality_time'
      },
      {
        id: 'q2_d',
        text: 'My partner forgetting important occasions like my birthday',
        language: 'receiving_gifts'
      },
      {
        id: 'q2_e',
        text: 'My partner being physically distant or avoiding touch',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q3',
    text: 'I feel most connected to my partner when...',
    options: [
      {
        id: 'q3_a',
        text: 'They express their feelings for me in words',
        language: 'words_of_affirmation'
      },
      {
        id: 'q3_b',
        text: 'They do something to help me without being asked',
        language: 'acts_of_service'
      },
      {
        id: 'q3_c',
        text: 'We spend uninterrupted time together',
        language: 'quality_time'
      },
      {
        id: 'q3_d',
        text: 'They give me something that shows they were thinking of me',
        language: 'receiving_gifts'
      },
      {
        id: 'q3_e',
        text: 'We are physically close and affectionate',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q4',
    text: 'When I want to show love to my partner, I usually...',
    options: [
      {
        id: 'q4_a',
        text: 'Tell them how much they mean to me',
        language: 'words_of_affirmation'
      },
      {
        id: 'q4_b',
        text: 'Do something helpful for them',
        language: 'acts_of_service'
      },
      {
        id: 'q4_c',
        text: 'Plan special time together',
        language: 'quality_time'
      },
      {
        id: 'q4_d',
        text: 'Give them a gift or surprise',
        language: 'receiving_gifts'
      },
      {
        id: 'q4_e',
        text: 'Give them a hug, kiss, or other physical affection',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q5',
    text: 'I feel most appreciated when my partner...',
    options: [
      {
        id: 'q5_a',
        text: 'Compliments me or expresses gratitude',
        language: 'words_of_affirmation'
      },
      {
        id: 'q5_b',
        text: 'Takes care of something I needed to do',
        language: 'acts_of_service'
      },
      {
        id: 'q5_c',
        text: 'Makes time to really listen to me',
        language: 'quality_time'
      },
      {
        id: 'q5_d',
        text: 'Brings me something they know I\'ll enjoy',
        language: 'receiving_gifts'
      },
      {
        id: 'q5_e',
        text: 'Shows physical affection',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q6',
    text: 'When I\'m stressed, I most want my partner to...',
    options: [
      {
        id: 'q6_a',
        text: 'Tell me everything will be okay and that they believe in me',
        language: 'words_of_affirmation'
      },
      {
        id: 'q6_b',
        text: 'Help me with practical things to reduce my stress',
        language: 'acts_of_service'
      },
      {
        id: 'q6_c',
        text: 'Sit with me and give me their full attention',
        language: 'quality_time'
      },
      {
        id: 'q6_d',
        text: 'Surprise me with something to cheer me up',
        language: 'receiving_gifts'
      },
      {
        id: 'q6_e',
        text: 'Hold me or give me physical comfort',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q7',
    text: 'I feel most secure in my relationship when...',
    options: [
      {
        id: 'q7_a',
        text: 'My partner regularly tells me they love me',
        language: 'words_of_affirmation'
      },
      {
        id: 'q7_b',
        text: 'My partner consistently shows they care through their actions',
        language: 'acts_of_service'
      },
      {
        id: 'q7_c',
        text: 'My partner prioritizes spending time with me',
        language: 'quality_time'
      },
      {
        id: 'q7_d',
        text: 'My partner remembers and celebrates important moments',
        language: 'receiving_gifts'
      },
      {
        id: 'q7_e',
        text: 'My partner is physically affectionate with me',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q8',
    text: 'The best way for my partner to comfort me is...',
    options: [
      {
        id: 'q8_a',
        text: 'Saying encouraging and supportive words',
        language: 'words_of_affirmation'
      },
      {
        id: 'q8_b',
        text: 'Doing something practical to help me',
        language: 'acts_of_service'
      },
      {
        id: 'q8_c',
        text: 'Being present and available to listen',
        language: 'quality_time'
      },
      {
        id: 'q8_d',
        text: 'Bringing me something thoughtful',
        language: 'receiving_gifts'
      },
      {
        id: 'q8_e',
        text: 'Giving me physical comfort like hugs',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q9',
    text: 'When celebrating an achievement, I most want my partner to...',
    options: [
      {
        id: 'q9_a',
        text: 'Tell me how proud they are of me',
        language: 'words_of_affirmation'
      },
      {
        id: 'q9_b',
        text: 'Take care of everything so I can relax and celebrate',
        language: 'acts_of_service'
      },
      {
        id: 'q9_c',
        text: 'Spend dedicated time celebrating with me',
        language: 'quality_time'
      },
      {
        id: 'q9_d',
        text: 'Give me a special gift to commemorate the occasion',
        language: 'receiving_gifts'
      },
      {
        id: 'q9_e',
        text: 'Celebrate with hugs, kisses, and physical affection',
        language: 'physical_touch'
      }
    ]
  },
  {
    id: 'q10',
    text: 'What would make me feel most loved on an ordinary day?',
    options: [
      {
        id: 'q10_a',
        text: 'A text or note telling me they\'re thinking of me',
        language: 'words_of_affirmation'
      },
      {
        id: 'q10_b',
        text: 'Coming home to find they\'ve done something helpful',
        language: 'acts_of_service'
      },
      {
        id: 'q10_c',
        text: 'Having an uninterrupted conversation over dinner',
        language: 'quality_time'
      },
      {
        id: 'q10_d',
        text: 'A small, unexpected gift or surprise',
        language: 'receiving_gifts'
      },
      {
        id: 'q10_e',
        text: 'A warm hug or physical affection when they get home',
        language: 'physical_touch'
      }
    ]
  }
];

// Love language descriptions and characteristics
export const LOVE_LANGUAGE_PROFILES = {
  words_of_affirmation: {
    name: 'Words of Affirmation',
    description: 'You feel most loved when your partner expresses their feelings verbally, offers compliments, and speaks encouraging words. Verbal appreciation and acknowledgment mean the world to you.',
    characteristics: [
      'Values verbal expressions of love and appreciation',
      'Feels hurt by harsh or critical words',
      'Appreciates compliments and encouraging messages',
      'Loves hearing "I love you" regularly',
      'Values verbal recognition of efforts and achievements'
    ],
    daily_actions: [
      'Send loving text messages throughout the day',
      'Give specific compliments about what you appreciate',
      'Say "I love you" and express gratitude regularly',
      'Leave encouraging notes',
      'Verbally acknowledge their efforts and contributions',
      'Express pride in their achievements',
      'Use their name affectionately',
      'Offer verbal encouragement during challenges'
    ],
    partner_guidance: [
      'Remember that your words have power to build up or tear down',
      'Be generous with compliments and appreciation',
      'Avoid harsh criticism or speaking in anger',
      'Express your feelings verbally rather than assuming they know',
      'Use positive and encouraging language',
      'Write thoughtful messages and notes',
      'Acknowledge their efforts and contributions daily'
    ]
  },
  quality_time: {
    name: 'Quality Time',
    description: 'You feel most loved when your partner gives you their undivided attention. Being together, sharing experiences, and having meaningful conversations fills your love tank.',
    characteristics: [
      'Values undivided attention and presence',
      'Feels hurt when partner is distracted or interrupts',
      'Appreciates shared activities and experiences',
      'Loves meaningful conversations',
      'Values consistent time together'
    ],
    daily_actions: [
      'Put away devices during conversations',
      'Plan regular one-on-one time together',
      'Take walks and talk without distractions',
      'Share meals together without TV or phones',
      'Listen actively when they speak',
      'Plan shared activities and experiences',
      'Have regular check-ins about your relationship',
      'Create rituals for spending time together'
    ],
    partner_guidance: [
      'Give them your full attention when together',
      'Plan regular dates and activities',
      'Minimize distractions during your time together',
      'Be present and engaged in conversations',
      'Create shared experiences and memories',
      'Show interest in their thoughts and feelings',
      'Make time together a priority in your schedule'
    ]
  },
  physical_touch: {
    name: 'Physical Touch',
    description: 'You feel most loved through physical expressions of affection. Hugs, kisses, holding hands, and other appropriate touch communicate love directly to your heart.',
    characteristics: [
      'Values physical affection and closeness',
      'Feels disconnected when touch is absent',
      'Appreciates both sexual and non-sexual touch',
      'Loves hugs, kisses, and hand-holding',
      'Values physical presence during difficult times'
    ],
    daily_actions: [
      'Give hugs and kisses regularly',
      'Hold hands while walking or sitting together',
      'Offer shoulder rubs or back rubs',
      'Cuddle while watching movies or relaxing',
      'Touch their arm or shoulder during conversation',
      'Sit close together rather than apart',
      'Give physical comfort during stress',
      'Show affection through appropriate public touch'
    ],
    partner_guidance: [
      'Initiate appropriate physical affection regularly',
      'Respect their need for physical closeness',
      'Use touch to comfort during difficult times',
      'Be mindful of their comfort level with public affection',
      'Make physical connection a daily priority',
      'Remember that non-sexual touch is also important',
      'Use physical touch to show support and encouragement'
    ]
  },
  acts_of_service: {
    name: 'Acts of Service',
    description: 'You feel most loved when your partner does helpful things for you. Actions speak louder than words, and you appreciate when someone lightens your load through practical help.',
    characteristics: [
      'Values helpful actions and practical support',
      'Feels loved when partner anticipates needs',
      'Appreciates when partner follows through on commitments',
      'Feels hurt when partner is lazy or unhelpful',
      'Values reliability and dependability'
    ],
    daily_actions: [
      'Help with household chores and tasks',
      'Take care of responsibilities without being asked',
      'Follow through on promises and commitments',
      'Anticipate and meet their practical needs',
      'Help with projects or tasks they find difficult',
      'Take care of things that stress them',
      'Be reliable and dependable in your actions',
      'Look for ways to make their life easier'
    ],
    partner_guidance: [
      'Pay attention to tasks that would help them',
      'Follow through on what you say you\'ll do',
      'Anticipate their needs and offer help',
      'Be reliable and consistent in your actions',
      'Take initiative rather than waiting to be asked',
      'Help reduce their stress through practical support',
      'Show love through helpful actions, not just words'
    ]
  },
  receiving_gifts: {
    name: 'Receiving Gifts',
    description: 'You feel most loved when your partner gives you thoughtful gifts. It\'s not about the cost, but the thought and effort that went into choosing something special for you.',
    characteristics: [
      'Values thoughtful gifts and surprises',
      'Appreciates the thought behind the gift more than cost',
      'Feels hurt when special occasions are forgotten',
      'Loves unexpected surprises',
      'Values symbols of love and remembrance'
    ],
    daily_actions: [
      'Give small, thoughtful gifts regularly',
      'Remember special occasions and anniversaries',
      'Bring them something when you\'ve been away',
      'Notice things they mention wanting',
      'Create handmade gifts or tokens of affection',
      'Surprise them with their favorite treats',
      'Give gifts that show you were thinking of them',
      'Make gifts meaningful rather than expensive'
    ],
    partner_guidance: [
      'Pay attention to things they mention liking',
      'Remember important dates and occasions',
      'Give gifts that show thoughtfulness, not just expense',
      'Look for opportunities to surprise them',
      'Make gifts personal and meaningful',
      'Consider their interests when choosing gifts',
      'The thought and effort matter more than the cost'
    ]
  }
};

// Scoring and results calculation
export class LoveLanguageAssessmentScorer {
  static calculateResults(responses: Record<string, string>): LoveLanguageResults {
    // Count selections for each love language
    const scores: Record<LoveLanguage, number> = {
      words_of_affirmation: 0,
      quality_time: 0,
      physical_touch: 0,
      acts_of_service: 0,
      receiving_gifts: 0
    };

    // Count responses for each language
    Object.values(responses).forEach(optionId => {
      // Find the language for this option
      for (const question of LOVE_LANGUAGE_QUESTIONS) {
        const option = question.options.find(opt => opt.id === optionId);
        if (option) {
          scores[option.language]++;
          break;
        }
      }
    });

    // Find primary and secondary languages
    const sortedLanguages = Object.entries(scores)
      .sort(([, a], [, b]) => b - a) as [LoveLanguage, number][];

    const primary = sortedLanguages[0][0];
    const secondary = sortedLanguages[1][1] > 0 ? sortedLanguages[1][0] : undefined;

    const profile = LOVE_LANGUAGE_PROFILES[primary];

    return {
      primary,
      secondary,
      scores,
      description: profile.description,
      daily_actions: profile.daily_actions,
      partner_guidance: profile.partner_guidance
    };
  }
}

// Helper function to get love language compatibility
export function getLoveLanguageCompatibility(
  partner1: LoveLanguage,
  partner2: LoveLanguage
): {
  compatibilityScore: number;
  insights: string[];
  recommendations: string[];
} {
  const compatibility = LOVE_LANGUAGE_COMPATIBILITY[partner1][partner2];
  return compatibility;
}

// Love language compatibility matrix
const LOVE_LANGUAGE_COMPATIBILITY = {
  words_of_affirmation: {
    words_of_affirmation: {
      compatibilityScore: 90,
      insights: [
        'Both partners highly value verbal expressions of love',
        'Natural understanding of each other\'s communication needs',
        'Strong foundation for emotional connection through words'
      ],
      recommendations: [
        'Continue expressing appreciation and love verbally',
        'Be mindful not to take verbal affirmation for granted',
        'Also explore the other love languages for deeper connection'
      ]
    },
    quality_time: {
      compatibilityScore: 85,
      insights: [
        'Complementary needs: words and presence',
        'Quality conversations can satisfy both languages',
        'Natural tendency toward meaningful communication'
      ],
      recommendations: [
        'Combine quality time with verbal appreciation',
        'Use conversation time to express affirmation',
        'Practice active listening during time together'
      ]
    },
    physical_touch: {
      compatibilityScore: 75,
      insights: [
        'Different primary ways of expressing and receiving love',
        'Potential for rich, multi-modal expressions of affection',
        'May need intentional effort to meet both needs'
      ],
      recommendations: [
        'Words partner: also express appreciation through appropriate touch',
        'Touch partner: verbalize feelings along with physical affection',
        'Learn to appreciate both verbal and physical expressions'
      ]
    },
    acts_of_service: {
      compatibilityScore: 80,
      insights: [
        'Actions and words can reinforce each other powerfully',
        'Different but complementary ways of showing care',
        'Opportunity for well-rounded expressions of love'
      ],
      recommendations: [
        'Words partner: acknowledge and appreciate acts of service verbally',
        'Service partner: explain the love behind your helpful actions',
        'Combine practical help with verbal encouragement'
      ]
    },
    receiving_gifts: {
      compatibilityScore: 70,
      insights: [
        'Both value thoughtfulness but in different forms',
        'Words can make gifts more meaningful',
        'Different primary expressions but compatible values'
      ],
      recommendations: [
        'Words partner: accompany gifts with heartfelt notes or messages',
        'Gifts partner: express the meaning behind your gifts verbally',
        'Focus on the thoughtfulness behind both words and gifts'
      ]
    }
  },
  quality_time: {
    words_of_affirmation: {
      compatibilityScore: 85,
      insights: [
        'Time together provides opportunity for verbal affirmation',
        'Complementary needs that can be met simultaneously',
        'Strong foundation for deep, meaningful connection'
      ],
      recommendations: [
        'Use quality time for meaningful conversations',
        'Express appreciation verbally during time together',
        'Practice giving full attention when speaking'
      ]
    },
    quality_time: {
      compatibilityScore: 95,
      insights: [
        'Perfect match for spending meaningful time together',
        'Natural understanding of each other\'s need for presence',
        'Strong foundation for shared experiences and deep connection'
      ],
      recommendations: [
        'Prioritize regular, uninterrupted time together',
        'Create shared rituals and traditions',
        'Plan diverse activities to keep time together fresh'
      ]
    },
    physical_touch: {
      compatibilityScore: 80,
      insights: [
        'Physical closeness during quality time enhances both languages',
        'Natural tendency toward intimate, connected moments',
        'Physical presence satisfies both needs'
      ],
      recommendations: [
        'Combine physical affection with quality time',
        'Hold hands, cuddle while talking or sharing activities',
        'Use physical touch to enhance presence and connection'
      ]
    },
    acts_of_service: {
      compatibilityScore: 75,
      insights: [
        'Service can create more time for meaningful connection',
        'Different priorities that can complement each other',
        'Opportunity to show love through both presence and practical help'
      ],
      recommendations: [
        'Time partner: appreciate how acts of service create more quality time',
        'Service partner: make time for presence alongside practical help',
        'Use service as a way to protect and prioritize time together'
      ]
    },
    receiving_gifts: {
      compatibilityScore: 70,
      insights: [
        'Gifts can represent time and thoughtfulness',
        'Time together can include gift-giving occasions',
        'Different expressions but compatible underlying values'
      ],
      recommendations: [
        'Time partner: give gifts that involve shared experiences',
        'Gifts partner: focus on presence during gift-giving moments',
        'Plan special occasions that combine both languages'
      ]
    }
  },
  physical_touch: {
    words_of_affirmation: {
      compatibilityScore: 75,
      insights: [
        'Touch can be accompanied by loving words',
        'Different but powerful ways of expressing affection',
        'Opportunity for rich, multi-sensory love expressions'
      ],
      recommendations: [
        'Combine physical affection with verbal expressions',
        'Touch partner: verbalize feelings during physical moments',
        'Words partner: include appropriate touch with verbal affirmation'
      ]
    },
    quality_time: {
      compatibilityScore: 80,
      insights: [
        'Physical closeness enhances quality time',
        'Natural tendency toward intimate, connected moments',
        'Physical presence satisfies both needs'
      ],
      recommendations: [
        'Include physical affection during quality time',
        'Plan activities that allow for physical closeness',
        'Use touch to enhance presence and connection'
      ]
    },
    physical_touch: {
      compatibilityScore: 95,
      insights: [
        'Perfect match for physical affection and closeness',
        'Natural understanding of each other\'s need for touch',
        'Strong foundation for intimate, connected relationship'
      ],
      recommendations: [
        'Maintain regular physical affection throughout the day',
        'Respect each other\'s preferences for different types of touch',
        'Use physical connection to comfort and support each other'
      ]
    },
    acts_of_service: {
      compatibilityScore: 70,
      insights: [
        'Different primary expressions of love',
        'Service can include physical care and comfort',
        'Opportunity to learn multiple ways of showing care'
      ],
      recommendations: [
        'Touch partner: appreciate the love behind practical help',
        'Service partner: include physical comfort in your caring actions',
        'Learn to value both physical and practical expressions of love'
      ]
    },
    receiving_gifts: {
      compatibilityScore: 65,
      insights: [
        'Different primary love languages requiring intentional bridge',
        'Touch can accompany gift-giving moments',
        'Both value thoughtfulness in different forms'
      ],
      recommendations: [
        'Touch partner: show appreciation for gifts through physical affection',
        'Gifts partner: include physical presentation when giving gifts',
        'Focus on the caring intention behind both expressions'
      ]
    }
  },
  acts_of_service: {
    words_of_affirmation: {
      compatibilityScore: 80,
      insights: [
        'Actions and words reinforce each other powerfully',
        'Words can explain and appreciate the love behind actions',
        'Complementary expressions that create well-rounded love'
      ],
      recommendations: [
        'Service partner: explain the love and thought behind your actions',
        'Words partner: verbally acknowledge and appreciate helpful acts',
        'Combine practical help with encouraging words'
      ]
    },
    quality_time: {
      compatibilityScore: 75,
      insights: [
        'Service can create more time for meaningful connection',
        'Helping each other can be a form of quality time',
        'Different priorities that can support each other'
      ],
      recommendations: [
        'Include your partner in service activities when possible',
        'Use acts of service to protect and create quality time',
        'Appreciate how practical help enables better time together'
      ]
    },
    physical_touch: {
      compatibilityScore: 70,
      insights: [
        'Service can include physical care and comfort',
        'Different expressions that can complement each other',
        'Both involve caring through physical means'
      ],
      recommendations: [
        'Service partner: include physical comfort in caring actions',
        'Touch partner: show appreciation through physical affection',
        'Combine practical help with physical connection'
      ]
    },
    acts_of_service: {
      compatibilityScore: 90,
      insights: [
        'Perfect understanding of showing love through helpful actions',
        'Natural appreciation for practical support and reliability',
        'Strong foundation built on mutual helpfulness'
      ],
      recommendations: [
        'Continue being reliable and helpful to each other',
        'Appreciate the effort and thought behind each other\'s actions',
        'Also explore other love languages for deeper connection'
      ]
    },
    receiving_gifts: {
      compatibilityScore: 75,
      insights: [
        'Both involve thoughtful action for the partner',
        'Service can include bringing meaningful gifts',
        'Different but compatible ways of showing care'
      ],
      recommendations: [
        'Service partner: occasionally include thoughtful gifts with your help',
        'Gifts partner: appreciate the practical thought behind helpful actions',
        'Recognize thoughtfulness in both gifts and service'
      ]
    }
  },
  receiving_gifts: {
    words_of_affirmation: {
      compatibilityScore: 70,
      insights: [
        'Words can make gifts more meaningful and personal',
        'Both value thoughtfulness and intentional expression',
        'Different forms but compatible underlying values'
      ],
      recommendations: [
        'Gifts partner: include heartfelt notes or verbal expressions with gifts',
        'Words partner: appreciate the thought and meaning behind gifts',
        'Focus on the caring intention behind both words and gifts'
      ]
    },
    quality_time: {
      compatibilityScore: 70,
      insights: [
        'Gifts can represent time and thoughtfulness',
        'Gift-giving can be part of quality time together',
        'Both value intention and meaningfulness'
      ],
      recommendations: [
        'Plan gift-giving as part of quality time together',
        'Choose gifts that create opportunities for shared experiences',
        'Focus on the time and thought behind both expressions'
      ]
    },
    physical_touch: {
      compatibilityScore: 65,
      insights: [
        'Different primary expressions requiring intentional connection',
        'Physical presentation can enhance gift-giving',
        'Both value tangible expressions of love'
      ],
      recommendations: [
        'Include physical affection when giving or receiving gifts',
        'Touch partner: show appreciation for gifts through physical response',
        'Gifts partner: present gifts with physical warmth and connection'
      ]
    },
    acts_of_service: {
      compatibilityScore: 75,
      insights: [
        'Both involve thoughtful action for the partner',
        'Service can include bringing meaningful gifts',
        'Different but compatible expressions of caring'
      ],
      recommendations: [
        'Appreciate the thoughtfulness behind both gifts and helpful actions',
        'Service partner: occasionally include small gifts with your help',
        'Gifts partner: recognize service as a valuable form of gift'
      ]
    },
    receiving_gifts: {
      compatibilityScore: 85,
      insights: [
        'Perfect understanding of the meaning behind thoughtful gifts',
        'Natural appreciation for symbols of love and care',
        'Strong foundation built on mutual thoughtfulness'
      ],
      recommendations: [
        'Continue exchanging meaningful gifts regularly',
        'Focus on thoughtfulness rather than expense',
        'Also explore other love languages for deeper connection'
      ]
    }
  }
};