import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

/**
 * Authentication context used to manage JWT-based user sessions.
 *
 * Provides global access to authentication state including:
 * - JWT token
 * - decoded user data (id, username, email)
 * - loading state during initialization
 * - login/logout actions
 *
 * @context AuthContext
 */
const AuthContext = createContext();

/**
 * AuthProvider wraps the application and provides authentication state.
 *
 * On mount, it:
 * - Reads JWT token from localStorage
 * - Decodes it into a user object
 * - Sets loading state until initialization is complete
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - React components that will have access to auth context
 *
 * @returns {JSX.Element} Context provider component
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);

      return {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email
      };
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setUser(decodeToken(savedToken));
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(decodeToken(newToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ loading, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 *
 * @returns {{
 *  token: string | null,
 *  user: {id: number, username: string, email: string} | null,
 *  login: (token: string) => void,
 *  logout: () => void,
 *  loading: boolean
 * }} Auth context values
 */
export const useAuth = () => useContext(AuthContext);
