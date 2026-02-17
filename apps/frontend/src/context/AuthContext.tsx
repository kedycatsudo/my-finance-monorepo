'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/user';

type AuthContextType = {
  currentUser: User | null;
  jwt: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (data: {
    username: string;
    email: string;
    password: string;
    monthly_circle_date: string;
  }) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  //Login with credentials

  async function login(username: string, password: string) {
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token && data.user) {
        setJwt(data.access_token);
        setCurrentUser(data.user);
        return { success: true, message: 'Login succesful' };
      }
      setError(data.message || 'Login failed');
      return { success: false, message: data.message || 'Login failed' };
    } catch (error: any) {
      setError(error.message || 'Internal Error');
      return { success: false, message: error.message || 'Internal Error' };
    }
  }

  //Register new User
  async function register({
    username,
    email,
    password,
    monthly_circle_date,
  }: {
    username: string;
    email: string;
    password: string;
    monthly_circle_date?: string;
  }) {
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, monthly_circle_date }),
      });
      const data = await res.json();
      if (res.ok && data.access_token && data.user) {
        setJwt(data.access_token);
        setCurrentUser(data.user);

        return { success: true, message: 'Registration succesful.' };
      } else {
        console.log(data);
        setError(data.message || 'Registration failed');
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error: any) {
      setError(error.message || 'Internal error');
      return { success: false, message: error.message || 'Internal error' };
    }
  }
  function logout() {
    setJwt(null);
    setCurrentUser(null);
    setError(null);
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        jwt,
        login,
        logout,
        register,
        isAuthenticated: !!jwt,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used under <AuthProvider>');
  return ctx;
}
