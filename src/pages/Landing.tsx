
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3, 
  MessageSquare,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: 'AI-Powered Goal Alignment',
      description: 'Automatically align individual employee goals with organizational strategy using advanced AI analysis.'
    },
    {
      icon: TrendingUp,
      title: 'Automated Progress Tracking',
      description: 'Monthly automated feedback and progress tracking with personalized recommendations for growth.'
    },
    {
      icon: MessageSquare,
      title: 'Slack Integration',
      description: 'Seamless communication with automated reports delivered directly to employees and managers via Slack.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards and analytics to track performance across departments and teams.'
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Customized experiences for employees, managers, group leaders, and L&D teams.'
    },
    {
      icon: Zap,
      title: 'Real-Time Insights',
      description: 'Get instant insights into goal alignment, progress trends, and organizational performance.'
    }
  ];

  const companyGoals = [
    'Position the company as a market leader in AI-driven solutions',
    'Integrate SAM as a core technology layer across In-App, CTV, and Web markets',
    'Drive measurable business impact through data-led customer value'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary">Thanos Project</span>
            </div>
            <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary-600">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            AI-Powered Performance
            <span className="text-primary block">Alignment System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            Transform your organization with intelligent goal alignment that automatically connects 
            individual employee objectives with company strategy, delivering monthly insights and 
            recommendations through AI-driven analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary-600 text-lg px-8 py-3"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-3 border-primary text-primary hover:bg-primary-50"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Every Role
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Designed to serve employees, managers, group leaders, and L&D teams with 
            role-specific insights and capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Company Goals Section */}
      <section className="bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sample Company Strategy Framework
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how individual goals align with organizational strategy through our AI-powered analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {companyGoals.map((goal, index) => (
              <Card key={index} className="border-0 bg-gradient-to-br from-primary-50 to-secondary-50">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 mt-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-primary">0{index + 1}</div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{goal}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-primary to-secondary border-0 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Organization?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join forward-thinking companies using AI to align their teams and drive unprecedented growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-3"
              >
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Thanos Project</span>
            </div>
            <p className="text-gray-400">
              © 2024 Thanos Project. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
