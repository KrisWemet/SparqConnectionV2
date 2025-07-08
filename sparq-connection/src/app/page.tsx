'use client';

import Link from 'next/link';
import { useAuthContext } from '@/lib/auth/AuthProvider';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Home() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <MainLayout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Redirecting to your dashboard...</h1>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Build Stronger
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {" "}Relationships
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered daily connection moments that help couples communicate, grow, 
            and reconnect through personalized questions and insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="px-8">
                Start Your Journey
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card variant="elevated">
            <CardContent className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Daily Questions</h3>
              <p className="text-gray-600">
                AI-generated questions that adapt to your relationship stage and help you discover new things about each other.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Health Dashboard</h3>
              <p className="text-gray-600">
                Track your relationship progress with science-backed metrics and celebrate your growth together.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Private & Secure</h3>
              <p className="text-gray-600">
                Your conversations are encrypted and private. We prioritize your relationship's confidentiality above all.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Philosophy Section */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Philosophy</h2>
          <p className="text-lg text-gray-700 italic">
            "We build rituals, not features. We create moments, not just products."
          </p>
          <p className="text-gray-600 mt-4">
            Every design decision is made to increase the frequency, depth, and joy of daily connection moments between partners.
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 mt-16">
          <h2 className="text-3xl font-semibold text-gray-900">
            Ready to Strengthen Your Connection?
          </h2>
          <p className="text-gray-600">
            Join thousands of couples who are building stronger relationships through daily connection moments.
          </p>
          <Link href="/auth">
            <Button size="lg" className="px-12">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}