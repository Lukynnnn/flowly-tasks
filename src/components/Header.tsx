
import React from 'react';
import { PlusCircle, Search, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onCreateBoard?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateBoard }) => {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 flex items-center px-6 sticky top-0 animate-fade-in">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-semibold tracking-tight">Flowly Boards</h1>
        <div className="relative ml-6 hidden md:block w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search boards..."
            className="w-full appearance-none bg-background pl-8 shadow-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9" onClick={onCreateBoard}>
          <PlusCircle className="mr-1 h-4 w-4" />
          New Board
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
