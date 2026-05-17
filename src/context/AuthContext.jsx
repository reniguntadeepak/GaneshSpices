import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { api, getToken, setToken } from '../api/client';

const USER_KEY = 'ganesh_spices_user';

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw && getToken()) return JSON.parse(raw);
  } catch {
    /* no session */
  }
  return null;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const { token, user: loggedIn } = await api.login(username, password);
      setToken(token);
      setUser(loggedIn);
      return { ok: true, user: loggedIn };
    } catch (err) {
      return { ok: false, error: err.message || 'Login failed.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, username, password) => {
    setLoading(true);
    try {
      const { token, user: registered } = await api.register(name, username, password);
      setToken(token);
      setUser(registered);
      return { ok: true, user: registered };
    } catch (err) {
      return { ok: false, error: err.message || 'Registration failed.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      isLoggedIn: !!user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
