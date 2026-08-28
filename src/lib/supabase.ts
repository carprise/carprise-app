import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const REQUEST_TIMEOUT_MS = 12000;

if (!url || !key) {
  console.warn('Supabase environment variables are missing. Add the project URL and publishable key to .env.');
}

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const parent = init?.signal;
  if (parent) {
    if (parent.aborted) controller.abort();
    else parent.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/** Always settle, even if a hung auth request never returns. */
export function withTimeout<T>(promise: Promise<T>, ms = REQUEST_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Login request timed out'));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

// On web, pick up tokens from the email confirmation / magic-link redirect URL.
const isWeb = Platform.OS === 'web';

export const supabase = url && key
  ? createClient(url, key, {
      global: { fetch: fetchWithTimeout },
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: isWeb,
      },
    })
  : null;

export const backendReady = Boolean(supabase);

/** Where auth emails should send users after confirm / reset */
export const AUTH_REDIRECT_URL =
  process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL?.trim() ||
  (isWeb && typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/drive`
    : 'https://www.carprise.co.uk/drive');
