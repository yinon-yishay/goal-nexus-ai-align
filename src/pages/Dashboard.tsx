
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { RoleBasedGoalCreation } from '@/components/goals/RoleBasedGoalCreation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal } from '@/types';
import { Target, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock goals data for dashboard display
const mockDashboardGoals: Goal[] = [
  {
    id: '1',
    employeeId: '1',
    title: 'Implement Advanced AI Features',
    description: 'Develop and integrate cutting-edge AI capabilities',
    companyGoalAlignment: 'Position the company as a market leader in AI-driven solutions',
    department: 'rd',
    targetDate: '2024-12-31',
    status: 'in-progress',
    progress: 65,
    createdAt: '2024-01-15',
    updatedAt: '2024-07-01'
  }
];

// Mock progress data for the chart
const mockProgressData = [
  { month: 'Jan', progress: 20 },
  { month: 'Feb', progress: 35 },
  { month: 'Mar', progress: 45 },
  { month: 'Apr', progress: 55 },
  { month: 'May', progress: 60 },
  { month: 'Jun', progress: 65 }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>(mockDashboardGoals);

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals(prevGoals => [...prevGoals, newGoal]);
  };

  if (!user) return null;

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'employee': return 'Employee';
      case 'manager': return 'Team Lead';
      case 'group-leader': return 'Group Manager';
      case 'ld-team': return 'L&D Team';
      default: return role;
    }
  };

  const getDepartmentName = (dept: string) => {
    switch (dept) {
      case 'rd': return 'R&D';
      case 'sm': return 'Sales & Marketing';
      case 'ga': return 'General Administration';
      default: return dept;
    }
  };

  // Calculate stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'in-progress').length;
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user.name} • {getRoleDisplayName(user.role)} • {getDepartmentName(user.department)}
          </p>
        </div>
        
        <RoleBasedGoalCreation onGoalCreated={handleGoalCreated} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Goals"
          value={totalGoals.toString()}
          icon={Target}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Completed"
          value={completedGoals.toString()}
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="In Progress"
          value={inProgressGoals.toString()}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Average Progress"
          value={`${averageProgress}%`}
          icon={Users}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Chart and Recent Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart data={mockProgressData} title="Monthly Progress Overview" />

        <Card>
          <CardHeader>
            <CardTitle>Recent Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No goals created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {goal.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Progress: {goal.progress}% • Status: {goal.status.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role-specific information */}
      {user.role === 'employee' && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Goals are assigned by your Team Lead
              </h3>
              <p className="text-gray-600">
                Your team lead will create and assign goals to you. Check the "My Goals" section to view your assigned goals and track progress.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
