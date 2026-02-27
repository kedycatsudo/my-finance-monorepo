'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FinancePayment, FinanceSource } from '@/types/finance';
import { useAuth } from './AuthContext';

type OutcomesContextType = {
  data: FinanceSource[];
  setData: React.Dispatch<React.SetStateAction<FinanceSource[]>>;
  addSource: (source: Omit<FinanceSource, 'id'>) => Promise<void>;
  updateSource: (source: FinanceSource) => Promise<void>;
  removeSource: (sourceId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  addPayment: (sourceId: string, payment: FinancePayment) => Promise<FinancePayment | null>;
  updatePayment: (
    sourceId: string,
    paymentId: string,
    payment: Partial<FinancePayment>,
  ) => Promise<FinancePayment | null>;
  removePayment: (sourceId: string, paymentId: string) => Promise<boolean>;
};

const OutcomesContext = createContext<OutcomesContextType | undefined>(undefined);

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return token ? { authorization: `Bearer ${token}` } : {};
}

export function OutcomesProvider2({ children }: { children: ReactNode }) {
  const { jwt } = useAuth();

  const [data, setData] = useState<FinanceSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //1) add a fetch function

  const fetchOutcomes = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/outcomes`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`Could not fetch outcomes ${res.status}`);
      }
      const payload = await res.json();
      setData(Array.isArray(payload) ? payload : []);
    } catch (error: any) {
      setError(error.message || 'Could not fetch outcomes.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 2) inital load
  useEffect(() => {
    if (!jwt) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }
    fetchOutcomes(jwt);
  }, [jwt]);

  //add outcome
  const addSource = async (source: Omit<FinanceSource, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/outcomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(source),
      });
      if (!res.ok) {
        throw new Error('Failed to add outcome');
      }
      const newOutcome = await res.json();
      setData((prev) => [...prev, newOutcome]);
    } catch (error: any) {
      setError(error.message || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };
  return (
    <OutcomesContext.Provider
      value={{
        data,
        setData,
        addSource,
        updateSource: async () => {}, // TODO: implement
        removeSource: async () => false, // TODO: implement
        loading,
        error,
        addPayment: async () => null, // TODO: implement
        updatePayment: async () => null, // TODO: implement
        removePayment: async () => false, // TODO: implement
      }}
    >
      {children}
    </OutcomesContext.Provider>
  );
}
export function useOutcomesContext() {
  const ctx = useContext(OutcomesContext);
  if (!ctx) throw new Error('useOutomcesContext must be used inside the layout');
  return ctx;
}
