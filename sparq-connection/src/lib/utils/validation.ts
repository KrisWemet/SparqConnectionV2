import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number');

export const userProfileSchema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(50),
  email: emailSchema,
  birth_date: z.string().optional(),
  attachment_style: z.enum(['secure', 'anxious', 'avoidant', 'disorganized']).optional(),
});

export const coupleSchema = z.object({
  relationship_start_date: z.string().optional(),
  relationship_status: z.enum(['dating', 'engaged', 'married', 'partnership']).optional(),
  goals: z.array(z.string()).optional(),
});

export const dailyQuestionSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters'),
  category: z.enum(['values', 'memories', 'future', 'intimacy', 'conflict', 'gratitude']),
  difficulty_level: z.number().min(1).max(5),
});

export const responseSchema = z.object({
  content: z.string().min(1, 'Response cannot be empty').max(1000, 'Response too long'),
  is_private: z.boolean().default(false),
});

export const reflectionSchema = z.object({
  content: z.string().min(1, 'Reflection cannot be empty').max(2000, 'Reflection too long'),
  mood: z.enum(['happy', 'sad', 'anxious', 'excited', 'confused', 'grateful', 'frustrated']).optional(),
  tags: z.array(z.string()).optional(),
});

export const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
  'self harm', 'cut myself', 'hurt myself', 'overdose', 'pills',
  'abuse', 'hit me', 'hurt me', 'scared', 'threatened',
  'addicted', 'drunk', 'high', 'drugs', 'alcohol problem'
];

export function validateCrisisContent(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return crisisKeywords.some(keyword => lowerContent.includes(keyword));
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateInviteCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}

export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}