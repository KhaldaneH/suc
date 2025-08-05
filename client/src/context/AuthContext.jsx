import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuthStatus, setLoadingAuthStatus] = useState(true);

  useEffect(() => {
    // Example auth check logic - replace with your real logic
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoadingAuthStatus(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loadingAuthStatus, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
