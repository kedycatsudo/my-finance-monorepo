'use client';

import React, { createContext, useContext, useState, ReactNode, JSX } from 'react';

type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<Theme>('light');
  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThememust be used inside <ThemeProvider>');
  return ctx;
}
