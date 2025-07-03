
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Goal } from '@/types';
import { GoalsHeader } from '@/components/goals/GoalsHeader';
import { GoalsFilters } from '@/components/goals/GoalsFilters';
import { GoalsGrid } from '@/components/goals/GoalsGrid';
import { GoalsEmptyState } from '@/components/goals/GoalsEmptyState';
import { EmployeeMessage } from '@/components/goals/EmployeeMessage';

// Mock goals data
const mockGoals: Goal[] = [
  {
    id: '1',
    employeeId: '1',
    title: 'Implement Advanced AI Features',
    description: 'Develop and integrate cutting-edge AI capabilities to enhance product functionality and user experience, focusing on machine learning algorithms and natural language processing.',
    companyGoalAlignment: 'Position the company as a market leader in AI-driven solutions',
    department: 'rd',
    targetDate: '2024-12-31',
    status: 'in-progress',
    progress: 65,
    createdAt: '2024-01-15',
    updatedAt: '2024-07-01'
  },
  {
    id: '2',
    employeeId: '1',
    title: 'Customer Acquisition Strategy',
    description: 'Develop and execute a comprehensive strategy to acquire 50 new enterprise customers through targeted marketing campaigns and strategic partnerships.',
    companyGoalAlignment: 'Drive measurable business impact through data-led customer value',
    department: 'sm',
    targetDate: '2024-11-30',
    status: 'in-progress',
    progress: 40,
    createdAt: '2024-02-01',
    updatedAt: '2024-07-01'
  },
  {
    id: '3',
    employeeId: '1',
    title: 'SAM Technology Integration',
    description: 'Successfully integrate SAM technology across In-App, CTV, and Web platforms to create a unified customer experience.',
    companyGoalAlignment: 'Integrate SAM as a core technology layer across In-App, CTV, and Web markets',
    department: 'rd',
    targetDate: '2024-10-15',
    status: 'completed',
    progress: 100,
    createdAt: '2024-03-01',
    updatedAt: '2024-06-15'
  }
];

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals([...goals, newGoal]);
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      all: goals.length,
      'not-started': goals.filter(g => g.status === 'not-started').length,
      'in-progress': goals.filter(g => g.status === 'in-progress').length,
      'completed': goals.filter(g => g.status === 'completed').length,
      'behind-schedule': goals.filter(g => g.status === 'behind-schedule').length
    };
  };

  const statusCounts = getStatusCounts();

  if (!user) return null;

  return (
    <div className="p-6">
      <GoalsHeader onGoalCreated={handleGoalCreated} />

      {user.role === 'employee' && <EmployeeMessage />}

      <GoalsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusCounts={statusCounts}
      />

      {filteredGoals.length === 0 ? (
        <GoalsEmptyState
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onCreateGoal={() => {}} // This will be handled by the header component
        />
      ) : (
        <GoalsGrid goals={filteredGoals} />
      )}
    </div>
  );
};

export default Goals;
