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
import { useInvestmentsContext } from '@/context/FinanceGenericContext';
import { InvestmentSource, InvestmentItem } from '@/types/investments';
import EditSourceModal from '@/components/modals/EditSourceModal';
import SourceContainer from '@/components/sourcesDetailsContainer/sourceContainer';
import CreateSourceModal, { SourceBase } from '@/components/modals/CreateSourceModal';
import {
  RecentProfits,
  RecentLoss,
  ProfitsThisMonth,
  LosesThisMonth,
  OpenPositions,
  ClosedPositions,
  InvestmentSourcesList,
  ProfitThisMonthAmount,
  LosesThisMonthAmount,
  OpenPositionsAmount,
  ClosedPositionsAmount,
} from '@/utils/functions/dataCalculations/investmentDataCalculations';

// -- HELPERS
function fromSourceBaseToInvestmentSource(
  base: Omit<SourceBase, 'id'> & { sourceType: 'investment' },
  id: string,
): InvestmentSource {
  return {
    ...base,
    id,
    items: [] as InvestmentItem[], // Explicitly type the empty array
    type: 'investment',
  };
}

export default function Investments() {
  const pathName = usePathname();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSource, setEditSource] = useState<InvestmentSource | null>(null);
  const [addSourceModalOpen, setAddSourceModalOpen] = useState(false);
  const { data: investments, updateSource, addSource, loading, error } = useInvestmentsContext();
  const catchUpTheMonth = [
    {
      name: 'Profits this month',
      data: ProfitsThisMonth({ data: investments }),
    },
    {
      name: 'Profit amount this month',
      data: ProfitThisMonthAmount({ data: investments }),
      unit: '$',
    },
    {
      name: 'Loses this month',
      data: LosesThisMonth({ data: investments }),
    },
    {
      name: 'Loses amount this month',
      data: LosesThisMonthAmount({ data: investments }),
      unit: '$',
    },
    {
      name: 'Open Positions',
      data: OpenPositions({ data: investments }).length,
    },
    {
      name: 'Open positions amount',
      data: OpenPositionsAmount({ data: investments }),
      unit: '$',
    },
    {
      name: 'Closed Positions',
      data: ClosedPositions({ data: investments }),
    },
    {
      name: 'Closed positions amount',
      data: ClosedPositionsAmount({ data: investments }),
      unit: '$',
    },
  ];
  const newSourceType: 'investment' = 'investment';

  // --- stats, chart, etc. code same as before ---

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!investments || investments.length === 0) {
    return <div>No investments found</div>;
  }

  // Prepare chart/summary data as before...
  // ... define recentProfit, profitThisMonth, etc.

  const pieDataRaw = investments.map((src) => ({
    name: src.sourceName,
    amount: src.items.reduce((sum, p) => sum + p.investedAmount, 0),
    description: src.description,
  }));
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

  // Fill in quickCatchUp, etc. as in your implementation. Not displayed in this snippet for brevity.

  return (
    <main className="flex flex-col xs:flex-row min-h-screen gap-1">
      {/* Side containers */}
      <div className="hidden xs:flex flex-col items-center gap-5 flex-shrink-0 xs:w-64">
        <SideBar
          activePath={pathName}
          className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
        />
        <div className="w-full flex flex-row xs:flex-col relative gap-2 items-center">
          <RecentSideInfo header="Recent Profit" items={RecentProfits({ data: investments })} />
          <RecentSideInfo header="Recent Lose" items={RecentLoss({ data: investments })} />
        </div>
      </div>
      {/* Main Content */}
      <section className="w-full flex flex-col flex-start items-center gap-5">
        <div className="flex flex-col">
          <h1 className="text-3xl xs:text-6xl font-bold text-[#1E1552] text-center z-10">
            INVESTMENTS
          </h1>
        </div>
        <div className="w-full flex xs:hidden flex-col items-center gap-5">
          <SideBar
            activePath={pathName}
            className="hidden [@media(min-width:450px)]:flex rounded-lg ..."
          />
          <div className="w-full flex flex-col relative gap-1 items-center">
            <RecentSideInfo header="Recent Profit" items={RecentProfits({ data: investments })} />
            <RecentSideInfo header="Recent Lose" items={RecentLoss({ data: investments })} />
          </div>
        </div>
        <div className="flex flex-col xs:flex-row justify-center items-center gap-1 w-full">
          <div className="w-full flex flex-col md:flex-row gap-2">
            <CatchUpTheMonth
              header="Month-to-Date Overview"
              items={catchUpTheMonth}
            ></CatchUpTheMonth>
            <SourcesList
              header="Open Positions and Sizes"
              items={OpenPositions({ data: investments })}
            ></SourcesList>
          </div>
          <div className="w-full flex flex-col gap-2">
            <SourcesList
              header="Investment Source List"
              items={InvestmentSourcesList({ data: investments })}
            ></SourcesList>

            <CatchUpTheMonth header="Quick Summary" items={catchUpTheMonth}></CatchUpTheMonth>
          </div>
        </div>
        {/* ... More chart/stat components here ... */}
        <div className="pl-1 flex flex-col md:flex-row items-center w-full gap-1">
          <PieChart data={pieDataWithColors} />
          <PieChartData header="Pie Chart Data Investment Sources" items={pieChartData} />
        </div>
        <div className="flex flex-col w-full">
          <SourcesDetailsContainer
            header="Investment Sources"
            items={investments}
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
                if ('items' in updatedSource) {
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
                  fromSourceBaseToInvestmentSource({ ...fields, sourceType: newSourceType }, id),
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
