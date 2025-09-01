import { LogOut, Calendar, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">MediCare</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {user?.role}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};