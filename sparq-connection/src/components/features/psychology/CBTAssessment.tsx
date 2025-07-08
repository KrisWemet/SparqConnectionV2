'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CBT_QUESTIONS, CBTAssessmentScorer } from '@/lib/psychology/cbtAssessment';
import type { CBTResults } from '@/types';

interface CBTAssessmentProps {
  onComplete: (results: CBTResults) => void;
  onSkip?: () => void;
}

export function CBTAssessment({ onComplete, onSkip }: CBTAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CBTResults | null>(null);

  const currentQuestion = CBT_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / CBT_QUESTIONS.length) * 100;
  const canProceed = responses[currentQuestion?.id] !== undefined;

  const handleResponse = (value: number) => {
    if (!currentQuestion) return;
    
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < CBT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate results
      const calculatedResults = CBTAssessmentScorer.calculateScores(responses);
      setResults(calculatedResults);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (results) {
      onComplete(results);
    }
  };

  if (showResults && results) {
    return <CBTResults results={results} onComplete={handleComplete} />;
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Thinking Patterns Assessment
                </h2>
                <p className="text-sm text-gray-600">
                  Understanding your cognitive patterns in relationships
                </p>
              </div>
              <span className="text-sm text-gray-600">
                {currentQuestionIndex + 1} of {CBT_QUESTIONS.length}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {currentQuestionIndex + 1}
                </span>
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">
                  How much do you agree with this statement?
                </CardTitle>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-800 text-lg leading-relaxed">
                "{currentQuestion.text}"
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Response Scale */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Strongly Disagree</span>
                <span>Neutral</span>
                <span>Strongly Agree</span>
              </div>
              
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleResponse(value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                      responses[currentQuestion.id] === value
                        ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-110'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <span key={value} className="w-10 text-center">
                    {value === 1 && 'Never'}
                    {value === 2 && 'Rarely'}
                    {value === 3 && 'Sometimes'}
                    {value === 4 && 'Neutral'}
                    {value === 5 && 'Often'}
                    {value === 6 && 'Usually'}
                    {value === 7 && 'Always'}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <div className="flex space-x-3">
                {onSkip && (
                  <Button variant="outline" onClick={onSkip}>
                    Skip Assessment
                  </Button>
                )}
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                >
                  {currentQuestionIndex === CBT_QUESTIONS.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-purple-900 mb-1">
                  About This Assessment
                </h3>
                <p className="text-sm text-purple-800">
                  This assessment helps identify common thinking patterns that can affect relationships. 
                  Understanding these patterns is the first step toward more balanced, helpful thoughts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// CBT Results Component
function CBTResults({ results, onComplete }: { results: CBTResults; onComplete: () => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent cognitive flexibility';
    if (score >= 60) return 'Good thinking patterns with room for growth';
    return 'Significant opportunity for improvement';
  };

  const formatDistortionName = (distortion: string) => {
    return distortion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl">🧠</div>
            <CardTitle className="text-2xl">
              Your Thinking Patterns Assessment
            </CardTitle>
            <p className="text-gray-600">
              Understanding your cognitive patterns in relationships
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(results.cognitive_flexibility_score)}`}>
                {results.cognitive_flexibility_score}
              </div>
              <div className="text-sm text-gray-600">Cognitive Flexibility Score</div>
              <div className="text-xs text-gray-500 mt-1">
                {getScoreDescription(results.cognitive_flexibility_score)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Patterns */}
      {results.primary_distortions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Primary Thought Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.primary_distortions.map((distortion, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-600">→</span>
                  <div>
                    <div className="font-medium text-orange-900">
                      {formatDistortionName(distortion)}
                    </div>
                    <div className="text-sm text-orange-800">
                      {getDistortionDescription(distortion)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {results.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Your Cognitive Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Areas */}
      {results.growth_areas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Areas for Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.growth_areas.map((area, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-blue-600 mt-1">→</span>
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interventions */}
      {results.interventions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.interventions.slice(0, 3).map((intervention, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mt-1">{index + 1}.</span>
                  <span className="text-blue-900">{intervention}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your thinking patterns assessment is complete! These insights will help 
              personalize your daily questions and growth recommendations.
            </p>
            <Button onClick={onComplete} className="w-full">
              Continue Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function for distortion descriptions
function getDistortionDescription(distortion: string): string {
  const descriptions = {
    catastrophizing: 'Tendency to expect the worst-case scenario in relationship situations',
    mind_reading: 'Assuming you know what your partner thinks without asking',
    all_or_nothing: 'Seeing relationship situations in black and white terms',
    emotional_reasoning: 'Believing your emotions always reflect reality',
    personalization: 'Taking responsibility for things beyond your control',
    should_statements: 'Having rigid expectations about how relationships "should" be',
    mental_filtering: 'Focusing primarily on negative aspects of your relationship'
  };
  
  return descriptions[distortion as keyof typeof descriptions] || 'Common cognitive pattern that affects relationships';
}