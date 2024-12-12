
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const signIn = () => {
    window.location.href = '/login';
  };

  const signOut = () => {
    document.cookie = 'user=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    window.location.href = '/';
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const userCookie = getCookie('user');
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUser(parsedUser);
      setIsAdmin(parsedUser.email === 'adam@apogeeintelligence.ai');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
