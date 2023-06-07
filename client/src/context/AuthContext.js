import React, { createContext, useState } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// AuthContext Provider component
// AuthContext Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ username: '' }); // Set a default user object

  // Function to set the logged-in user
  const login = (userData) => {
    const { username, email } = userData;
    setUser({ username, email });
  };

  // Function to log out the user
  const logout = () => {
    setUser({ username: '' }); // Reset the user object
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

