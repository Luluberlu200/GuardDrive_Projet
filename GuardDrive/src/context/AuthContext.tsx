import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email: string, password: string): Promise<boolean> {
    const data = await api.post('/auth/login', { email, password });
    if (!data.token) return false;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return true;
  }

  async function register(name: string, email: string, password: string): Promise<boolean> {
    const data = await api.post('/auth/register', { name, email, password });
    if (!data.token) return false;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return true;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  function updateUser(data: Partial<User>) {
    const updated = { ...user, ...data } as User;
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}
