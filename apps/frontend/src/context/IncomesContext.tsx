'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FinanceSource } from '@/types/finance';

type IncomesContextType = {
  data: FinanceSource[];
  setData: React.Dispatch<React.SetStateAction<FinanceSource[]>>;
  addSource: (source: Omit<FinanceSource, 'id'>) => Promise<void>;
  updateSource: (source: FinanceSource) => Promise<void>;
  removeSource: (sourceId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const IncomesContext = createContext<IncomesContextType | undefined>(undefined);
function getAuthHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { authorization: `Bearer ${token}` } : {};
}

export function IncomesProvider2({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinanceSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ----- Fetch incomes from API -----
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/incomes`, {
      headers: {
        ...getAuthHeader(),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch incomes');
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Could not fetch incomes');
        setData([]);
        setLoading(false);
      });
  }, []);

  // ----- Add income -----
  const addSource = async (source: Omit<FinanceSource, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/incomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(source),
      });
      if (!res.ok) throw new Error(`Failed to add income`);
      const newIncome = await res.json();
      setData((prev) => [...prev, newIncome]);
    } catch (err: any) {
      setError(err.message || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  // ----- Update income -----
  const updateSource = async (source: FinanceSource) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/incomes/${source.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(source),
      });
      if (!res.ok) throw new Error('Failed to update income');
      const updated = await res.json();
      setData((prev) => prev.map((i) => (i.id === source.id ? updated : i)));
    } catch (err: any) {
      setError(err.message || 'Failed to update income');
    } finally {
      setLoading(false);
    }
  };

  // ----- Remove income -----
  const removeSource = async (sourceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/incomes/${sourceId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove income');
      setData((prev) => prev.filter((i) => i.id !== sourceId));
    } catch (err: any) {
      setError(err.message || 'Failed to remove income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IncomesContext.Provider
      value={{ data, setData, addSource, updateSource, removeSource, loading, error }}
    >
      {children}
    </IncomesContext.Provider>
  );
}

export function useIncomesContext() {
  const ctx = useContext(IncomesContext);
  if (!ctx) throw new Error('useIncomesContext must be used inside <IncomesProvider>');
  return ctx;
}
