// Utility for incomes/outcomes
function toSortTime(value: string): number {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`).getTime();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

export function flattenPayments<
  S extends {
    name?: string;
    sourceName?: string;
    finance_payments?: P[];
    finance_paymens?: P[];
    payments?: P[];
  },
  P extends {
    date: string;
    amount: number;
    name: string;
    status: string;
    loop: boolean;
    payment_type?: string;
    type?: string;
  },
>(sources: S[]): (P & { source: string; payment_type: string })[] {
  return (Array.isArray(sources) ? sources : [])
    .flatMap((src) => {
      const source = src.name ?? src.sourceName ?? '';
      const payments = Array.isArray(src.finance_payments)
        ? src.finance_payments
        : Array.isArray(src.finance_paymens)
          ? src.finance_paymens
          : Array.isArray(src.payments)
            ? src.payments
            : [];
      return payments.map((p) => ({
        ...p,
        source,
        payment_type: p.payment_type ?? p.type ?? '',
      }));
    })
    .sort((a, b) => toSortTime(String(b.date)) - toSortTime(String(a.date)));
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
