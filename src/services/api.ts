
import axios from 'axios';
import { Expense } from '../contexts/ExpenseContext';

// API base URL - change this when deploying
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type for creating a new expense (without id)
type NewExpense = Omit<Expense, 'id'> & { userId: string };

// Type for expense from the backend (MongoDB uses _id)
interface BackendExpense {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  isIncome: boolean;
  userId: string;
}

// Transform backend expense to frontend expense format
const transformExpense = (backendExpense: BackendExpense): Expense => ({
  id: backendExpense._id,
  amount: backendExpense.amount,
  description: backendExpense.description,
  category: backendExpense.category as any, // Type cast needed here
  date: backendExpense.date,
  isIncome: backendExpense.isIncome,
});

export const ExpenseService = {
  // Get all expenses for a user
  getExpenses: async (userId: string): Promise<Expense[]> => {
    try {
      const response = await apiClient.get(`/expenses/${userId}`);
      return response.data.map(transformExpense);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Create a new expense
  createExpense: async (expense: NewExpense): Promise<Expense> => {
    try {
      const response = await apiClient.post('/expenses', expense);
      return transformExpense(response.data);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // Update an expense
  updateExpense: async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    try {
      const response = await apiClient.patch(`/expenses/${id}`, expense);
      return transformExpense(response.data);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // Delete an expense
  deleteExpense: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/expenses/${id}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },
};

export default ExpenseService;
