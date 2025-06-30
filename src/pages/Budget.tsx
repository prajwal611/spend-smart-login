
import React, { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, AlertTriangle, Target, Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const Budget: React.FC = () => {
  const { budgets, setBudgetLimit, getCurrentMonthBudget, deleteBudget } = useBudget();
  const { expenses } = useExpenses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [budgetAmount, setBudgetAmount] = useState("");
  const [editingBudget, setEditingBudget] = useState<string | null>(null);

  const currentMonthBudget = getCurrentMonthBudget();
  
  // Calculate actual spent amount from expenses
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses
    .filter(expense => !expense.isIncome && expense.date.startsWith(currentMonth))
    .reduce((total, expense) => total + expense.amount, 0);

  const handleSetBudget = () => {
    const amount = parseFloat(budgetAmount);
    if (amount > 0 && selectedMonth) {
      setBudgetLimit(selectedMonth, amount);
      setBudgetAmount("");
      setIsDialogOpen(false);
      setEditingBudget(null);
    }
  };

  const handleEditBudget = (budgetId: string, currentLimit: number, month: string) => {
    setEditingBudget(budgetId);
    setSelectedMonth(month);
    setBudgetAmount(currentLimit.toString());
    setIsDialogOpen(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    deleteBudget(budgetId);
  };

  const getMonthName = (monthString: string) => {
    const date = new Date(monthString + "-01");
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getBudgetStatus = (budget: any, actualSpent: number) => {
    if (budget.limit === 0) return "No limit set";
    const percentage = (actualSpent / budget.limit) * 100;
    
    if (percentage >= 100) return "Over budget";
    if (percentage >= 80) return "Near limit";
    return "On track";
  };

  const getBudgetColor = (budget: any, actualSpent: number) => {
    if (budget.limit === 0) return "text-muted-foreground";
    const percentage = (actualSpent / budget.limit) * 100;
    
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingBudget(null);
            setBudgetAmount("");
            setSelectedMonth(new Date().toISOString().slice(0, 7));
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? "Edit Monthly Budget" : "Set Monthly Budget"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={!!editingBudget}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter budget amount"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSetBudget}>
                  {editingBudget ? "Update Budget" : "Set Budget"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Month Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Month - {getMonthName(currentMonth)}
          </CardTitle>
          <CardDescription>
            Your spending progress for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentMonthBudget && currentMonthBudget.limit > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {formatCurrency(currentMonthExpenses)} of {formatCurrency(currentMonthBudget.limit)}
                </span>
                <span className={`text-sm font-medium ${getBudgetColor(currentMonthBudget, currentMonthExpenses)}`}>
                  {getBudgetStatus(currentMonthBudget, currentMonthExpenses)}
                </span>
              </div>
              <Progress 
                value={Math.min((currentMonthExpenses / currentMonthBudget.limit) * 100, 100)} 
                className="h-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Remaining: {formatCurrency(Math.max(0, currentMonthBudget.limit - currentMonthExpenses))}</span>
                <span>{Math.round((currentMonthExpenses / currentMonthBudget.limit) * 100)}%</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">No budget set for this month</h3>
              <p className="text-muted-foreground mb-4">
                Set a budget limit to track your spending progress.
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Set Budget for {getMonthName(currentMonth)}
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Budgets */}
      {budgets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Budget Periods</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets
              .sort((a, b) => b.month.localeCompare(a.month))
              .map((budget) => {
                const monthExpenses = expenses
                  .filter(expense => !expense.isIncome && expense.date.startsWith(budget.month))
                  .reduce((total, expense) => total + expense.amount, 0);
                
                return (
                  <Card key={budget.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{getMonthName(budget.month)}</CardTitle>
                          <CardDescription className={getBudgetColor(budget, monthExpenses)}>
                            {getBudgetStatus(budget, monthExpenses)}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBudget(budget.id, budget.limit, budget.month)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the budget for {getMonthName(budget.month)}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBudget(budget.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {budget.limit > 0 ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Spent: {formatCurrency(monthExpenses)}</span>
                            <span>Limit: {formatCurrency(budget.limit)}</span>
                          </div>
                          <Progress 
                            value={Math.min((monthExpenses / budget.limit) * 100, 100)} 
                            className="h-2"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No limit set</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
