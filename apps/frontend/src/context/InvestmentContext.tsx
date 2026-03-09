'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

import {
  InvestmentItem,
  InvestmentResult,
  InvestmentSource,
  InvestmentStatus,
  InvestmentTerm,
} from '@/types/investments';

type InvestmentSourceInput = Omit<InvestmentSource, 'id' | 'items' | 'sourceType'> & {
  description?: string;
};

type InvestmentContextType = {
  data: InvestmentSource[];
  setData: React.Dispatch<React.SetStateAction<InvestmentSource[]>>;
  loading: boolean;
  error: string;

  fetchSources: () => Promise<void>;
  addSource: (source: InvestmentSourceInput) => Promise<InvestmentSource | null>;
  updateSource: (source: InvestmentSource) => Promise<InvestmentSource | null>;
  removeSource: (sourceId: string) => Promise<boolean>;

  addItem: (sourceId: string, item: Omit<InvestmentItem, 'id'>) => Promise<InvestmentItem | null>;
  updateItem: (
    sourceId: string,
    itemId: string,
    item: Partial<InvestmentItem>,
  ) => Promise<InvestmentItem | null>;

  removeItem: (sourceId: string, itemId: string) => Promise<boolean>;
  fetchItemsBySource: (sourceId: string) => Promise<InvestmentItem[]>;
};

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

function getAutheader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { authorization: `Bearer ${token}` } : {};
}
function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

function toInvestmentItem(apiItem: any): InvestmentItem {
  return {
    id: String(apiItem.id),
    assetName: apiItem.assetName ?? apiItem.asset_name ?? '',
    term: (apiItem.term ?? 'middle') as InvestmentTerm,
    investedAmount: Number(apiItem.investedAmount ?? apiItem.invested_amount ?? 0),
    entryDate: apiItem.entryDate ?? apiItem.entry_date ?? '',
    exitDate: apiItem.exitDate ?? apiItem.exit_date ?? null,
    result: (apiItem.result ?? 'none') as InvestmentResult,
    resultAmount:
      apiItem.resultAmount !== undefined && apiItem.resultAmount !== null
        ? Number(apiItem.resultAmount)
        : apiItem.result_amount !== undefined && apiItem.result_amount !== null
          ? Number(apiItem.result_amount)
          : null,
    status: (apiItem.status ?? 'open') as InvestmentStatus,
  };
}

function toInvestmentSource(apiSource: any): InvestmentSource {
  const rawItems = Array.isArray(apiSource?.investmentItems)
    ? apiSource.investmentItems
    : Array.isArray(apiSource?.items)
      ? apiSource.items
      : [];

  const sourceType = apiSource?.type;
  const safeType: InvestmentSource['type'] =
    sourceType === 'crypto' || sourceType === 'forex' || sourceType === 'investment'
      ? sourceType
      : 'investment';
  return {
    id: String(apiSource.id),
    name: apiSource.name ?? '',
    description: apiSource.description ?? '',
    sourceType: 'investment',
    type: safeType,
    items: rawItems.map(toInvestmentItem),
  };
}

function toCreateItemBody(item: Omit<InvestmentItem, 'id'>) {
  return {
    asset_name: item.assetName,
    term: item.term,
    invested_amount: item.investedAmount,
    entry_date: item.entryDate,
    exit_date: item.exitDate,
    result: item.result,
    result_amount: item.resultAmount,
    status: item.status,
  };
}

function toUpdateItemBody(item: Partial<InvestmentItem>) {
  return {
    ...(item.assetName !== undefined ? { asset_name: item.assetName } : {}),
    ...(item.term !== undefined ? { term: item.term } : {}),
    ...(item.investedAmount !== undefined ? { invested_amount: item.investedAmount } : {}),
    ...(item.entryDate !== undefined ? { entry_date: item.entryDate } : {}),
    ...(item.exitDate !== undefined ? { exit_date: item.exitDate } : {}),
    ...(item.result !== undefined ? { result: item.result } : {}),
    ...(item.resultAmount !== undefined ? { result_amount: item.resultAmount } : {}),
    ...(item.status !== undefined ? { status: item.status } : {}),
  };
}

export function InvestmentsProvider({ children }: { children: ReactNode }) {
  const { jwt } = useAuth();
  const [data, setData] = useState<InvestmentSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}/api/investment`, {
        method: 'GET',
        headers: { ...getAutheader() },
      });
      if (!res.ok) throw new Error(`Could not fetch investments(${res.status})`);
      const payload = await res.json();
      const mapped = Array.isArray(payload) ? payload.map(toInvestmentSource) : [];
      setData(mapped);
    } catch (error: any) {
      setError(error.message || 'Coud not fetch investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jwt) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }
    fetchSources();
  }, [jwt]);

  const addSource = async (source: InvestmentSourceInput): Promise<InvestmentSource | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}/api/investment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAutheader() },
        body: JSON.stringify({
          name: source.name,
          description: source.description ?? '',
          type: source.type,
        }),
      });
      if (!res.ok) throw new Error('Failed to add investment source');
      const created = toInvestmentSource(await res.json());
      setData((prev) => [...prev, created]);
      return created;
    } catch (error: any) {
      setError(error.message || 'Failed to add investment source');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSource = async (source: InvestmentSource): Promise<InvestmentSource | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}/api/investment/${source.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAutheader() },
        body: JSON.stringify({
          name: source.name,
          description: source.description ?? '',
          type: source.type,
        }),
      });

      if (!res.ok) throw new Error('Failed to update investment source');

      const updatedApi = await res.json();

      let updatedSource: InvestmentSource | null = null;
      setData((prev) =>
        prev.map((src) => {
          if (src.id !== source.id) return src;
          updatedSource = {
            ...src,
            name: updatedApi.name ?? src.name,
            description: updatedApi.description ?? src.description,
            type: (updatedApi.type as InvestmentSource['type']) ?? src.type,
          };
          return updatedSource;
        }),
      );

      return updatedSource;
    } catch (err: any) {
      setError(err.message || 'Failed to update investment source');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeSource = async (sourceId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}/api/investment/${sourceId}`, {
        method: 'DELETE',
        headers: { ...getAutheader() },
      });

      if (!res.ok) throw new Error('Failed to remove investment source');

      setData((prev) => prev.filter((s) => s.id !== sourceId));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to remove investment source');
      return false;
    } finally {
      setLoading(false);
    }
  };
  return (
    <InvestmentContext.Provider
      value={{
        data,
        error: error || '',
        setData,
        loading,
        fetchSources,
        addSource,
        updateSource,
        removeSource,
        addItem: async () => null,
        updateItem: async () => null,
        removeItem: async () => false,
        fetchItemsBySource: async () => [],
      }}
    >
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestmentsContext() {
  const ctx = useContext(InvestmentContext);
  if (!ctx) throw new Error('useInvestmentsContext must be used inside <InvestmentsProvider>');
  return ctx;
}
