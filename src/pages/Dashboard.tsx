import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Wallet, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpenses } from "@/contexts/ExpenseContext";
import ExpenseCard from "@/components/ExpenseCard";
import ExpensePieChart from "@/components/ExpensePieChart";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGoals } from "@/contexts/GoalContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { expenses, deleteExpense, getBalance, getTotalIncome, getTotalExpenses } = useExpenses();
  const { goals, getTotalGoalsTarget, getTotalGoalsSaved } = useGoals();
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const totalGoalsTarget = getTotalGoalsTarget();
  const totalGoalsSaved = getTotalGoalsSaved();

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const recentExpenses = sortedExpenses.slice(0, 5);

  const handleDelete = () => {
    if (selectedExpenseId) {
      deleteExpense(selectedExpenseId);
      setSelectedExpenseId(null);
      setShowConfirmDialog(false);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedExpenseId(id);
    setShowConfirmDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <Button asChild>
          <Link to="/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-income/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-expense/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalGoalsTarget > 0 
                ? `${Math.round((totalGoalsSaved / totalGoalsTarget) * 100)}%`
                : "0%"
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(totalGoalsSaved)} of {formatCurrency(totalGoalsTarget)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and recent transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart */}
        <ExpensePieChart />

        {/* Recent Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Financial Goals</CardTitle>
              <CardDescription>
                Your active financial goals
              </CardDescription>
            </div>
            <Button variant="ghost" asChild className="text-sm">
              <Link to="/goals">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.length > 0 ? (
              goals.slice(0, 3).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{goal.name}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg mb-1">No goals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Set financial goals to track your progress.
                </p>
                <Button asChild>
                  <Link to="/goals/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Goal
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your latest 5 transactions
              </CardDescription>
            </div>
            <Button variant="ghost" asChild className="text-sm">
              <Link to="/transactions">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <ExpenseCard 
                  key={expense.id} 
                  expense={expense} 
                  onEdit={() => navigate(`/edit/${expense.id}`)}
                  onDelete={() => confirmDelete(expense.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg mb-1">No transactions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding your income and expenses to track your finances.
                </p>
                <Button asChild>
                  <Link to="/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
