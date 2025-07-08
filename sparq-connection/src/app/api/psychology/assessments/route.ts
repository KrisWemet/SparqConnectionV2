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

    const { data: assessments, error } = await supabase
      .from('psychology_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Assessments fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assessments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('Assessments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { assessment_type, questions_responses, raw_scores, interpreted_results } = await request.json();

    if (!assessment_type || !questions_responses) {
      return NextResponse.json(
        { error: 'Assessment type and responses are required' },
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

    const { data: assessment, error } = await supabase
      .from('psychology_assessments')
      .insert({
        id: uuidv4(),
        user_id: user.id,
        assessment_type,
        questions_responses,
        raw_scores,
        interpreted_results,
        assessment_version: '1.0',
        is_complete: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Assessment creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create assessment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ assessment }, { status: 201 });
  } catch (error) {
    console.error('Assessment creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}