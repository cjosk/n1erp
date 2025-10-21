import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Neon1 ERP | Neonbir',
  description: 'Neonbir üretim ve operasyon ekipleri için ERP sistemi.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-[#f8f9fa] text-gray-900">{children}</body>
    </html>
  );
}
