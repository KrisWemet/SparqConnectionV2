'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AttachmentAssessment } from './AttachmentAssessment';
import { LoveLanguagesAssessment } from './LoveLanguagesAssessment';
import type { AttachmentResults, LoveLanguageResults } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { useAuthContext } from '@/lib/auth/AuthProvider';

interface ComprehensivePsychologyAssessmentProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

type AssessmentStep = 
  | 'welcome'
  | 'attachment'
  | 'love_languages'
  | 'gottman'
  | 'cbt_intro'
  | 'mindfulness'
  | 'complete';

interface AssessmentResults {
  attachment?: AttachmentResults;
  loveLanguages?: LoveLanguageResults;
  // Additional results will be added as we implement more modalities
}

export function ComprehensivePsychologyAssessment({ 
  onComplete, 
  onSkip 
}: ComprehensivePsychologyAssessmentProps) {
  const { user } = useAuthContext();
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('welcome');
  const [results, setResults] = useState<AssessmentResults>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assessmentSteps = [
    { id: 'welcome', title: 'Welcome', description: 'Introduction to psychology assessment' },
    { id: 'attachment', title: 'Attachment Style', description: 'How you connect in relationships' },
    { id: 'love_languages', title: 'Love Languages', description: 'How you give and receive love' },
    { id: 'gottman', title: 'Communication Style', description: 'Relationship dynamics (Coming Soon)' },
    { id: 'cbt_intro', title: 'Thinking Patterns', description: 'Cognitive patterns (Coming Soon)' },
    { id: 'mindfulness', title: 'Mindfulness Practice', description: 'Present-moment awareness (Coming Soon)' },
    { id: 'complete', title: 'Complete', description: 'Your personalized insights' }
  ];

  const currentStepIndex = assessmentSteps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / assessmentSteps.length) * 100;

  const handleAttachmentComplete = (attachmentResults: AttachmentResults) => {
    setResults(prev => ({ ...prev, attachment: attachmentResults }));
    setCurrentStep('love_languages');
  };

  const handleLoveLanguagesComplete = (loveLanguageResults: LoveLanguageResults) => {
    setResults(prev => ({ ...prev, loveLanguages: loveLanguageResults }));
    // For now, skip to complete since other assessments aren't implemented yet
    setCurrentStep('complete');
  };

  const handleCompleteAssessment = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Create a comprehensive assessment record
      const { error } = await supabase
        .from('psychology_assessments')
        .insert({
          user_id: user.id,
          assessment_type: 'comprehensive_initial',
          questions_responses: {
            attachment_complete: !!results.attachment,
            love_languages_complete: !!results.loveLanguages,
            // Add other completed assessments
          },
          interpreted_results: {
            attachment: results.attachment,
            love_languages: results.loveLanguages,
            completion_percentage: 40, // 2 out of 5 core assessments complete
            next_steps: [
              'Complete remaining psychological assessments',
              'Begin personalized daily questions',
              'Start couple compatibility analysis when partner joins'
            ]
          },
          is_complete: false, // Will be true when all assessments are done
        });

      if (error) {
        console.error('Error saving comprehensive assessment:', error);
      }

      onComplete?.();
    } catch (error) {
      console.error('Error completing assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'welcome') {
    return <WelcomeStep onNext={() => setCurrentStep('attachment')} onSkip={onSkip} />;
  }

  if (currentStep === 'attachment') {
    return (
      <div className="space-y-6">
        <AssessmentProgress 
          steps={assessmentSteps} 
          currentStep={currentStep} 
          progress={progress} 
        />
        <AttachmentAssessment 
          onComplete={handleAttachmentComplete}
          onSkip={() => setCurrentStep('love_languages')}
        />
      </div>
    );
  }

  if (currentStep === 'love_languages') {
    return (
      <div className="space-y-6">
        <AssessmentProgress 
          steps={assessmentSteps} 
          currentStep={currentStep} 
          progress={progress} 
        />
        <LoveLanguagesAssessment 
          onComplete={handleLoveLanguagesComplete}
          onSkip={() => setCurrentStep('complete')}
        />
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <CompletionStep 
        results={results}
        onComplete={handleCompleteAssessment}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Placeholder for other assessment steps
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <AssessmentProgress 
        steps={assessmentSteps} 
        currentStep={currentStep} 
        progress={progress} 
      />
      <ComingSoonStep 
        stepTitle={assessmentSteps[currentStepIndex]?.title || 'Assessment'}
        onNext={() => setCurrentStep('complete')}
      />
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ onNext, onSkip }: { onNext: () => void; onSkip?: () => void }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl">🧠💕</div>
            <CardTitle className="text-3xl">
              Welcome to Your Psychology Assessment
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Discover the science behind your relationships
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Understanding your psychological patterns is the foundation for building stronger, 
                more fulfilling relationships. Our comprehensive assessment combines insights from 
                10+ therapeutic modalities to create your personalized relationship profile.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">What you'll discover:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: '🤗', title: 'Attachment Style', desc: 'How you connect and bond' },
                  { icon: '💬', title: 'Love Languages', desc: 'How you give and receive love' },
                  { icon: '🗣️', title: 'Communication Patterns', desc: 'Your conflict resolution style' },
                  { icon: '🧘', title: 'Mindfulness Profile', desc: 'Your awareness and presence' },
                  { icon: '💭', title: 'Thinking Patterns', desc: 'Your cognitive tendencies' },
                  { icon: '🌟', title: 'Personal Strengths', desc: 'Your unique relationship gifts' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">
                    Assessment Overview
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Takes 15-20 minutes to complete</li>
                    <li>• Based on validated psychological research</li>
                    <li>• Your data is private and encrypted</li>
                    <li>• Results help personalize your experience</li>
                    <li>• Can be completed in multiple sessions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={onNext} className="flex-1">
                Start Assessment
              </Button>
              {onSkip && (
                <Button variant="outline" onClick={onSkip} className="flex-1">
                  Skip for Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Assessment Progress Component
function AssessmentProgress({ 
  steps, 
  currentStep, 
  progress 
}: { 
  steps: Array<{ id: string; title: string; description: string }>;
  currentStep: string;
  progress: number;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Psychology Assessment Progress
            </h2>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {steps.map((step, index) => {
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const isCurrent = step.id === currentStep;
              
              return (
                <div 
                  key={step.id}
                  className={`text-center p-2 rounded ${
                    isCompleted 
                      ? 'bg-green-50 text-green-700' 
                      : isCurrent 
                        ? 'bg-pink-50 text-pink-700' 
                        : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <div className="font-medium">{step.title}</div>
                  {isCurrent && (
                    <div className="text-gray-600 mt-1">{step.description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Coming Soon Step Component
function ComingSoonStep({ 
  stepTitle, 
  onNext 
}: { 
  stepTitle: string; 
  onNext: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="text-center space-y-4">
          <div className="text-6xl">🚧</div>
          <CardTitle className="text-2xl">
            {stepTitle} Assessment
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          <p className="text-gray-600">
            This assessment is coming soon! We're working hard to bring you comprehensive 
            psychological insights across all major therapeutic modalities.
          </p>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">What's Next</h3>
            <p className="text-sm text-purple-800">
              For now, let's complete your initial profile with the assessments that are ready. 
              You can always return to complete additional assessments as they become available.
            </p>
          </div>
          
          <Button onClick={onNext}>
            Continue to Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Completion Step Component
function CompletionStep({ 
  results, 
  onComplete, 
  isSubmitting 
}: { 
  results: AssessmentResults;
  onComplete: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <CardTitle className="text-2xl">
              Assessment Complete!
            </CardTitle>
            <p className="text-gray-600">
              You've completed the initial phase of your psychology assessment
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Your Results Summary</h3>
              
              {results.attachment && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🤗</span>
                    <div>
                      <div className="font-medium text-green-900">Attachment Style</div>
                      <div className="text-sm text-green-800">
                        {results.attachment.attachment_style.charAt(0).toUpperCase() + 
                         results.attachment.attachment_style.slice(1)} Attachment
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {results.loveLanguages && (
                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💕</span>
                    <div>
                      <div className="font-medium text-pink-900">Love Language</div>
                      <div className="text-sm text-pink-800">
                        Primary: {results.loveLanguages.primary.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">What's Next</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your daily questions will be personalized based on these insights</li>
                <li>• Complete additional assessments as they become available</li>
                <li>• Invite your partner to create a comprehensive couple profile</li>
                <li>• Start your journey with science-backed relationship practices</li>
              </ul>
            </div>

            <Button 
              onClick={onComplete} 
              loading={isSubmitting}
              className="w-full"
            >
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}