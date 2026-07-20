import { RefreshControl, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/src/constants/theme';
import { Card, StatusPill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Home() {
  const { driver, campaigns, refreshing, refresh } = useApp();
  const active = campaigns.find(c => c.status === 'active' || c.status === 'accepted' || c.status === 'review');
  const invited = campaigns.find(c => c.status === 'invited');
  const potential = campaigns.filter(c => c.status === 'invited').reduce((sum, c) => sum + c.pay, 0);
  const upcoming = campaigns.filter(c => c.status === 'accepted' || c.status === 'active' || c.status === 'review').reduce((sum, c) => sum + c.pay, 0);
  const firstName = driver?.name ?? 'Driver';

  return (
    <ScrollView contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.gold} />}>
      <View style={styles.top}>
        <View><Text style={styles.hello}>WELCOME BACK</Text><Text style={styles.name}>{firstName}.</Text></View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{firstName[0]}</Text><View style={styles.dot} /></View>
      </View>

      {active ? (
        <Card style={styles.hero}>
          <View style={styles.heroTop}><StatusPill status={active.status} /><Ionicons name="radio" size={22} color={C.violet} /></View>
          <Text style={styles.brand}>{active.brand}</Text><Text style={styles.campaign}>{active.title}</Text>
          <Text style={styles.area}>{active.area} · {active.end}</Text>
          <View style={styles.progress}><View style={[styles.progressFill, { width: `${active.progress}%` }]} /></View>
          <View style={styles.heroBottom}><Text style={styles.progressText}>{active.progress}% complete</Text><Pressable onPress={() => router.push(`/campaign/${active.id}`)}><Text style={styles.link}>Open campaign →</Text></Pressable></View>
        </Card>
      ) : (
        <Card style={styles.empty}><Ionicons name="navigate-outline" size={28} color={C.gold} /><Text style={styles.emptyTitle}>No live campaign yet.</Text><Text style={styles.emptyCopy}>New invitations will appear here as soon as the Carprise team assigns one to your account.</Text></Card>
      )}

      <Text style={styles.section}>YOUR ACCOUNT</Text>
      <View style={styles.stats}>
        <Card style={styles.stat}><Text style={styles.statValue}>£{potential.toFixed(0)}</Text><Text style={styles.statLabel}>Potential earnings</Text></Card>
        <Card style={styles.stat}><Text style={styles.statValue}>£{upcoming.toFixed(0)}</Text><Text style={styles.statLabel}>Upcoming earnings</Text></Card>
      </View>

      {invited && <Pressable onPress={() => router.push(`/campaign/${invited.id}`)}><Card style={styles.invite}><View style={styles.inviteIcon}><Ionicons name="sparkles" color={C.gold} size={21} /></View><View style={{ flex: 1 }}><Text style={styles.inviteTop}>NEW INVITATION</Text><Text style={styles.inviteTitle}>{invited.brand}: {invited.title}</Text><Text style={styles.inviteCopy}>Earn £{invited.pay.toFixed(0)} · Starts {invited.start}</Text></View><Ionicons name="chevron-forward" color={C.muted} size={20} /></Card></Pressable>}

      {!driver?.verified && <><Text style={styles.section}>NEXT ACTION</Text><Card><Text style={styles.actionTitle}>Complete your vehicle profile</Text><Text style={styles.actionCopy}>Add your vehicle details and photos so the Carprise team can review your eligibility.</Text><Pressable onPress={() => router.push('/(tabs)/vehicle')} style={styles.actionButton}><Text style={styles.actionButtonText}>Complete vehicle profile</Text></Pressable></Card></>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingTop: 62, paddingBottom: 120, gap: 16 }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, hello: { color: C.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2 }, name: { color: C.text, fontSize: 34, fontWeight: '700' }, avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.panel2, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: C.text, fontWeight: '800', fontSize: 18 }, dot: { position: 'absolute', right: 1, bottom: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: C.success, borderWidth: 2, borderColor: C.bg }, hero: { padding: 22, backgroundColor: '#12131A' }, heroTop: { flexDirection: 'row', justifyContent: 'space-between' }, brand: { color: C.gold, fontSize: 12, fontWeight: '900', letterSpacing: 4, marginTop: 32 }, campaign: { color: C.text, fontSize: 27, fontWeight: '700', marginTop: 6 }, area: { color: C.muted, marginTop: 8 }, progress: { height: 4, backgroundColor: '#292C34', marginTop: 28, borderRadius: 9 }, progressFill: { height: 4, backgroundColor: C.violet, borderRadius: 9 }, heroBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }, progressText: { color: C.muted, fontSize: 11 }, link: { color: C.gold, fontSize: 11, fontWeight: '700' }, empty: { alignItems: 'center', paddingVertical: 30 }, emptyTitle: { color: C.text, fontSize: 20, fontWeight: '700', marginTop: 14 }, emptyCopy: { color: C.muted, lineHeight: 20, textAlign: 'center', marginTop: 8 }, section: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 10 }, stats: { flexDirection: 'row', gap: 12 }, stat: { flex: 1 }, statValue: { color: C.text, fontSize: 24, fontWeight: '700' }, statLabel: { color: C.muted, fontSize: 11, marginTop: 5 }, invite: { flexDirection: 'row', alignItems: 'center', gap: 13 }, inviteIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: C.gold + '16', alignItems: 'center', justifyContent: 'center' }, inviteTop: { color: C.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 }, inviteTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginTop: 4 }, inviteCopy: { color: C.muted, fontSize: 11, marginTop: 4 }, actionTitle: { color: C.text, fontSize: 18, fontWeight: '700' }, actionCopy: { color: C.muted, lineHeight: 20, marginTop: 8 }, actionButton: { marginTop: 18, backgroundColor: C.gold, borderRadius: 14, padding: 14, alignItems: 'center' }, actionButtonText: { color: '#111', fontWeight: '800' },
});
