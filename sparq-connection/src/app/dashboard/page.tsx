'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/MainLayout';
import { useAuthContext } from '@/lib/auth/AuthProvider';
import { useCouple } from '@/hooks/useCouple';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateInvitationModal } from '@/components/features/invitations/CreateInvitationModal';
import { DailyQuestionCard } from '@/components/features/questions/DailyQuestionCard';

export default function DashboardPage() {
  const { user, signOut } = useAuthContext();
  const { couple, partner, loading: coupleLoading, hasCouple } = useCouple();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {hasCouple 
                ? `Welcome back, ${user?.user_metadata?.display_name || 'there'}! 👋`
                : `Hi ${user?.user_metadata?.display_name || 'there'}! 👋`
              }
            </h1>
            <Button variant="ghost" onClick={signOut}>
              Sign Out
            </Button>
          </div>

          {coupleLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading your connection...</p>
            </div>
          )}

          {!coupleLoading && hasCouple && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                You're connected with {partner?.display_name}! ✨
              </h2>
              <p className="text-gray-700">
                Your relationship journey has begun. Start building your connection streak with today's question.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DailyQuestionCard />

            <Card>
              <CardHeader>
                <CardTitle>Your Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">
                    {couple?.current_streak || 0}
                  </div>
                  <p className="text-gray-600">Days connected</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {couple?.current_streak ? `Longest: ${couple.longest_streak} days` : 'Start your journey today!'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relationship Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {couple?.health_score || '--'}
                  </div>
                  <p className="text-gray-600">Health Score</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {couple?.health_score ? 'Keep building your connection!' : 'Complete setup to see your score'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  hasCouple ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {hasCouple ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-medium">1</span>
                  )}
                </div>
                <span className={hasCouple ? 'text-green-700' : 'text-gray-700'}>
                  {hasCouple ? `Connected with ${partner?.display_name}` : 'Invite your partner to join'}
                </span>
                {!hasCouple && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsInviteModalOpen(true)}
                  >
                    Send Invite
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">2</span>
                </div>
                <span className="text-gray-600">Complete your relationship profile</span>
                <Button size="sm" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">3</span>
                </div>
                <span className="text-gray-600">Answer your first daily question together</span>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to Sparq Connection! ✨
            </h2>
            <p className="text-gray-700 mb-4">
              You're about to embark on a journey of deeper connection with your partner. 
              Our AI-powered platform will guide you through personalized questions and insights 
              to strengthen your relationship every day.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Next step:</strong> Invite your partner to join you and start building your connection streak together.
            </p>
          </div>
        </div>

        <CreateInvitationModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onSuccess={() => {
            setIsInviteModalOpen(false);
            // Optionally refresh couple data
          }}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}