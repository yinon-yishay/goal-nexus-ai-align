
-- Create enum for questionnaire status
CREATE TYPE questionnaire_status AS ENUM ('pending', 'completed', 'overdue');

-- Create enum for progress evaluation
CREATE TYPE progress_evaluation AS ENUM ('excellent', 'good', 'needs_improvement', 'poor');

-- Create table for monthly questionnaires
CREATE TABLE public.monthly_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  status questionnaire_status DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(manager_id, employee_id, month, year)
);

-- Create table for questionnaire responses
CREATE TABLE public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID REFERENCES public.monthly_questionnaires(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for progress evaluations
CREATE TABLE public.progress_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID REFERENCES public.monthly_questionnaires(id) ON DELETE CASCADE,
  overall_rating progress_evaluation NOT NULL,
  goals_on_track BOOLEAN NOT NULL,
  areas_for_improvement TEXT,
  manager_comments TEXT,
  ai_suggestions TEXT,
  employee_message TEXT,
  slack_message_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table to track Slack message history
CREATE TABLE public.slack_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID REFERENCES public.monthly_questionnaires(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL,
  message_type TEXT NOT NULL, -- 'positive' or 'improvement'
  message_content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  slack_response JSONB
);

-- Enable Row Level Security
ALTER TABLE public.monthly_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slack_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for managers to see their questionnaires
CREATE POLICY "Managers can view their questionnaires" ON public.monthly_questionnaires
  FOR SELECT USING (true); -- Will be updated when auth is implemented

CREATE POLICY "Managers can update their questionnaires" ON public.monthly_questionnaires
  FOR UPDATE USING (true); -- Will be updated when auth is implemented

-- Create RLS policies for questionnaire responses
CREATE POLICY "Allow questionnaire responses access" ON public.questionnaire_responses
  FOR ALL USING (true); -- Will be updated when auth is implemented

-- Create RLS policies for progress evaluations
CREATE POLICY "Allow progress evaluations access" ON public.progress_evaluations
  FOR ALL USING (true); -- Will be updated when auth is implemented

-- Create RLS policies for slack messages
CREATE POLICY "Allow slack messages access" ON public.slack_messages
  FOR ALL USING (true); -- Will be updated when auth is implemented

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_monthly_questionnaires_updated_at 
  BEFORE UPDATE ON public.monthly_questionnaires 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
