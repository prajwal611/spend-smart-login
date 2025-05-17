
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, PieChart, PlusCircle, Wallet } from "lucide-react";
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

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-primary font-semibold text-xl">
            <Wallet className="h-6 w-6" />
            <span>ExpenseWise</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={`${navigationMenuTriggerStyle()} ${
                    location.pathname === "/" ? "bg-accent text-accent-foreground" : ""
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
                  <Link to="/reports" className={`${navigationMenuTriggerStyle()} ${
                    location.pathname === "/reports" ? "bg-accent text-accent-foreground" : ""
                  }`}>
                    Reports
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
      
      {/* Mobile navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <div className="flex justify-around">
          <Link 
            to="/" 
            className={`flex flex-col items-center py-2 px-4 ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link 
            to="/add" 
            className={`flex flex-col items-center py-2 px-4 ${
              location.pathname === "/add" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Add</span>
          </Link>
          <Link 
            to="/reports" 
            className={`flex flex-col items-center py-2 px-4 ${
              location.pathname === "/reports" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <PieChart className="h-5 w-5" />
            <span className="text-xs mt-1">Reports</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
