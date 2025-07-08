'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LOVE_LANGUAGE_QUESTIONS, LoveLanguageAssessmentScorer, LOVE_LANGUAGE_PROFILES } from '@/lib/psychology/loveLanguagesAssessment';
import type { LoveLanguageResults, LoveLanguage } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { useAuthContext } from '@/lib/auth/AuthProvider';

interface LoveLanguagesAssessmentProps {
  onComplete?: (results: LoveLanguageResults) => void;
  onSkip?: () => void;
  isStandalone?: boolean;
}

export function LoveLanguagesAssessment({ 
  onComplete, 
  onSkip, 
  isStandalone = false 
}: LoveLanguagesAssessmentProps) {
  const { user } = useAuthContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<LoveLanguageResults | null>(null);
  const [startTime] = useState(new Date());

  const currentQuestion = LOVE_LANGUAGE_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === LOVE_LANGUAGE_QUESTIONS.length - 1;
  const progress = ((currentQuestionIndex + 1) / LOVE_LANGUAGE_QUESTIONS.length) * 100;

  const handleResponse = (questionId: string, optionId: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < LOVE_LANGUAGE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Calculate results using our scoring algorithm
      const assessmentResults = LoveLanguageAssessmentScorer.calculateResults(responses);
      
      // Calculate completion time
      const completionTimeSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

      // Save assessment to database
      const { error: assessmentError } = await supabase
        .from('psychology_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'love_languages',
          questions_responses: responses,
          raw_scores: assessmentResults.scores,
          interpreted_results: assessmentResults,
          completion_time_seconds: completionTimeSeconds,
          is_complete: true
        });

      if (assessmentError) {
        console.error('Error saving assessment:', assessmentError);
      }

      // Update user psychology profile
      const { error: profileError } = await supabase
        .from('user_psychology_profiles')
        .upsert({
          user_id: user.id,
          primary_love_language: assessmentResults.primary,
          secondary_love_language: assessmentResults.secondary,
          love_language_scores: assessmentResults.scores,
          assessment_completion_percentage: 50, // Attachment + Love Languages = 50%
          last_assessment_update: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      setResults(assessmentResults);
      onComplete?.(assessmentResults);
    } catch (error) {
      console.error('Error processing assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (results) {
    return <LoveLanguageResults results={results} />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Love Languages Assessment
              </h2>
              {onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip for now
                </Button>
              )}
            </div>
            
            <p className="text-gray-600">
              Discover how you most naturally give and receive love. Understanding your love language 
              helps create deeper emotional connection with your partner.
            </p>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {LOVE_LANGUAGE_QUESTIONS.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-pink-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose the option that best describes how you feel:
            </p>
            
            {/* Multiple choice options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    responses[currentQuestion.id] === option.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.id}
                    checked={responses[currentQuestion.id] === option.id}
                    onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500 mt-1"
                  />
                  <span className="text-gray-900 leading-relaxed">
                    {option.text}
                  </span>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!responses[currentQuestion.id]}
                loading={isSubmitting && isLastQuestion}
              >
                {isLastQuestion ? 'Complete Assessment' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Helper Text */}
      <Card className="bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-purple-900 mb-1">
                Understanding Love Languages
              </h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Think about what makes you feel most loved and appreciated</li>
                <li>• Consider how you naturally express love to others</li>
                <li>• There are no wrong answers - choose what resonates most</li>
                <li>• Your love language can evolve over time and relationships</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Results Component
function LoveLanguageResults({ results }: { results: LoveLanguageResults }) {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'partner'>('overview');

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

  const getLoveLanguageColor = (language: LoveLanguage) => {
    const colors = {
      words_of_affirmation: 'text-blue-600 bg-blue-50 border-blue-200',
      quality_time: 'text-green-600 bg-green-50 border-green-200',
      physical_touch: 'text-pink-600 bg-pink-50 border-pink-200',
      acts_of_service: 'text-orange-600 bg-orange-50 border-orange-200',
      receiving_gifts: 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors[language];
  };

  const profile = LOVE_LANGUAGE_PROFILES[results.primary];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Results */}
      <Card>
        <CardHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl">{getLoveLanguageEmoji(results.primary)}</div>
            <CardTitle className="text-2xl">
              Your Primary Love Language
            </CardTitle>
            <div className={`inline-flex px-4 py-2 rounded-full text-lg font-semibold border ${getLoveLanguageColor(results.primary)}`}>
              {profile.name}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed text-center">
              {results.description}
            </p>

            {/* Score Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-center">Your Love Language Scores</h3>
              <div className="space-y-3">
                {Object.entries(results.scores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([language, score]) => {
                    const languageKey = language as LoveLanguage;
                    const percentage = (score / LOVE_LANGUAGE_QUESTIONS.length) * 100;
                    return (
                      <div key={language} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <span className="mr-2">{getLoveLanguageEmoji(languageKey)}</span>
                            {LOVE_LANGUAGE_PROFILES[languageKey].name}
                          </span>
                          <span className="text-sm text-gray-600">{score}/{LOVE_LANGUAGE_QUESTIONS.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {results.secondary && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Your secondary love language is{' '}
                  <span className="font-semibold text-gray-900">
                    {getLoveLanguageEmoji(results.secondary)} {LOVE_LANGUAGE_PROFILES[results.secondary].name}
                  </span>
                </p>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full"
            >
              {showDetails ? 'Hide Details' : 'View Detailed Insights'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {showDetails && (
        <Card>
          <CardHeader>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'daily', label: 'Daily Actions' },
                { id: 'partner', label: 'Partner Guide' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Key Characteristics</h3>
                <ul className="space-y-2">
                  {profile.characteristics.map((characteristic, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-pink-600 mt-1">•</span>
                      <span className="text-gray-700">{characteristic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'daily' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Daily Actions That Fill Your Love Tank</h3>
                <ul className="space-y-3">
                  {results.daily_actions.map((action, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg">
                      <span className="text-pink-600 mt-1">✓</span>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'partner' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">How Your Partner Can Love You Best</h3>
                <ul className="space-y-3">
                  {results.partner_guidance.map((guidance, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 mt-1">💡</span>
                      <span className="text-gray-700">{guidance}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Share Your Love Language
            </h3>
            <p className="text-gray-700">
              Understanding each other's love languages is the first step to deeper connection. 
              Share these results with your partner and discover their love language too.
            </p>
            <div className="text-sm text-gray-600">
              Next, we'll explore your communication and conflict resolution styles.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}