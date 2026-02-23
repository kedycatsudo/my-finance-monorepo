import { FinanceSource } from '@/types/finance';
import { InvestmentSource } from '@/types/investments';

export function isFinanceSource(a: FinanceSource | InvestmentSource): a is FinanceSource {
  return 'finance_payments' in a;
}
export function isInvestmentSource(a: FinanceSource | InvestmentSource): a is InvestmentSource {
  return 'items' in a;
}
