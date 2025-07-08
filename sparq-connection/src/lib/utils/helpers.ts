import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(d);
}

export function calculateRelationshipDuration(startDate: Date | string): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
} {
  const start = new Date(startDate);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - start.getTime();
  const totalDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = (totalDays % 365) % 30;

  return { years, months, days, totalDays };
}

export function generateCoupleId(): string {
  return `couple_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateHealthScore(metrics: {
  communication_score: number;
  trust_score: number;
  satisfaction_score: number;
  engagement_score: number;
}): number {
  const { communication_score, trust_score, satisfaction_score, engagement_score } = metrics;
  const weights = {
    communication: 0.3,
    trust: 0.3,
    satisfaction: 0.25,
    engagement: 0.15
  };

  return Math.round(
    communication_score * weights.communication +
    trust_score * weights.trust +
    satisfaction_score * weights.satisfaction +
    engagement_score * weights.engagement
  );
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your connection journey today!";
  if (streak === 1) return "Great start! Keep the momentum going.";
  if (streak < 7) return `${streak} days strong! You're building a habit.`;
  if (streak < 30) return `${streak} days of connection! You're on fire!`;
  if (streak < 100) return `${streak} days together! This is becoming natural.`;
  return `${streak} days of daily connection! You're relationship heroes!`;
}

export function getRandomMotivationalMessage(): string {
  const messages = [
    "Every connection moment matters 💕",
    "Small moments create big changes ✨",
    "Your relationship is worth investing in 🌟",
    "Building love one question at a time 💖",
    "Strong relationships are built daily 🔥",
    "Connection is the foundation of love 🏠",
    "Every answer brings you closer 🤝",
    "Love grows through understanding 🌱"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}