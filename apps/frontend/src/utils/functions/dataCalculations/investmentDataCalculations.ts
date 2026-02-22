import { InvestmentSource } from '@/types/investments';
import type { RecentSideInfoItem } from '@/types/financeRecentSideInfoItem';
import type { SourceListItem } from '@/types/sourceListItem';
type DataCalculationProps = {
  data: InvestmentSource[];
};

//investment calculations

export function RecentProfits({ data }: DataCalculationProps): RecentSideInfoItem[] {
  return data
    .flatMap((investment) => investment.items)
    .filter((item) => item.status === 'closed' && item.result === 'profit')
    .map((i) => ({
      name: i.assetName,
      data: i.resultAmount ?? 0, // fallback to 0 if null
      date: i.exitDate ?? '', // fallback to empty string if null
      unit: '$',
    }));
}
export function RecentLoss({ data }: DataCalculationProps): RecentSideInfoItem[] {
  return data
    .flatMap((investment) => investment.items)
    .map((i) => ({
      name: i.assetName,
      data: i.resultAmount ?? 0, // fallback to 0 if null
      date: i.exitDate ?? '', // fallback to empty string if null
      unit: '$',
    }));
}
export function ProfitsThisMonth({ data }: DataCalculationProps): number {
  return data
    .flatMap((investment) => investment.items)
    .filter((item) => item.status === 'closed' && item.result === 'profit').length;
}
export function ProfitThisMonthAmount({ data }: DataCalculationProps): number {
  return data
    .flatMap((investment) => investment.items)
    .filter((item) => item.status === 'closed' && item.result === 'profit')
    .reduce((sum, item) => sum + (item.resultAmount ?? 0), 0);
}
export function LosesThisMonth({ data }: DataCalculationProps): number {
  return data
    .flatMap((investment) => investment.items)
    .filter((item) => item.status === 'closed' && item.result === 'loss').length;
}
export function LosesThisMonthAmount({ data }: DataCalculationProps): number {
  return data
    .flatMap((investment) => investment.items)
    .filter((item) => item.status === 'closed' && item.result === 'loss')
    .reduce((sum, item) => sum + (item.resultAmount ?? 0), 0);
}
export function OpenPositions({ data }: DataCalculationProps): SourceListItem[] {
  return data
    .flatMap((investment) => investment.items)
    .filter((item) => item.status === 'open')
    .map((i) => ({
      name: i.assetName,
      amount: i.investedAmount,
      unit: '$',
    }));
}
export function OpenPositionsAmount({ data }: DataCalculationProps): number {
  return data
    .flatMap((investment) => investment.items)
    .filter((item) => item.status === 'open')
    .reduce((sum, item) => sum + (item.resultAmount ?? 0), 0);
}
export function ClosedPositions({ data }: DataCalculationProps): number {
  return data.flatMap((investment) => investment.items).filter((item) => item.status === 'closed')
    .length;
}
export function ClosedPositionsAmount({ data }: DataCalculationProps): number {
  return data
    .flatMap((investment) => investment.items)
    .filter((item) => item.status === 'closed')
    .reduce((sum, item) => sum + (item.resultAmount ?? 0), 0);
}
export function InvestmentSourcesList({ data }: DataCalculationProps): SourceListItem[] {
  return data.map((d) => ({
    name: d.name,
    amount: d.items.reduce((sum, p) => sum + p.investedAmount, 0),
    unit: '$',
  }));
}
