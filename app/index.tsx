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
    <LinearGradient colors={[C.bg, C.bgSoft, C.bg]} style={styles.wrap}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.copy}>DRIVER NETWORK</Text>
      <View style={styles.line} />
      {(loading || routing) && <ActivityIndicator color={C.paper} style={styles.loader} />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  logo: { width: 260, height: 54 },
  copy: {
    color: C.muted,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 3.5,
    marginTop: 14,
  },
  line: {
    width: 48,
    height: 1,
    backgroundColor: C.paper,
    marginTop: 22,
  },
  loader: { marginTop: 28 },
});
