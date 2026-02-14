'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { basePath } from '@/constants/config';
type DataKey = 'incomes' | 'outcomes' | 'investments';

import { FinanceSource } from '@/types/finance';
import { InvestmentSource } from '@/types/investments';

type ContextDataMap = {
  incomes: FinanceSource[];
  outcomes: FinanceSource[];
  investments: InvestmentSource[];
};
type FinanceGenericContextType<K extends DataKey> = {
  data: ContextDataMap[K];
  setData: React.Dispatch<React.SetStateAction<ContextDataMap[K]>>;
  addSource: (source: ContextDataMap[K][number]) => void;
  updateSource: (source: ContextDataMap[K][number]) => void;
  removeSource: (sourceId: string) => void;
  loading: boolean;
  error: string | null;
};

function createGenericContext<K extends DataKey>(file: K) {
  const Ctx = createContext<FinanceGenericContextType<K> | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ContextDataMap[K]>([] as ContextDataMap[K]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetch(`${basePath}/data/${file}.json`)
        .then((res) => {
          if (!res.ok) throw new Error(`Could not fetch /data/${file}.json`);
          return res.json();
        })
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || `Could not fetch /data/${file}.json`);
          setData([] as ContextDataMap[K]);
          setLoading(false);
        });
    }, [file]);

    // CRUD logic works for both
    const addSource = (source: ContextDataMap[K][number]) =>
      setData((prev) => [...prev, source] as ContextDataMap[K]);
    const updateSource = (updated: ContextDataMap[K][number]) =>
      setData((prev) => prev.map((s) => (s.id === updated.id ? updated : s)) as ContextDataMap[K]);
    const removeSource = (sourceId: string) =>
      setData((prev) => prev.filter((s) => s.id !== sourceId) as ContextDataMap[K]);

    return (
      <Ctx.Provider
        value={{ data, setData, addSource, updateSource, removeSource, loading, error }}
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
