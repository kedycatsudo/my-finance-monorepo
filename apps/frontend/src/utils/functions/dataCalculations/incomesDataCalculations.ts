import { FinancePayment, FinanceSource } from '@/types/finance';
import type { RecentSideInfoItem } from '@/types/financeRecentSideInfoItem';
import { SourceListItem } from '@/types/sourceListItem';
type DataCalculationProps = {
  data: FinanceSource[];
};

// incomes calculations

export function TotalIncomes({ data }: DataCalculationProps): number {
  return data.reduce(
    (sum, src) =>
      sum +
      (Array.isArray(src?.finance_payments) ? src.finance_payments : []).reduce(
        (s, p) => s + (p?.amount || 0),
        0,
      ),
    0,
  );
}
export function TotalIncomesPaidAmount({ data }: DataCalculationProps) {
  const sources: FinanceSource[] = Array.isArray(data) ? (data as FinanceSource[]) : [];
  return sources
    .flatMap((income) => (Array.isArray(income?.finance_payments) ? income.finance_payments : []))
    .filter((payment): payment is FinancePayment => Boolean(payment))
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);
}
export function PaidIncomePayments({ data }: DataCalculationProps): object {
  return data
    .flatMap((income) => (Array.isArray(income?.finance_payments) ? income.finance_payments : []))
    .filter((payment): payment is FinancePayment => Boolean(payment))
    .filter((payment) => payment.status === 'paid');
}
export function RecentEarned({ data }: DataCalculationProps): RecentSideInfoItem[] {
  const sources: FinanceSource[] = Array.isArray(data) ? (data as FinanceSource[]) : [];

  return sources
    .flatMap((income) => (Array.isArray(income?.finance_payments) ? income.finance_payments : []))
    .filter((payment): payment is FinancePayment => Boolean(payment))
    .filter((payment) => payment.status === 'paid')
    .map((p) => ({
      name: p.name,
      data: p.amount,
      unit: '$',
      date: p.date,
    }));
}
export function UpcomingEarning({ data }: DataCalculationProps): RecentSideInfoItem[] {
  const sources: FinanceSource[] = Array.isArray(data) ? (data as FinanceSource[]) : [];
  return sources
    .flatMap((income) => (Array.isArray(income?.finance_payments) ? income.finance_payments : []))
    .filter((payment): payment is FinancePayment => Boolean(payment))
    .filter((payment) => payment.status === 'coming')
    .map((p) => ({
      name: p.name,
      data: p.amount,
      unit: '$',
      date: p.date,
    }));
}
export function IncomesUpcoming({ data }: DataCalculationProps): object {
  const sources: FinanceSource[] = Array.isArray(data) ? (data as FinanceSource[]) : [];
  return sources
    .flatMap((income) => (Array.isArray(income?.finance_payments) ? income.finance_payments : []))
    .filter((payment): payment is FinancePayment => Boolean(payment))
    .filter((payment) => payment.status === 'coming');
}
export function UpcomingIncomeAmount({ data }: DataCalculationProps): number {
  const sources: FinanceSource[] = Array.isArray(data) ? (data as FinanceSource[]) : [];
  return sources
    .flatMap((income) => (Array.isArray(income?.finance_payments) ? income.finance_payments : []))
    .filter((payment): payment is FinancePayment => Boolean(payment))
    .filter((payment) => payment.status === 'coming')
    .reduce((sum, payment) => sum + payment.amount, 0);
}
export function IncomeSourceList({ data }: DataCalculationProps): SourceListItem[] {
  return data.map((d) => ({
    name: d.name,
    amount: (Array.isArray(d?.finance_payments) ? d.finance_payments : []).reduce(
      (sum, p) => sum + (p?.amount || 0),
      0,
    ),
    unit: '$',
  }));
}

//sourceContainer data
