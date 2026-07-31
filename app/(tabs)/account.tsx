import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, R, Space } from '@/src/constants/theme';
import { Card, ScreenTitle, Button } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function AccountScreen() {
  const { driver, vehicle, signOut } = useApp();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page}>
      <ScreenTitle
        eyebrow="Account"
        title="Driver profile."
        copy="Vehicle, payouts and security for your commercial operations account."
      />

      <Card style={styles.identity}>
        <Text style={styles.name}>
          {[driver?.firstName, driver?.lastName].filter(Boolean).join(' ') || 'Carprise driver'}
        </Text>
        <Text style={styles.email}>{driver?.email}</Text>
        <Text style={styles.meta}>
          Rating {driver?.rating?.toFixed(1) ?? '5.0'} ·{' '}
          {driver?.verified ? 'Vehicle verified' : 'Vehicle pending review'}
        </Text>
      </Card>

      <Text style={styles.section}>Operations</Text>
      <LinkRow
        icon="car-sport-outline"
        title="Vehicle"
        subtitle={
          vehicle
            ? `${vehicle.registration || 'No reg'} · ${vehicle.verificationStatus}`
            : 'Add vehicle details'
        }
        onPress={() => router.push('/(tabs)/vehicle')}
      />
      <LinkRow
        icon="wallet-outline"
        title="Earnings history"
        subtitle="Campaign pay and commerce share"
        onPress={() => router.push('/(tabs)/earnings')}
      />
      <LinkRow
        icon="person-outline"
        title="Profile & documents"
        subtitle="Contact details, bank, licence"
        onPress={() => router.push('/(tabs)/profile')}
      />

      <Text style={styles.section}>About this app</Text>
      <Card>
        <Text style={styles.aboutTitle}>Driver operations</Text>
        <Text style={styles.aboutCopy}>
          This app is for inventory, stock, routes, campaigns and analytics. Passengers use a separate
          experience for ordering, personalisation and cabin controls.
        </Text>
      </Card>

      <View style={{ marginTop: 8 }}>
        <Button
          label="Sign out"
          secondary
          onPress={async () => {
            await signOut();
            router.replace('/auth' as any);
          }}
        />
      </View>
    </ScrollView>
  );
}

function LinkRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.linkRow}>
        <View style={styles.linkIcon}>
          <Ionicons name={icon} size={18} color={C.champagne} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.linkTitle}>{title}</Text>
          <Text style={styles.linkSub}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={C.muted2} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  page: {
    flexGrow: 1,
    paddingHorizontal: Space.pageX,
    paddingTop: Space.pageTop,
    paddingBottom: Space.pageBottom,
    gap: 12,
  },
  identity: { marginBottom: 4 },
  name: { color: C.paper, fontSize: 22, fontWeight: '400', letterSpacing: -0.4 },
  email: { color: C.muted, marginTop: 6, fontSize: 14 },
  meta: { color: C.muted2, marginTop: 8, fontSize: 12 },
  section: {
    color: C.muted2,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 2,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: { color: C.paper, fontSize: 15, fontWeight: '500' },
  linkSub: { color: C.muted, fontSize: 12, marginTop: 3 },
  aboutTitle: { color: C.paper, fontSize: 15, fontWeight: '500' },
  aboutCopy: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
});
