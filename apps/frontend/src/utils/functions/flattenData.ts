// Utility for incomes/outcomes
export function flattenPayments<
  S extends { name: string; payments: P[] },
  P extends { date: string | number; amount: number; name: string; status: string },
>(sources: S[]): (P & { source: string })[] {
  return sources
    .flatMap((src) =>
      src.payments.map((p) => ({
        ...p,
        source: src.name,
        name: p.name,
        amount: p.amount,
        status: p.status,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Utility for investments (for your InvestmentSource shape)
export function flattenInvestments<
  S extends { name: string | null; type: string | null; items: I[] },
  I extends {
    entryDate: string | null;
    exitDate?: string | null;
    assetName: string | null;
    term: string | null;
    investedAmount: number | null;
    result: string | null;
    resultAmount: number | null;
    status: string | null;
  },
>(sources: S[]): (I & { name: string; sourceType: string })[] {
  return sources
    .flatMap((src) =>
      src.items.map((item) => ({
        ...item,
        name: src.name ?? '',
        sourceType: src.type ?? '',
        assetName: item.assetName,
        status: item.status,
        investedAmount: item.investedAmount,
        entryDate: item.entryDate,
      })),
    )
    .sort((a, b) => {
      const dateA = new Date(a.exitDate ?? a.entryDate ?? '1881-01-01').getTime();
      const dateB = new Date(b.exitDate ?? b.entryDate ?? '1881-01-01').getTime();
      return dateB - dateA;
    });
}
