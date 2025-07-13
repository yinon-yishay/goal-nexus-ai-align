import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar, MessageSquare, Send } from 'lucide-react';

const TestDashboard = () => {
  const [loading, setLoading] = useState(false);

  const createSampleQuestionnaires = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('monthly-scheduler');
      
      if (error) throw error;
      
      toast({ 
        title: "Success", 
        description: `Created ${data.created} sample questionnaires` 
      });
    } catch (error) {
      console.error('Error creating questionnaires:', error);
      toast({ 
        title: "Error", 
        description: "Failed to create questionnaires" 
      });
    } finally {
      setLoading(false);
    }
  };

  const testAIMessageGeneration = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-employee-message', {
        body: {
          employeeName: 'John Smith',
          overallRating: 'excellent',
          goalsOnTrack: true,
          areasForImprovement: '',
          managerComments: 'Outstanding performance this month',
          questionnaireId: 'test-id'
        }
      });
      
      if (error) throw error;
      
      toast({ 
        title: "AI Test Success", 
        description: "Message generated successfully" 
      });
      console.log('Generated message:', data);
    } catch (error) {
      console.error('Error testing AI:', error);
      toast({ 
        title: "Error", 
        description: "Failed to test AI generation" 
      });
    } finally {
      setLoading(false);
    }
  };

  const testSlackMessage = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-slack-message', {
        body: {
          employeeId: 'test-employee',
          message: 'This is a test message from the questionnaire system!',
          messageType: 'positive',
          questionnaireId: null
        }
      });
      
      if (error) throw error;
      
      toast({ 
        title: "Slack Test Success", 
        description: "Message sent successfully" 
      });
      console.log('Slack response:', data);
    } catch (error) {
      console.error('Error testing Slack:', error);
      toast({ 
        title: "Error", 
        description: "Failed to test Slack integration" 
      });
    } finally {
      setLoading(false);
    }
  };

  const viewDatabaseData = async () => {
    try {
      const { data: questionnaires } = await supabase
        .from('monthly_questionnaires')
        .select('*')
        .limit(5);
        
      const { data: evaluations } = await supabase
        .from('progress_evaluations')
        .select('*')
        .limit(5);
        
      const { data: messages } = await supabase
        .from('slack_messages')
        .select('*')
        .limit(5);

      console.log('Questionnaires:', questionnaires);
      console.log('Evaluations:', evaluations);
      console.log('Slack Messages:', messages);
      
      toast({ 
        title: "Database Check", 
        description: "Check console for data (F12)" 
      });
    } catch (error) {
      console.error('Error viewing data:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch database data" 
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Dashboard - Questionnaire System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              1. Create Sample Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Creates sample questionnaires for testing the evaluation flow.
            </p>
            <Button 
              onClick={createSampleQuestionnaires}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              Create Sample Questionnaires
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              2. Test AI Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tests the Gemini AI integration for message generation.
            </p>
            <Button 
              onClick={testAIMessageGeneration}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2" />
              )}
              Test AI Message Generation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              3. Test Slack Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tests the Slack bot integration (will attempt to send a message).
            </p>
            <Button 
              onClick={testSlackMessage}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Test Slack Message
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. View Database Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Logs current database content to browser console.
            </p>
            <Button 
              onClick={viewDatabaseData}
              variant="secondary"
              className="w-full"
            >
              View Database Data
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>Step 1:</strong> Click "Create Sample Questionnaires" to populate test data</p>
            <p><strong>Step 2:</strong> Go to <code>/progress</code> to see the questionnaire interface</p>
            <p><strong>Step 3:</strong> Select an employee and fill out their evaluation</p>
            <p><strong>Step 4:</strong> Test AI message generation</p>
            <p><strong>Step 5:</strong> Test Slack integration (requires valid Slack setup)</p>
            <p><strong>Step 6:</strong> Check Edge Function logs in Supabase dashboard</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDashboard;