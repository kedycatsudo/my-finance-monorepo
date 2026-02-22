'use client';
/* components import */
import SideBar from '@/components/SideBar';
import RecentSideInfo from '@/components/RecentSideInfo';
import MobileMenuButton from '@/components/MobileBurgerMenu';
import FinancialSnapShot from '@/components/dashboard/inOutMiniSnaps';
import PieChartData from '@/components/PieChartData';
import PieChart, { CATEGORY_COLORS, DEFAULT_CHART_COLORS } from '@/components/PieChart';
import { usePathname } from 'next/navigation';
import {
  useIncomesContext,
  useOutcomesContext,
  useInvestmentsContext,
} from '@/context/FinanceGenericContext';
import { useMemo } from 'react';
import { flattenInvestments, flattenPayments } from '@/utils/functions/flattenData';
import { InvestmentItem, InvestmentSource } from '@/types/investments';
import { FinanceSource, FinancePayment } from '@/types/finance';
export default function Dashboard() {
  const pathName = usePathname() ?? '';

  // Get live data from generic contexts
  const { data: incomes } = useIncomesContext();
  const incomesArray = incomes as FinanceSource[];
  const { data: outcomes } = useOutcomesContext();
  const { data: investments } = useInvestmentsContext();
  const allIncomePayments = useMemo(() => flattenPayments(incomes), [incomes]);
  const allOutcomePayments = useMemo(() => flattenPayments(outcomes), [outcomes]);
  const allInvestmentPositions = useMemo(() => flattenInvestments(investments), [investments]);
  // For pie chart & summary
  const totalIncomes = incomesArray.reduce(
    (sum: number, src: FinanceSource) =>
      sum + src.payments.reduce((s: number, p: FinancePayment) => s + p.amount, 0),
    0,
  );
  const totalOutcomes = outcomes.reduce(
    (sum: number, src: FinanceSource) =>
      sum + src.payments.reduce((s: number, p) => s + p.amount, 0),
    0,
  );
  const totalInvested = investments.reduce(
    (sum: number, src: InvestmentSource) =>
      sum + src.items.reduce((ss: number, i: InvestmentItem) => ss + i.investedAmount, 0),
    0,
  );
  // Pie data -- just use incomes & outcomes, add investments if needed
  const pieDataRaw = [
    {
      name: 'Outcomes',
      amount: totalOutcomes,
    },
    { name: 'Incomes', amount: totalIncomes },
    { name: 'Investments', amount: totalInvested },
  ];
  const pieDataWithColors = pieDataRaw.map((item, idx) => ({
    ...item,
    color: CATEGORY_COLORS[item.name] || DEFAULT_CHART_COLORS[idx % DEFAULT_CHART_COLORS.length],
  }));

  // Pie chart data legend
  const pieChartData = pieDataWithColors.map((d) => ({
    name: d.name,
    amount: d.amount,
    date: Date.now(),
    color: d.color,
  }));

  // FinancialSnapShot expects array of { name, data }
  const currentOutcomes = [
    {
      name: 'Total Outcomes',
      data: totalOutcomes,
      unit: '$',
    },
    {
      name: 'Outcome Sources',
      data: outcomes.length,
    },
  ];
  const currentIncomes = [
    {
      name: 'Total Incomes',
      data: totalIncomes,
      unit: '$',
    },
    {
      name: 'Income Sources',
      data: incomes.length,
    },
  ];

  // Recent lists for snapshots
  const recentOutcomes = allOutcomePayments.slice(0, 5).map((p) => ({
    name: p.name,
    data: p.amount,
    unit: '$',
    date: p.date,
  }));

  const recentIncomes = allIncomePayments.slice(0, 5).map((p) => ({
    name: p.name,
    data: p.amount,
    unit: '$',
    date: p.date,
  }));

  const recentInvestments = allInvestmentPositions
    .filter((item) => item.status === 'closed')
    .slice(0, 5)
    .map((item) => ({
      name: `${item.name}: ${item.assetName}`,
      data: Number(item.investedAmount ?? 0),
      date: item.entryDate || '',
      unit: '$',
    }));
  const recentMisc = allInvestmentPositions
    .filter((item) => item.status === 'open')
    .slice(0, 5)
    .map((item) => ({
      name: `${item.name}: ${item.assetName}`,
      data: Number(item.investedAmount ?? 0),
      date: item.entryDate || '',
      unit: '$',
    }));
  return (
    <main className="flex flex-col xs:flex-row min-h-screen gap-1">
      {/* Side containers */}
      <div className="hidden xs:flex flex-col items-center gap-5 flex-shrink-0 xs:w-64">
        <SideBar
          activePath={pathName}
          className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
        />
        {/*recently investment and miscs */}
        <div className=" w-full flex flex-col relative gap-2 items-center">
          <RecentSideInfo header="Recent invested" items={recentInvestments} />
          <RecentSideInfo header="Recent Miscellaneous" items={recentMisc} />
        </div>
      </div>
      {/* Main Content */}
      <section className="w-full flex flex-col flex-start items-center gap-5">
        {/* header and welcome message */}
        <div className="flex flex-col md:flex-row">
          <h1 className="text-3xl xs:text-6xl font-bold text-[#1E1552] text-center z-10">
            DASHBOARD
          </h1>
          <p className="text-x xs:text-xl font-bold text-[#1E1552] max-w-[750px] text-center z-10">
            Welcome to MyFinance Dashboard. Congratulations, your colour is
            <span className="text-green-700"> green </span>
            so far this month.
          </p>
        </div>
        <div className="w-full flex xs:hidden flex-col items-center gap-5">
          <SideBar
            activePath={pathName}
            className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
          />
          <div className="w-full flex flex-col relative gap-1 items-center">
            <RecentSideInfo header="Recently Invested" items={recentInvestments} />
            <RecentSideInfo header="Recent Miscellaneous" items={recentMisc} />
          </div>
        </div>
        <div className="flex flex-col  justify-center items-center gap-1 w-full">
          <FinancialSnapShot header="Current Outcomes" items={currentOutcomes} />
          <FinancialSnapShot header="Current Incomes" items={currentIncomes} />
        </div>
        <div className="pl-1 flex flex-col md:flex-row  items-center w-full gap-1">
          <PieChart data={pieDataWithColors} />
          <PieChartData header="Pie Chart Data" items={pieChartData} />
        </div>
        <div className="pl-1 flex flex-col l:flex-row items-center w-full gap-5">
          <FinancialSnapShot header="Recent Outcomes" items={recentOutcomes} />
          <FinancialSnapShot header="Recent Incomes" items={recentIncomes} />
        </div>
      </section>
      <MobileMenuButton
        menuItems={[
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/incomes', label: 'Incomes' },
          { href: '/outcomes', label: 'Outcomes' },
          { href: '/investments', label: 'Investments' },
          { href: '/profile', label: 'Profile' },
          { href: '/logout', label: 'Logout' },
        ]}
      />
    </main>
  );
}
