import { createContext, useContext, useState } from "react";

// Create the auth context
const AuthContext = createContext(null);

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock user for development
const mockUser = {
    id: '1',
    email: 'user@example.com',
    name: 'Test User'
};

// Auth provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    // Mock sign in function
    const signIn = async (email, password) => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simple validation
        if (email === 'user@example.com' && password === 'password') {
          setUser(mockUser);
          return { user: mockUser, error: null };
        } else {
          throw new Error('Invalid email or password');
        }
      } catch (error) {
        setError(error.message);
        return { user: null, error: error.message };
      } finally {
        setLoading(false);
      }
    };
  
    // Mock sign up function
    const signUp = async (email, password) => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, just return success
        return { user: null, error: null, message: 'Check your email for confirmation' };
      } catch (error) {
        setError(error.message);
        return { user: null, error: error.message };
      } finally {
        setLoading(false);
      }
    };
  
    // Mock sign out function
    const signOut = async () => {
      setUser(null);
      return { error: null };
    };
  
    const value = {
      user,
      loading,
      error,
      signIn,
      signUp,
      signOut
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}