import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Carprise — Commercializing Mobility',
  description:
    'Modular mobility commerce platform for drivers, passengers, brands and fleets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={inter.className}>
      <body className={`${inter.className} min-h-screen bg-ink antialiased`}>{children}</body>
    </html>
  );
}
