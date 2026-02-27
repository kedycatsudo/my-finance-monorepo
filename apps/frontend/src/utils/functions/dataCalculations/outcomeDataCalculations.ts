import { FinanceSource } from '@/types/finance';
import type { RecentSideInfoItem } from '@/types/financeRecentSideInfoItem';
import { SourceListItem } from '@/types/sourceListItem';
import { FinancePayment } from '@/types/finance';
type DataCalculationProps = {
  data: FinanceSource[];
};
// outcomes Calculations
export function RecentPaid({ data }: DataCalculationProps): RecentSideInfoItem[] {
  return data
    .flatMap((outcome) => outcome.finance_payments)
    .filter((payment) => payment.status === 'paid')
    .map((p) => ({ name: p.name, data: p.amount, unit: '$', date: p.date }));
}
export function UpcomingPayment({ data }: DataCalculationProps): RecentSideInfoItem[] {
  return data
    .flatMap((outcome) => outcome.finance_payments)
    .filter((payment) => payment.status === 'coming')
    .map((p) => ({ name: p.name, data: p.amount, unit: '$', date: p.date }));
}
export function TotalOutcomes({ data }: DataCalculationProps): number {
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
export function PaidOutcomePayments({ data }: DataCalculationProps) {
  return data
    .flatMap((outcome) =>
      Array.isArray(outcome?.finance_payments) ? outcome.finance_payments : [],
    )
    .filter((payment): payment is FinancePayment => Boolean(payment))
    .filter((payment) => payment.status === 'paid');
}
export function TotalOutcomesPaidAmount({ data }: DataCalculationProps): number {
  return data
    .flatMap((outcome) => outcome.finance_payments)
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
}
export function UpcomingPayments({ data }: DataCalculationProps) {
  return data
    .flatMap((outcome) => outcome.finance_payments)
    .filter((payment) => payment.status === 'coming');
}
export function UpcomingAmount({ data }: DataCalculationProps): number {
  return data
    .flatMap((outcome) => outcome.finance_payments)
    .filter((payment) => payment.status === 'coming')
    .reduce((sum, payment) => sum + payment.amount, 0);
}
export function OutcomeSourcesList({ data }: DataCalculationProps): SourceListItem[] {
  return data.map((d) => ({
    name: d.name,
    amount: d.finance_payments.reduce((sum, p) => sum + p.amount, 0),
    unit: '$',
  }));
}
