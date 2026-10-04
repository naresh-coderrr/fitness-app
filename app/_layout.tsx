import 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StartupError } from '../src/components/StartupError';
import { useSession } from '../src/hooks/useSession';
import { queryClient } from '../src/lib/queryClient';
import { getSupabaseStartupError } from '../src/lib/supabase';
import { theme } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, loading } = useSession();
  const startupError = getSupabaseStartupError();
  const ready = !loading || Boolean(startupError);

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (startupError) {
    return (
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <StartupError message={startupError} />
      </QueryClientProvider>
    );
  }

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.color.background },
        }}
      >
        <Stack.Protected guard={session != null}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={session == null}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
