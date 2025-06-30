
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, PieChart, PlusCircle, Wallet, StickyNote, Target, DollarSign, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-border py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary font-semibold text-xl">
            <Wallet className="h-6 w-6" />
            <span>ExpenseWise</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/dashboard" className={`${navigationMenuTriggerStyle()} ${
                    location.pathname === "/dashboard" ? "bg-accent text-accent-foreground" : ""
                  }`}>
                    Dashboard
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/add" className={`${navigationMenuTriggerStyle()} ${
                    location.pathname === "/add" ? "bg-accent text-accent-foreground" : ""
                  }`}>
                    Add Transaction
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/budget" className={`${navigationMenuTriggerStyle()} ${
                    location.pathname === "/budget" ? "bg-accent text-accent-foreground" : ""
                  }`}>
                    Budget
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/notes" className={`${navigationMenuTriggerStyle()} ${
                    location.pathname === "/notes" ? "bg-accent text-accent-foreground" : ""
                  }`}>
                    Notes
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/reports" className={`${navigationMenuTriggerStyle()} ${
                    location.pathname === "/reports" ? "bg-accent text-accent-foreground" : ""
                  }`}>
                    Reports
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/goals">
                    <Target className="mr-2 h-4 w-4" />
                    Goals
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Theme Toggle */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
        {children}
      </main>
      
      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <div className="grid grid-cols-5">
          <Link 
            to="/dashboard" 
            className={`flex flex-col items-center py-2 px-2 ${
              location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link 
            to="/add" 
            className={`flex flex-col items-center py-2 px-2 ${
              location.pathname === "/add" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Add</span>
          </Link>
          <Link 
            to="/budget" 
            className={`flex flex-col items-center py-2 px-2 ${
              location.pathname === "/budget" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <DollarSign className="h-5 w-5" />
            <span className="text-xs mt-1">Budget</span>
          </Link>
          <Link 
            to="/notes" 
            className={`flex flex-col items-center py-2 px-2 ${
              location.pathname === "/notes" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <StickyNote className="h-5 w-5" />
            <span className="text-xs mt-1">Notes</span>
          </Link>
          <Link 
            to="/profile" 
            className={`flex flex-col items-center py-2 px-2 ${
              location.pathname === "/profile" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
