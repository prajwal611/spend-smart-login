
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export type GoalCategory = 
  | "emergency_fund"
  | "vacation"
  | "house"
  | "car"
  | "education"
  | "retirement"
  | "investment"
  | "other";

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: GoalCategory;
  targetDate: string;
  description?: string;
  createdAt: string;
}

interface GoalContextType {
  goals: FinancialGoal[];
  isLoading: boolean;
  addGoal: (goal: Omit<FinancialGoal, "id" | "createdAt">) => void;
  updateGoal: (id: string, goal: Partial<Omit<FinancialGoal, "id" | "createdAt">>) => void;
  deleteGoal: (id: string) => void;
  addToGoal: (id: string, amount: number) => void;
  getTotalGoalsTarget: () => number;
  getTotalGoalsSaved: () => number;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const savedGoals = localStorage.getItem(`goals_${user.id}`);
      if (savedGoals) {
        try {
          setGoals(JSON.parse(savedGoals));
        } catch (error) {
          console.error("Failed to parse saved goals:", error);
          setGoals([]);
        }
      } else {
        setGoals([]);
      }
    } else {
      setGoals([]);
    }
    setIsLoading(false);
  }, [user]);

  const saveGoals = (updatedGoals: FinancialGoal[]) => {
    if (user) {
      localStorage.setItem(`goals_${user.id}`, JSON.stringify(updatedGoals));
    }
  };

  const addGoal = (goal: Omit<FinancialGoal, "id" | "createdAt">) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    toast.success("Financial goal added");
  };

  const updateGoal = (id: string, updatedFields: Partial<Omit<FinancialGoal, "id" | "createdAt">>) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, ...updatedFields } : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    toast.success("Goal updated");
  };

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    toast.success("Goal deleted");
  };

  const addToGoal = (id: string, amount: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id 
        ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) }
        : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    toast.success(amount > 0 ? "Amount added to goal" : "Amount withdrawn from goal");
  };

  const getTotalGoalsTarget = () => {
    return goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  };

  const getTotalGoalsSaved = () => {
    return goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        isLoading,
        addGoal,
        updateGoal,
        deleteGoal,
        addToGoal,
        getTotalGoalsTarget,
        getTotalGoalsSaved,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalProvider");
  }
  return context;
};
