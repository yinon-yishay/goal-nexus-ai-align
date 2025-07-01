
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Goal } from '@/types';
import { CalendarDays, Target, TrendingUp } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  showEmployeeName?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, showEmployeeName = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-accent text-white';
      case 'in-progress': return 'bg-secondary text-white';
      case 'behind-schedule': return 'bg-destructive text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'behind-schedule': return 'Behind Schedule';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {goal.title}
          </CardTitle>
          <Badge className={getStatusColor(goal.status)}>
            {getStatusText(goal.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">
          {goal.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(goal.targetDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span className="capitalize">{goal.department}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-start space-x-2">
            <TrendingUp className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Company Alignment</p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {goal.companyGoalAlignment}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
