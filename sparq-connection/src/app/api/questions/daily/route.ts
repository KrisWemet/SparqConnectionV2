import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIService } from '@/lib/ai/openai';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get('couple_id');

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

    const today = new Date().toISOString().split('T')[0];

    let { data: todaysQuestion, error: questionError } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('date', today)
      .single();

    if (questionError && questionError.code === 'PGRST116') {
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
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) {
        console.error('Recent questions fetch error:', recentError);
      }

      const attachment_styles = profiles?.map(p => p.attachment_style).filter(Boolean) || [];
      const previous_questions = recentQuestions?.map(q => q.content) || [];

      const questionContent = await AIService.generateDailyQuestion({
        coupleId,
        relationship_stage: couple.relationship_status || undefined,
        attachment_styles,
        previous_questions,
      });

      const questionId = uuidv4();

      const { data: newQuestion, error: createError } = await supabase
        .from('daily_questions')
        .insert({
          id: questionId,
          couple_id: coupleId,
          content: questionContent,
          category: 'gratitude',
          difficulty_level: 1,
          ai_generated: true,
          date: today,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Question creation error:', createError);
        return NextResponse.json(
          { error: 'Failed to create daily question' },
          { status: 500 }
        );
      }

      todaysQuestion = newQuestion;
    } else if (questionError) {
      console.error('Question fetch error:', questionError);
      return NextResponse.json(
        { error: 'Failed to fetch daily question' },
        { status: 500 }
      );
    }

    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('*')
      .eq('question_id', todaysQuestion.id);

    if (responsesError) {
      console.error('Responses fetch error:', responsesError);
    }

    return NextResponse.json({
      question: todaysQuestion,
      responses: responses || [],
    });
  } catch (error) {
    console.error('Daily question API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}