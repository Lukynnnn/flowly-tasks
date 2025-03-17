
import React from 'react';
import { PlusCircle, Search, Settings, LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onCreateBoard?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateBoard }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "There was a problem logging out.",
        variant: "destructive"
      });
    }
  };

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
        {isAuthenticated ? (
          <>
            <Button variant="outline" size="sm" className="h-9" onClick={onCreateBoard}>
              <PlusCircle className="mr-1 h-4 w-4" />
              New Board
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 relative">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">{user?.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" className="h-9" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button size="sm" className="h-9" onClick={() => navigate('/register')}>
              Register
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
