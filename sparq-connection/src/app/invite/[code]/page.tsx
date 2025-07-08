'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthContext } from '@/lib/auth/AuthProvider';
import { useInvitations } from '@/hooks/useInvitations';
import { supabase } from '@/lib/supabase/client';

interface InvitationData {
  id: string;
  inviter_id: string;
  invite_code: string;
  status: string;
  expires_at: string;
  inviter_name?: string;
}

export default function InvitePage() {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthContext();
  const { acceptInvitation } = useInvitations();

  const inviteCode = params.code as string;

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!inviteCode) return;

      try {
        const { data, error } = await supabase
          .from('invitations')
          .select(`
            *,
            inviter:users!invitations_inviter_id_fkey(display_name)
          `)
          .eq('invite_code', inviteCode)
          .eq('status', 'pending')
          .gt('expires_at', new Date().toISOString())
          .single();

        if (error || !data) {
          setError('Invalid or expired invitation code');
        } else {
          setInvitation({
            ...data,
            inviter_name: data.inviter?.display_name || 'Someone'
          });
        }
      } catch (err) {
        setError('Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [inviteCode]);

  const handleAcceptInvitation = async () => {
    if (!invitation || !user) return;

    setAccepting(true);
    setError(null);

    try {
      const { error: acceptError } = await acceptInvitation(invitation.invite_code);

      if (acceptError) {
        setError(acceptError.message || 'Failed to accept invitation');
      } else {
        // Redirect to onboarding or dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invitation...</p>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout
        title="Invalid Invitation"
        subtitle="This invitation link is not valid"
      >
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Invitation Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => router.push('/auth')}
              variant="outline"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <AuthLayout
      title="You're Invited!"
      subtitle="Join your partner on Sparq Connection"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {invitation.inviter_name} invited you to connect
          </CardTitle>
          <p className="text-center text-gray-600">
            Start building stronger connection moments together on Sparq Connection
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isAuthenticated ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Please sign in or create an account to accept this invitation
              </p>
              <Button
                onClick={() => router.push('/auth')}
                className="w-full"
              >
                Sign In / Sign Up
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You'll be connected as a couple</li>
                  <li>• Complete your relationship profile together</li>
                  <li>• Start receiving personalized daily questions</li>
                  <li>• Track your relationship growth and milestones</li>
                </ul>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleAcceptInvitation}
                  loading={accepting}
                  disabled={accepting}
                  className="flex-1"
                >
                  Accept Invitation
                </Button>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Invitation code: <code className="font-mono">{invitation.invite_code}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}