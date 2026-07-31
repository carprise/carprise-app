import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn('Supabase environment variables are missing. Add the project URL and publishable key to .env.');
}

// On web, pick up tokens from the email confirmation / magic-link redirect URL.
const isWeb = Platform.OS === 'web';

export const supabase = url && key
  ? createClient(url, key, {
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
