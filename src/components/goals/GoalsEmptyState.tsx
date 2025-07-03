
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Target, Plus } from 'lucide-react';

interface GoalsEmptyStateProps {
  searchTerm: string;
  statusFilter: string;
  onCreateGoal: () => void;
}

export const GoalsEmptyState: React.FC<GoalsEmptyStateProps> = ({
  searchTerm,
  statusFilter,
  onCreateGoal
}) => {
  const { user } = useAuth();
  const canCreateGoals = user?.role === 'manager' || user?.role === 'group-leader';
  const hasFilters = searchTerm || statusFilter !== 'all';

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasFilters ? 'No matching goals found' : 'No goals yet'}
        </h3>
        <p className="text-gray-600 mb-4">
          {hasFilters 
            ? 'Try adjusting your search or filter criteria'
            : user?.role === 'employee' 
              ? 'Your team lead will assign goals to you'
              : 'Create your first goal to start tracking your progress'
          }
        </p>
        {!hasFilters && canCreateGoals && (
          <Button onClick={onCreateGoal} className="bg-primary hover:bg-primary-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
