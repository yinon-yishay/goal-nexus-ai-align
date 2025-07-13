import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { 
      employeeName, 
      overallRating, 
      goalsOnTrack, 
      areasForImprovement, 
      managerComments,
      questionnaireId 
    } = await req.json();

    console.log('Generating message for:', employeeName, 'Rating:', overallRating);

    // Create context for AI message generation
    const context = `
Employee: ${employeeName}
Overall Rating: ${overallRating}
Goals on Track: ${goalsOnTrack ? 'Yes' : 'No'}
Areas for Improvement: ${areasForImprovement || 'None specified'}
Manager Comments: ${managerComments || 'None provided'}
`;

    // Generate personalized message using Gemini API
    const prompt = overallRating === 'excellent' || overallRating === 'good' 
      ? `Create a positive, encouraging Slack message for ${employeeName} based on their monthly performance review. 
         Rating: ${overallRating}, Goals on track: ${goalsOnTrack ? 'Yes' : 'No'}.
         ${managerComments ? `Manager feedback: ${managerComments}` : ''}
         Keep it professional, specific, and motivating. Max 200 words.`
      : `Create a constructive, supportive Slack message for ${employeeName} based on their monthly performance review.
         Rating: ${overallRating}, Goals on track: ${goalsOnTrack ? 'Yes' : 'No'}.
         Areas for improvement: ${areasForImprovement || 'General performance'}
         ${managerComments ? `Manager feedback: ${managerComments}` : ''}
         Focus on growth opportunities and support. Keep it encouraging yet actionable. Max 200 words.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiResult = await geminiResponse.json();
    const generatedMessage = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || 
      'Thank you for your continued dedication and hard work this month!';

    // Generate AI suggestions for manager
    const suggestionPrompt = `Based on this employee performance data:
${context}
Provide 2-3 specific, actionable suggestions for the manager to help improve this employee's performance next month. Keep suggestions brief and practical.`;

    const suggestionResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: suggestionPrompt
          }]
        }]
      }),
    });

    let aiSuggestions = '';
    if (suggestionResponse.ok) {
      const suggestionResult = await suggestionResponse.json();
      aiSuggestions = suggestionResult.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    console.log('Generated message and suggestions successfully');

    return new Response(JSON.stringify({ 
      success: true,
      employeeMessage: generatedMessage,
      aiSuggestions: aiSuggestions,
      messageType: overallRating === 'excellent' || overallRating === 'good' ? 'positive' : 'improvement'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating employee message:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});