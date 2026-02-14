'use client';
import React from 'react';

type CatchUpTheMonthItems = {
  name: string;
  data: number | string;
  unit?: string;
};

type CatchUpTheMonthProps = { header: string; items: CatchUpTheMonthItems[]; className?: string };

export default function CatchUpTheMonth({ header, items, className = '' }: CatchUpTheMonthProps) {
  return (
    <div
      className={'w-full bg-[#3A4483]/75 rounded-[16px] p-1 flex flex-col items-center shadow-lg'}
    >
      <h3 className="text-white font-bold text-l xs:text-xl mb-2 text-center">{header}</h3>
      <div className="w-full h-1 mb-0.5 bg-[#29388A] rounded" />
      {/* Items */}
      <div className="w-full">
        {items.map((item, idx) => (
          <React.Fragment key={item.name + '_' + item.data}>
            <div className="flex flex-row justify-between items-center py-2 gap-1">
              <span className="text-white text-s xs:text-xl">{item.name}</span>
              <div className="flex flex-col xs:flex-row gap-1">
                <span className="mt-0.5 bg-[#29388A] bg-opacity-60 border border-[#29388A] rounded px-2 py-0.5 font-bold text-s xs:text-xl shadow-inner text-[#a9deff]">
                  {item.data.toLocaleString(undefined)}
                  {item.unit ? item.unit : ''}
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
    </div>
  );
}
