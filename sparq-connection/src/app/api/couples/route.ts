import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = createClient(request);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: couples, error } = await supabase
      .from('couples')
      .select(`
        *,
        partner1:users!couples_partner1_id_fkey(*),
        partner2:users!couples_partner2_id_fkey(*)
      `)
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`);

    if (error) {
      console.error('Couples fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch couples' },
        { status: 500 }
      );
    }

    return NextResponse.json({ couples });
  } catch (error) {
    console.error('Couples API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { partner2_id, relationship_start_date, relationship_status } = await request.json();

    if (!partner2_id) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
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

    const coupleId = uuidv4();

    const { data: couple, error } = await supabase
      .from('couples')
      .insert({
        id: coupleId,
        partner1_id: user.id,
        partner2_id,
        relationship_start_date,
        relationship_status,
        health_score: 50,
        current_streak: 0,
        longest_streak: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Couple creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create couple' },
        { status: 500 }
      );
    }

    return NextResponse.json({ couple }, { status: 201 });
  } catch (error) {
    console.error('Couple creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}