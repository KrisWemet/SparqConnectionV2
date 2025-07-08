'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { useCouple } from '@/hooks/useCouple';

export function DailyQuestionCard() {
  const { hasCouple } = useCouple();
  const {
    questionData,
    loading,
    error,
    userResponse,
    partnerResponse,
    fetchDailyQuestion,
    submitResponse: submitQuestionResponse,
  } = useDailyQuestion();

  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisRecommendations, setCrisisRecommendations] = useState<string[]>([]);

  const handleSubmitResponse = async () => {
    if (!response.trim()) return;

    setSubmitting(true);
    try {
      const result = await submitQuestionResponse(response);
      
      if (result.crisisDetected) {
        setCrisisRecommendations(result.crisisRecommendations);
        setShowCrisisModal(true);
      }
      
      setResponse('');
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasCouple) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Connect with your partner to unlock daily questions and start building your relationship streak.
          </p>
          <Button disabled className="w-full">
            Invite Partner First
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !questionData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {error || 'Unable to load today\'s question. Please try again.'}
          </p>
          <Button onClick={fetchDailyQuestion} className="w-full">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Today's Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-800 font-medium">
              {questionData.question.content}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Category: {questionData.question.category}
            </p>
          </div>

          {userResponse ? (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Your Response:</p>
                <p className="text-blue-800">{userResponse.content}</p>
              </div>

              {partnerResponse ? (
                <div className="p-3 bg-pink-50 rounded-lg">
                  <p className="text-sm font-medium text-pink-900">Partner's Response:</p>
                  <p className="text-pink-800">{partnerResponse.content}</p>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">Waiting for your partner to respond...</p>
                </div>
              )}

              <Button 
                onClick={fetchDailyQuestion} 
                variant="outline" 
                className="w-full"
              >
                Refresh Responses
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <Button
                onClick={submitResponse}
                disabled={!response.trim() || submitting}
                className="w-full"
              >
                {submitting ? 'Submitting...' : 'Share Response'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showCrisisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              We're Here to Help
            </h3>
            <p className="text-gray-700 mb-4">
              We noticed you might be going through a difficult time. Your wellbeing matters to us.
            </p>
            
            {crisisRecommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Immediate Resources:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {crisisRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Crisis Hotlines:</h4>
              <p className="text-sm text-red-700">
                <strong>National Suicide Prevention Lifeline:</strong><br />
                988 or 1-800-273-8255
              </p>
              <p className="text-sm text-red-700 mt-2">
                <strong>Crisis Text Line:</strong><br />
                Text HOME to 741741
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowCrisisModal(false)}
                variant="outline"
                className="flex-1"
              >
                I'm Safe
              </Button>
              <Button
                onClick={() => {
                  window.open('tel:988', '_blank');
                }}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Call 988
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}