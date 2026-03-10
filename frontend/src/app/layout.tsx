import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ghumo Firo India - Explore Rajasthan Tours',
  description: 'Discover the beauty of Rajasthan with our curated tour packages. Book your dream vacation today!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScrollProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
