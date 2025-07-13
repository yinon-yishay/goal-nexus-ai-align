import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send, MessageSquare } from 'lucide-react';

interface Questionnaire {
  id: string;
  employee_id: string;
  employee_name: string;
  month: number;
  year: number;
  status: string;
  due_date: string;
}

interface ProgressEvaluation {
  overall_rating: 'excellent' | 'good' | 'needs_improvement' | 'poor' | '';
  goals_on_track: boolean;
  areas_for_improvement: string;
  manager_comments: string;
  employee_message: string;
  ai_suggestions: string;
  slack_message_sent: boolean;
}

const MonthlyQuestionnaire = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [evaluation, setEvaluation] = useState<ProgressEvaluation>({
    overall_rating: '',
    goals_on_track: false,
    areas_for_improvement: '',
    manager_comments: '',
    employee_message: '',
    ai_suggestions: '',
    slack_message_sent: false
  });
  const [loading, setLoading] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [sendingSlack, setSendingSlack] = useState(false);

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_questionnaires')
        .select(`
          *,
          progress_evaluations(*)
        `)
        .order('due_date', { ascending: false });

      if (error) throw error;
      setQuestionnaires(data || []);
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      toast({ title: "Error", description: "Failed to load questionnaires" });
    }
  };

  const selectQuestionnaire = async (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    
    // Check if evaluation already exists
    const { data } = await supabase
      .from('progress_evaluations')
      .select('*')
      .eq('questionnaire_id', questionnaire.id)
      .single();

    if (data) {
      setEvaluation(data);
    } else {
      // Reset form for new evaluation
      setEvaluation({
        overall_rating: '',
        goals_on_track: false,
        areas_for_improvement: '',
        manager_comments: '',
        employee_message: '',
        ai_suggestions: '',
        slack_message_sent: false
      });
    }
  };

  const generateEmployeeMessage = async () => {
    if (!selectedQuestionnaire || !evaluation.overall_rating) {
      toast({ title: "Error", description: "Please select a rating first" });
      return;
    }

    setGeneratingMessage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-employee-message', {
        body: {
          employeeName: selectedQuestionnaire.employee_name,
          overallRating: evaluation.overall_rating,
          goalsOnTrack: evaluation.goals_on_track,
          areasForImprovement: evaluation.areas_for_improvement,
          managerComments: evaluation.manager_comments,
          questionnaireId: selectedQuestionnaire.id
        }
      });

      if (error) throw error;

      setEvaluation(prev => ({
        ...prev,
        employee_message: data.employeeMessage,
        ai_suggestions: data.aiSuggestions
      }));

      toast({ title: "Success", description: "Message generated successfully!" });
    } catch (error) {
      console.error('Error generating message:', error);
      toast({ title: "Error", description: "Failed to generate message" });
    } finally {
      setGeneratingMessage(false);
    }
  };

  const saveEvaluation = async () => {
    if (!selectedQuestionnaire) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('progress_evaluations')
        .upsert({
          questionnaire_id: selectedQuestionnaire.id,
          overall_rating: evaluation.overall_rating as 'excellent' | 'good' | 'needs_improvement' | 'poor',
          goals_on_track: evaluation.goals_on_track,
          areas_for_improvement: evaluation.areas_for_improvement,
          manager_comments: evaluation.manager_comments,
          employee_message: evaluation.employee_message,
          ai_suggestions: evaluation.ai_suggestions,
          slack_message_sent: evaluation.slack_message_sent
        });

      if (error) throw error;

      // Update questionnaire status
      await supabase
        .from('monthly_questionnaires')
        .update({ status: 'completed' })
        .eq('id', selectedQuestionnaire.id);

      toast({ title: "Success", description: "Evaluation saved successfully!" });
      fetchQuestionnaires();
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast({ title: "Error", description: "Failed to save evaluation" });
    } finally {
      setLoading(false);
    }
  };

  const sendSlackMessage = async () => {
    if (!selectedQuestionnaire || !evaluation.employee_message) {
      toast({ title: "Error", description: "Please generate a message first" });
      return;
    }

    setSendingSlack(true);
    try {
      const { error } = await supabase.functions.invoke('send-slack-message', {
        body: {
          employeeId: selectedQuestionnaire.employee_id,
          message: evaluation.employee_message,
          messageType: evaluation.overall_rating === 'excellent' || evaluation.overall_rating === 'good' ? 'positive' : 'improvement',
          questionnaireId: selectedQuestionnaire.id
        }
      });

      if (error) throw error;

      setEvaluation(prev => ({ ...prev, slack_message_sent: true }));
      toast({ title: "Success", description: "Slack message sent!" });
    } catch (error) {
      console.error('Error sending Slack message:', error);
      toast({ title: "Error", description: "Failed to send Slack message" });
    } finally {
      setSendingSlack(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Monthly Team Questionnaires</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questionnaire List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pending Questionnaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {questionnaires.map((q) => (
                <div
                  key={q.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedQuestionnaire?.id === q.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => selectQuestionnaire(q)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{q.employee_name}</h3>
                    <Badge variant={q.status === 'completed' ? 'default' : 'secondary'}>
                      {q.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(0, q.month - 1).toLocaleString('default', { month: 'long' })} {q.year}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(q.due_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Form */}
        <div className="lg:col-span-2">
          {selectedQuestionnaire ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  Monthly Evaluation - {selectedQuestionnaire.employee_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Overall Rating</Label>
                    <Select
                      value={evaluation.overall_rating}
                      onValueChange={(value) => setEvaluation(prev => ({ ...prev, overall_rating: value as 'excellent' | 'good' | 'needs_improvement' | 'poor' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="goals">Goals on Track</Label>
                    <Select
                      value={evaluation.goals_on_track.toString()}
                      onValueChange={(value) => setEvaluation(prev => ({ ...prev, goals_on_track: value === 'true' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="improvements">Areas for Improvement</Label>
                  <Textarea
                    id="improvements"
                    value={evaluation.areas_for_improvement}
                    onChange={(e) => setEvaluation(prev => ({ ...prev, areas_for_improvement: e.target.value }))}
                    placeholder="Describe areas where the employee can improve..."
                  />
                </div>

                <div>
                  <Label htmlFor="comments">Manager Comments</Label>
                  <Textarea
                    id="comments"
                    value={evaluation.manager_comments}
                    onChange={(e) => setEvaluation(prev => ({ ...prev, manager_comments: e.target.value }))}
                    placeholder="Additional feedback and comments..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={generateEmployeeMessage}
                    disabled={generatingMessage || !evaluation.overall_rating}
                    variant="outline"
                  >
                    {generatingMessage ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    Generate AI Message
                  </Button>
                </div>

                {evaluation.employee_message && (
                  <div>
                    <Label htmlFor="message">Employee Message</Label>
                    <Textarea
                      id="message"
                      value={evaluation.employee_message}
                      onChange={(e) => setEvaluation(prev => ({ ...prev, employee_message: e.target.value }))}
                      rows={4}
                    />
                  </div>
                )}

                {evaluation.ai_suggestions && (
                  <div>
                    <Label htmlFor="suggestions">AI Suggestions for Manager</Label>
                    <Textarea
                      id="suggestions"
                      value={evaluation.ai_suggestions}
                      readOnly
                      rows={3}
                      className="bg-muted"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={saveEvaluation}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Save Evaluation
                  </Button>

                  {evaluation.employee_message && (
                    <Button 
                      onClick={sendSlackMessage}
                      disabled={sendingSlack || evaluation.slack_message_sent}
                      variant="outline"
                    >
                      {sendingSlack ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {evaluation.slack_message_sent ? 'Sent' : 'Send to Slack'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Select a questionnaire to begin evaluation</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyQuestionnaire;