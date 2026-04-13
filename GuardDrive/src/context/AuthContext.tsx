import { createContext, useContext, useState, type ReactNode } from 'react';
import { type User, mockUsers } from '../data/mockUsers';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Simule une connexion : cherche l'utilisateur dans les données mockées
  function login(email: string, password: string): boolean {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }

  // Simule une inscription : ajoute un utilisateur temporairement
  function register(name: string, email: string, password: string): boolean {
    const alreadyExists = mockUsers.find((u) => u.email === email);
    if (alreadyExists) return false;

    const newUser: User = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
    };
    mockUsers.push(newUser);
    return true;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le context facilement dans les pages
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}
