'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FinancePayment, FinanceSource } from '@/types/finance';

type IncomesContextType = {
  data: FinanceSource[];
  setData: React.Dispatch<React.SetStateAction<FinanceSource[]>>;
  addSource: (source: Omit<FinanceSource, 'id'>) => Promise<void>;
  updateSource: (source: FinanceSource) => Promise<void>;
  removeSource: (sourceId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  addPayment: (sourceId: string, payment: FinancePayment) => Promise<FinancePayment | null>;
  updatePayment: (
    sourceId: string,
    paymentId: string,
    payment: Partial<FinancePayment>,
  ) => Promise<FinancePayment | null>;
};

const IncomesContext = createContext<IncomesContextType | undefined>(undefined);
function getAuthHeader(): Record<string, string> {
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

  // ----- Add income-----
  const addSource = async (source: Omit<FinanceSource, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
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

  // ----- Update income  -----
  const updateSource = async (source: FinanceSource) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/incomes?sourceId=${source.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(source),
        },
      );
      if (!res.ok) {
        throw new Error('Failed to update income');
      }
      const response = await res.json();
      // Replace the entire source with the updated one from backend
      setData((prev) => prev.map((src) => (src.id === source.id ? response.updated_source : src)));
      return response.updated_source;
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/incomes?sourceId=${sourceId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        },
      );
      if (!res.ok) throw new Error('Failed to remove income');
      setData((prev) => prev.filter((i) => i.id !== sourceId));
    } catch (err: any) {
      setError(err.message || 'Failed to remove income');
    } finally {
      setLoading(false);
    }
  };

  //---add payment---
  const addPayment = async (
    sourceId: string,
    payment: FinancePayment,
  ): Promise<FinancePayment | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/incomes/${sourceId}/payments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(payment),
        },
      );
      if (!res.ok) {
        throw new Error('Filed to add payment');
      }

      const updatedSource = await res.json();
      setData((prev) =>
        prev.map((src) =>
          src.id === updatedSource.id
            ? {
                ...src,
                finance_payments: updatedSource.finance_payments, // ← Just use the whole updated array!
              }
            : src,
        ),
      );
      // Return the newly created payment (it's the last one in the updated array)
      const newPayment =
        updatedSource.finance_payments?.[updatedSource.finance_payments.length - 1] || null;
      return newPayment;
    } catch (error: any) {
      setError(error.message || 'Failed to add payment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  //---update payment---
  const updatePayment = async (
    sourceId: string,
    paymentId: string,
    payment: Partial<FinancePayment>,
  ): Promise<FinancePayment | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/incomes/${sourceId}/payments/${paymentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(payment),
        },
      );

      if (!res.ok) {
        throw new Error('Failed to update payment');
      }

      const response = await res.json();
      // Update state with the complete updated source
      setData((prev) =>
        prev.map((src) =>
          src.id === sourceId
            ? {
                ...src,
                finance_payments: response.updated_source?.finance_payments || src.finance_payments,
              }
            : src,
        ),
      );
      // Return the updated payment
      const updatedPayment =
        response.updated_source?.finance_payments?.find(
          (p: FinancePayment) => p.id === paymentId,
        ) || null;
      return updatedPayment;
    } catch (error: any) {
      setError(error.message || 'Failed to update payment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <IncomesContext.Provider
      value={{
        data,
        setData,
        addSource,
        updateSource,
        removeSource,
        loading,
        error,
        addPayment,
        updatePayment,
      }}
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
