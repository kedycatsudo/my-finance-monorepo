'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { assetPrefix } from '@/constants/config';

export type MenuItem = {
  href: string;
  label: string;
};

type MobileMenuButtonProps = {
  menuItems: MenuItem[];
};

export default function MobileMenuButton({ menuItems }: MobileMenuButtonProps) {
  const [open, setOpen] = useState(false);

  // Helper to close menu when clicking a link or backdrop
  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      {/* Floating Mobile Menu Button (does not render when open) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex 
    items-center 
    justify-center 
    [@media(min-width:450px)]:hidden 
    fixed 
    bottom-4 
    left-1/2 
    transform 
    -translate-x-1/2 
    z-50 
    bg-[#727272] 
    rounded-full 
    p-4 
    shadow-lg"
          aria-label="Open menu"
        >
          <Image src={`${assetPrefix}images/Menu.svg`} alt="Menu icon" width={20} height={20} />
        </button>
      )}

      {/* Only button for modal/menu */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
          style={{ background: 'rgba(0,0,0,0.60)' }}
          aria-label="Mobile menu modal"
          onClick={handleClose}
        >
          {/* Stop click in modal from closing it */}
          <span
            className="relative z-10 mx-4 w-full max-w-xs bg-[#3A4483] rounded-2xl shadow-2xl p-6 animate-slide-down flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute top-3 right-3 text-white text-2xl"
              aria-label="Close menu"
              onClick={handleClose}
            >
              ×
            </button>
            <nav className="flex flex-col gap-6 text-center w-full">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white font-bold text-xl hover:text-blue-200"
                  onClick={handleClose}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </span>
        </button>
      )}
    </>
  );
}
