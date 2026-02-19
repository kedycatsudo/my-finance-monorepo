'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FinanceSource, FinancePayment, FinanceSourceType } from '@/types/finance';

//TYPES
type ContextType = {
  data: FinanceSource[];
  setData: React.Dispatch<React.SetStateAction<FinanceSource[]>>;
  addSource: (item: FinanceSource) => Promise<void>;
  updateSource: (item: FinanceSource) => Promise<void>;
  removeSource: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const FinanceSourceContext = createContext<ContextType | undefined>(undefined);

//Mapping helpers
function mapPaymentFromBackend(src: any): FinancePayment {
  return {
    id: src.id,
    name: src.name,
    type: src.payment_type,
    amount: parseFloat(src.amount || '0'),
    date: src.payments_circle_date || '',
    loop: !!src.loop,
    status: src.status,
  };
}
function mapSourceFromBackend(src: any): FinanceSource {
  return {
    id: src.id,
    sourceName: src.name ?? '',
    type: src.type,
    date: src.created_at,
    description: src.decription,
    payments: (src.finance_payment || []).map(mapPaymentFromBackend),
    sourceType: 'finance',
  };
}

function mapPaymentToBackend(payment: FinancePayment): any {
  return {
    id: payment.id,
    name: payment.name,
    payment_type: payment.type,
    amount: payment.amount,
    payment_circle_date: payment.date,
    loop: !!payment.loop,
    status: payment.status,
  };
}

function mapSourceToBackend(src: FinanceSource): any {
  return {
    id: src.id,
    name: src.sourceName,
    type: src.type,
    created_at: src.date,
    description: src.description,
    finance_payments: (src.payments || []).map(mapPaymentToBackend),
    sourceType: 'finance',
  };
}
// ---Provider--
export function FinanceSourceProvider({
  children,
  type,
}: {
  children: ReactNode;
  type: FinanceSourceType;
}) {
  const [data, setData] = useState<FinanceSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //updated endpoint logic;
  const ENDPOINT = type === 'income' ? 'api/incomes' : '/api/outcomes';

  useEffect(() => {
    setLoading(true);
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch sources');
        return res.json();
      })
      .then((items) => {
        setData((items || []).map(mapSourceFromBackend));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        setData([]);
      });
  }, [ENDPOINT]);

  const addSource = async (item: FinanceSource) => {
    try {
      setLoading(true);
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapSourceToBackend(item)),
      });
      if (!res.ok) throw new Error('Failed to add source');
      const result = await res.json();
      setData((prev) => [...prev, mapSourceFromBackend(result)]);
    } catch (error: any) {
      setError(error.message || 'Failed to add source');
    } finally {
      setLoading(false);
    }
  };
  const updateSource = async (item: FinanceSource) => {
    try {
      setLoading(true);
      const res = await fetch(`${ENDPOINT}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapSourceToBackend(item)),
      });
      if (!res.ok) throw new Error('Failed to update the source');
      const updated = await res.json();
      setData((prev) =>
        prev.map((src) => (src.id === item.id ? mapSourceFromBackend(updated) : src)),
      );
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const removeSource = async (id: string) => {
    try {
      setLoading(true);

      const res = await fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete source');
      setData((prev) => prev.filter((src) => src.id !== id));
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <FinanceSourceContext.Provider
      value={{ data, setData, addSource, updateSource, removeSource, loading, error }}
    >
      {children}
    </FinanceSourceContext.Provider>
  );
}

export function useFinanceSourceContext() {
  const context = useContext(FinanceSourceContext);
  if (!context) {
    throw new Error('useFinanceSourceContext must be used within a FinanceSourceProvider');
  }
  return context;
}
