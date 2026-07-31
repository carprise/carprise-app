import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { C, R } from '@/src/constants/theme';
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
    <LinearGradient colors={[C.bg, C.bgSoft, C.bg]} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.eyebrow}>Welcome to Carprise</Text>
        <Text style={styles.title}>Commercializing Mobility.</Text>
        <Text style={styles.copy}>
          You keep the fare with your mobility platform. Carprise adds a commercial layer — and shares
          the value with you.
        </Text>

        <Card style={styles.hero}>
          <View style={styles.iconWrap}>
            <Ionicons name={step.icon} size={32} color={C.champagne} />
          </View>
          <Text style={styles.stepLabel}>
            Step {index + 1} of {STEPS.length}
          </Text>
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
  eyebrow: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    color: C.paper,
    fontSize: 34,
    fontWeight: '500',
    lineHeight: 38,
    letterSpacing: -1.1,
  },
  copy: { color: C.muted, fontSize: 15, lineHeight: 23 },
  hero: { padding: 24, marginTop: 8 },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: R.md,
    backgroundColor: C.champagne + '14',
    borderWidth: 1,
    borderColor: C.champagne + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    color: C.violet,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 22,
  },
  stepTitle: {
    color: C.paper,
    fontSize: 24,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: -0.4,
  },
  stepCopy: { color: C.muted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 8 },
  dot: { width: 8, height: 2, backgroundColor: C.lineStrong },
  dotActive: { width: 28, backgroundColor: C.champagne },
  skip: { alignItems: 'center', padding: 14 },
  skipText: { color: C.champagne, fontWeight: '700', fontSize: 12 },
});
