'use client';
import { useState } from 'react';
import SideBar from '@/components/SideBar';
import RecentSideInfo from '@/components/RecentSideInfo';
import MobileMenuButton from '@/components/MobileBurgerMenu';
import PieChartData from '@/components/PieChartData';
import PieChart, { CATEGORY_COLORS, DEFAULT_CHART_COLORS } from '@/components/PieChart';
import CatchUpTheMonth from '@/components/outcomes/catchUpTheMonth';
import SourcesDetailsContainer from '@/components/sourcesDetailsContainer/sourcesDetailsContainer';
import SourcesList from '@/components/SourcesList';
import { usePathname } from 'next/navigation';
import { useIncomesContext } from '@/context/IncomesContext';
import { FinanceSource, FinancePayment } from '@/types/finance';
import EditSourceModal from '@/components/modals/EditSourceModal';
import SourceContainer from '@/components/sourcesDetailsContainer/sourceContainer';
import CreateSourceModal, { SourceBase } from '@/components/modals/CreateSourceModal';
import {
  TotalIncomes,
  PaidIncomePayments,
  TotalIncomesPaidAmount,
  RecentEarned,
  IncomesUpcoming,
  UpcomingIncomeAmount,
  UpcomingEarning,
  IncomeSourceList,
} from '@/utils/functions/dataCalculations/incomesDataCalculations';

// Helper: create FinanceSource from SourceBase, let backend assign the ID!
function fromSourceBaseToFinanceSource(
  base: Omit<SourceBase, 'id'> & { sourceType: 'finance' },
): Omit<FinanceSource, 'id'> {
  return {
    ...base,
    payments: [] as FinancePayment[],
    type: 'income',
  };
}

export default function Incomes() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSource, setEditSource] = useState<FinanceSource | null>(null);
  const [addSourceModalOpen, setAddSourceModalOpen] = useState(false);
  const pathName = usePathname();

  const { data: incomes, updateSource, addSource, loading, error } = useIncomesContext();

  const totalIncomes = console.log('incomes from api:', incomes);
  incomes?.reduce(
    (acc, src) => acc + src.payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    0,
  ) ?? 0;
  const paidIncomePayments =
    incomes?.flatMap((src) => src.payments.filter((p) => p.status === 'paid')) ?? [];
  const totalIncomesPaidAmount = TotalIncomesPaidAmount({ data: incomes });
  const recentEarned = RecentEarned({ data: incomes });
  const incomesUpcoming = IncomesUpcoming({ data: incomes });
  const upcomingIncomeAmount = UpcomingIncomeAmount({ data: incomes });
  const upcomingEarning = UpcomingEarning({ data: incomes });
  const incomesSourceList = IncomeSourceList({ data: incomes });
  const catchUptheMonth = [
    { name: 'Total Income', data: totalIncomes ?? 0, unit: '$' },
    { name: 'Payments Received', data: paidIncomePayments.length ?? 0 },
    { name: 'Amount Received', data: totalIncomesPaidAmount ?? 0, unit: '$' },
    { name: 'Upcoming Payments', data: incomesUpcoming.length ?? 0 },
    { name: 'Upcoming Amount', data: upcomingIncomeAmount ?? 0, unit: '$' },
    { name: 'Monthly Reset Date', data: '-/01-' },
  ];

  const pieDataRaw =
    incomes?.map((src) => ({
      name: src.sourceName,
      amount: src.payments.reduce((sum, p) => sum + (p.amount || 0), 0),
      description: src.description,
    })) ?? [];
  const pieDataWithColors = pieDataRaw.map((item, idx) => ({
    ...item,
    color: CATEGORY_COLORS[item.name] || DEFAULT_CHART_COLORS[idx % DEFAULT_CHART_COLORS.length],
  }));
  const pieChartData = pieDataWithColors.map((d) => ({
    sourceName: d.name,
    amount: d.amount,
    date: Date.now(),
    description: d.description,
    color: d.color,
  }));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="flex flex-col xs:flex-row min-h-screen gap-1">
      {/* Side containers */}
      <div className="hidden xs:flex flex-col items-center gap-5 flex-shrink-0 xs:w-64">
        <SideBar
          activePath={pathName}
          className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
        />
        <div className="flex flex-row xs:flex-col relative gap-2 items-center">
          <RecentSideInfo header="Recent Received" items={recentEarned} />
          <RecentSideInfo header="Upcoming Payment" items={upcomingEarning} />
        </div>
      </div>
      {/* Main Content */}
      <section className="w-full flex flex-col flex-start items-center gap-5">
        <div className="flex flex-col">
          <h1 className="text-3xl xs:text-6xl font-bold text-[#1E1552] text-center z-10">
            INCOMES
          </h1>
        </div>
        <div className="w-full flex xs:hidden flex-col items-center gap-5">
          <SideBar
            activePath={pathName}
            className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
          />
          <div className="flex flex-col w-full relative gap-1 items-center">
            <RecentSideInfo header="Recent Recieved" items={recentEarned} />
            <RecentSideInfo header="Upcoming Payment" items={upcomingEarning} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-1 w-full">
          <CatchUpTheMonth header="Month-to-Date Overview" items={catchUptheMonth} />
          <SourcesList header="Income Sources" items={incomesSourceList} />
        </div>
        <div className="pl-1 flex flex-col md:flex-row items-center w-full gap-1">
          <PieChart data={pieDataWithColors} />
          <PieChartData header="Pie Chart Data" items={pieChartData} />
        </div>
        <div className="flex flex-col w-full">
          <SourcesDetailsContainer
            header="Income Sources"
            items={incomes}
            renderSource={(item, open, onClick, onEdit) => (
              <SourceContainer
                key={item.id}
                item={item}
                open={open}
                onClick={onClick}
                onEdit={() => {
                  setEditSource(item);
                  setEditModalOpen(true);
                }}
              />
            )}
            onAddSource={() => setAddSourceModalOpen(true)}
          />

          {/* Edit existing source modal */}
          {editSource && (
            <EditSourceModal
              open={editModalOpen}
              source={editSource}
              onClose={() => setEditModalOpen(false)}
              onSubmit={(updatedSource) => {
                if ('payments' in updatedSource) {
                  updateSource(updatedSource);
                }
                setEditModalOpen(false);
              }}
            />
          )}

          {/* Add new source modal */}
          {addSourceModalOpen && (
            <CreateSourceModal
              open={addSourceModalOpen}
              onClose={() => setAddSourceModalOpen(false)}
              onSubmit={(fields) => {
                addSource(fromSourceBaseToFinanceSource({ ...fields, sourceType: 'finance' }));
                setAddSourceModalOpen(false);
              }}
            />
          )}
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
