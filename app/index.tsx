import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '@/src/constants/theme';
import { useApp } from '@/src/context/AppContext';

export default function Index() {
  const { session, loading } = useApp();
  const [routing, setRouting] = useState(true);

  useEffect(() => {
    if (loading) return;

    let cancelled = false;
    (async () => {
      if (!session) {
        if (!cancelled) {
          router.replace('/auth' as any);
          setRouting(false);
        }
        return;
      }

      const done = await AsyncStorage.getItem('carprise_onboarding_complete');
      if (cancelled) return;
      router.replace((done ? '/(tabs)' : '/onboarding') as any);
      setRouting(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, session]);

  return (
    <LinearGradient colors={['#07080A', '#111018', '#07080A']} style={styles.wrap}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.copy}>DRIVER NETWORK</Text>
      <View style={styles.line} />
      {(loading || routing) && <ActivityIndicator color={C.gold} style={styles.loader} />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 290, height: 130 },
  copy: { color: C.gold, fontWeight: '800', fontSize: 11, letterSpacing: 4, marginTop: 12 },
  line: { width: 42, height: 1, backgroundColor: C.violet, marginTop: 22 },
  loader: { marginTop: 28 },
});
