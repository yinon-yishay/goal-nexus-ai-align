
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

export const EmployeeMessage: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="text-center">
          <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Goals are assigned by your Team Lead
          </h3>
          <p className="text-gray-600">
            Your team lead will create and assign goals to you. You can view and track progress on your assigned goals below.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
