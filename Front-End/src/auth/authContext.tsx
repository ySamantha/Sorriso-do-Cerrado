import React, { createContext, useContext } from 'react';
import { useSession, signOut } from './auth-client';

interface User {
  id: string;
  email: string;
  name: string;
  papel?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPending: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        papel: (session.user as any).papel || 'cliente',
      }
    : null;

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.papel === 'admin',
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}