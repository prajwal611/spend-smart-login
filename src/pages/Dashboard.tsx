
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Wallet } from "lucide-react";
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { expenses, deleteExpense, getBalance, getTotalIncome, getTotalExpenses } = useExpenses();
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();

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
      <div className="grid gap-4 sm:grid-cols-3">
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
      </div>

      {/* Charts and recent transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart */}
        <ExpensePieChart />

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
