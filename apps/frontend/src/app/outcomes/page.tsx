'use client';
import { useState } from 'react';
import SideBar from '@/components/SideBar';
import RecentSideInfo from '@/components/RecentSideInfo';
import MobileMenuButton from '@/components/MobileBurgerMenu';
import SourcesList from '@/components/SourcesList';
import PieChartData from '@/components/PieChartData';
import PieChart, { CATEGORY_COLORS, DEFAULT_CHART_COLORS } from '@/components/PieChart';
import CatchUpTheMonth from '@/components/outcomes/catchUpTheMonth';
import SourcesDetailsContainer from '@/components/sourcesDetailsContainer/sourcesDetailsContainer';
import { useOutcomesContext } from '@/context/FinanceGenericContext';
import { usePathname } from 'next/navigation';
import { FinanceSource } from '@/types/finance';
import EditSourceModal from '@/components/modals/EditSourceModal';
import CreateSourceModal, { SourceBase } from '@/components/modals/CreateSourceModal';
import {
  RecentPaid,
  UpcomingPayment,
  TotalOutcomes,
  PaidOutcomePayments,
  UpcomingPayments,
  UpcomingAmount,
  OutcomeSourcesList,
} from '@/utils/functions/dataCalculations/outcomeDataCalculations';
import { TotalIncomesPaidAmount } from '@/utils/functions/dataCalculations/incomesDataCalculations';
import SourceContainer from '@/components/sourcesDetailsContainer/sourceContainer';

// -- HELPERS
function fromSourceBaseToFinanceSource(
  base: Omit<SourceBase, 'id'> & { sourceType: 'finance' },
  id: string,
): FinanceSource {
  return {
    ...base,
    id,
    payments: [],
    type: 'outcome',
  };
}

export default function Outcomes() {
  const pathName = usePathname();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSource, setEditSource] = useState<FinanceSource | null>(null);
  const [addSourceModalOpen, setAddSourceModalOpen] = useState(false);
  const { data: outcomes, updateSource, addSource, loading, error } = useOutcomesContext();

  const newSourceType: 'finance' = 'finance';

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!outcomes || outcomes.length === 0) {
    return <div>No outcomes found</div>;
  }

  // ... prepare your summary data as usual...

  const pieDataRaw = outcomes.map((src) => ({
    name: src.name,
    amount: src.payments.reduce((sum, p) => sum + p.amount, 0),
    description: src.description,
  }));
  const pieDataWithColors = pieDataRaw.map((item, idx) => ({
    ...item,
    color: CATEGORY_COLORS[item.name] || DEFAULT_CHART_COLORS[idx % DEFAULT_CHART_COLORS.length],
  }));
  const pieChartData = pieDataWithColors.map((d) => ({
    name: d.name,
    amount: d.amount,
    date: Date.now(),
    description: d.description,
    color: d.color,
  }));

  // Example catchUp arrays here, use your calculation logic
  const catchUptheMonth = [
    { name: 'Total Outcomes', data: TotalOutcomes({ data: outcomes }), unit: '$' },
    {
      name: 'Got Paid Payments',
      data: Object.keys(PaidOutcomePayments({ data: outcomes })).length,
    },
    { name: 'Got Paid Amount', data: TotalIncomesPaidAmount({ data: outcomes }), unit: '$' },
    { name: 'UpComing Payments', data: Object.keys(UpcomingPayments({ data: outcomes })).length },
    { name: 'Upcoming Amount', data: UpcomingAmount({ data: outcomes }), unit: '$' },
    { name: 'Reset Date', data: '-/01-' },
  ];

  return (
    <main className="flex flex-col xs:flex-row min-h-screen gap-1">
      <div className="hidden xs:flex flex-col items-center gap-5 flex-shrink-0 xs:w-64">
        <SideBar
          activePath={pathName ?? undefined}
          className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
        />
        <div className="w-full flex flex-row xs:flex-col relative gap-2 items-center">
          <RecentSideInfo header="Recent Paid" items={RecentPaid({ data: outcomes })} />
          <RecentSideInfo header="Upcoming payment" items={UpcomingPayment({ data: outcomes })} />
        </div>
      </div>
      <section className="w-full flex flex-col flex-start items-center gap-5 ">
        <div className="flex flex-col">
          <h1 className="text-3xl xs:text-6xl font-bold text-[#1E1552] text-center z-10">
            OUTCOMES
          </h1>
        </div>
        <div className="w-full flex xs:hidden flex-col items-center gap-5">
          <SideBar
            activePath={pathName ?? undefined}
            className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
          />
          <div className="w-full flex flex-col relative gap-1 items-center">
            <RecentSideInfo header="Recent Paid" items={RecentPaid({ data: outcomes })} />
            <RecentSideInfo header="Upcoming payment" items={UpcomingPayment({ data: outcomes })} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-1 w-full">
          <CatchUpTheMonth header="Quick Catch Up For This Month" items={catchUptheMonth} />
          <SourcesList header="Outcome Sources" items={OutcomeSourcesList({ data: outcomes })} />
        </div>
        <div className="pl-1 flex flex-col md:flex-row items-center w-full gap-1">
          <PieChart data={pieDataWithColors} />
          <PieChartData header="Pie Chart Data" items={pieChartData} />
        </div>
        <div className="flex flex-col w-full">
          <SourcesDetailsContainer
            header="Outcome Sources"
            items={outcomes}
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
          {addSourceModalOpen && (
            <CreateSourceModal
              open={addSourceModalOpen}
              onClose={() => setAddSourceModalOpen(false)}
              onSubmit={(fields) => {
                const id = Date.now().toString() + Math.random().toString(36).slice(2);
                addSource(
                  fromSourceBaseToFinanceSource({ ...fields, sourceType: newSourceType }, id),
                );
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
