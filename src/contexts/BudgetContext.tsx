
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface MonthlyBudget {
  id: string;
  month: string; // Format: "2024-01"
  limit: number;
  spent: number;
}

interface BudgetContextType {
  budgets: MonthlyBudget[];
  isLoading: boolean;
  setBudgetLimit: (month: string, limit: number) => void;
  updateSpent: (month: string, amount: number) => void;
  getCurrentMonthBudget: () => MonthlyBudget | null;
  getBudgetForMonth: (month: string) => MonthlyBudget | null;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const savedBudgets = localStorage.getItem(`budgets_${user.id}`);
      if (savedBudgets) {
        try {
          setBudgets(JSON.parse(savedBudgets));
        } catch (error) {
          console.error("Failed to parse saved budgets:", error);
          setBudgets([]);
        }
      } else {
        setBudgets([]);
      }
    } else {
      setBudgets([]);
    }
    setIsLoading(false);
  }, [user]);

  const saveBudgets = (updatedBudgets: MonthlyBudget[]) => {
    if (user) {
      localStorage.setItem(`budgets_${user.id}`, JSON.stringify(updatedBudgets));
    }
  };

  const setBudgetLimit = (month: string, limit: number) => {
    const existingBudgetIndex = budgets.findIndex(b => b.month === month);
    let updatedBudgets: MonthlyBudget[];

    if (existingBudgetIndex >= 0) {
      updatedBudgets = budgets.map((budget, index) =>
        index === existingBudgetIndex ? { ...budget, limit } : budget
      );
    } else {
      const newBudget: MonthlyBudget = {
        id: Date.now().toString(),
        month,
        limit,
        spent: 0,
      };
      updatedBudgets = [...budgets, newBudget];
    }

    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
    toast.success(`Budget limit set for ${month}`);
  };

  const updateSpent = (month: string, amount: number) => {
    const existingBudgetIndex = budgets.findIndex(b => b.month === month);
    let updatedBudgets: MonthlyBudget[];

    if (existingBudgetIndex >= 0) {
      updatedBudgets = budgets.map((budget, index) =>
        index === existingBudgetIndex 
          ? { ...budget, spent: Math.max(0, budget.spent + amount) }
          : budget
      );
    } else {
      const newBudget: MonthlyBudget = {
        id: Date.now().toString(),
        month,
        limit: 0,
        spent: Math.max(0, amount),
      };
      updatedBudgets = [...budgets, newBudget];
    }

    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
  };

  const getCurrentMonthBudget = (): MonthlyBudget | null => {
    const currentMonth = new Date().toISOString().slice(0, 7); // "2024-01"
    return budgets.find(b => b.month === currentMonth) || null;
  };

  const getBudgetForMonth = (month: string): MonthlyBudget | null => {
    return budgets.find(b => b.month === month) || null;
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        isLoading,
        setBudgetLimit,
        updateSpent,
        getCurrentMonthBudget,
        getBudgetForMonth,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
