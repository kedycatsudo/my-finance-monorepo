import './globals.css';
import type { ReactNode } from 'react';
import type { FinanceSourceType } from '@/types/finance';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModalProvider } from '@/context/ModalContext';
import AppModal from '@/components/modals/AppModal';
import { ProfileProvider } from '@/context/ProfileContext';
// Import ONLY from your generic context now!
import { FinanceSourceProvider } from '@/context/FinanceSourceContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="gap-6 p-1 bg-[#DCDDE3]">
        <ProfileProvider>
          <AuthProvider>
            <ThemeProvider>
              <ModalProvider>
                <FinanceSourceProvider type="default">
                  {' '}
                  {/* spelling! */}
                  <Header />
                  {children}
                  <AppModal />
                </FinanceSourceProvider>
              </ModalProvider>
            </ThemeProvider>
          </AuthProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
