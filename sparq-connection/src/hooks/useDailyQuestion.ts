'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/lib/auth/AuthProvider';
import { useCouple } from '@/hooks/useCouple';

interface DailyQuestion {
  id: string;
  couple_id: string;
  content: string;
  category: string;
  date: string;
  created_at: string;
}

interface Response {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  is_private: boolean;
  timestamp: string;
  created_at: string;
}

interface DailyQuestionData {
  question: DailyQuestion;
  responses: Response[];
}

export function useDailyQuestion() {
  const { user } = useAuthContext();
  const { couple, hasCouple } = useCouple();
  const [questionData, setQuestionData] = useState<DailyQuestionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyQuestion = async () => {
    if (!hasCouple || !couple?.id) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/questions/daily?couple_id=${couple.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setQuestionData(data);
      } else {
        setError(data.error || 'Failed to fetch daily question');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching daily question:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (content: string, isPrivate: boolean = false) => {
    if (!questionData?.question || !content.trim()) {
      throw new Error('Question or content is missing');
    }

    const response = await fetch('/api/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question_id: questionData.question.id,
        content,
        is_private: isPrivate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit response');
    }

    await fetchDailyQuestion();
    
    return {
      response: data.response,
      crisisDetected: data.crisis_detected,
      crisisRecommendations: data.crisis_recommendations || [],
    };
  };

  useEffect(() => {
    if (hasCouple && couple?.id) {
      fetchDailyQuestion();
    }
  }, [hasCouple, couple?.id]);

  const userResponse = questionData?.responses.find(r => r.user_id === user?.id);
  const partnerResponse = questionData?.responses.find(r => r.user_id !== user?.id);

  return {
    questionData,
    loading,
    error,
    userResponse,
    partnerResponse,
    hasAnswered: Boolean(userResponse),
    partnerHasAnswered: Boolean(partnerResponse),
    fetchDailyQuestion,
    submitResponse,
  };
}