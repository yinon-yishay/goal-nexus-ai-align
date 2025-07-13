import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const slackBotToken = Deno.env.get('SLACK_BOT_TOKEN');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { employeeId, message, messageType, questionnaireId } = await req.json();

    console.log('Sending Slack message:', { employeeId, messageType, questionnaireId });

    // Send message to Slack
    const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slackBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: employeeId, // This should be a Slack user ID or channel
        text: message,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: message
            }
          }
        ]
      }),
    });

    const slackResult = await slackResponse.json();
    
    // Store the message in our database
    const { error: dbError } = await supabase
      .from('slack_messages')
      .insert({
        questionnaire_id: questionnaireId,
        employee_id: employeeId,
        message_type: messageType,
        message_content: message,
        slack_response: slackResult
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    // Update the questionnaire to mark Slack message as sent
    if (questionnaireId) {
      await supabase
        .from('progress_evaluations')
        .update({ slack_message_sent: true })
        .eq('questionnaire_id', questionnaireId);
    }

    console.log('Slack message sent successfully:', slackResult);

    return new Response(JSON.stringify({ 
      success: true, 
      slackResponse: slackResult 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending Slack message:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});