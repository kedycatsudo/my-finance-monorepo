'use client';
import React from 'react';
import TotalRow from './TotalRow';
// import { CATEGORY_COLORS, DEFAULT_CHART_COLORS } from '@/utils/chartColors';
type FinancialItem = {
  name: string;
  amount: number;
  date?: number | string;
  color?: string;
  description?: string;
};
type InOutSnapshotProps = {
  header: string;
  items: FinancialItem[];
  className?: string;
};

export default function PieChartData({ header, items, className }: InOutSnapshotProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div
      className={`w-full bg-[#3A4483]/75 rounded-[16px] p-1 flex flex-col items-center shadow-lg ${
        className ?? ''
      }`}
    >
      <h3 className="text-white font-bold text-l xs:text-xl mb-2 text-center">{header}</h3>
      <div className="w-full h-1 mb-0.5 bg-[#29388A] rounded" />
      <div className="w-full">
        {items.map((item, idx) => (
          <React.Fragment key={item.name + '-' + item.amount}>
            <div className="flex flex-row justify-between items-center py-2 gap-1">
              <div className="flex gap-1 items-center">
                <span className="text-white text-s xs:text-xl">{item.name}</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: item.color, // use only color assigned by parent!
                    marginRight: 8,
                  }}
                />
                <p>{item.description}</p>
              </div>
              <div className="flex flex-col xs:flex-row gap-1">
                <span className="mt-0.5 bg-[#29388A] bg-opacity-60 border border-[#29388A] rounded px-2 py-0.5 font-bold text-[#a9deff] text-s xs:text-xl shadow-inner">
                  {item.amount.toLocaleString(undefined)}$
                </span>
              </div>
            </div>
            {idx < items.length - 1 && (
              <div className="h-0.5 bg-[#29388A] opacity-60 rounded"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="w-full h-1 my-2 bg-[#29388A] rounded" />
      <TotalRow total={total} />
    </div>
  );
}
