
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { GoalCard } from '@/components/goals/GoalCard';
import { Goal } from '@/types';
import { 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Mock data
const mockGoals: Goal[] = [
  {
    id: '1',
    employeeId: '1',
    title: 'Implement Advanced AI Features',
    description: 'Develop and integrate cutting-edge AI capabilities to enhance product functionality and user experience.',
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
    description: 'Develop and execute a comprehensive strategy to acquire 50 new enterprise customers.',
    companyGoalAlignment: 'Drive measurable business impact through data-led customer value',
    department: 'sm',
    targetDate: '2024-11-30',
    status: 'in-progress',
    progress: 40,
    createdAt: '2024-02-01',
    updatedAt: '2024-07-01'
  }
];

const mockProgressData = [
  { month: 'Jan', progress: 20 },
  { month: 'Feb', progress: 35 },
  { month: 'Mar', progress: 45 },
  { month: 'Apr', progress: 50 },
  { month: 'May', progress: 55 },
  { month: 'Jun', progress: 65 },
];

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const renderEmployeeDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Goals"
          value={mockGoals.length}
          icon={Target}
          description="Currently working on"
        />
        <StatsCard
          title="Average Progress"
          value="52%"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Goals Completed"
          value={3}
          icon={CheckCircle}
          description="This quarter"
        />
        <StatsCard
          title="Days to Next Review"
          value={15}
          icon={Clock}
          description="Monthly check-in"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart 
          data={mockProgressData}
          title="My Progress Overview"
        />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Goals</h3>
          {mockGoals.slice(0, 2).map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Team Members"
          value={8}
          icon={Users}
          description="Direct reports"
        />
        <StatsCard
          title="Team Progress"
          value="68%"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Goals Behind Schedule"
          value={2}
          icon={AlertTriangle}
          description="Need attention"
        />
        <StatsCard
          title="Goals Completed"
          value={12}
          icon={CheckCircle}
          description="This quarter"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart 
          data={mockProgressData.map(d => ({ ...d, progress: d.progress + 10 }))}
          title="Team Progress Overview"
        />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Team Goals Requiring Attention</h3>
          {mockGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} showEmployeeName />
          ))}
        </div>
      </div>
    </div>
  );

  const renderGroupLeaderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value={45}
          icon={Users}
          description="Across all teams"
        />
        <StatsCard
          title="Organization Progress"
          value="71%"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Goals Behind Schedule"
          value={8}
          icon={AlertTriangle}
          description="Across departments"
        />
        <StatsCard
          title="Strategy Alignment"
          value="89%"
          icon={Target}
          description="Goals aligned"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart 
          data={mockProgressData.map(d => ({ ...d, progress: d.progress + 15 }))}
          title="Organization-wide Progress"
        />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Department Overview</h3>
          <div className="grid grid-cols-1 gap-4">
            {['R&D', 'Sales & Marketing', 'General & Administrative'].map((dept, idx) => (
              <div key={dept} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{dept}</span>
                  <span className="text-sm text-gray-500">{75 + idx * 5}% progress</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLDDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Manager Compliance"
          value="92%"
          icon={CheckCircle}
          description="Goals input rate"
        />
        <StatsCard
          title="Employee Engagement"
          value="85%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Training Opportunities"
          value={23}
          icon={Target}
          description="Identified"
        />
        <StatsCard
          title="Performance Reviews"
          value={38}
          icon={Users}
          description="This month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart 
          data={mockProgressData.map(d => ({ ...d, progress: d.progress + 20 }))}
          title="Overall Development Progress"
        />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Department Analytics</h3>
          <div className="space-y-3">
            {[
              { dept: 'R&D', employees: 15, goalsSet: 14, completion: 87 },
              { dept: 'S&M', employees: 18, goalsSet: 17, completion: 82 },
              { dept: 'G&A', employees: 12, goalsSet: 11, completion: 75 }
            ].map((data) => (
              <div key={data.dept} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{data.dept}</span>
                  <span className="text-sm text-gray-500">{data.completion}% avg progress</span>
                </div>
                <div className="text-sm text-gray-600">
                  {data.goalsSet}/{data.employees} employees with goals set
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'employee': return 'Employee';
      case 'manager': return 'Manager';
      case 'group-leader': return 'Group Leader';
      case 'ld-team': return 'L&D Team Member';
      default: return role;
    }
  };

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'employee': return renderEmployeeDashboard();
      case 'manager': return renderManagerDashboard();
      case 'group-leader': return renderGroupLeaderDashboard();
      case 'ld-team': return renderLDDashboard();
      default: return renderEmployeeDashboard();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}
        </h1>
        <p className="text-gray-600 mt-2">
          {getRoleDisplayName(user.role)} Dashboard - Here's your performance overview
        </p>
      </div>

      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;
