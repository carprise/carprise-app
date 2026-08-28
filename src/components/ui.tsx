import React from 'react';
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { C, R } from '@/src/constants/theme';
import { FONT_FAMILY } from '@/src/lib/fonts';
import type { CampaignStatus } from '@/src/types';

export function ScreenTitle({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <View style={s.head}>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={s.title}>{title}</Text>
      {copy ? <Text style={s.copy}>{copy}</Text> : null}
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Pill({
  children,
  tone = 'gold',
}: {
  children: React.ReactNode;
  tone?: 'gold' | 'violet' | 'green' | 'muted' | 'warning';
}) {
  const color =
    tone === 'violet'
      ? C.violet
      : tone === 'green'
        ? C.success
        : tone === 'warning'
          ? C.warning
          : tone === 'muted'
            ? C.muted2
            : C.champagne;
  return (
    <View style={[s.pill, { borderColor: color + '40', backgroundColor: color + '12' }]}>
      <Text style={[s.pillText, { color }]}>{children}</Text>
    </View>
  );
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
  return <Pill tone={meta.tone}>{meta.label}</Pill>;
}

export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress?: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary ? s.buttonGhost : s.buttonPrimary,
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.88 },
      ]}
    >
      <Text style={secondary ? s.buttonGhostText : s.buttonPrimaryText}>{label}</Text>
    </Pressable>
  );
}

export function StatusDot({ live = true }: { live?: boolean }) {
  return <View style={[s.dot, live && s.dotLive]} />;
}

export function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View style={s.metric}>
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={s.metricValue}>{value}</Text>
      {hint ? <Text style={s.metricHint}>{hint}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  head: { gap: 10, marginBottom: 26 },
  eyebrow: {
    fontFamily: FONT_FAMILY,
    color: C.champagne,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONT_FAMILY,
    color: C.paper,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '400',
    letterSpacing: -0.8,
  },
  copy: {
    fontFamily: FONT_FAMILY,
    color: C.muted,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 400,
  },
  card: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.lg,
    padding: 20,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: R.pill,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  pillText: {
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  button: {
    width: '100%',
    minHeight: 50,
    borderRadius: R.md,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: C.paper,
    borderColor: C.paper,
  },
  buttonPrimaryText: {
    fontFamily: FONT_FAMILY,
    color: C.ink,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderColor: C.lineStrong,
  },
  buttonGhostText: {
    fontFamily: FONT_FAMILY,
    color: C.paper,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.muted2,
  },
  dotLive: {
    backgroundColor: C.success,
  },
  metric: {
    flex: 1,
    minWidth: 96,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.lg,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  metricLabel: {
    fontFamily: FONT_FAMILY,
    color: C.muted2,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontFamily: FONT_FAMILY,
    color: C.paper,
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: -0.5,
    marginTop: 8,
  },
  metricHint: {
    fontFamily: FONT_FAMILY,
    color: C.muted,
    fontSize: 11,
    marginTop: 6,
    lineHeight: 15,
  },
});
