'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { assetPrefix } from '@/constants/config';
// If you want an initial users JSON import, set the path here:
const USERS_DATA_PATH = `${assetPrefix}data/user.json`;

type AuthContextType = {
  currentUser: User | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  register: (user: Omit<User, 'id' | 'hashedPassword'> & { password: string }) => {
    success: boolean;
    message: string;
  };
  isAuthenticated: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Load users from JSON file on 1st load (MVP)
  useEffect(() => {
    fetch(USERS_DATA_PATH)
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch users');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        // Optionally, you could auto-login the first user for MVP/demo purpose
      })
      .catch((err) => {
        setError(err.message || 'Internal Server Error');
        setUsers([]);
      });
  }, []);

  // Persist users to localStorage for demo register-after-refresh
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  // Attempt auto-login from localStorage/demo (optional)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // --Login method (username or email)--
  function login(username: string, password: string) {
    const user = users.find((u) => u.username === username || u.email === username);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    // Plain match for MVP; use hash/secure backend for real
    if (user.password !== password) {
      return { success: false, message: 'Login failed (incorrect password)' };
    }
    setCurrentUser(user);
    return { success: true, message: 'Login successful' };
  }

  function logout() {
    setCurrentUser(null);
    localStorage.clear();
  }

  // -- Register method --
  function register(newUser: Omit<User, 'id' | 'hashedPassword'> & { password: string }) {
    if (users.some((u) => u.username === newUser.username || u.email === newUser.email)) {
      return { success: false, message: 'Username or email already exists.' };
    }
    const user: User = {
      ...newUser,
      id: 'user' + (users.length + 1),
    };
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    return { success: true, message: 'Registration successful' };
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        isAuthenticated: !!currentUser,
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
