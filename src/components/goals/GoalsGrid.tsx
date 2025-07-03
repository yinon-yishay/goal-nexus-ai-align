
import React from 'react';
import { GoalCard } from '@/components/goals/GoalCard';
import { Goal } from '@/types';

interface GoalsGridProps {
  goals: Goal[];
}

export const GoalsGrid: React.FC<GoalsGridProps> = ({ goals }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};
