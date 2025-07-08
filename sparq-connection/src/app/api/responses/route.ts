import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIService } from '@/lib/ai/openai';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
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

    const { data: question, error: questionError } = await supabase
      .from('daily_questions')
      .select('*, couples(*)')
      .eq('id', questionId)
      .single();

    if (questionError) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const couple = question.couples;
    if (!couple || (couple.partner1_id !== user.id && couple.partner2_id !== user.id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const { data: responses, error } = await supabase
      .from('responses')
      .select('*, users(*)')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Responses fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      );
    }

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Responses API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question_id, content, is_private = false } = await request.json();

    if (!question_id || !content) {
      return NextResponse.json(
        { error: 'Question ID and content are required' },
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

    const { data: question, error: questionError } = await supabase
      .from('daily_questions')
      .select('*, couples(*)')
      .eq('id', question_id)
      .single();

    if (questionError) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const couple = question.couples;
    if (!couple || (couple.partner1_id !== user.id && couple.partner2_id !== user.id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const contentModerated = await AIService.moderateContent(content);
    if (contentModerated) {
      return NextResponse.json(
        { error: 'Content violates community guidelines' },
        { status: 400 }
      );
    }

    const crisisResult = await AIService.detectCrisis({ content });
    
    if (crisisResult.isCrisisDetected) {
      const eventHash = createHash('sha256').update(content + Date.now()).digest('hex');
      
      const { error: crisisError } = await supabase
        .from('crisis_events')
        .insert({
          id: uuidv4(),
          couple_id: couple.id,
          event_hash: eventHash,
          severity: crisisResult.confidence > 0.8 ? 'critical' : 
                   crisisResult.confidence > 0.6 ? 'high' : 
                   crisisResult.confidence > 0.4 ? 'medium' : 'low',
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });

      if (crisisError) {
        console.error('Crisis event logging error:', crisisError);
      }
    }

    const responseId = uuidv4();

    const { data: response, error } = await supabase
      .from('responses')
      .insert({
        id: responseId,
        question_id,
        user_id: user.id,
        content,
        is_private,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Response creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response,
      crisis_detected: crisisResult.isCrisisDetected,
      crisis_recommendations: crisisResult.recommendations,
    }, { status: 201 });
  } catch (error) {
    console.error('Response creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}