import { FinanceSource } from '@/types/finance';
import type { RecentSideInfoItem } from '@/types/financeRecentSideInfoItem';
import { SourceListItem } from '@/types/sourceListItem';
type DataCalculationProps = {
  data: FinanceSource[];
};

// incomes calculations

export function TotalIncomes({ data }: DataCalculationProps): number {
  return data.reduce((sum, src) => sum + src.payments.reduce((s, p) => s + p.amount, 0), 0);
}
export function TotalIncomesPaidAmount({ data }: DataCalculationProps): number {
  return data
    .flatMap((income) => income.payments)
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
}

export function PaidIncomePayments({ data }: DataCalculationProps): object {
  return data.flatMap((income) => income.payments).filter((payment) => payment.status === 'paid');
}
export function RecentEarned({ data }: DataCalculationProps): RecentSideInfoItem[] {
  return data
    .flatMap((income) => income.payments)
    .filter((payment) => payment.status === 'paid')
    .map((p) => ({
      name: p.name,
      data: p.amount,
      unit: '$',
      date: p.date,
    }));
}
export function UpcomingEarning({ data }: DataCalculationProps): RecentSideInfoItem[] {
  return data
    .flatMap((income) => income.payments)
    .filter((payment) => payment.status === 'coming')
    .map((p) => ({
      name: p.name,
      data: p.amount,
      unit: '$',
      date: p.date,
    }));
}
export function IncomesUpcoming({ data }: DataCalculationProps): object {
  return data.flatMap((income) => income.payments).filter((payment) => payment.status === 'coming');
}
export function UpcomingIncomeAmount({ data }: DataCalculationProps): number {
  return data
    .flatMap((income) => income.payments)
    .filter((payment) => payment.status === 'coming')
    .reduce((sum, payment) => sum + payment.amount, 0);
}
export function IncomeSourceList({ data }: DataCalculationProps): SourceListItem[] {
  return data.map((d) => ({
    sourceName: d.sourceName,
    amount: d.payments.reduce((sum, p) => sum + p.amount, 0),
    unit: '$',
  }));
}

//sourceContainer data
