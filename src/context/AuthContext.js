import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
    }
  }, [token, name]);

  const setTokenAndRedirect = (newToken, name) => {
    setToken(newToken);
    setName(name);
    navigate('/encrypt');
  };

  const logout = () => {
    setToken('');
    setName('');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/');
  };
  

  return (
    <AuthContext.Provider value={{ token, setToken: setTokenAndRedirect, name, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
