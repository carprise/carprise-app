'use client';

import { BrandShell } from '@/components/shell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BrandShell>{children}</BrandShell>;
}
