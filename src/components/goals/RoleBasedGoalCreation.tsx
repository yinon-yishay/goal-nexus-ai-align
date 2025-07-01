
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Goal, User } from '@/types';
import { Plus, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RoleBasedGoalCreationProps {
  onGoalCreated: (goal: Goal) => void;
}

// Mock users for role-based assignment
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    role: 'employee',
    department: 'rd',
    managerId: '2'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    role: 'manager',
    department: 'rd'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'group-leader',
    department: 'sm'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@company.com',
    role: 'ld-team',
    department: 'ga'
  },
  {
    id: '5',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'employee',
    department: 'sm'
  },
  {
    id: '6',
    name: 'Lisa Wang',
    email: 'lisa@company.com',
    role: 'manager',
    department: 'ga'
  }
];

const companyStrategies = [
  'Position the company as a market leader in AI-driven solutions',
  'Integrate SAM as a core technology layer across In-App, CTV, and Web markets',
  'Drive measurable business impact through data-led customer value'
];

export const RoleBasedGoalCreation: React.FC<RoleBasedGoalCreationProps> = ({ onGoalCreated }) => {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    companyGoalAlignment: '',
    targetDate: '',
    department: user?.department || 'rd'
  });

  // Determine which users the current user can create goals for
  const getEligibleUsers = (): User[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'manager': // Team lead
        return mockUsers.filter(u => u.role === 'employee' && u.department === user.department);
      case 'group-leader': // Group manager
        return mockUsers.filter(u => u.role === 'manager' && u.department === user.department);
      default:
        return [];
    }
  };

  const canCreateGoals = user?.role === 'manager' || user?.role === 'group-leader';
  const eligibleUsers = getEligibleUsers();

  const handleCreateGoal = () => {
    if (!selectedEmployeeId || !newGoal.title || !newGoal.description || !newGoal.companyGoalAlignment || !newGoal.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including selecting an employee.",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      employeeId: selectedEmployeeId,
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
    
    // Reset form
    setNewGoal({
      title: '',
      description: '',
      companyGoalAlignment: '',
      targetDate: '',
      department: user?.department || 'rd'
    });
    setSelectedEmployeeId('');
    setIsCreateDialogOpen(false);

    const selectedUser = eligibleUsers.find(u => u.id === selectedEmployeeId);
    toast({
      title: "Goal Created",
      description: `Goal successfully created for ${selectedUser?.name}!`,
    });
  };

  if (!canCreateGoals) {
    return null;
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Goal for Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>
            Create Goal for {user?.role === 'manager' ? 'Employee' : 'Team Lead'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">
              Select {user?.role === 'manager' ? 'Employee' : 'Team Lead'} *
            </Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${user?.role === 'manager' ? 'employee' : 'team lead'}`} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {eligibleUsers.map((eligibleUser) => (
                  <SelectItem key={eligibleUser.id} value={eligibleUser.id}>
                    {eligibleUser.name} ({eligibleUser.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="Enter goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the goal in detail"
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
  );
};
