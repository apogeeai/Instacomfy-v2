
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
    <AuthContext.Provider value={{ user, setUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
