
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import { GoalProvider } from "./contexts/GoalContext";
import { NotesProvider } from "./contexts/NotesContext";
import { BudgetProvider } from "./contexts/BudgetContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Goals from "./pages/Goals";
import AddGoal from "./pages/AddGoal";
import Notes from "./pages/Notes";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public route that redirects to dashboard if authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// App with providers
const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="expensewise-theme">
        <AuthProvider>
          <ExpenseProvider>
            <GoalProvider>
              <NotesProvider>
                <BudgetProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route 
                        path="/" 
                        element={
                          <PublicRoute>
                            <Index />
                          </PublicRoute>
                        } 
                      />
                      <Route 
                        path="/login" 
                        element={
                          <PublicRoute>
                            <Login />
                          </PublicRoute>
                        } 
                      />
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Dashboard />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/add" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <AddExpense />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/edit/:id" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <EditExpense />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/transactions" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Transactions />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/reports" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Reports />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/goals" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Goals />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/goals/add" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <AddGoal />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/notes" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Notes />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/budget" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Budget />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Profile />
                            </Layout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </BudgetProvider>
              </NotesProvider>
            </GoalProvider>
          </ExpenseProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => <AppWithProviders />;

export default App;
