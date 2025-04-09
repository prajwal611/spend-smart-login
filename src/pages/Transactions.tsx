
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "@/contexts/ExpenseContext";
import ExpenseCard from "@/components/ExpenseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { ExpenseCategory } from "@/contexts/ExpenseContext";
import { TransactionType, isValidTransactionType } from "@/lib/utils";

const Transactions: React.FC = () => {
  const { expenses, deleteExpense } = useExpenses();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<TransactionType>("all");
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | "all">("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = 
      filterType === "all" || 
      (filterType === "expense" && !expense.isIncome) || 
      (filterType === "income" && expense.isIncome);
    const matchesCategory = 
      filterCategory === "all" || expense.category === filterCategory;
      
    return matchesSearch && matchesType && (filterType === "income" || matchesCategory);
  });

  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Transactions</h1>
        <Button onClick={() => navigate("/add")}>Add New</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={filterType} onValueChange={(value) => setFilterType(value as TransactionType)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
          
          {filterType !== "income" && (
            <Select 
              value={filterCategory} 
              onValueChange={(value) => setFilterCategory(value as any)}
              disabled={filterType === "income"}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="space-y-4 pb-20 sm:pb-0">
        {sortedExpenses.length > 0 ? (
          sortedExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={() => navigate(`/edit/${expense.id}`)}
              onDelete={() => confirmDelete(expense.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
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

export default Transactions;
