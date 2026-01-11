import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    email:"",
    id:"",
    name:""
  });
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      const response = await axios.get(`${apiBase}/check-auth`, { withCredentials: true });
      if (response.status === 200) {
        setIsLoggedIn(true);
        setUserData({
          name:response.data.name,
          id:response.data.id,
          email:response.data.email,
        })
      }
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);