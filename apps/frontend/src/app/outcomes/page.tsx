'use client';
import { useMemo, useState } from 'react';
import SideBar from '@/components/SideBar';
import RecentSideInfo from '@/components/RecentSideInfo';
import MobileMenuButton from '@/components/MobileBurgerMenu';
import SourcesList from '@/components/SourcesList';
import PieChartData from '@/components/PieChartData';
import PieChart, { CATEGORY_COLORS, DEFAULT_CHART_COLORS } from '@/components/PieChart';
import CatchUpTheMonth from '@/components/outcomes/catchUpTheMonth';
import SourcesDetailsContainer from '@/components/sourcesDetailsContainer/sourcesDetailsContainer';
import { usePathname } from 'next/navigation';
import { FinanceSource } from '@/types/finance';
import { FinancePayment } from '@/types/finance';
import EditSourceModal from '@/components/modals/EditSourceModal';
import CreateSourceModal, { SourceBase } from '@/components/modals/CreateSourceModal';
import { useOutcomesContext } from '@/context/OutcomesContext';
import { useModal } from '@/context/ModalContext';
import {
  RecentPaid,
  UpcomingPayment,
  TotalOutcomes,
  PaidOutcomePayments,
  outcomeUpcoming,
  UpcomingOutcomeAmount,
  OutcomeSourcesList,
} from '@/utils/functions/dataCalculations/outcomeDataCalculations';
import { TotalIncomesPaidAmount } from '@/utils/functions/dataCalculations/incomesDataCalculations';
import SourceContainer from '@/components/sourcesDetailsContainer/sourceContainer';

// -- HELPERS
function fromSourceBaseToFinanceSource(
  base: Omit<SourceBase, 'id'> & { sourceType: 'finance' },
): Omit<FinanceSource, 'id'> {
  return {
    ...base,
    finance_payments: [] as FinancePayment[],
    type: 'outcome',
  };
}

export default function Outcomes() {
  const pathName = usePathname();
  const { showModal, showConfirmModal, closeModal } = useModal();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSourceId, setEditSourceId] = useState<string | null>(null);
  const [addSourceModalOpen, setAddSourceModalOpen] = useState(false);
  const {
    data: outcomes,
    removeSource,
    updateSource,
    addSource,
    loading,
    error,
  } = useOutcomesContext();
  const liveEditSource = editSourceId
    ? (outcomes.find((src) => src.id === editSourceId) ?? null)
    : null;

  //Quick reachs
  const outcomesUpcoming = outcomeUpcoming({ data: outcomes });
  const upcomingPaymentsCount = Array.isArray(outcomesUpcoming) ? outcomeUpcoming.length : 0;
  const upcomingOutcomeAmount = UpcomingOutcomeAmount({ data: outcomes });
  const recentPaid = RecentPaid({ data: outcomes });
  const upcomingPayment = UpcomingPayment({ data: outcomes });
  const outcomesSourceList = OutcomeSourcesList({ data: outcomes });
  const catchUptheMonth = [
    { name: 'Total Outcomes', data: TotalOutcomes({ data: outcomes }), unit: '$' },
    {
      name: 'Got Paid Payments',
      data: Object.keys(PaidOutcomePayments({ data: outcomes })).length,
    },
    { name: 'Got Paid Amount', data: TotalIncomesPaidAmount({ data: outcomes }), unit: '$' },
    { name: 'UpComing Payments', data: upcomingPaymentsCount },
    { name: 'Upcoming Amount', data: upcomingOutcomeAmount ?? 0, unit: '$' },
    { name: 'Reset Date', data: '-/01-' },
  ];
  // ... prepare your summary data as usual...

  const pieDataRaw =
    outcomes.map((src) => ({
      name: src.name,
      amount: (Array.isArray(src?.finance_payments) ? src.finance_payments : []).reduce(
        (sum, p) => sum + (p?.amount || 0),
        0,
      ),
      description: src.description,
    })) ?? [];

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

  return (
    <main className="flex flex-col xs:flex-row min-h-screen gap-1">
      <div className="hidden xs:flex flex-col items-center gap-5 flex-shrink-0 xs:w-64">
        <SideBar
          activePath={pathName ?? undefined}
          className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
        />
        <div className="w-full flex flex-row xs:flex-col relative gap-2 items-center">
          <RecentSideInfo header="Recent Paid" items={recentPaid} />
          <RecentSideInfo header="Upcoming payment" items={upcomingPayment} />
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
          <SourcesList header="Outcome Sources" items={outcomesSourceList} />
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
                onDelete={() => {
                  showConfirmModal(
                    'Please confirm that selected source will be deleted with the payments attached.',
                    async () => {
                      const ok = await removeSource(item.id);
                      closeModal();
                      if (ok ?? null) showModal('Source deleted successfully.');
                    },
                    () => closeModal(),
                  );
                }}
                key={item.id}
                item={item}
                open={open}
                onClick={() => onClick()}
                onEdit={() => {
                  setEditSourceId(item.id);
                  setEditModalOpen(true);
                }}
              />
            )}
            onAddSource={() => setAddSourceModalOpen(true)}
          />
          {liveEditSource && (
            <EditSourceModal
              open={editModalOpen}
              source={liveEditSource}
              onClose={() => setEditModalOpen(false)}
              onSubmit={async (updatedSource) => {
                if ('finance_payments' in updatedSource) {
                  {
                    await updateSource(updatedSource);
                    showModal('Source updated succesfully.');
                  }
                  setEditModalOpen(false);
                  setEditSourceId(null);
                }
              }}
            />
          )}
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
