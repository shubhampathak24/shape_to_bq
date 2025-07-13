import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm" data-id="n9iou5zyo" data-path="src/components/layout/Header.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-id="wdlx6fajy" data-path="src/components/layout/Header.tsx">
        <div className="flex justify-between items-center h-16" data-id="289rsm4m5" data-path="src/components/layout/Header.tsx">
          <div className="flex items-center space-x-3" data-id="9fpkwc1cv" data-path="src/components/layout/Header.tsx">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full" data-id="4lgcqf5t3" data-path="src/components/layout/Header.tsx">
              <MapPin className="h-6 w-6 text-white" data-id="m4yaizdjm" data-path="src/components/layout/Header.tsx" />
            </div>
            <div data-id="85xurm7ej" data-path="src/components/layout/Header.tsx">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-id="87fp64ic0" data-path="src/components/layout/Header.tsx">
                GeoData Loader
              </h1>
              <p className="text-xs text-gray-500" data-id="8wf8tkjeh" data-path="src/components/layout/Header.tsx">Geospatial Data Processing Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4" data-id="ubegwbd2q" data-path="src/components/layout/Header.tsx">
            <DropdownMenu data-id="eldev3hz4" data-path="src/components/layout/Header.tsx">
              <DropdownMenuTrigger asChild data-id="7kvyzqm3f" data-path="src/components/layout/Header.tsx">
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50" data-id="c4sd2gzc2" data-path="src/components/layout/Header.tsx">
                  <Avatar className="h-8 w-8" data-id="n4zukhpw2" data-path="src/components/layout/Header.tsx">
                    <AvatarImage src={user?.avatar} alt={user?.name} data-id="0499eu365" data-path="src/components/layout/Header.tsx" />
                    <AvatarFallback data-id="d13xaym3z" data-path="src/components/layout/Header.tsx">
                      <User className="h-4 w-4" data-id="0m8drmb3m" data-path="src/components/layout/Header.tsx" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left" data-id="vd3hxtk3q" data-path="src/components/layout/Header.tsx">
                    <p className="text-sm font-medium text-gray-900" data-id="ezk4ttaoh" data-path="src/components/layout/Header.tsx">{user?.name}</p>
                    <p className="text-xs text-gray-500" data-id="d0o591s7k" data-path="src/components/layout/Header.tsx">{user?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" data-id="a3biypr1o" data-path="src/components/layout/Header.tsx">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50" data-id="bypv1yl96" data-path="src/components/layout/Header.tsx">
                  <LogOut className="mr-2 h-4 w-4" data-id="3ctf07htt" data-path="src/components/layout/Header.tsx" />
                  <span data-id="9xeyg48bn" data-path="src/components/layout/Header.tsx">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>);

};

export default Header;