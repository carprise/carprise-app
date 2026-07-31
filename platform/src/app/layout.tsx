import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en-GB">
      <body className="min-h-screen bg-ink antialiased">{children}</body>
    </html>
  );
}
