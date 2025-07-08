import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIService } from '@/lib/ai/openai';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('couple_id');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    if (!coupleId) {
      return NextResponse.json(
        { error: 'Couple ID is required' },
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

    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .select('*')
      .eq('id', coupleId)
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .single();

    if (coupleError || !couple) {
      return NextResponse.json(
        { error: 'Couple not found or access denied' },
        { status: 404 }
      );
    }

    const { data: questions, error } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Questions fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { couple_id, category, difficulty_level } = await request.json();

    if (!couple_id) {
      return NextResponse.json(
        { error: 'Couple ID is required' },
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

    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .select('*')
      .eq('id', couple_id)
      .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
      .single();

    if (coupleError || !couple) {
      return NextResponse.json(
        { error: 'Couple not found or access denied' },
        { status: 404 }
      );
    }

    const { data: profiles, error: profilesError } = await supabase
      .from('user_psychology_profiles')
      .select('*')
      .in('user_id', [couple.partner1_id, couple.partner2_id]);

    if (profilesError) {
      console.error('Psychology profiles fetch error:', profilesError);
    }

    const { data: recentQuestions, error: recentError } = await supabase
      .from('daily_questions')
      .select('content')
      .eq('couple_id', couple_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('Recent questions fetch error:', recentError);
    }

    const attachment_styles = profiles?.map(p => p.attachment_style).filter(Boolean) || [];
    const previous_questions = recentQuestions?.map(q => q.content) || [];

    const questionContent = await AIService.generateDailyQuestion({
      coupleId: couple_id,
      relationship_stage: couple.relationship_status || undefined,
      attachment_styles,
      previous_questions,
      topics_of_interest: [category].filter(Boolean),
    });

    const questionId = uuidv4();
    const today = new Date().toISOString().split('T')[0];

    const { data: question, error } = await supabase
      .from('daily_questions')
      .insert({
        id: questionId,
        couple_id,
        content: questionContent,
        category: category || 'gratitude',
        difficulty_level: difficulty_level || 1,
        ai_generated: true,
        date: today,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Question creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create question' },
        { status: 500 }
      );
    }

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Question creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}