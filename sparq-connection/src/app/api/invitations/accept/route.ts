import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { invite_code } = await request.json();

    if (!invite_code) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      );
    }

    const { supabase } = createClient(request);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*, inviter:users!invitations_inviter_id_fkey(*)')
      .eq('invite_code', invite_code)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    if (new Date(invitation.expires_at) < new Date()) {
      await supabase
        .from('invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    if (invitation.inviter_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot accept your own invitation' },
        { status: 400 }
      );
    }

    const { data: existingCouple, error: existingError } = await supabase
      .from('couples')
      .select('*')
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .single();

    if (existingCouple) {
      return NextResponse.json(
        { error: 'You are already part of a couple' },
        { status: 400 }
      );
    }

    const coupleId = uuidv4();

    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .insert({
        id: coupleId,
        partner1_id: invitation.inviter_id,
        partner2_id: user.id,
        health_score: 50,
        current_streak: 0,
        longest_streak: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (coupleError) {
      console.error('Couple creation error:', coupleError);
      return NextResponse.json(
        { error: 'Failed to create couple' },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from('invitations')
      .update({
        status: 'accepted',
        couple_id: coupleId,
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Invitation update error:', updateError);
    }

    return NextResponse.json({
      message: 'Invitation accepted successfully',
      couple,
    }, { status: 201 });
  } catch (error) {
    console.error('Invitation acceptance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}