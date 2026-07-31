import Link from 'next/link';
import { statusTone } from '@/lib/format';

export function Pill({
  children,
  tone = 'gold',
}: {
  children: React.ReactNode;
  tone?: 'gold' | 'violet' | 'success' | 'warning' | 'danger' | 'muted';
}) {
  const map = {
    gold: 'bg-gold/15 text-gold border-gold/40',
    violet: 'bg-violet/15 text-violet border-violet/40',
    success: 'bg-success/15 text-success border-success/40',
    warning: 'bg-warning/15 text-warning border-warning/40',
    danger: 'bg-danger/15 text-danger border-danger/40',
    muted: 'bg-white/5 text-muted border-white/10',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  return <Pill tone={statusTone(status)}>{status.replaceAll('_', ' ')}</Pill>;
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-panel p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-[10px] font-extrabold tracking-[0.18em] text-gold">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-cream">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </Card>
  );
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-extrabold transition disabled:opacity-45';
  const variants = {
    primary: 'bg-gradient-to-r from-gold to-gold2 text-ink hover:opacity-90',
    secondary:
      'border border-gold/50 bg-panel2 text-gold hover:bg-gold/10',
    ghost: 'text-muted hover:text-cream',
    danger: 'bg-danger/20 text-danger border border-danger/40 hover:bg-danger/30',
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function PageHeader({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-gold">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-cream sm:text-4xl">
          {title}
        </h1>
        {copy ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {copy}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Empty({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <Card className="text-center">
      <p className="font-bold text-cream">{title}</p>
      <p className="mt-2 text-sm text-muted">{copy}</p>
    </Card>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-panel2 text-[10px] uppercase tracking-wider text-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-extrabold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line bg-panel">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle text-cream">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
