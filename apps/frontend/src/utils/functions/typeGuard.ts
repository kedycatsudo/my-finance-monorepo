import { FinanceSource } from "@/types/finance";
import { InvestmentSource } from "@/types/investments";

export function isFinanceSource(a: FinanceSource | InvestmentSource): a is FinanceSource { return 'payments' in a }
export function isInvestmentSource(a: FinanceSource | InvestmentSource): a is InvestmentSource { return 'items' in a }