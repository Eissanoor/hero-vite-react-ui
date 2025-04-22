
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_CONFIG from '../config/api.js';

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile data from API
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ME}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      // Extract user data from the data.data property
      const userData = data.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If we can't fetch the profile, we should log the user out
      logout();
      throw error;
    }
  };

  // Check for authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setLoading(true);
      
      if (authStatus) {
        try {
          await fetchUserProfile();
          setIsAuthenticated(true);
          
          // If on login page, redirect to dashboard
          if (location.pathname === '/login') {
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          // If profile fetch fails, consider user not authenticated
          setIsAuthenticated(false);
          if (location.pathname !== '/login') {
            navigate('/login', { replace: true });
          }
        }
      } else {
        setIsAuthenticated(false);
        // If not authenticated and not already on login page, redirect to login
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [location.pathname, navigate]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      
      // Fetch user profile with the new token
      try {
        const userProfile = await fetchUserProfile();
        setIsAuthenticated(true);
        navigate('/dashboard', { replace: true });
        return { success: true, user: userProfile };
      } catch (profileError) {
        // If profile fetch fails but login succeeded, still consider it a success
        // but log the error
        console.error('Error fetching profile after login:', profileError);
        setIsAuthenticated(true);
        navigate('/dashboard', { replace: true });
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
