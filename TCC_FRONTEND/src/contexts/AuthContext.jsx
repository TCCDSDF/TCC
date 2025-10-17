import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configuração da API
const API_BASE_URL = 'https://tcc-upeo.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Tentar login como usuário normal primeiro
      try {
        const response = await axios.post(`${API_BASE_URL}/usuarios/login`, {
          email,
          senha: password
        });
        
        console.log('Login response (usuário):', response.data);
        
        const { token } = response.data;
        const user = {
          id: response.data.id,
          nome: response.data.nome,
          email: response.data.email,
          userType: response.data.tipo // Backend usa 'tipo' em vez de 'userType'
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        setIsAuthenticated(true);
        return user;
      } catch (userError) {
        // Se falhar, tentar login como barbeiro
        console.log('Tentando login como barbeiro...');
        const response = await axios.post(`${API_BASE_URL}/barbeiros/login`, {
          email,
          senha: password
        });
        
        console.log('Login response (barbeiro):', response.data);
        
        const { token } = response.data;
        const user = {
          id: response.data.id,
          nome: response.data.nome,
          email: response.data.email,
          userType: response.data.tipo // 'barbeiro'
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        setIsAuthenticated(true);
        return user;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/cadastro`, userData);
      const { token } = response.data;
      const user = {
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email,
        userType: response.data.tipo // Backend usa 'tipo' em vez de 'userType'
      };
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};