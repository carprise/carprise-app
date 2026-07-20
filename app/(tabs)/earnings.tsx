import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { C } from '@/src/constants/theme';
import { Card, ScreenTitle, Pill, StatusPill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

const isCompleted = (status: string) => status === 'complete' || status === 'completed';

export default function Earnings() {
  const { campaigns } = useApp();
  const potential = campaigns.filter(c => c.status === 'invited');
  const upcoming = campaigns.filter(c => c.status === 'accepted' || c.status === 'active' || c.status === 'review');
  const earned = campaigns.filter(c => isCompleted(c.status));
  const potentialTotal = potential.reduce((sum, c) => sum + c.pay, 0);
  const upcomingTotal = upcoming.reduce((sum, c) => sum + c.pay, 0);
  const earnedTotal = earned.reduce((sum, c) => sum + c.pay, 0);
  const history = [...upcoming, ...earned];

  return <ScrollView contentContainerStyle={styles.page}>
    <ScreenTitle eyebrow="EARNINGS" title="Clear. Tracked. Paid." copy="Invitations stay separate from confirmed campaign income, so you always know what is potential and what is secured." />
    <Card style={styles.total}><Text style={styles.label}>TOTAL EARNED</Text><Text style={styles.amount}>£{earnedTotal.toFixed(2)}</Text><Text style={styles.muted}>Across {earned.length} completed campaign{earned.length === 1 ? '' : 's'}</Text></Card>
    <View style={styles.grid}>
      <Card style={styles.metric}><Text style={styles.label}>POTENTIAL</Text><Text style={styles.small}>£{potentialTotal.toFixed(0)}</Text><Text style={styles.caption}>Invitations not yet accepted</Text></Card>
      <Card style={styles.metric}><Text style={styles.label}>UPCOMING</Text><Text style={styles.small}>£{upcomingTotal.toFixed(0)}</Text><Text style={styles.caption}>Accepted, active or in review</Text></Card>
      <Card style={styles.metric}><Text style={styles.label}>EARNED</Text><Text style={styles.small}>£{earnedTotal.toFixed(0)}</Text><Text style={styles.caption}>Completed campaigns</Text></Card>
    </View>
    {potential.length > 0 && <><Text style={styles.section}>POTENTIAL EARNINGS</Text>{potential.map(c => <Card key={c.assignmentId} style={styles.payment}><View style={styles.paymentCopy}><Text style={styles.pTitle}>{c.brand} · {c.title}</Text><Text style={styles.muted}>Accept the invitation to move this into upcoming earnings.</Text></View><View style={styles.right}><Text style={styles.pAmount}>£{c.pay.toFixed(0)}</Text><Pill tone="violet">POTENTIAL</Pill></View></Card>)}</>}
    <Text style={styles.section}>CONFIRMED &amp; COMPLETED</Text>
    {history.length === 0 && <Card><Text style={styles.pTitle}>No confirmed earnings yet</Text><Text style={styles.muted}>Accepted campaigns will appear here, while invitations remain under potential earnings.</Text></Card>}
    {history.map(c => <Card key={c.assignmentId} style={styles.payment}><View style={styles.paymentCopy}><Text style={styles.pTitle}>{c.brand} · {c.title}</Text><Text style={styles.muted}>{isCompleted(c.status) ? 'Campaign completed' : 'Due after completion and evidence approval'}</Text></View><View style={styles.right}><Text style={styles.pAmount}>£{c.pay.toFixed(0)}</Text><StatusPill status={c.status} /></View></Card>)}
    <Card><Text style={styles.pTitle}>Payment details</Text><Text style={styles.muted}>Payments are processed after campaign activity and final evidence checks have been approved.</Text></Card>
  </ScrollView>;
}

const styles = StyleSheet.create({ page: { padding: 20, paddingTop: 62, paddingBottom: 120, gap: 13 }, total: { padding: 24 }, label: { color: C.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2 }, amount: { color: C.text, fontSize: 40, fontWeight: '700', marginTop: 12 }, muted: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 5 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, metric: { flexGrow: 1, flexBasis: 150 }, small: { color: C.text, fontSize: 24, fontWeight: '700', marginTop: 8 }, caption: { color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 6 }, section: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 12 }, payment: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }, paymentCopy: { flex: 1 }, right: { alignItems: 'flex-end' }, pTitle: { color: C.text, fontSize: 14, fontWeight: '700' }, pAmount: { color: C.text, fontSize: 18, fontWeight: '800', marginBottom: 7 } });
