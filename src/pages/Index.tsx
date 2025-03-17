
import React from 'react';
import Header from '@/components/Header';
import Board from '@/components/Board';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Organize your tasks with Flowly
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A simple and intuitive task management application that helps you stay organized and productive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                Login
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Board />
      </main>
    </div>
  );
};

export default Index;
