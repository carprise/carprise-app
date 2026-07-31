import { RefreshControl, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { C } from '@/src/constants/theme';
import { Card, ScreenTitle, StatusPill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Campaigns() {
  const { campaigns, refreshing, refresh } = useApp();
  const list = campaigns.filter(c => c.status !== 'declined');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.page}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.champagne} />}
    >
      <ScreenTitle
        eyebrow="Commercial work"
        title="Campaigns & activations."
        copy="Brand work assigned to your vehicle: invitations, live activity, evidence and completion."
      />

      {list.length === 0 && (
        <Card>
          <Text style={styles.emptyTitle}>No campaigns assigned yet.</Text>
          <Text style={styles.emptyCopy}>
            The Carprise team will add suitable invitations to your account as pilot campaigns become available.
          </Text>
        </Card>
      )}

      {list.map(c => (
        <Pressable key={c.assignmentId} onPress={() => router.push(`/campaign/${c.id}`)}>
          <Card style={styles.card}>
            <View style={styles.row}>
              <StatusPill status={c.status} />
              <Text style={styles.pay}>£{c.pay.toFixed(0)}</Text>
            </View>
            <Text style={styles.brand}>{c.brand}</Text>
            <Text style={styles.title}>{c.title}</Text>
            <Text style={styles.meta}>
              {c.area} · {c.start} to {c.end}
            </Text>
            {c.status !== 'invited' && (
              <>
                <View style={styles.progress}>
                  <View style={[styles.fill, { width: `${c.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{c.progress}% complete</Text>
              </>
            )}
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  page: { flexGrow: 1, padding: 20, paddingTop: 62, paddingBottom: 120, gap: 14, backgroundColor: C.bg },
  card: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pay: { color: C.champagne, fontSize: 18, fontWeight: '600', letterSpacing: -0.3 },
  brand: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginTop: 22,
  },
  title: {
    color: C.paper,
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: -0.5,
    marginTop: 6,
  },
  meta: { color: C.muted, fontSize: 13, marginTop: 8 },
  progress: { height: 2, overflow: 'hidden', backgroundColor: C.line, marginTop: 20 },
  fill: { height: 2, backgroundColor: C.violet },
  progressText: { color: C.muted2, fontSize: 11, marginTop: 8 },
  emptyTitle: { color: C.paper, fontSize: 18, fontWeight: '500', letterSpacing: -0.3 },
  emptyCopy: { color: C.muted, lineHeight: 21, marginTop: 8 },
});
