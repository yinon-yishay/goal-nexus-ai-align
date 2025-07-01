
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3,
  CheckSquare,
  Settings,
  UserCog
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['employee', 'manager', 'group-leader', 'ld-team']
  },
  {
    title: 'My Goals',
    href: '/goals',
    icon: Target,
    roles: ['employee']
  },
  {
    title: 'Team Goals',
    href: '/team-goals',
    icon: Users,
    roles: ['manager', 'group-leader']
  },
  {
    title: 'Progress Tracking',
    href: '/progress',
    icon: CheckSquare,
    roles: ['employee', 'manager']
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['manager', 'group-leader', 'ld-team']
  },
  {
    title: 'Organization Overview',
    href: '/organization',
    icon: TrendingUp,
    roles: ['group-leader', 'ld-team']
  },
  {
    title: 'Backoffice',
    href: '/backoffice',
    icon: UserCog,
    roles: ['ld-team', 'group-leader']
  }
];

export const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
