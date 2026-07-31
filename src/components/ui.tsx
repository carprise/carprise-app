import React from 'react';
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, R } from '@/src/constants/theme';
import type { CampaignStatus } from '@/src/types';

export function ScreenTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <View style={s.head}><Text style={s.eyebrow}>{eyebrow}</Text><Text style={s.title}>{title}</Text>{copy ? <Text style={s.copy}>{copy}</Text> : null}</View>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Pill({ children, tone = 'gold' }: { children: React.ReactNode; tone?: 'gold' | 'violet' | 'green' | 'muted' | 'warning' }) {
  const bg = tone === 'violet' ? C.violet : tone === 'green' ? C.success : tone === 'warning' ? C.warning : tone === 'muted' ? C.muted : C.gold;
  return <View style={[s.pill, { backgroundColor: bg + '22', borderColor: bg + '55' }]}><Text style={[s.pillText, { color: bg }]}>{children}</Text></View>;
}

export function campaignStatus(status: CampaignStatus) {
  if (status === 'invited') return { label: 'Invited', tone: 'violet' as const };
  if (status === 'accepted') return { label: 'Accepted', tone: 'gold' as const };
  if (status === 'active') return { label: 'Active', tone: 'green' as const };
  if (status === 'review') return { label: 'In review', tone: 'warning' as const };
  if (status === 'complete' || status === 'completed') return { label: 'Completed', tone: 'green' as const };
  return { label: 'Declined', tone: 'muted' as const };
}

export function StatusPill({ status }: { status: CampaignStatus }) {
  const meta = campaignStatus(status);
  return <Pill tone={meta.tone}>{meta.label.toUpperCase()}</Pill>;
}

export function Button({ label, onPress, secondary = false, disabled = false }: { label: string; onPress?: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable disabled={disabled || !onPress} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.button2, (pressed || disabled) && { opacity: disabled ? 0.45 : 0.75 }]}>
    {secondary
      ? <Text style={s.button2Text}>{label}</Text>
      : <LinearGradient colors={[C.gold, C.gold2]} style={s.gradient}><Text style={s.buttonText}>{label}</Text></LinearGradient>}
  </Pressable>;
}

const s = StyleSheet.create({
  head: { gap: 8, marginBottom: 22 },
  eyebrow: { color: C.gold, fontSize: 11, fontWeight: '800', letterSpacing: 2.1 },
  title: { color: C.text, fontSize: 34, lineHeight: 38, fontWeight: '700', letterSpacing: -1.2 },
  copy: { color: C.muted, fontSize: 15, lineHeight: 23, maxWidth: 520 },
  card: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, borderRadius: R.lg, padding: 18 },
  pill: { alignSelf: 'flex-start', borderRadius: 99, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  pillText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  button: { width: '100%', minHeight: 50, borderRadius: 15, overflow: 'hidden', alignSelf: 'stretch', justifyContent: 'center' },
  gradient: { minHeight: 50, paddingVertical: 15, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#111', fontSize: 14, fontWeight: '800' },
  button2: { backgroundColor: C.panel2, borderWidth: 1, borderColor: C.gold + '88', paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  button2Text: { color: C.gold, fontSize: 14, fontWeight: '800' },
});
