import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { AppProvider } from '@/src/context/AppContext';
import { C } from '@/src/constants/theme';

export default function Root() {
  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Light': Inter_300Light,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    if (document.getElementById('carprise-inter')) return;
    const link = document.createElement('link');
    link.id = 'carprise-inter';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = `
      html, body, #root, #root * {
        font-family: Inter, ui-sans-serif, system-ui, sans-serif !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  if (!loaded && Platform.OS !== 'web') return null;

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.bg },
          animation: 'fade',
        }}
      />
    </AppProvider>
  );
}
