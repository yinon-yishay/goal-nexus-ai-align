
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Goal } from '@/types';
import { Plus, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GoalsHeaderProps {
  onGoalCreated: (goal: Goal) => void;
}

const companyStrategies = [
  'Position the company as a market leader in AI-driven solutions',
  'Integrate SAM as a core technology layer across In-App, CTV, and Web markets',
  'Drive measurable business impact through data-led customer value'
];

export const GoalsHeader: React.FC<GoalsHeaderProps> = ({ onGoalCreated }) => {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newGoal, setNewGoal] = React.useState({
    title: '',
    description: '',
    companyGoalAlignment: '',
    targetDate: '',
    department: user?.department || 'rd'
  });

  const canCreateGoals = user?.role === 'manager' || user?.role === 'group-leader';

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.description || !newGoal.companyGoalAlignment || !newGoal.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      employeeId: user?.id || '1',
      title: newGoal.title,
      description: newGoal.description,
      companyGoalAlignment: newGoal.companyGoalAlignment,
      department: newGoal.department as 'rd' | 'sm' | 'ga',
      targetDate: newGoal.targetDate,
      status: 'not-started',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onGoalCreated(goal);
    setNewGoal({
      title: '',
      description: '',
      companyGoalAlignment: '',
      targetDate: '',
      department: user?.department || 'rd'
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Goal Created",
      description: "Your new goal has been successfully created!",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          My Goals
        </h1>
        <p className="text-gray-600 mt-2">
          Track your progress and align with company objectives
        </p>
      </div>
      
      {canCreateGoals && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal in detail"
                  rows={3}
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alignment">Company Goal Alignment *</Label>
                <Select 
                  value={newGoal.companyGoalAlignment} 
                  onValueChange={(value) => setNewGoal({ ...newGoal, companyGoalAlignment: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company strategy alignment" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {companyStrategies.map((strategy, index) => (
                      <SelectItem key={index} value={strategy}>
                        {strategy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date *</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal} className="bg-primary hover:bg-primary-600">
                  Create Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
