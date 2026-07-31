'use client';

import { useRouter } from 'next/navigation';
import { loginAs } from '@/lib/store';
import { Button, Card } from '@/components/ui';

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <Card className="w-full max-w-md shadow-glow">
        <p className="text-[11px] font-extrabold tracking-[0.22em] text-gold">
          CARPRISE OPS
        </p>
        <h1 className="mt-3 text-3xl font-bold">Pilot control centre</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Demo access for the Manchester pilot. In production this uses Supabase
          auth with admin role checks.
        </p>
        <Button
          className="mt-8 w-full"
          onClick={() => {
            loginAs('admin');
            router.push('/admin');
          }}
        >
          Enter as operations
        </Button>
        <Button href="/" variant="ghost" className="mt-3 w-full">
          Back to home
        </Button>
      </Card>
    </div>
  );
}
