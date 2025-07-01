
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoalCard } from '@/components/goals/GoalCard';
import { useAuth } from '@/contexts/AuthContext';
import { Goal } from '@/types';
import { Plus, Target, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

const companyStrategies = [
  'Position the company as a market leader in AI-driven solutions',
  'Integrate SAM as a core technology layer across In-App, CTV, and Web markets',
  'Drive measurable business impact through data-led customer value'
];

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Form state
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    companyGoalAlignment: '',
    targetDate: '',
    department: user?.department || 'rd'
  });

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

    setGoals([...goals, goal]);
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
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Goals ({statusCounts.all})</SelectItem>
            <SelectItem value="not-started">Not Started ({statusCounts['not-started']})</SelectItem>
            <SelectItem value="in-progress">In Progress ({statusCounts['in-progress']})</SelectItem>
            <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
            <SelectItem value="behind-schedule">Behind Schedule ({statusCounts['behind-schedule']})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No matching goals found' : 'No goals yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first goal to start tracking your progress'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-primary hover:bg-primary-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;
