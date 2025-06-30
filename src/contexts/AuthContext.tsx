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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - make this persistent in localStorage so users persist across refreshes
const getMockUsers = () => {
  const storedUsers = localStorage.getItem("expenseTrackerMockUsers");
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (error) {
      console.error("Failed to parse stored mock users:", error);
    }
  }
  return [
    {
      id: "1",
      email: "user@example.com",
      password: "password123",
      name: "Demo User",
    },
  ];
};

// Save users to localStorage
const saveMockUsers = (users: any[]) => {
  localStorage.setItem("expenseTrackerMockUsers", JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("expenseTrackerUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("expenseTrackerUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current users from localStorage
      const currentUsers = getMockUsers();
      console.log("Current users:", currentUsers);
      console.log("Attempting login with:", { email, password });
      
      const foundUser = currentUsers.find(
        (u) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("expenseTrackerUser", JSON.stringify(userWithoutPassword));
        toast.success("Logged in successfully");
      } else {
        console.log("User not found or wrong credentials");
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
    try {
      // Simulate API call delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current users from localStorage
      const currentUsers = getMockUsers();
      
      // Check if user already exists
      if (currentUsers.some(u => u.email === email)) {
        toast.error("User already exists");
        throw new Error("User already exists");
      }
      
      // Create a new user
      const newUser = {
        id: (currentUsers.length + 1).toString(),
        email,
        name,
        password, // Include password for mock data
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
