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

// Safe localStorage operations for SSR/production environments
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage getItem failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage setItem failed:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage removeItem failed:', error);
    }
  }
};

// Mock users for demo - make this persistent in localStorage so users persist across refreshes
const getMockUsers = () => {
  try {
    const storedUsers = safeLocalStorage.getItem("expenseTrackerMockUsers");
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to parse stored mock users:", error);
  }
  
  // Always ensure we have default users
  const defaultUsers = getDefaultUsers();
  saveMockUsers(defaultUsers);
  return defaultUsers;
};

const getDefaultUsers = () => [
  {
    id: "demo-user-1",
    email: "user@example.com",
    password: "password123",
    name: "Demo User",
  },
];

// Save users to localStorage
const saveMockUsers = (users: any[]) => {
  try {
    safeLocalStorage.setItem("expenseTrackerMockUsers", JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save mock users:", error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize users on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure default users exist
      getMockUsers();
    }
  }, []);

  useEffect(() => {
    // Check for saved user in localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedUser = safeLocalStorage.getItem("expenseTrackerUser");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Validate the parsed user has required fields
          if (parsedUser && 
              typeof parsedUser.id === 'string' && 
              typeof parsedUser.email === 'string' && 
              typeof parsedUser.name === 'string') {
            setUser(parsedUser);
          } else {
            console.warn("Invalid saved user data, clearing localStorage");
            safeLocalStorage.removeItem("expenseTrackerUser");
          }
        }
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        safeLocalStorage.removeItem("expenseTrackerUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("=== LOGIN ATTEMPT START ===");
    
    if (!email || !password) {
      const errorMsg = "Please enter both email and password";
      console.log("Login failed: Missing credentials");
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setIsLoading(true);
      
      // Normalize inputs
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();
      
      console.log("Normalized login inputs:", { 
        email: normalizedEmail, 
        passwordLength: normalizedPassword.length 
      });
      
      // Get current users from localStorage with proper error handling
      const currentUsers = getMockUsers();
      console.log("Available users:", currentUsers.map(u => ({ 
        id: u.id, 
        email: u.email, 
        passwordLength: u.password?.length 
      })));
      
      if (!Array.isArray(currentUsers) || currentUsers.length === 0) {
        console.error("No users found in storage, initializing default users");
        const defaultUsers = getDefaultUsers();
        saveMockUsers(defaultUsers);
        console.log("Initialized default users:", defaultUsers.map(u => ({ 
          id: u.id, 
          email: u.email 
        })));
      }
      
      // Find user with exact match
      const foundUser = currentUsers.find(user => {
        if (!user || !user.email || !user.password) {
          console.warn("Invalid user object found:", user);
          return false;
        }
        
        const userEmail = user.email.toLowerCase().trim();
        const userPassword = user.password.trim();
        
        const emailMatch = userEmail === normalizedEmail;
        const passwordMatch = userPassword === normalizedPassword;
        
        console.log("Checking user:", {
          userEmail,
          emailMatch,
          passwordMatch,
          storedPasswordLength: userPassword.length,
          inputPasswordLength: normalizedPassword.length
        });
        
        return emailMatch && passwordMatch;
      });
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        console.log("Login successful for user:", userWithoutPassword);
        
        setUser(userWithoutPassword);
        safeLocalStorage.setItem("expenseTrackerUser", JSON.stringify(userWithoutPassword));
        toast.success("Logged in successfully");
      } else {
        console.log("Login failed - no matching user found");
        console.log("Attempted login with:", { normalizedEmail, passwordLength: normalizedPassword.length });
        console.log("Available users for comparison:", currentUsers.map(u => ({
          email: u.email?.toLowerCase().trim(),
          passwordLength: u.password?.length
        })));
        
        toast.error("Invalid email or password");
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log("=== LOGIN ATTEMPT END ===");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      throw new Error("All fields are required");
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentUsers = getMockUsers();
      
      const normalizedEmail = email.trim().toLowerCase();
      if (currentUsers.some(u => u.email && u.email.toLowerCase().trim() === normalizedEmail)) {
        toast.error("User already exists");
        throw new Error("User already exists");
      }
      
      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: email.trim(),
        name: name.trim(),
        password: password.trim(),
      };
      
      const updatedUsers = [...currentUsers, newUser];
      saveMockUsers(updatedUsers);
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      safeLocalStorage.setItem("expenseTrackerUser", JSON.stringify(userWithoutPassword));
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
    safeLocalStorage.removeItem("expenseTrackerUser");
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
