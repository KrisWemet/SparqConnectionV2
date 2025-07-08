'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ATTACHMENT_QUESTIONS, AttachmentAssessmentScorer } from '@/lib/psychology/attachmentAssessment';
import type { AttachmentQuestion, AttachmentResults } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { useAuthContext } from '@/lib/auth/AuthProvider';

interface AttachmentAssessmentProps {
  onComplete?: (results: AttachmentResults) => void;
  onSkip?: () => void;
  isStandalone?: boolean;
}

export function AttachmentAssessment({ 
  onComplete, 
  onSkip, 
  isStandalone = false 
}: AttachmentAssessmentProps) {
  const { user } = useAuthContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<AttachmentResults | null>(null);
  const [startTime] = useState(new Date());

  const currentQuestion = ATTACHMENT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === ATTACHMENT_QUESTIONS.length - 1;
  const progress = ((currentQuestionIndex + 1) / ATTACHMENT_QUESTIONS.length) * 100;

  const handleResponse = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < ATTACHMENT_QUESTIONS.length - 1) {
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
      const assessmentResults = AttachmentAssessmentScorer.calculateScores(responses);
      
      // Calculate completion time
      const completionTimeSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

      // Save assessment to database
      const { error: assessmentError } = await supabase
        .from('psychology_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'attachment',
          questions_responses: responses,
          raw_scores: {
            anxiety: assessmentResults.anxiety_score,
            avoidance: assessmentResults.avoidance_score,
            security: assessmentResults.security_score
          },
          interpreted_results: assessmentResults,
          completion_time_seconds: completionTimeSeconds,
          is_complete: true
        });

      if (assessmentError) {
        console.error('Error saving assessment:', assessmentError);
      }

      // Update or create user psychology profile
      const { error: profileError } = await supabase
        .from('user_psychology_profiles')
        .upsert({
          user_id: user.id,
          attachment_style: assessmentResults.attachment_style,
          attachment_security_score: assessmentResults.security_score,
          attachment_anxiety_score: assessmentResults.anxiety_score,
          attachment_avoidance_score: assessmentResults.avoidance_score,
          assessment_completion_percentage: 25, // Attachment is 1/4 of full assessment
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
    return <AttachmentResults results={results} />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Attachment Style Assessment
              </h2>
              {onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip for now
                </Button>
              )}
            </div>
            
            <p className="text-gray-600">
              Understanding your attachment style helps us personalize your relationship journey. 
              This assessment takes about 5-10 minutes.
            </p>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {ATTACHMENT_QUESTIONS.length}</span>
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
              How much do you agree with this statement?
            </p>
            
            {/* Likert Scale */}
            <div className="space-y-3">
              {[
                { value: 1, label: 'Strongly Disagree' },
                { value: 2, label: 'Disagree' },
                { value: 3, label: 'Slightly Disagree' },
                { value: 4, label: 'Neither Agree nor Disagree' },
                { value: 5, label: 'Slightly Agree' },
                { value: 6, label: 'Agree' },
                { value: 7, label: 'Strongly Agree' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    responses[currentQuestion.id] === option.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={responses[currentQuestion.id] === option.value}
                    onChange={(e) => handleResponse(currentQuestion.id, parseInt(e.target.value))}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-500">{option.value}</span>
                    </div>
                  </div>
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
      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Tips for answering
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Think about your general feelings in romantic relationships</li>
                <li>• There are no right or wrong answers - be honest</li>
                <li>• If you're single, think about past relationships or how you imagine you'd feel</li>
                <li>• Your first instinct is usually the most accurate</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Results Component
function AttachmentResults({ results }: { results: AttachmentResults }) {
  const [showDetails, setShowDetails] = useState(false);

  const getStyleColor = (style: string) => {
    const colors = {
      secure: 'text-green-600 bg-green-50',
      anxious: 'text-yellow-600 bg-yellow-50',
      avoidant: 'text-blue-600 bg-blue-50',
      disorganized: 'text-purple-600 bg-purple-50'
    };
    return colors[style as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getStyleEmoji = (style: string) => {
    const emojis = {
      secure: '🤗',
      anxious: '😰',
      avoidant: '🛡️',
      disorganized: '🌪️'
    };
    return emojis[style as keyof typeof emojis] || '❓';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Results */}
      <Card>
        <CardHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl">{getStyleEmoji(results.attachment_style)}</div>
            <CardTitle className="text-2xl">
              Your Attachment Style: {' '}
              <span className={`px-3 py-1 rounded-full text-lg ${getStyleColor(results.attachment_style)}`}>
                {results.attachment_style.charAt(0).toUpperCase() + results.attachment_style.slice(1)}
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {results.description}
            </p>

            {/* Score Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Your Scores</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{results.security_score}</div>
                  <div className="text-sm text-gray-600">Security</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{results.anxiety_score}</div>
                  <div className="text-sm text-gray-600">Anxiety</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{results.avoidance_score}</div>
                  <div className="text-sm text-gray-600">Avoidance</div>
                </div>
              </div>
            </div>

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
        <>
          <Card>
            <CardHeader>
              <CardTitle>Relationship Implications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.relationship_implications.map((implication, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-pink-600 mt-1">•</span>
                    <span className="text-gray-700">{implication}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.growth_areas.map((area, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Understanding attachment styles helps create stronger relationships
            </h3>
            <p className="text-gray-700">
              Your results will help us personalize your daily questions and relationship insights.
              Next, we'll explore your love languages and communication style.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}