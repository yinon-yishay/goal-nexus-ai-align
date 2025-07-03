
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface GoalsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  statusCounts: {
    all: number;
    'not-started': number;
    'in-progress': number;
    'completed': number;
    'behind-schedule': number;
  };
}

export const GoalsFilters: React.FC<GoalsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  statusCounts
}) => {
  return (
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
  );
};
