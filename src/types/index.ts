
export type UserRole = 'employee' | 'manager' | 'group-leader' | 'ld-team';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: 'rd' | 'sm' | 'ga';
  managerId?: string;
  avatarUrl?: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  companyGoalAlignment: string;
  department: 'rd' | 'sm' | 'ga';
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'behind-schedule';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressEntry {
  id: string;
  goalId: string;
  month: string;
  year: number;
  achieved: boolean;
  notes?: string;
  createdAt: string;
}

export interface DepartmentStats {
  department: 'rd' | 'sm' | 'ga';
  name: string;
  totalEmployees: number;
  goalsSet: number;
  goalsCompleted: number;
  averageProgress: number;
}

export interface CompanyStrategy {
  id: string;
  title: string;
  description: string;
  department?: 'rd' | 'sm' | 'ga';
  priority: 'high' | 'medium' | 'low';
}
