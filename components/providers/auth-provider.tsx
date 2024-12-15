
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  isAdmin: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAdmin: false,
  signIn: () => {},
  signOut: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (session?.user) {
        setUser(session.user);
        setIsAdmin(session.user.email === 'adam@apogeeintelligence.ai');
      }
    };
    
    checkSession();
  }, []);

  const signIn = () => {
    window.location.href = '/login';
  };

  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
