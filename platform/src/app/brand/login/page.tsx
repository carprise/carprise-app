'use client';

import { useRouter } from 'next/navigation';
import { brands } from '@/lib/demo-data';
import { loginAs } from '@/lib/store';
import { Button, Card } from '@/components/ui';

export default function BrandLoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <Card className="w-full max-w-md shadow-glow">
        <p className="text-[11px] font-extrabold tracking-[0.22em] text-gold">
          BRAND PORTAL
        </p>
        <h1 className="mt-3 text-3xl font-bold">Campaign access</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Demo sign-in as a pilot brand. Production uses Supabase auth linked to
          brand owner profiles.
        </p>
        <div className="mt-6 space-y-2">
          {brands.map((b) => (
            <Button
              key={b.id}
              variant="secondary"
              className="w-full !justify-start"
              onClick={() => {
                loginAs('brand', b.id);
                router.push('/brand');
              }}
            >
              Continue as {b.name}
            </Button>
          ))}
        </div>
        <Button href="/" variant="ghost" className="mt-4 w-full">
          Back to home
        </Button>
      </Card>
    </div>
  );
}
