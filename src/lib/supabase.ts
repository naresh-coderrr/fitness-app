import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { AppState } from 'react-native';

const SECURE_STORE_LIMIT = 2048;

export class MissingSupabaseConfigError extends Error {
  constructor() {
    super(
      'The app is missing its server settings. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file, then restart.',
    );
    this.name = 'MissingSupabaseConfigError';
  }
}

const storage = {
  async getItem(key: string): Promise<string | null> {
    const fromSecure = await SecureStore.getItemAsync(key);
    if (fromSecure != null) {
      return fromSecure;
    }
    return AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (value.length > SECURE_STORE_LIMIT) {
      console.warn(
        'Session is larger than SecureStore can hold; saving it with AsyncStorage instead.',
      );
      await AsyncStorage.setItem(key, value);
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // Key may not exist in SecureStore yet.
      }
      return;
    }

    await SecureStore.setItemAsync(key, value);
    await AsyncStorage.removeItem(key);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Key may only exist in one store.
    }
  },
};

function readConfig(): { url: string; anonKey: string } {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new MissingSupabaseConfigError();
  }
  return { url, anonKey };
}

let supabase: SupabaseClient | null = null;
let startupError: MissingSupabaseConfigError | null = null;

try {
  const { url, anonKey } = readConfig();
  supabase = createClient(url, anonKey, {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  AppState.addEventListener('change', (state) => {
    if (!supabase) {
      return;
    }
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
} catch (error) {
  startupError =
    error instanceof MissingSupabaseConfigError
      ? error
      : new MissingSupabaseConfigError();
}

export function getSupabase(): SupabaseClient | null {
  return supabase;
}

export function getSupabaseStartupError(): string | null {
  return startupError?.message ?? null;
}
