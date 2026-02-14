'use client';
import Image from 'next/image';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { assetPrefix, basePath } from '@/constants/config';
export default function Header() {
  return (
    <header>
      <div className="flex m-2 items-center justify-center xs:justify-start gap-2">
        <Image
          src={`${assetPrefix}images/myfinancelogo.png`}
          alt="MyFinance Logo"
          width={80}
          height={80}
          className="w-10 h-10 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 shadow-lg rounded-full object-cover z-[9999] mt-2"
        />
        <div className="p-1 bg-[#29388A] rounded font-bold text-[#a9deff] text-xs xs:text-xl lg:text-sm shadow-inner">
          <DateTimeDisplay />
        </div>
      </div>
    </header>
  );
}
