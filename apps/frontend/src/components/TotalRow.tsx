'use client';
type TotalData = { total: number };

export default function TotalRow({ total }: TotalData) {
  return (
    <div>
      <div className="flex items-center justify-between py-2 gap-4 w-full">
        <span className="text-white text-s xs:text-xl font-semibold">Total </span>
        <span className="text-s xs:text-xl mt-0.5 bg-[#29388A] bg-opacity-60 border border-[#29388A] rounded px-2 py-0.5 font-bold text-[#a9deff] text-xs md:text-sm lg:text-sm shadow-inner">
          {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}$
        </span>
      </div>
    </div>
  );
}
