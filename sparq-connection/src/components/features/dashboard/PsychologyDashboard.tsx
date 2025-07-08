'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { 
  UserPsychologyProfile, 
  CoupleePsychologyAnalysis,
  AttachmentStyle,
  LoveLanguage,
  DailyPsychologicalCheckin
} from '@/types';
import { supabase } from '@/lib/supabase/client';
import { useAuthContext } from '@/lib/auth/AuthProvider';

interface PsychologyDashboardProps {
  userProfile?: UserPsychologyProfile;
  partnerProfile?: UserPsychologyProfile;
  coupleAnalysis?: CoupleePsychologyAnalysis;
  onStartAssessment?: () => void;
}

export function PsychologyDashboard({ 
  userProfile, 
  partnerProfile, 
  coupleAnalysis,
  onStartAssessment 
}: PsychologyDashboardProps) {
  const { user } = useAuthContext();
  const [todayCheckin, setTodayCheckin] = useState<DailyPsychologicalCheckin | null>(null);
  const [weeklyTrends, setWeeklyTrends] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'individual' | 'couple' | 'growth'>('overview');

  useEffect(() => {
    if (user) {
      loadTodayCheckin();
      loadWeeklyTrends();
    }
  }, [user]);

  const loadTodayCheckin = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_psychological_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();
    
    setTodayCheckin(data);
  };

  const loadWeeklyTrends = async () => {
    if (!user) return;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data } = await supabase
      .from('daily_psychological_checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', weekAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });
    
    setWeeklyTrends(data);
  };

  if (!userProfile) {
    return <AssessmentPrompt onStartAssessment={onStartAssessment} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Psychology Dashboard</h1>
          <p className="text-gray-600">Your personalized relationship intelligence insights</p>
        </div>
        
        {/* Completion Status */}
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            Assessment: {userProfile.assessment_completion_percentage || 0}% complete
          </div>
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${userProfile.assessment_completion_percentage || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'individual', label: 'Individual Growth', icon: '🌱' },
          { id: 'couple', label: 'Couple Insights', icon: '💕' },
          { id: 'growth', label: 'Growth Plan', icon: '🎯' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          userProfile={userProfile}
          partnerProfile={partnerProfile}
          todayCheckin={todayCheckin}
          weeklyTrends={weeklyTrends}
        />
      )}

      {activeTab === 'individual' && (
        <IndividualGrowthTab 
          userProfile={userProfile}
          todayCheckin={todayCheckin}
          weeklyTrends={weeklyTrends}
        />
      )}

      {activeTab === 'couple' && (
        <CoupleInsightsTab 
          userProfile={userProfile}
          partnerProfile={partnerProfile}
          coupleAnalysis={coupleAnalysis}
        />
      )}

      {activeTab === 'growth' && (
        <GrowthPlanTab 
          userProfile={userProfile}
          partnerProfile={partnerProfile}
          coupleAnalysis={coupleAnalysis}
        />
      )}
    </div>
  );
}

// Assessment Prompt Component
function AssessmentPrompt({ onStartAssessment }: { onStartAssessment?: () => void }) {
  return (
    <div className="text-center space-y-6 py-12">
      <div className="text-6xl">🧠💕</div>
      <h2 className="text-2xl font-bold text-gray-900">
        Unlock Your Relationship Intelligence
      </h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Complete your psychology assessment to access personalized insights, 
        couple compatibility analysis, and growth recommendations.
      </p>
      <Button onClick={onStartAssessment} size="lg">
        Start Psychology Assessment
      </Button>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ 
  userProfile, 
  partnerProfile, 
  todayCheckin,
  weeklyTrends 
}: {
  userProfile: UserPsychologyProfile;
  partnerProfile?: UserPsychologyProfile;
  todayCheckin: DailyPsychologicalCheckin | null;
  weeklyTrends: any;
}) {
  const getAttachmentEmoji = (style: AttachmentStyle) => {
    const emojis = {
      secure: '🤗',
      anxious: '😰',
      avoidant: '🛡️',
      disorganized: '🌪️'
    };
    return emojis[style];
  };

  const getLoveLanguageEmoji = (language: LoveLanguage) => {
    const emojis = {
      words_of_affirmation: '💬',
      quality_time: '⏰',
      physical_touch: '🤗',
      acts_of_service: '🛠️',
      receiving_gifts: '🎁'
    };
    return emojis[language];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Attachment Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{getAttachmentEmoji(userProfile.attachment_style)}</span>
            <span>Attachment Style</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <div className="text-lg font-semibold capitalize">
              {userProfile.attachment_style}
            </div>
            <div className="text-sm text-gray-600">
              Security Score: {userProfile.attachment_security_score || 'N/A'}
            </div>
            {partnerProfile && (
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">Partner:</div>
                <div className="flex items-center justify-center space-x-1">
                  <span>{getAttachmentEmoji(partnerProfile.attachment_style)}</span>
                  <span className="text-sm capitalize">{partnerProfile.attachment_style}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Love Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{getLoveLanguageEmoji(userProfile.primary_love_language)}</span>
            <span>Love Language</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <div className="text-lg font-semibold">
              {userProfile.primary_love_language.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            {userProfile.secondary_love_language && (
              <div className="text-sm text-gray-600">
                Secondary: {userProfile.secondary_love_language.replace('_', ' ')}
              </div>
            )}
            {partnerProfile && (
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">Partner:</div>
                <div className="flex items-center justify-center space-x-1">
                  <span>{getLoveLanguageEmoji(partnerProfile.primary_love_language)}</span>
                  <span className="text-sm">
                    {partnerProfile.primary_love_language.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📝</span>
            <span>Today's Check-in</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayCheckin ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mood:</span>
                <span className="font-medium">{todayCheckin.primary_emotion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Relationship:</span>
                <span className="font-medium">{todayCheckin.relationship_satisfaction}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Connection:</span>
                <span className="font-medium">{todayCheckin.connection_feeling}/10</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="text-gray-500">No check-in today</div>
              <Button size="sm" variant="outline">
                Quick Check-in
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Psychological Scores */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Psychological Wellness Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Emotional Regulation', value: userProfile.emotional_regulation_score, color: 'bg-blue-500' },
              { label: 'Mindfulness', value: userProfile.mindfulness_score, color: 'bg-green-500' },
              { label: 'Values Alignment', value: userProfile.values_living_score, color: 'bg-purple-500' },
              { label: 'Life Satisfaction', value: userProfile.life_satisfaction_score, color: 'bg-pink-500' }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-sm text-gray-600">{item.label}</div>
                <div className="relative w-16 h-16 mx-auto">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${(item.value || 0)}, 100`}
                      className={`${item.color.replace('bg-', 'text-')}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{item.value || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Individual Growth Tab Component
function IndividualGrowthTab({ 
  userProfile, 
  todayCheckin,
  weeklyTrends 
}: {
  userProfile: UserPsychologyProfile;
  todayCheckin: DailyPsychologicalCheckin | null;
  weeklyTrends: any;
}) {
  return (
    <div className="space-y-6">
      {/* Individual Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Growth Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { area: 'Self-Awareness', score: userProfile.emotional_awareness_score, target: 80 },
                { area: 'Emotional Regulation', score: userProfile.emotional_regulation_score, target: 75 },
                { area: 'Communication Skills', score: userProfile.interpersonal_effectiveness_score, target: 85 },
                { area: 'Stress Management', score: userProfile.distress_tolerance_score, target: 70 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.area}</span>
                    <span className="text-gray-500">{item.score || 0}/{item.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((item.score || 0) / item.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Character Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile.character_strengths && userProfile.character_strengths.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {userProfile.character_strengths.slice(0, 6).map((strength, index) => (
                  <div key={index} className="px-3 py-2 bg-green-50 text-green-800 rounded-lg text-sm text-center">
                    {strength.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Complete the strengths assessment to see your top character strengths
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Mood Trends */}
      {weeklyTrends && weeklyTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>This Week's Emotional Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {weeklyTrends.map((day: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500">
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    <div className="mt-1 text-2xl">
                      {day.primary_emotion === 'joy' && '😊'}
                      {day.primary_emotion === 'sadness' && '😢'}
                      {day.primary_emotion === 'anxiety' && '😰'}
                      {day.primary_emotion === 'love' && '🥰'}
                      {day.primary_emotion === 'contentment' && '😌'}
                      {!day.primary_emotion && '❓'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {day.relationship_satisfaction}/10
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Growth Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getIndividualRecommendations(userProfile).map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 mt-1">{rec.icon}</span>
                <div>
                  <div className="font-medium text-blue-900">{rec.title}</div>
                  <div className="text-sm text-blue-800">{rec.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Couple Insights Tab Component
function CoupleInsightsTab({ 
  userProfile, 
  partnerProfile, 
  coupleAnalysis 
}: {
  userProfile: UserPsychologyProfile;
  partnerProfile?: UserPsychologyProfile;
  coupleAnalysis?: CoupleePsychologyAnalysis;
}) {
  if (!partnerProfile) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Invite Your Partner
          </h3>
          <p className="text-gray-600 mb-6">
            Get comprehensive couple insights when both partners complete their assessments.
          </p>
          <Button>Send Partner Invitation</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compatibility Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Compatibility Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {coupleAnalysis?.overall_compatibility_score || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Overall Compatibility</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">
                {coupleAnalysis?.love_language_compatibility_score || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Love Language Match</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {coupleAnalysis?.communication_style_match || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Communication Style</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Relationship Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(coupleAnalysis?.shared_strengths || [
                'Both committed to growth',
                'Open communication',
                'Mutual respect'
              ]).map((strength, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(coupleAnalysis?.priority_focus_areas || [
                'Different attachment styles',
                'Communication preferences',
                'Conflict resolution'
              ]).map((challenge, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-orange-600 mt-1">→</span>
                  <span className="text-gray-700">{challenge}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Therapy Modalities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(coupleAnalysis?.recommended_modalities || ['gottman', 'attachment', 'mindfulness']).map((modality, index) => (
              <div key={index} className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-900 capitalize">
                  {modality.replace('_', ' ')}
                </div>
                <div className="text-xs text-purple-700 mt-1">Recommended</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Growth Plan Tab Component
function GrowthPlanTab({ 
  userProfile, 
  partnerProfile, 
  coupleAnalysis 
}: {
  userProfile: UserPsychologyProfile;
  partnerProfile?: UserPsychologyProfile;
  coupleAnalysis?: CoupleePsychologyAnalysis;
}) {
  return (
    <div className="space-y-6">
      {/* Current Focus */}
      <Card>
        <CardHeader>
          <CardTitle>Current Growth Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Individual Goals</h4>
              <div className="space-y-2">
                {getIndividualGoals(userProfile).map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {partnerProfile && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Couple Goals</h4>
                <div className="space-y-2">
                  {getCoupleGoals(userProfile, partnerProfile).map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Plan */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getWeeklyActions(userProfile, partnerProfile).map((action, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <input type="checkbox" className="mt-1 rounded" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {action.modality}
                    </span>
                    <span className="text-xs text-gray-500">{action.timeEstimate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions for recommendations
function getIndividualRecommendations(profile: UserPsychologyProfile) {
  const recommendations = [];
  
  if ((profile.emotional_regulation_score || 0) < 70) {
    recommendations.push({
      icon: '🧘',
      title: 'Practice Emotional Regulation',
      description: 'Try the 4-7-8 breathing technique when feeling overwhelmed'
    });
  }
  
  if ((profile.mindfulness_score || 0) < 60) {
    recommendations.push({
      icon: '🌱',
      title: 'Daily Mindfulness Practice',
      description: 'Start with 5 minutes of mindful awareness each morning'
    });
  }
  
  if (profile.attachment_style === 'anxious') {
    recommendations.push({
      icon: '💪',
      title: 'Build Self-Soothing Skills',
      description: 'Practice self-compassion when anxiety arises in your relationship'
    });
  }
  
  return recommendations;
}

function getIndividualGoals(profile: UserPsychologyProfile) {
  const goals = [];
  
  if ((profile.emotional_regulation_score || 0) < 70) {
    goals.push('Improve emotional regulation skills');
  }
  
  if ((profile.mindfulness_score || 0) < 60) {
    goals.push('Establish daily mindfulness practice');
  }
  
  if (profile.attachment_style === 'anxious') {
    goals.push('Develop secure attachment behaviors');
  }
  
  if (profile.attachment_style === 'avoidant') {
    goals.push('Practice emotional vulnerability');
  }
  
  return goals.length > 0 ? goals : ['Continue personal growth journey'];
}

function getCoupleGoals(profile1: UserPsychologyProfile, profile2: UserPsychologyProfile) {
  const goals = [];
  
  if (profile1.primary_love_language !== profile2.primary_love_language) {
    goals.push('Learn and practice each other\'s love languages');
  }
  
  if (profile1.attachment_style !== profile2.attachment_style) {
    goals.push('Understand and support different attachment needs');
  }
  
  goals.push('Improve daily communication rituals');
  goals.push('Practice conflict resolution skills together');
  
  return goals;
}

function getWeeklyActions(profile: UserPsychologyProfile, partnerProfile?: UserPsychologyProfile) {
  const actions = [];
  
  actions.push({
    title: 'Daily Appreciation Practice',
    description: 'Share one thing you appreciate about your partner each day',
    modality: 'Gottman Method',
    timeEstimate: '2 minutes/day'
  });
  
  if (profile.attachment_style === 'anxious') {
    actions.push({
      title: 'Self-Soothing Practice',
      description: 'Use calming techniques when feeling relationship anxiety',
      modality: 'Attachment Theory',
      timeEstimate: '5-10 minutes'
    });
  }
  
  actions.push({
    title: 'Mindful Communication',
    description: 'Practice listening without planning your response',
    modality: 'Mindfulness',
    timeEstimate: '10 minutes/day'
  });
  
  if (partnerProfile && profile.primary_love_language !== partnerProfile.primary_love_language) {
    actions.push({
      title: 'Love Language Practice',
      description: `Express love using your partner's primary language: ${partnerProfile.primary_love_language.replace('_', ' ')}`,
      modality: 'Love Languages',
      timeEstimate: '5-15 minutes'
    });
  }
  
  return actions;
}