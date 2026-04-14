'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header and footer on dashboard and user panel routes
  const hideLayout = pathname?.startsWith('/dashboard') || pathname?.startsWith('/my-account');

  return (
    <>
      {!hideLayout && <Header />}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
