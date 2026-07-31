'use client';

import { useSyncExternalStore } from 'react';
import type { Assignment, EvidenceItem, Transaction } from './types';
import {
  assignments as seedAssignments,
  evidence as seedEvidence,
  transactions as seedTransactions,
} from './demo-data';

type SessionRole = 'admin' | 'brand' | null;

type PlatformState = {
  role: SessionRole;
  brandId: string | null;
  assignments: Assignment[];
  evidence: EvidenceItem[];
  transactions: Transaction[];
  cart: { productId: string; qty: number }[];
  claimedSamples: string[];
  notices: string[];
};

const listeners = new Set<() => void>();

let state: PlatformState = {
  role: null,
  brandId: null,
  assignments: [...seedAssignments],
  evidence: [...seedEvidence],
  transactions: [...seedTransactions],
  cart: [],
  claimedSamples: [],
  notices: [],
};

function emit() {
  listeners.forEach((l) => l());
}

function setState(partial: Partial<PlatformState>) {
  state = { ...state, ...partial };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        'carprise_platform_session',
        JSON.stringify({ role: state.role, brandId: state.brandId })
      );
    } catch {
      /* ignore */
    }
  }
  emit();
}

export function hydrateSession() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('carprise_platform_session');
    if (!raw) return;
    const parsed = JSON.parse(raw) as { role: SessionRole; brandId: string | null };
    state = { ...state, role: parsed.role, brandId: parsed.brandId };
    emit();
  } catch {
    /* ignore */
  }
}

export function loginAs(role: SessionRole, brandId: string | null = null) {
  setState({ role, brandId: role === 'brand' ? brandId ?? 'brand-1' : null });
}

export function logout() {
  setState({ role: null, brandId: null });
}

export function approveEvidence(id: string) {
  setState({
    evidence: state.evidence.map((e) =>
      e.id === id ? { ...e, reviewStatus: 'approved' } : e
    ),
    notices: [`Evidence ${id} approved`],
  });
}

export function rejectEvidence(id: string) {
  setState({
    evidence: state.evidence.map((e) =>
      e.id === id ? { ...e, reviewStatus: 'rejected' } : e
    ),
    notices: [`Evidence ${id} rejected`],
  });
}

export function updateAssignmentStatus(id: string, status: Assignment['status']) {
  setState({
    assignments: state.assignments.map((a) =>
      a.id === id ? { ...a, status, progress: status === 'invited' ? 0 : Math.max(a.progress, 10) } : a
    ),
  });
}

export function addToCart(productId: string) {
  const existing = state.cart.find((c) => c.productId === productId);
  if (existing) {
    setState({
      cart: state.cart.map((c) =>
        c.productId === productId ? { ...c, qty: c.qty + 1 } : c
      ),
    });
  } else {
    setState({ cart: [...state.cart, { productId, qty: 1 }] });
  }
}

export function clearCart() {
  setState({ cart: [] });
}

export function claimSample(productId: string) {
  if (state.claimedSamples.includes(productId)) return false;
  setState({ claimedSamples: [...state.claimedSamples, productId] });
  return true;
}

export function completeCheckout(opts: {
  vehicleId: string;
  city: string;
  items: { productId: string; name: string; amountPence: number; campaignId?: string; type: Transaction['type'] }[];
}) {
  const now = new Date().toISOString();
  const newTx: Transaction[] = opts.items.map((item, i) => ({
    id: `tx-live-${Date.now()}-${i}`,
    vehicleId: opts.vehicleId,
    productName: item.name,
    campaignId: item.campaignId,
    amountPence: item.amountPence,
    platformFeePence: Math.round(item.amountPence * 0.2),
    driverSharePence:
      item.type === 'sample'
        ? 50
        : Math.round(item.amountPence * 0.3),
    type: item.type,
    status: 'completed',
    createdAt: now,
    city: opts.city,
  }));
  setState({
    transactions: [...newTx, ...state.transactions],
    cart: [],
    notices: [`Checkout complete · ${newTx.length} item(s)`],
  });
  return newTx;
}

export function getState() {
  return state;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePlatformStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}
