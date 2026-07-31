import React from 'react';
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { C, R } from '@/src/constants/theme';
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
        ? C.acid
        : tone === 'warning'
          ? C.warning
          : tone === 'muted'
            ? C.muted2
            : C.champagne;
  return (
    <View style={[s.pill, { backgroundColor: color + '18', borderColor: color + '55' }]}>
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
  return <Pill tone={meta.tone}>{meta.label.toUpperCase()}</Pill>;
}

/** Primary = paper (website), secondary = ghost outline */
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
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.82 },
      ]}
    >
      <Text style={secondary ? s.buttonGhostText : s.buttonPrimaryText}>{label}</Text>
    </Pressable>
  );
}

export function StatusDot({ live = true }: { live?: boolean }) {
  return <View style={[s.dot, live && s.dotLive]} />;
}

const s = StyleSheet.create({
  head: { gap: 10, marginBottom: 24 },
  eyebrow: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    color: C.paper,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '500',
    letterSpacing: -1.1,
  },
  copy: {
    color: C.muted,
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 520,
    marginTop: 2,
  },
  card: {
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.lg,
    padding: 18,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: R.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  button: {
    width: '100%',
    minHeight: 52,
    borderRadius: R.md,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: C.paper,
    borderColor: C.paper,
  },
  buttonPrimaryText: {
    color: C.ink,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderColor: C.lineStrong,
  },
  buttonGhostText: {
    color: C.paper,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.muted2,
  },
  dotLive: {
    backgroundColor: C.acid,
    shadowColor: C.acid,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
