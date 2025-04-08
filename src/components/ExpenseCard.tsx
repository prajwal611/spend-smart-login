
import React from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Expense } from "@/contexts/ExpenseContext";
import { Badge } from "@/components/ui/badge";
import CategoryIcon from "./CategoryIcon";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { formatCurrency } from "@/lib/utils";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${expense.isIncome ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}>
              <CategoryIcon 
                category={expense.isIncome ? 'income' : expense.category} 
              />
            </div>
            <div>
              <p className="font-medium">{expense.description}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(expense.date), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className={`font-semibold ${expense.isIncome ? 'text-income' : 'text-expense'}`}>
              {expense.isIncome ? '+' : '-'}{formatCurrency(expense.amount)}
            </p>
            {!expense.isIncome && (
              <Badge variant="secondary" className="mt-1">
                {expense.category}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-3 space-x-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
