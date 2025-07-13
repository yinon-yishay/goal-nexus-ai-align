import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Get the first day of next month as due date
    const dueDate = new Date(currentYear, currentMonth, 1);

    console.log('Creating monthly questionnaires for:', currentMonth, currentYear);

    // For demo purposes, create questionnaires for sample manager-employee pairs
    // In a real system, this would fetch from a teams/employees table
    const sampleEmployees = [
      { managerId: 'manager_1', employeeId: 'emp_001', employeeName: 'John Smith' },
      { managerId: 'manager_1', employeeId: 'emp_002', employeeName: 'Sarah Johnson' },
      { managerId: 'manager_2', employeeId: 'emp_003', employeeName: 'Mike Davis' },
      { managerId: 'manager_2', employeeId: 'emp_004', employeeName: 'Lisa Wilson' },
    ];

    const questionnaires = sampleEmployees.map(emp => ({
      manager_id: emp.managerId,
      employee_id: emp.employeeId,
      employee_name: emp.employeeName,
      month: currentMonth,
      year: currentYear,
      due_date: dueDate.toISOString(),
      status: 'pending' as const
    }));

    // Insert questionnaires (using ON CONFLICT to avoid duplicates)
    const { data, error } = await supabase
      .from('monthly_questionnaires')
      .upsert(questionnaires, { 
        onConflict: 'manager_id,employee_id,month,year',
        ignoreDuplicates: true 
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Successfully created/updated questionnaires:', data?.length || 0);

    return new Response(JSON.stringify({ 
      success: true,
      created: data?.length || 0,
      questionnaires: data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in monthly scheduler:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});