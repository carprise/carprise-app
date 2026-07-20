import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { C } from '@/src/constants/theme';
import { Card, ScreenTitle, Pill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function Earnings() {
  const { campaigns } = useApp();
  const paid = campaigns.filter(c => c.status === 'complete');
  const pending = campaigns.filter(c => c.status === 'active' || c.status === 'review');
  const paidTotal = paid.reduce((sum, c) => sum + c.pay, 0);
  const pendingTotal = pending.reduce((sum, c) => sum + c.pay, 0);

  return <ScrollView contentContainerStyle={styles.page}>
    <ScreenTitle eyebrow="EARNINGS" title="Clear. Tracked. Paid." copy="See campaign income and payment status without chasing updates." />
    <Card style={styles.total}><Text style={styles.label}>TOTAL EARNED</Text><Text style={styles.amount}>£{paidTotal.toFixed(2)}</Text><Text style={styles.muted}>Across {paid.length} completed campaign{paid.length === 1 ? '' : 's'}</Text></Card>
    <View style={styles.row}><Card style={styles.half}><Text style={styles.label}>PENDING</Text><Text style={styles.small}>£{pendingTotal.toFixed(0)}</Text></Card><Card style={styles.half}><Text style={styles.label}>PAID</Text><Text style={styles.small}>£{paidTotal.toFixed(0)}</Text></Card></View>
    <Text style={styles.section}>PAYMENT HISTORY</Text>
    {[...paid, ...pending].length === 0 && <Card><Text style={styles.pTitle}>No payments yet</Text><Text style={styles.muted}>Campaign earnings will appear here once you accept an invitation.</Text></Card>}
    {[...paid, ...pending].map(c => <Card key={c.assignmentId} style={styles.payment}><View style={{ flex: 1 }}><Text style={styles.pTitle}>{c.brand} · {c.title}</Text><Text style={styles.muted}>{c.status === 'complete' ? 'Campaign completed' : 'Due after completion and approval'}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={styles.pAmount}>£{c.pay.toFixed(0)}</Text><Pill tone={c.status === 'complete' ? 'green' : 'gold'}>{c.status === 'complete' ? 'PAID' : 'PENDING'}</Pill></View></Card>)}
    <Card><Text style={styles.pTitle}>Payment details</Text><Text style={styles.muted}>Payments are processed after campaign activity and final evidence checks have been approved.</Text></Card>
  </ScrollView>;
}

const styles = StyleSheet.create({ page: { padding: 20, paddingTop: 62, paddingBottom: 120, gap: 13 }, total: { padding: 24 }, label: { color: C.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2 }, amount: { color: C.text, fontSize: 40, fontWeight: '700', marginTop: 12 }, muted: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 5 }, row: { flexDirection: 'row', gap: 12 }, half: { flex: 1 }, small: { color: C.text, fontSize: 24, fontWeight: '700', marginTop: 8 }, section: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 12 }, payment: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }, pTitle: { color: C.text, fontSize: 14, fontWeight: '700' }, pAmount: { color: C.text, fontSize: 18, fontWeight: '800', marginBottom: 7 } });
