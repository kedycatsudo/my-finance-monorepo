'use client';

import Image from 'next/image';
import { useState } from 'react';
import PaymentsContainer from './paymentsContainer';
import InformationContainer from './informationContainer';
import { FinanceSource, FinancePayment } from '@/types/finance';
import { InvestmentSource, InvestmentItem } from '@/types/investments';
import { assetPrefix } from '@/constants/config';

type SourceContainerProps = {
  item: FinanceSource | InvestmentSource;
  open: boolean;
  onClick: () => void;
  onEdit: () => void;
};

// Type guards for discriminated union
function isFinanceSource(a: FinanceSource | InvestmentSource): a is FinanceSource {
  return 'payments' in a;
}
function isInvestmentSource(a: FinanceSource | InvestmentSource): a is InvestmentSource {
  return 'items' in a;
}

export default function SourceContainer({ item, open, onClick, onEdit }: SourceContainerProps) {
  const [openPayments, setOpenPayments] = useState<{ [id: string]: boolean }>({});

  // Info content and payment/asset display
  let datasInfo: { id: number; infoPair: string; data: string | number }[] = [];
  let dataPayments: (FinancePayment | InvestmentItem)[] = [];
  let title: string = '';

  if (isFinanceSource(item)) {
    // For incomes/outcomes
    title = item.name;
    datasInfo = [
      { id: 1, infoPair: 'Description', data: item.description ?? '' },
      {
        id: 2,
        infoPair: 'Monthly Recurring Amount',
        data:
          item.payments
            .filter((p) => p.loop)
            .reduce((sum, p) => sum + p.amount, 0)
            .toLocaleString(undefined, { minimumFractionDigits: 2 }) + '$',
      },
      {
        id: 3,
        infoPair: 'Current amount for this month',
        data:
          item.payments
            .reduce((sum, p) => sum + p.amount, 0)
            .toLocaleString(undefined, { minimumFractionDigits: 2 }) + '$',
      },
      {
        id: 4,
        infoPair: 'Avg monthly total payment',
        data:
          (
            item.payments.reduce((sum, p) => sum + p.amount, 0) / (item.payments.length || 1)
          ).toLocaleString(undefined, { minimumFractionDigits: 2 }) + '$',
      },
    ];
    dataPayments = item.payments;
  } else if (isInvestmentSource(item)) {
    // For investments
    title = item.name ?? '';
    datasInfo = [
      { id: 1, infoPair: 'Description', data: item.description ?? '' },
      {
        id: 2,
        infoPair: 'Total Invested',
        data:
          item.items
            .reduce((sum, i) => sum + Number(i.investedAmount ?? 0), 0)
            .toLocaleString(undefined, { minimumFractionDigits: 2 }) + '$',
      },
      {
        id: 3,
        infoPair: 'Number of Assets',
        data: item.items.length,
      },
      {
        id: 4,
        infoPair: 'Closed Positions',
        data: item.items.filter((i) => i.status === 'closed').length,
      },
      {
        id: 5,
        infoPair: 'Open Positions ',
        data: item.items.filter((i) => i.status === 'open').length,
      },
      {
        id: 6,
        infoPair: 'Realized P&L',
        data:
          item.items
            .filter((i) => i.status === 'closed')
            .reduce((sum, i) => sum + Number(i.resultAmount ?? 0), 0)
            .toLocaleString(undefined, { minimumFractionDigits: 2 }) + '$',
      },
      {
        id: 7,
        infoPair: 'Avg Invested per Asset',
        data:
          (item.items.length > 0
            ? item.items.reduce((sum, i) => sum + Number(i.investedAmount ?? 0), 0) /
              item.items.length
            : 0
          ).toLocaleString(undefined, { minimumFractionDigits: 2 }) + '$',
      },
    ];
    dataPayments = item.items;
  }

  return (
    <div
      className={`w-full flex flex-col xs:flex-col border-4 border-[#29388A] rounded items-center p-2 cursor-pointer transition-all relative ${
        open ? 'bg-[#29388A]' : ''
      }`}
    >
      <div className="flex flex-row mt-auto ml-0 items-center self-start ">
        <h1
          className={`text-2xl xs:text-3xl text-[#1E1552] ${
            open ? 'text-[#FFFFFF]' : ''
          } font-bold mr-2`}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
          tabIndex={0}
          role="button"
        >
          {title}
        </h1>

        <Image
          onClick={onClick}
          src={`${assetPrefix}sourceArrowBig.svg`}
          alt="Menu icon"
          width={32}
          height={32}
          className={`w-8 h-8 transition-transform ${open ? 'rotate-90' : ''}`}
        />
        <Image
          onClick={(e) => {
            e.stopPropagation(); // Prevent accidental open/close on edit
            onEdit();
          }}
          src={`${assetPrefix}editIcon.svg`}
          alt="Edit modal button"
          width={32}
          height={32}
          className={`absolute top-0 right-0 w-8 h-8 transition-transform ${
            open ? 'rotate-90' : ''
          }`}
        />
      </div>

      <div className="flex flex-col xs:flex-row gap-2 w-full">
        {open && (
          <div className="mt-2 p-3 rounded transition-all">
            {dataPayments.map((payment) => (
              <PaymentsContainer
                key={payment.id}
                payment={payment}
                open={!!openPayments[payment.id]}
                onClick={() =>
                  setOpenPayments((prev) => ({
                    ...prev,
                    [payment.id]: !prev[payment.id],
                  }))
                }
              />
            ))}
          </div>
        )}
        {open && (
          <div className="w-full bg-[#0D1A63] gap-2 rounded z-[9999] mt-auto p-1 relative">
            {datasInfo.map((info) => (
              <InformationContainer key={info.id} infoPair={info.infoPair} data={info.data} />
            ))}
            {open && (
              <Image
                src={`${assetPrefix}/infoIco.svg`}
                alt="Information icon"
                width={36}
                height={36}
                className="absolute top-0 right-0"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
