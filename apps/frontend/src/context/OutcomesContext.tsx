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
  addPaymentToOutcomes: (
    sourceId: string,
    payment: FinancePayment,
  ) => Promise<FinancePayment | null>;
  updatePayment: (
    sourceId: string,
    paymentId: string,
    payment: Partial<FinancePayment>,
  ) => Promise<FinancePayment | null>;
  removeOutcomePayment: (sourceId: string, paymentId: string) => Promise<boolean>;
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

  const updateSource = async (source: FinanceSource) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/outcomes?sourceId=${source.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(source),
        },
      );
      if (!res.ok) throw new Error('Failed to remove income');
      const response = await res.json();
      // Replace the entire source with the updated one from backend
      setData((prev) => prev.map((src) => (src.id === source.id ? response.updated_source : src)));
      return response.updated_source;
    } catch (error: any) {
      setError(error.message || 'Failed to update income');
    } finally {
      setLoading(false);
    }
  };
  const removeSource = async (sourceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/outcomes?sourceId=${sourceId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        },
      );
      if (!res.ok) throw new Error('Failed to remove outcome');
      setData((prev) => prev.filter((i) => i.id !== sourceId));
      return true;
    } catch (error: any) {
      setError(error.message || 'Failed to remove the outcome source');
      return false;
    } finally {
      setLoading(false);
    }
  };

  //---add payment---
  const addPaymentToOutcomes = async (
    sourceId: string,
    payment: FinancePayment,
  ): Promise<FinancePayment | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/outcomes/${sourceId}/payments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(payment),
        },
      );
      if (!res.ok) {
        throw new Error('Failed to add payment');
      }
      const payload = await res.json();
      // backend create usually return one created payment object
      const createdPayment: FinancePayment | null =
        payload && payload.id ? payload : (payload?.newPayment ?? payload?.payment ?? null);
      if (!createdPayment) return null;

      setData((prev) =>
        prev.map((src) =>
          src.id === sourceId
            ? { ...src, finance_payments: [...(src.finance_payments ?? []), createdPayment] }
            : src,
        ),
      );
      return createdPayment;
    } catch (error: any) {
      setError(error.message || 'Failed to add payment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (
    sourceId: string,
    paymentId: string,
    payment: Partial<FinancePayment>,
  ): Promise<FinancePayment | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/outcomes/${sourceId}/payments/${paymentId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(payment ?? {}),
        },
      );

      if (!res.ok) {
        throw new Error('Failed to update payment');
      }

      const response = await res.json();

      setData((prev) =>
        prev.map((src) => {
          if (src.id !== sourceId) return src;

          if (response.updated_source?.finance_payments) {
            return { ...src, finance_payments: response.updated_source.finance_payments };
          }

          if (response.updated_payment) {
            return {
              ...src,
              finance_payments: (src.finance_payments ?? []).map((p) =>
                p.id === paymentId ? response.updated_payment : p,
              ),
            };
          }

          return src;
        }),
      );

      const updatedPayment =
        response.updated_source?.finance_payments?.find(
          (p: FinancePayment) => p.id === paymentId,
        ) ||
        response.updated_payment ||
        null;

      return updatedPayment;
    } catch (error: any) {
      setError(error.message || 'Failed to update payment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeOutcomePayment = async (sourceId: string, paymentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH}/api/outcomes/${sourceId}/payments/${paymentId}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } },
      );
      if (!res.ok) {
        throw new Error('Failed to remove outcome payment');
      }
      setData((prev) =>
        prev.map((src) =>
          src.id === sourceId
            ? {
                ...src,
                finance_payments: (src.finance_payments ?? []).filter((p) => p.id !== paymentId),
              }
            : src,
        ),
      );
      return true;
    } catch (error: any) {
      setError(error.message || 'Failed to remove outcome payment');
      return false;
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
        updateSource,
        removeSource,
        loading,
        error,
        addPaymentToOutcomes,
        updatePayment,
        removeOutcomePayment,
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
