'use client';
import React from 'react';
import TotalRow from '../TotalRow';
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

export default function FinancialSnapShot({
  header,
  items,
  className = '',
}: FinancialSnapShotProps) {
  const total = items.reduce((sum, item) => sum + item.data, 0);
  const toSortTime = (value?: string | number) => {
    if (!value) return 0;
    const raw = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return new Date(`${raw}T00:00:00.000Z`).getTime();
    }
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  };

  const formatDate = (value?: string | number) => {
    if (!value) return '';
    const raw = String(value);
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return raw;
    return parsed.toISOString().slice(0, 10);
  };

  const sortedItems = [...items]
    .sort((a, b) => toSortTime(b.date) - toSortTime(a.date))
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
                    {formatDate(item.date)}
                  </span>
                )}
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
