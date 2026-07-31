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
  // Illustrative commerce share for pilot messaging (not live ledger yet)
  const commerceShare = Math.round(earnedTotal * 0.15 + upcomingTotal * 0.05);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <ScreenTitle
        eyebrow="EARNINGS"
        title="Clear. Tracked. Paid."
        copy="Campaign fees plus a share of in-journey commerce. Invitations stay separate from confirmed income."
      />

      <Card style={styles.total}>
        <Text style={styles.label}>TOTAL EARNED</Text>
        <Text style={styles.amount}>£{earnedTotal.toFixed(2)}</Text>
        <Text style={styles.muted}>Across {earned.length} completed campaign{earned.length === 1 ? '' : 's'}</Text>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.metric}>
          <Text style={styles.label}>POTENTIAL</Text>
          <Text style={styles.small}>£{potentialTotal.toFixed(0)}</Text>
          <Text style={styles.caption}>Invitations not yet accepted</Text>
        </Card>
        <Card style={styles.metric}>
          <Text style={styles.label}>UPCOMING</Text>
          <Text style={styles.small}>£{upcomingTotal.toFixed(0)}</Text>
          <Text style={styles.caption}>Accepted, active or in review</Text>
        </Card>
        <Card style={styles.metric}>
          <Text style={styles.label}>COMMERCE SHARE</Text>
          <Text style={styles.small}>£{commerceShare.toFixed(0)}</Text>
          <Text style={styles.caption}>Est. retail & sample bonuses</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.pTitle}>How you earn</Text>
        <Text style={styles.muted}>
          1. Campaign fee when you complete activation checklist and evidence is approved.{'\n'}
          2. Transaction share when passengers buy products during journeys in your vehicle.{'\n'}
          3. Sample fulfilment bonus when free trials are claimed from your kit.{'\n'}
          Fares always stay with your mobility provider — Carprise only monetises the commercial layer.
        </Text>
      </Card>

      {potential.length > 0 && (
        <>
          <Text style={styles.section}>POTENTIAL EARNINGS</Text>
          {potential.map(c => (
            <Card key={c.assignmentId} style={styles.payment}>
              <View style={styles.paymentCopy}>
                <Text style={styles.pTitle}>{c.brand} · {c.title}</Text>
                <Text style={styles.muted}>Accept the invitation to move this into upcoming earnings.</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.pAmount}>£{c.pay.toFixed(0)}</Text>
                <Pill tone="violet">POTENTIAL</Pill>
              </View>
            </Card>
          ))}
        </>
      )}

      <Text style={styles.section}>CONFIRMED & COMPLETED</Text>
      {history.length === 0 && (
        <Card>
          <Text style={styles.pTitle}>No confirmed earnings yet</Text>
          <Text style={styles.muted}>Accepted campaigns will appear here, while invitations remain under potential earnings.</Text>
        </Card>
      )}
      {history.map(c => (
        <Card key={c.assignmentId} style={styles.payment}>
          <View style={styles.paymentCopy}>
            <Text style={styles.pTitle}>{c.brand} · {c.title}</Text>
            <Text style={styles.muted}>
              {isCompleted(c.status) ? 'Campaign completed' : 'Due after completion and evidence approval'}
            </Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.pAmount}>£{c.pay.toFixed(0)}</Text>
            <StatusPill status={c.status} />
          </View>
        </Card>
      ))}

      <Card>
        <Text style={styles.pTitle}>Payment details</Text>
        <Text style={styles.muted}>
          Payments are processed after campaign activity and final evidence checks have been approved. Add bank details under Profile.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingTop: 62, paddingBottom: 120, gap: 13 },
  total: { padding: 24 },
  label: { color: C.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  amount: { color: C.text, fontSize: 40, fontWeight: '700', marginTop: 12 },
  muted: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metric: { flexGrow: 1, flexBasis: 150 },
  small: { color: C.text, fontSize: 24, fontWeight: '700', marginTop: 8 },
  caption: { color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 6 },
  section: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginTop: 12 },
  payment: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  paymentCopy: { flex: 1 },
  right: { alignItems: 'flex-end' },
  pTitle: { color: C.text, fontSize: 14, fontWeight: '700' },
  pAmount: { color: C.text, fontSize: 18, fontWeight: '800', marginBottom: 7 },
});
