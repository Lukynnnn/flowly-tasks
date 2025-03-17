
import React from 'react';
import Header from '@/components/Header';
import Board from '@/components/Board';

const Index: React.FC = () => {
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
