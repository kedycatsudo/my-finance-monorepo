import './globals.css';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ModalProvider } from '@/context/ModalContext';
import AppModal from '@/components/modals/AppModal';
import { ProfileProvider } from '@/context/ProfileContext';
// Import ONLY from your generic context now!
import {
  InvestmentsProvider,
  IncomesProvider,
  OutcomesProvider,
} from '@/context/FinanceGenericContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="gap-6 p-1 bg-[#DCDDE3]">
        <ProfileProvider>
          <AuthProvider>
            <ThemeProvider>
              <ModalProvider>
                <InvestmentsProvider>
                  <IncomesProvider>
                    <OutcomesProvider>
                      {' '}
                      {/* spelling! */}
                      <Header />
                      {children}
                      <AppModal />
                    </OutcomesProvider>
                  </IncomesProvider>
                </InvestmentsProvider>
              </ModalProvider>
            </ThemeProvider>
          </AuthProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
