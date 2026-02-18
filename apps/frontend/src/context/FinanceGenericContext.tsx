'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { basePath } from '@/constants/config';
type DataKey = 'incomes' | 'outcomes' | 'investments';

import { FinanceSource } from '@/types/finance';
import { InvestmentSource } from '@/types/investments';

//Backend => Frontend
function mapFinanceSourceFromBackend(src: any): FinanceSource {
  return {
    id: src.id,
    sourceName: src.name,
    type: src.type,
    date: src.created_at,
    description: src.description,
    sourceType: 'finance',
    payments: src.finance_payments || [],
  };
}

//Frontend ->Backend
function mapFinanceSourceToBackend(src: FinanceSource): any {
  return {
    id: src.id,
    name: src.sourceName,
    type: src.type,
    created_at: src.date,
    description: src.description,
    user_id: src.userId,
    //Add user_id if needed
  };
}

type ContextDataMap = {
  incomes: FinanceSource[];
  outcomes: FinanceSource[];
  investments: InvestmentSource[];
};
type FinanceGenericContextType<K extends DataKey> = {
  data: ContextDataMap[K];
  setData: React.Dispatch<React.SetStateAction<ContextDataMap[K]>>;
  addSource: (source: ContextDataMap[K][number]) => Promise<void>;
  updateSource: (source: ContextDataMap[K][number]) => Promise<void>;
  removeSource: (sourceId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

// Helper: Get backend endpoint for given key
const getEndPoint = (key: DataKey) => `/api/${key}`;

function createGenericContext<K extends DataKey>(key: K) {
  const Ctx = createContext<FinanceGenericContextType<K> | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ContextDataMap[K]>([] as ContextDataMap[K]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //fetch from backend
    useEffect(() => {
      setLoading(true);
      fetch(getEndPoint(key), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Could not fetch ${getEndPoint(key)}`);
          return res.json();
        })
        .then((data) => {
          if (key === 'incomes' || key === 'outcomes') {
            setData(data.map(mapFinanceSourceFromBackend));
          } else {
            setData(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || `Could not fetch ${getEndPoint(key)}`);
          setData([] as ContextDataMap[K]);
          setLoading(false);
        });
    }, [key]);

    // --- CRUD operations now call the backend ---
    // NOTE: Make sure backend returns the full updated list or the updated item!

    const addSource = async (source: ContextDataMap[K][number]) => {
      try {
        setLoading(true);
        const backendPayload =
          key === 'incomes' || key === 'outcomes' ? mapFinanceSourceToBackend(source) : source;
        const res = await fetch(getEndPoint(key), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendPayload),
        });
        if (!res.ok) throw new Error(`Failed to add source`);
        const newItem = await res.json();
        setData(
          (prev) =>
            [
              ...prev,
              key === 'incomes' || key === 'outcomes'
                ? mapFinanceSourceFromBackend(newItem)
                : newItem,
            ] as ContextDataMap[K],
        );
      } catch (error: any) {
        setError(error.message || 'Failed to add source');
      } finally {
        setLoading(false);
      }
    };

    const updateSource = async (updated: ContextDataMap[K][number]) => {
      try {
        setLoading(true);
        const res = await fetch(`${getEndPoint(key)}/${updated.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        if (!res.ok) throw new Error(`Failed to udpate source`);
        const newItem = await res.json();
        setData(
          (prev) => prev.map((s) => (s.id === updated.id ? newItem : s)) as ContextDataMap[K],
        );
      } catch (error: any) {
        setError(error.message || 'Failed to udpate source');
      } finally {
        setLoading(false);
      }
    };

    const removeSource = async (sourceId: string) => {
      try {
        setLoading(true);
        const res = await fetch(`${getEndPoint(key)}/${sourceId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error(`Failed to remove source`);
        setData((prev) => prev.filter((s) => s.id !== sourceId) as ContextDataMap[K]);
      } catch (error: any) {
        setError(error.message || 'Faied to remove source');
      } finally {
        setLoading(false);
      }
    };
    return (
      <Ctx.Provider
        value={{
          data,
          setData,
          addSource,
          updateSource,
          removeSource,
          loading,
          error,
        }}
      >
        {children}
      </Ctx.Provider>
    );
  }

  function useGeneric() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('Must be used inside Provider');
    return ctx;
  }

  return [Provider, useGeneric] as const;
}

export const [IncomesProvider, useIncomesContext] = createGenericContext('incomes');
export const [OutcomesProvider, useOutcomesContext] = createGenericContext('outcomes');
export const [InvestmentsProvider, useInvestmentsContext] = createGenericContext('investments');
