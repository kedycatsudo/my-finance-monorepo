// Utility for incomes/outcomes
export function flattenPayments<S extends { sourceName: string; payments: P[] }, P extends { date: string | number; amount: number; name: string, status: string }>(
    sources: S[]
): (P & { sourceName: string })[] {
    return sources
        .flatMap(src =>
            src.payments.map(p => ({
                ...p,
                sourceName: src.sourceName,
                name: p.name,
                amount: p.amount,
                status: p.status
            }))
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Utility for investments (for your InvestmentSource shape)
export function flattenInvestments<S extends { sourceName: string | null; type: string | null; items: I[] }, I extends { entryDate: string | null; exitDate?: string | null; assetName: string | null; term: string | null; investedAmount: number | null; result: string | null; resultAmount: number | null; status: string | null }>(
    sources: S[]
): (I & { sourceName: string; sourceType: string })[] {
    return sources
        .flatMap(src =>
            src.items.map(item => ({
                ...item,
                sourceName: src.sourceName ?? '',
                sourceType: src.type ?? '',
                assetName: item.assetName,
                status: item.status,
                investedAmount: item.investedAmount,
                entryDate: item.entryDate

            }))
        )
        .sort((a, b) => {
            const dateA = new Date(a.exitDate ?? a.entryDate ?? '1881-01-01').getTime();
            const dateB = new Date(b.exitDate ?? b.entryDate ?? '1881-01-01').getTime(); return dateB - dateA;
        });
}