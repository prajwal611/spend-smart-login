

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - make this persistent in localStorage so users persist across refreshes
const getMockUsers = () => {
  try {
    const storedUsers = localStorage.getItem("expenseTrackerMockUsers");
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      return Array.isArray(parsed) ? parsed : getDefaultUsers();
    }
  } catch (error) {
    console.error("Failed to parse stored mock users:", error);
  }
  return getDefaultUsers();
};

const getDefaultUsers = () => [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    name: "Demo User",
  },
];

// Save users to localStorage
const saveMockUsers = (users: any[]) => {
  try {
    localStorage.setItem("expenseTrackerMockUsers", JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save mock users:", error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    try {
      const savedUser = localStorage.getItem("expenseTrackerUser");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Validate the parsed user has required fields
        if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.name) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("expenseTrackerUser");
        }
      }
    } catch (error) {
      console.error("Failed to parse saved user:", error);
      localStorage.removeItem("expenseTrackerUser");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      throw new Error("Email and password are required");
    }

    try {
      // Simulate API call delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current users from localStorage
      const currentUsers = getMockUsers();
      console.log("Available users for login:", currentUsers.map(u => ({ email: u.email, id: u.id })));
      
      // Normalize inputs
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();
      
      console.log("Login attempt:", { email: normalizedEmail, hasPassword: !!normalizedPassword });
      
      // Find user with exact match
      const foundUser = currentUsers.find(user => {
        const userEmail = user.email.toLowerCase();
        return userEmail === normalizedEmail && user.password === normalizedPassword;
      });
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("expenseTrackerUser", JSON.stringify(userWithoutPassword));
        toast.success("Logged in successfully");
        console.log("Login successful for:", userWithoutPassword.email);
      } else {
        console.log("Login failed - no matching user found");
        toast.error("Invalid email or password");
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      throw new Error("All fields are required");
    }

    try {
      // Simulate API call delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current users from localStorage
      const currentUsers = getMockUsers();
      
      // Check if user already exists (case insensitive)
      const normalizedEmail = email.trim().toLowerCase();
      if (currentUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
        toast.error("User already exists");
        throw new Error("User already exists");
      }
      
      // Create a new user
      const newUser = {
        id: Date.now().toString(), // Use timestamp for unique ID
        email: email.trim(),
        name: name.trim(),
        password: password.trim(),
      };
      
      // Add to users array and save
      const updatedUsers = [...currentUsers, newUser];
      saveMockUsers(updatedUsers);
      
      // Return without password for user state
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("expenseTrackerUser", JSON.stringify(userWithoutPassword));
      toast.success("Registration successful");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    if (!currentPassword || !newPassword) {
      toast.error("Please enter both current and new password");
      throw new Error("Both passwords are required");
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentUsers = getMockUsers();
      const userIndex = currentUsers.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      if (currentUsers[userIndex].password !== currentPassword.trim()) {
        toast.error("Current password is incorrect");
        throw new Error("Current password is incorrect");
      }
      
      // Update password
      currentUsers[userIndex].password = newPassword.trim();
      saveMockUsers(currentUsers);
      
      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("expenseTrackerUser");
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

