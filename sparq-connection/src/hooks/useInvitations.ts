'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthContext } from '@/lib/auth/AuthProvider';
import { generateInviteCode } from '@/lib/utils/validation';
import { Invitation } from '@/types';

export interface InvitationActions {
  createInvitation: (email?: string) => Promise<{ data?: Invitation; error?: any }>;
  acceptInvitation: (inviteCode: string) => Promise<{ error?: any }>;
  getInvitations: () => Promise<{ data?: Invitation[]; error?: any }>;
  cancelInvitation: (invitationId: string) => Promise<{ error?: any }>;
}

export function useInvitations(): InvitationActions {
  const { user } = useAuthContext();

  const createInvitation = async (email?: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      const inviteCode = generateInviteCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const { data, error } = await supabase
        .from('invitations')
        .insert({
          inviter_id: user.id,
          invite_code: inviteCode,
          email: email || null,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) {
        return { error };
      }

      // TODO: Send email invitation if email is provided
      // This would integrate with an email service like Resend or SendGrid

      return { data };
    } catch (error) {
      return { error };
    }
  };

  const acceptInvitation = async (inviteCode: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // Call the database function to accept invitation
      const { data, error } = await supabase.rpc('accept_invitation', {
        invite_code_param: inviteCode,
        accepter_id: user.id,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const getInvitations = async () => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false });

      return { data: data || undefined, error };
    } catch (error) {
      return { error };
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'expired' })
        .eq('id', invitationId)
        .eq('inviter_id', user.id);

      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    createInvitation,
    acceptInvitation,
    getInvitations,
    cancelInvitation,
  };
}