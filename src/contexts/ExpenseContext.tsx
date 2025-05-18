import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export type ExpenseCategory = 
  | "food"
  | "transportation"
  | "housing"
  | "utilities"
  | "entertainment"
  | "healthcare"
  | "education"
  | "shopping"
  | "personal"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  isIncome: boolean;
}

interface ExpenseContextType {
  expenses: Expense[];
  isLoading: boolean;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Omit<Expense, "id">>) => void;
  deleteExpense: (id: string) => void;
  getTotalExpenses: () => number;
  getTotalIncome: () => number;
  getBalance: () => number;
  getExpensesByCategory: () => Record<ExpenseCategory, number>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Mock initial expenses - only used for demo user
const MOCK_EXPENSES: Expense[] = [
  {
    id: "1",
    amount: 45.99,
    description: "Grocery shopping",
    category: "food",
    date: new Date().toISOString(),
    isIncome: false,
  },
  {
    id: "2",
    amount: 1200,
    description: "Monthly salary",
    category: "other",
    date: new Date().toISOString(),
    isIncome: true,
  },
  {
    id: "3",
    amount: 30.00,
    description: "Gas",
    category: "transportation",
    date: new Date().toISOString(),
    isIncome: false,
  },
  {
    id: "4",
    amount: 800,
    description: "Rent",
    category: "housing",
    date: new Date().toISOString(),
    isIncome: false,
  },
];

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load expenses from localStorage when user changes
    if (user) {
      const savedExpenses = localStorage.getItem(`expenses_${user.id}`);
      if (savedExpenses) {
        try {
          setExpenses(JSON.parse(savedExpenses));
        } catch (error) {
          console.error("Failed to parse saved expenses:", error);
          // Only use mock data for the demo user (id: "1")
          setExpenses(user.id === "1" ? MOCK_EXPENSES : []);
        }
      } else {
        // Only use mock data for the demo user (id: "1"), empty array for new users
        const initialExpenses = user.id === "1" ? MOCK_EXPENSES : [];
        setExpenses(initialExpenses);
        saveExpenses(initialExpenses);
      }
    } else {
      setExpenses([]);
    }
    setIsLoading(false);
  }, [user]);

  const saveExpenses = (updatedExpenses: Expense[]) => {
    if (user) {
      localStorage.setItem(`expenses_${user.id}`, JSON.stringify(updatedExpenses));
    }
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    toast.success(expense.isIncome ? "Income added" : "Expense added");
  };

  const updateExpense = (id: string, updatedFields: Partial<Omit<Expense, "id">>) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, ...updatedFields } : expense
    );
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    toast.success("Transaction updated");
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    toast.success(expense?.isIncome ? "Income deleted" : "Expense deleted");
  };

  const getTotalExpenses = () => {
    return expenses
      .filter(expense => !expense.isIncome)
      .reduce((acc, expense) => acc + expense.amount, 0);
  };

  const getTotalIncome = () => {
    return expenses
      .filter(expense => expense.isIncome)
      .reduce((acc, expense) => acc + expense.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getExpensesByCategory = () => {
    const categories = {} as Record<ExpenseCategory, number>;
    expenses
      .filter(expense => !expense.isIncome)
      .forEach(expense => {
        if (!categories[expense.category]) {
          categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
      });
    return categories;
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        isLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        getTotalExpenses,
        getTotalIncome,
        getBalance,
        getExpensesByCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
