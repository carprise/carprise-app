'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  hydrateSession,
  logout,
  usePlatformStore,
} from '@/lib/store';

const adminNav = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/drivers', label: 'Drivers' },
  { href: '/admin/vehicles', label: 'Vehicles' },
  { href: '/admin/campaigns', label: 'Campaigns' },
  { href: '/admin/evidence', label: 'Evidence' },
  { href: '/admin/transactions', label: 'Commerce' },
  { href: '/admin/economics', label: 'Unit economics' },
];

const brandNav = [
  { href: '/brand', label: 'Overview' },
  { href: '/brand/campaigns', label: 'Campaigns' },
  { href: '/brand/products', label: 'Products' },
  { href: '/brand/analytics', label: 'Analytics' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = usePlatformStore();

  useEffect(() => {
    hydrateSession();
  }, []);

  if (role !== 'admin' && pathname !== '/admin/login') {
    return (
      <Gate
        title="Ops access required"
        copy="Sign in to the Carprise operations console to manage the pilot network."
        href="/admin/login"
        cta="Open admin login"
      />
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <Shell
      title="Carprise Ops"
      subtitle="Pilot control centre"
      nav={adminNav}
      pathname={pathname}
      onLogout={logout}
      home="/"
    >
      {children}
    </Shell>
  );
}

export function BrandShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = usePlatformStore();

  useEffect(() => {
    hydrateSession();
  }, []);

  if (role !== 'brand' && pathname !== '/brand/login') {
    return (
      <Gate
        title="Brand portal"
        copy="Sign in to manage campaigns, sampling and journey performance."
        href="/brand/login"
        cta="Open brand login"
      />
    );
  }

  if (pathname === '/brand/login') return <>{children}</>;

  return (
    <Shell
      title="Brand Portal"
      subtitle="Campaign & commerce"
      nav={brandNav}
      pathname={pathname}
      onLogout={logout}
      home="/"
    >
      {children}
    </Shell>
  );
}

function Gate({
  title,
  copy,
  href,
  cta,
}: {
  title: string;
  copy: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="max-w-md rounded-3xl border border-line bg-panel p-8 text-center">
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-gold">
          CARPRISE
        </p>
        <h1 className="mt-3 text-2xl font-bold text-cream">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p>
        <Link
          href={href}
          className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-gold to-gold2 px-5 py-3 text-sm font-extrabold text-ink"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

function Shell({
  title,
  subtitle,
  nav,
  pathname,
  children,
  onLogout,
  home,
}: {
  title: string;
  subtitle: string;
  nav: { href: string; label: string }[];
  pathname: string;
  children: React.ReactNode;
  onLogout: () => void;
  home: string;
}) {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-line p-6 md:block">
          <Link href={home} className="block">
            <p className="text-[10px] font-extrabold tracking-[0.22em] text-gold">
              CARPRISE
            </p>
            <p className="mt-1 text-lg font-bold">{title}</p>
            <p className="text-xs text-muted">{subtitle}</p>
          </Link>
          <nav className="mt-10 space-y-1">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== nav[0].href && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-violet/20 text-cream'
                      : 'text-muted hover:bg-white/5 hover:text-cream'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={onLogout}
            className="mt-10 text-sm font-semibold text-muted hover:text-gold"
          >
            Sign out
          </button>
        </aside>
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-line px-4 py-4 md:hidden">
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-gold">
                CARPRISE
              </p>
              <p className="font-bold">{title}</p>
            </div>
            <button onClick={onLogout} className="text-sm text-muted">
              Sign out
            </button>
          </header>
          <div className="flex gap-2 overflow-x-auto border-b border-line px-4 py-2 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <main className="p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
