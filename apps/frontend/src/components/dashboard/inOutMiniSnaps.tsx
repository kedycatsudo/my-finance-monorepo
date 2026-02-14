'use client';
import React from 'react';
import TotalRow from '../TotalRow';
import { FinancePayment } from '@/types/finance';
type FinancialSnapshotItem = {
  name: string;
  data: number;
  unit?: string;
  date?: string | number;
};
type FinancialSnapShotProps = {
  header: string;
  items: FinancialSnapshotItem[];
  className?: string;
};

// Senior note: Don't control rendering like "if pathName === ..." in this component;
// delegate conditional hiding to parent where possible!

export default function FinancialSnapShot({
  header,
  items,
  className = '',
}: FinancialSnapShotProps) {
  const total = items.reduce((sum, item) => sum + item.data, 0);
  const sortedItems = [...items]
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
    .slice(0, 5);
  return (
    <div
      className={`w-full bg-[#3A4483]/75 rounded-[16px] p-1 flex flex-col items-center shadow-lg ${className}`}
    >
      <h3 className="text-white font-bold text-l xs:text-xl mb-2 text-center">{header}</h3>
      <div className="w-full h-1 mb-0.5 bg-[#29388A] rounded" />
      {/* Items */}
      <div className="w-full">
        {sortedItems.map((item, idx) => (
          <React.Fragment key={item.name + '-' + item.data}>
            <div className="flex flex-row justify-between items-center py-2 gap-1">
              <span className="text-white text-s xs:text-xl">{item.name}</span>
              <div className="flex flex-col xs:flex-row gap-1">
                <span className="mt-0.5 bg-[#29388A] bg-opacity-60 border border-[#29388A] rounded px-2 py-0.5 font-bold text-s xs:text-xl shadow-inner text-[#a9deff]">
                  {item.data.toLocaleString(undefined)}
                  {item.unit ? item.unit : ''}
                </span>
                {item.date && (
                  <span className="mt-0.5 bg-[#29388A] bg-opacity-60 border border-[#29388A] rounded px-2 py-0.5 font-bold text-s xs:text-xl shadow-inner text-[#a9deff]">
                    {item.date ? item.date : ''}
                  </span>
                )}
                {/* <span className="mt-0.5 bg-[#29388A] bg-opacity-60 border border-[#29388A] rounded px-2 py-0.5 font-bold text-[#a9deff] text-s xs:text-xl shadow-inner">
                  {new Date(item.date).toLocaleDateString()}
                  
                </span> */}
              </div>
            </div>

            {/* Divider except last item */}
            {idx < items.length - 1 && (
              <div className="h-0.5 bg-[#29388A] opacity-60 rounded"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="w-full h-1 my-2 bg-[#29388A] rounded" />
      {(header === 'Recent Outcomes' || header === 'Recent Incomes') && <TotalRow total={total} />}
    </div>
  );
}
