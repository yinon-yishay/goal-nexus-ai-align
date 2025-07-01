
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
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
  }
];

// Function to determine role based on email (for L&D to configure later)
const getRoleFromEmail = (email: string): UserRole => {
  // For POC, simple email-based role assignment
  if (email.includes('manager') || email.includes('mike')) return 'manager';
  if (email.includes('leader') || email.includes('emily')) return 'group-leader';
  if (email.includes('hr') || email.includes('ld') || email.includes('david')) return 'ld-team';
  return 'employee'; // default role
};

const getDepartmentFromEmail = (email: string): 'rd' | 'sm' | 'ga' => {
  // Simple department assignment for POC
  if (email.includes('sales') || email.includes('marketing')) return 'sm';
  if (email.includes('admin') || email.includes('hr')) return 'ga';
  return 'rd'; // default department
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('thanosUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('thanosUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const googleLogin = async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      // For POC, we'll simulate Google OAuth with a prompt
      // In production, this would be replaced with actual Google OAuth
      const email = prompt('Enter your company email for Google Sign-In (POC):');
      
      if (!email) {
        setIsLoading(false);
        return false;
      }

      // Create user from Google sign-in info
      const googleUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        role: getRoleFromEmail(email),
        department: getDepartmentFromEmail(email)
      };

      setUser(googleUser);
      localStorage.setItem('thanosUser', JSON.stringify(googleUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('thanosUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
