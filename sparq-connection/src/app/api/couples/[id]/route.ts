import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { supabase } = createClient(request);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: couple, error } = await supabase
      .from('couples')
      .select(`
        *,
        partner1:users!couples_partner1_id_fkey(*),
        partner2:users!couples_partner2_id_fkey(*)
      `)
      .eq('id', params.id)
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .single();

    if (error) {
      console.error('Couple fetch error:', error);
      return NextResponse.json(
        { error: 'Couple not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ couple });
  } catch (error) {
    console.error('Couple API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();

    const { supabase } = createClient(request);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: couple, error } = await supabase
      .from('couples')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .select()
      .single();

    if (error) {
      console.error('Couple update error:', error);
      return NextResponse.json(
        { error: 'Failed to update couple' },
        { status: 500 }
      );
    }

    return NextResponse.json({ couple });
  } catch (error) {
    console.error('Couple update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}