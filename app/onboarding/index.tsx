import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '@/src/constants/theme';
import { Button, Card } from '@/src/components/ui';

const STEPS = [
  {
    icon: 'car-sport' as const,
    title: 'Add your vehicle',
    copy: 'Verified vehicles become commerce nodes. We need make, model, registration and photos.',
  },
  {
    icon: 'briefcase' as const,
    title: 'Accept campaigns',
    copy: 'Brands fund sampling, retail and awareness. You deliver the in-journey experience and earn a share.',
  },
  {
    icon: 'camera' as const,
    title: 'Upload evidence',
    copy: 'Installation and journey proof unlocks payment after Carprise ops review.',
  },
  {
    icon: 'wallet' as const,
    title: 'Get paid',
    copy: 'Campaign fees, transaction share and bonuses appear in Earnings once approved.',
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  const finish = async () => {
    await AsyncStorage.setItem('carprise_onboarding_complete', '1');
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={['#07080A', '#111018', '#07080A']} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.eyebrow}>WELCOME TO CARPRISE</Text>
        <Text style={styles.title}>Commercializing Mobility.</Text>
        <Text style={styles.copy}>
          You keep the fare with your mobility platform. Carprise adds a commercial layer — and shares the value with you.
        </Text>

        <Card style={styles.hero}>
          <View style={styles.iconWrap}>
            <Ionicons name={step.icon} size={36} color={C.gold} />
          </View>
          <Text style={styles.stepLabel}>STEP {index + 1} OF {STEPS.length}</Text>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepCopy}>{step.copy}</Text>
        </Card>

        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <Button
          label={last ? 'Enter driver dashboard' : 'Continue'}
          onPress={last ? finish : () => setIndex(index + 1)}
        />
        {!last && (
          <Pressable onPress={finish} style={styles.skip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { padding: 24, paddingTop: 72, paddingBottom: 48, gap: 16 },
  eyebrow: { color: C.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2.4 },
  title: { color: C.text, fontSize: 34, fontWeight: '700', lineHeight: 38 },
  copy: { color: C.muted, fontSize: 15, lineHeight: 22 },
  hero: { padding: 24, marginTop: 12 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: C.gold + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { color: C.violet, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginTop: 22 },
  stepTitle: { color: C.text, fontSize: 24, fontWeight: '700', marginTop: 8 },
  stepCopy: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 10 },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.panel2 },
  dotActive: { width: 22, backgroundColor: C.gold },
  skip: { alignItems: 'center', padding: 14 },
  skipText: { color: C.muted, fontWeight: '700' },
});
