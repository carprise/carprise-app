import { RefreshControl, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { C } from '@/src/constants/theme';
import { Card, Pill, ScreenTitle } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Campaigns() {
  const { campaigns, refreshing, refresh } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.gold} />}>
      <ScreenTitle eyebrow="DRIVER CAMPAIGNS" title="Your journeys." copy="Invitations, live activity and completed campaigns in one place." />
      {campaigns.length === 0 && <Card><Text style={styles.emptyTitle}>No campaigns assigned yet.</Text><Text style={styles.emptyCopy}>The Carprise team will add suitable invitations to your account as pilot campaigns become available.</Text></Card>}
      {campaigns.filter(c => c.status !== 'declined').map(c => (
        <Pressable key={c.assignmentId} onPress={() => router.push(`/campaign/${c.id}`)}>
          <Card style={styles.card}>
            <View style={styles.row}><Pill tone={c.status === 'active' ? 'green' : c.status === 'invited' ? 'violet' : 'muted'}>{c.status.toUpperCase()}</Pill><Text style={styles.pay}>£{c.pay.toFixed(0)}</Text></View>
            <Text style={styles.brand}>{c.brand}</Text><Text style={styles.title}>{c.title}</Text><Text style={styles.meta}>{c.area} · {c.start} to {c.end}</Text>
            {c.status === 'active' && <View style={styles.progress}><View style={[styles.fill, { width: `${c.progress}%` }]} /></View>}
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ page: { padding: 20, paddingTop: 62, paddingBottom: 120, gap: 13 }, card: { padding: 20 }, row: { flexDirection: 'row', justifyContent: 'space-between' }, pay: { color: C.gold, fontSize: 18, fontWeight: '800' }, brand: { color: C.gold, fontSize: 10, fontWeight: '900', letterSpacing: 3, marginTop: 24 }, title: { color: C.text, fontSize: 21, fontWeight: '700', marginTop: 5 }, meta: { color: C.muted, fontSize: 12, marginTop: 8 }, progress: { height: 4, backgroundColor: '#292C34', marginTop: 20 }, fill: { height: 4, backgroundColor: C.violet }, emptyTitle: { color: C.text, fontSize: 18, fontWeight: '700' }, emptyCopy: { color: C.muted, lineHeight: 20, marginTop: 8 } });
