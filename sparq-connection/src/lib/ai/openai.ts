import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QuestionGenerationParams {
  coupleId: string;
  relationship_stage?: string;
  attachment_styles?: string[];
  previous_questions?: string[];
  mood?: string;
  topics_of_interest?: string[];
}

export interface CrisisDetectionParams {
  content: string;
  context?: string;
}

export interface CrisisDetectionResult {
  isCrisisDetected: boolean;
  confidence: number;
  keywords: string[];
  sentiment: number;
  recommendations: string[];
}

export class AIService {
  static async generateDailyQuestion(params: QuestionGenerationParams): Promise<string> {
    const systemPrompt = `You are a relationship wellness expert creating personalized daily questions for couples. 
    Create questions that are:
    - Emotionally safe and appropriate
    - Science-backed (Gottman, EFT, attachment theory)
    - Adapted to the couple's stage and attachment styles
    - Encouraging deeper connection
    - Taking 2-3 minutes to answer thoughtfully
    
    Return only the question text, no additional formatting or explanation.`;

    const userPrompt = `Generate a daily question for a couple with these characteristics:
    ${params.attachment_styles ? `Attachment styles: ${params.attachment_styles.join(', ')}` : ''}
    ${params.relationship_stage ? `Relationship stage: ${params.relationship_stage}` : ''}
    ${params.mood ? `Current mood: ${params.mood}` : ''}
    ${params.topics_of_interest ? `Topics of interest: ${params.topics_of_interest.join(', ')}` : ''}
    ${params.previous_questions ? `Recent questions (avoid similar): ${params.previous_questions.slice(-3).join(', ')}` : ''}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      return response.choices[0].message.content?.trim() || 'What made you smile today?';
    } catch (error) {
      console.error('Error generating question:', error);
      return 'What made you smile today?';
    }
  }

  static async detectCrisis(params: CrisisDetectionParams): Promise<CrisisDetectionResult> {
    const systemPrompt = `You are a crisis detection system for a relationship app. 
    Analyze the content for signs of:
    - Suicidal ideation
    - Self-harm mentions
    - Domestic violence indicators
    - Severe mental health crisis
    - Substance abuse crisis
    
    Return a JSON object with:
    - isCrisisDetected: boolean
    - confidence: number (0-1)
    - keywords: string[] (detected crisis keywords)
    - sentiment: number (-1 to 1)
    - recommendations: string[] (immediate actions)`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this content: "${params.content}"` }
        ],
        temperature: 0.1,
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        isCrisisDetected: result.isCrisisDetected || false,
        confidence: result.confidence || 0,
        keywords: result.keywords || [],
        sentiment: result.sentiment || 0,
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error('Error detecting crisis:', error);
      return {
        isCrisisDetected: false,
        confidence: 0,
        keywords: [],
        sentiment: 0,
        recommendations: []
      };
    }
  }

  static async moderateContent(content: string): Promise<boolean> {
    try {
      const response = await openai.moderations.create({
        input: content,
      });

      return response.results[0].flagged;
    } catch (error) {
      console.error('Error moderating content:', error);
      return false;
    }
  }
}

export default openai;