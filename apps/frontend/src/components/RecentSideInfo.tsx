'use client';
import React from 'react';
import TotalRow from './TotalRow';
import { RecentSideInfoItem } from '@/types/financeRecentSideInfoItem';
// Define the type directly for clarity since RecentItem is obsolete.

type RecentSideInfoProps = {
  header: string;
  items: RecentSideInfoItem[];
  className?: string;
};
export default function RecentSideInfo({ header, items, className = '' }: RecentSideInfoProps) {
  const total = items.reduce((sum, item) => sum + Number(item.data), 0);

  const sortedItems = [...items]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  return (
    <div className={`flex-1 w-full ${className}`}>
      <div className="w-full bg-[#3A4483]/75 rounded-[16px] p-1 flex flex-col items-center shadow-lg">
        <h3 className="text-white font-bold text-l xs:text-xl mb-2 text-center">{header}</h3>
        <div className="w-full h-1 my-2 bg-[#29388A] rounded" />
        <div className="w-full flex flex-col">
          {items.length === 0 && (
            <div className="w-full text-center text-white opacity-60 py-5">No items</div>
          )}
          {sortedItems.map((item, idx) => (
            <React.Fragment key={item.name + '-' + item.date}>
              <div className="w-full flex flex-row justify-between items-center py-2 gap-1">
                <span className="text-white">{item.name}</span>
                <div className="flex flex-col md:flex-row">
                  <span className="mt-0.5 bg-[#29388A] bg-opacity-60 border border-[#29388A] rounded px-2 py-0.5 font-bold text-s xs:text-xl shadow-inner text-[#a9deff]">
                    {item.data.toLocaleString(undefined)}
                    {item.unit ? item.unit : ''}
                  </span>
                  <span className="mt-0.5 bg-[#29388A] bg-opacity-60 border border-[#29388A] rounded px-2 py-0.5 font-bold text-[#a9deff] text-s xs:text-xl shadow-inner">
                    {item.date ? new Date(item.date).toLocaleDateString() : ''}
                  </span>
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
        <TotalRow total={total} />
      </div>
    </div>
  );
}
