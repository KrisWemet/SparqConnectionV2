'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/layouts/MainLayout';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <SignUpForm
            onSwitchToSignIn={() => setMode('signin')}
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm
            onBackToSignIn={() => setMode('signin')}
          />
        );
      default:
        return (
          <SignInForm
            onSwitchToSignUp={() => setMode('signup')}
            onForgotPassword={() => setMode('reset')}
          />
        );
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <AuthLayout
        title="Sparq Connection"
        subtitle="Building stronger relationships, one moment at a time"
      >
        {renderForm()}
      </AuthLayout>
    </ProtectedRoute>
  );
}