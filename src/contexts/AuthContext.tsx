
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

// Initialize with stored users or default
const MOCK_USERS = getMockUsers();

// Save users to localStorage
const saveMockUsers = () => {
  localStorage.setItem("expenseTrackerMockUsers", JSON.stringify(MOCK_USERS));
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
    // Simulate API call delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("expenseTrackerUser", JSON.stringify(userWithoutPassword));
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid email or password");
      throw new Error("Invalid email or password");
    }
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      toast.error("User already exists");
      setIsLoading(false);
      throw new Error("User already exists");
    }
    
    // Create a new user
    const newUser = {
      id: (MOCK_USERS.length + 1).toString(),
      email,
      name,
      password, // Include password for mock data
    };
    
    // Add to mock users array
    MOCK_USERS.push(newUser);
    saveMockUsers(); // Save updated users list
    
    // Return without password for user state
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("expenseTrackerUser", JSON.stringify(userWithoutPassword));
    toast.success("Registration successful");
    setIsLoading(false);
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
