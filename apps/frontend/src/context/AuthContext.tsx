'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/user';
import { useProfile } from './ProfileContext';
type AuthContextType = {
  currentUser: User | null;
  jwt: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (data: {
    username: string;
    email: string;
    password: string;
    monthlyCircleDate: string;
  }) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Internal Error';
}

type ApiErrorBody = {
  message?: string | string[];
};

function buildApiError(status: number, fallback: string, body?: unknown): Error {
  if (status === 401) {
    return new Error('Session expired or unauthorized (401). Please log in again.');
  }

  if (typeof body === 'string' && body.trim()) {
    return new Error(`${body} (${status})`);
  }

  if (body && typeof body === 'object') {
    const typed = body as ApiErrorBody;
    const message = Array.isArray(typed.message) ? typed.message.join(', ') : typed.message;
    if (message) {
      return new Error(`${message} (${status})`);
    }
  }

  return new Error(`${fallback} (${status})`);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setProfile } = useProfile();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  );
  const [error, setError] = useState<string | null>(null);

  //Login with credentials

  async function login(username: string, password: string) {
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const mappedError = buildApiError(res.status, 'Login failed', data);
        setError(mappedError.message);
        return { success: false, message: mappedError.message };
      }

      if (res.ok && data.access_token && data.user) {
        setJwt(data.access_token);
        setCurrentUser(data.user);
        setProfile(data.user);
        localStorage.setItem('profile', JSON.stringify(data.user));
        localStorage.setItem('token', data.access_token); // Store JWT
        return { success: true, message: 'Login succesful' };
      }
      setError(data.message || 'Login failed');
      return { success: false, message: data.message || 'Login failed' };
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setError(message);
      return { success: false, message };
    }
  }

  //Register new User
  async function register({
    username,
    email,
    password,
    monthlyCircleDate,
  }: {
    username: string;
    email: string;
    password: string;
    monthlyCircleDate?: string;
  }) {
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, monthlyCircleDate }),
      });
      const data = await res.json();

      if (!res.ok) {
        const mappedError = buildApiError(res.status, 'Registration failed', data);
        setError(mappedError.message);
        return { success: false, message: mappedError.message };
      }

      if (res.ok && data.access_token && data.user) {
        setJwt(data.access_token);
        setCurrentUser(data.user);

        return { success: true, message: 'Registration succesful.' };
      } else {
        setError(data.message || 'Registration failed');
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setError(message);
      return { success: false, message };
    }
  }
  function logout() {
    setJwt(null);
    setCurrentUser(null);
    localStorage.removeItem('profile');
    setProfile(null);
    setError(null);
    localStorage.removeItem('token');
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
