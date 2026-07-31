import { RefreshControl, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, R } from '@/src/constants/theme';
import { Card, StatusPill, StatusDot } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Home() {
  const { driver, campaigns, refreshing, refresh } = useApp();
  const active = campaigns.find(c => c.status === 'active' || c.status === 'accepted' || c.status === 'review');
  const invited = campaigns.find(c => c.status === 'invited');
  const potential = campaigns.filter(c => c.status === 'invited').reduce((sum, c) => sum + c.pay, 0);
  const upcoming = campaigns.filter(c => c.status === 'accepted' || c.status === 'active' || c.status === 'review').reduce((sum, c) => sum + c.pay, 0);
  const firstName = driver?.name ?? 'Driver';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.page}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.champagne} />}
    >
      <View style={styles.top}>
        <View>
          <Text style={styles.hello}>Welcome back</Text>
          <Text style={styles.name}>{firstName}.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstName[0]}</Text>
          <View style={styles.dotWrap}>
            <StatusDot />
          </View>
        </View>
      </View>

      {active ? (
        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <StatusPill status={active.status} />
            <Ionicons name="radio" size={20} color={C.violet} />
          </View>
          <Text style={styles.brand}>{active.brand}</Text>
          <Text style={styles.campaign}>{active.title}</Text>
          <Text style={styles.area}>
            {active.area} · {active.end}
          </Text>
          <View style={styles.progress}>
            <View style={[styles.progressFill, { width: `${active.progress}%` }]} />
          </View>
          <View style={styles.heroBottom}>
            <Text style={styles.progressText}>{active.progress}% complete</Text>
            <Pressable onPress={() => router.push(`/campaign/${active.id}`)}>
              <Text style={styles.link}>Open campaign →</Text>
            </Pressable>
          </View>
        </Card>
      ) : (
        <Card style={styles.empty}>
          <Ionicons name="navigate-outline" size={28} color={C.champagne} />
          <Text style={styles.emptyTitle}>No live campaign yet.</Text>
          <Text style={styles.emptyCopy}>
            New invitations will appear here as soon as the Carprise team assigns one to your account.
          </Text>
        </Card>
      )}

      <Text style={styles.section}>Your account</Text>
      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>£{potential.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Potential</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statValue}>£{upcoming.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </Card>
      </View>

      {invited && (
        <Pressable onPress={() => router.push(`/campaign/${invited.id}`)}>
          <Card style={styles.invite}>
            <View style={styles.inviteIcon}>
              <Ionicons name="sparkles" color={C.champagne} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inviteTop}>New invitation</Text>
              <Text style={styles.inviteTitle}>
                {invited.brand}: {invited.title}
              </Text>
              <Text style={styles.inviteCopy}>
                Earn £{invited.pay.toFixed(0)} · Starts {invited.start}
              </Text>
            </View>
            <Ionicons name="chevron-forward" color={C.muted2} size={18} />
          </Card>
        </Pressable>
      )}

      {!driver?.verified && (
        <>
          <Text style={styles.section}>Next action</Text>
          <Card>
            <Text style={styles.actionTitle}>Complete your vehicle profile</Text>
            <Text style={styles.actionCopy}>
              Add your vehicle details and photos so the Carprise team can review your eligibility.
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/vehicle')} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Complete vehicle profile</Text>
            </Pressable>
          </Card>
        </>
      )}

      <Text style={styles.section}>How Carprise works</Text>
      <Card>
        <Text style={styles.actionTitle}>You drive. We commercialise the journey.</Text>
        <Text style={styles.actionCopy}>
          Fares stay with your mobility platform. Carprise adds campaigns, samples and cashless retail
          in-vehicle, then shares the value with you.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  page: { flexGrow: 1, padding: 20, paddingTop: 62, paddingBottom: 120, gap: 16, backgroundColor: C.bg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  hello: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  name: {
    color: C.paper,
    fontSize: 34,
    fontWeight: '500',
    letterSpacing: -1.1,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.panel2,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: C.paper, fontWeight: '600', fontSize: 18 },
  dotWrap: { position: 'absolute', right: 1, bottom: 1 },
  hero: { padding: 22, backgroundColor: C.panel },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginTop: 28,
  },
  campaign: {
    color: C.paper,
    fontSize: 26,
    fontWeight: '500',
    letterSpacing: -0.6,
    marginTop: 8,
  },
  area: { color: C.muted, marginTop: 8, fontSize: 13 },
  progress: { height: 2, backgroundColor: C.line, marginTop: 28 },
  progressFill: { height: 2, backgroundColor: C.violet },
  heroBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  progressText: { color: C.muted2, fontSize: 11 },
  link: { color: C.champagne, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { color: C.paper, fontSize: 20, fontWeight: '500', marginTop: 14, letterSpacing: -0.4 },
  emptyCopy: { color: C.muted, lineHeight: 21, textAlign: 'center', marginTop: 8, maxWidth: 280 },
  section: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1 },
  statValue: { color: C.paper, fontSize: 24, fontWeight: '500', letterSpacing: -0.5 },
  statLabel: {
    color: C.muted2,
    fontSize: 10,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  invite: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  inviteIcon: {
    width: 42,
    height: 42,
    borderRadius: R.md,
    backgroundColor: C.champagne + '14',
    borderWidth: 1,
    borderColor: C.champagne + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteTop: {
    color: C.champagne,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  inviteTitle: { color: C.paper, fontSize: 15, fontWeight: '600', marginTop: 4 },
  inviteCopy: { color: C.muted, fontSize: 12, marginTop: 4 },
  actionTitle: { color: C.paper, fontSize: 18, fontWeight: '500', letterSpacing: -0.3 },
  actionCopy: { color: C.muted, lineHeight: 21, marginTop: 8 },
  actionButton: {
    marginTop: 18,
    backgroundColor: C.paper,
    borderRadius: R.md,
    padding: 15,
    alignItems: 'center',
  },
  actionButtonText: { color: C.ink, fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },
});
