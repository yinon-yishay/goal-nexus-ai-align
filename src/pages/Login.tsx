
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Target, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { role: 'Employee', email: 'sarah@company.com', department: 'R&D' },
    { role: 'Manager', email: 'mike@company.com', department: 'R&D' },
    { role: 'Group Leader', email: 'emily@company.com', department: 'Sales & Marketing' },
    { role: 'L&D Team', email: 'david@company.com', department: 'General & Administrative' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome to Thanos Project!",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-primary">Thanos Project</span>
          </div>
          <p className="text-gray-600">AI-Powered Performance Alignment System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-600" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Demo Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-primary-50 border-primary-200">
                <AlertDescription className="text-primary-700">
                  <strong>Demo Password:</strong> demo123<br />
                  Click any account below to auto-fill the login form.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {demoAccounts.map((account, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-white/60"
                    onClick={() => handleDemoLogin(account.email)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{account.role}</h3>
                          <p className="text-sm text-gray-600">{account.email}</p>
                          <p className="text-xs text-gray-500">{account.department}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Use Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Role Capabilities:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Employee:</strong> View personal goals and progress</li>
                  <li>• <strong>Manager:</strong> Manage team goals and analytics</li>
                  <li>• <strong>Group Leader:</strong> Organization-wide oversight</li>
                  <li>• <strong>L&D Team:</strong> Department analytics and insights</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
