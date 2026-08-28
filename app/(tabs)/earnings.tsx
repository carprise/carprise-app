import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, Space } from '@/src/constants/theme';
import { Card, ScreenTitle, Pill, StatusPill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { supabase } from '@/src/lib/supabase';

const isCompleted = (status: string) => status === 'complete' || status === 'completed';

type LedgerRow = {
  id: string;
  amount_pence: number;
  entry_type: string;
  description: string | null;
  status: string;
  created_at: string;
};

export default function Earnings() {
  const { campaigns, session, refreshing, refresh } = useApp();
  const [ledger, setLedger] = useState<LedgerRow[]>([]);
  const potential = campaigns.filter(c => c.status === 'invited');
  const upcoming = campaigns.filter(c => c.status === 'accepted' || c.status === 'active' || c.status === 'review');
  const earned = campaigns.filter(c => isCompleted(c.status));
  const potentialTotal = potential.reduce((sum, c) => sum + c.pay, 0);
  const upcomingTotal = upcoming.reduce((sum, c) => sum + c.pay, 0);
  const earnedTotal = earned.reduce((sum, c) => sum + c.pay, 0);
  const ledgerTotal = ledger.reduce((sum, row) => sum + Number(row.amount_pence || 0), 0) / 100;
  const displayEarned = ledger.length ? ledgerTotal : earnedTotal;
  const history = [...upcoming, ...earned];
  const commerceShare = Math.round(earnedTotal * 0.15 + upcomingTotal * 0.05);

  const loadLedger = useCallback(async () => {
    if (!supabase || !session?.user?.id) {
      setLedger([]);
      return;
    }
    const { data } = await supabase
      .from('earnings_ledger')
      .select('id, amount_pence, entry_type, description, status, created_at')
      .eq('driver_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setLedger((data as LedgerRow[]) ?? []);
  }, [session?.user?.id]);

  useEffect(() => {
    void loadLedger();
  }, [loadLedger]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.page}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            await refresh();
            await loadLedger();
          }}
          tintColor={C.paper}
        />
      }
    >
      <ScreenTitle
        eyebrow="Earnings"
        title="Clear. Tracked. Paid."
        copy="Campaign fees plus a share of in-journey commerce. Completions write to your earnings ledger."
      />

      <Card style={styles.total}>
        <Text style={styles.label}>
          {ledger.length ? 'Ledger total' : 'Total earned (campaigns)'}
        </Text>
        <Text style={styles.amount}>£{displayEarned.toFixed(2)}</Text>
        <Text style={styles.muted}>
          {ledger.length
            ? `${ledger.length} ledger entr${ledger.length === 1 ? 'y' : 'ies'}`
            : `Across ${earned.length} completed campaign${earned.length === 1 ? '' : 's'}`}
        </Text>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.metric}>
          <Text style={styles.label}>Potential</Text>
          <Text style={styles.small}>£{potentialTotal.toFixed(0)}</Text>
          <Text style={styles.caption}>Invitations not yet accepted</Text>
        </Card>
        <Card style={styles.metric}>
          <Text style={styles.label}>Upcoming</Text>
          <Text style={styles.small}>£{upcomingTotal.toFixed(0)}</Text>
          <Text style={styles.caption}>Accepted, active or in review</Text>
        </Card>
        <Card style={styles.metric}>
          <Text style={styles.label}>Commerce share</Text>
          <Text style={styles.small}>£{commerceShare.toFixed(0)}</Text>
          <Text style={styles.caption}>Est. retail and sample bonuses</Text>
        </Card>
      </View>

      {ledger.length > 0 ? (
        <>
          <Text style={styles.section}>Ledger</Text>
          {ledger.map(row => (
            <Card key={row.id} style={styles.row}>
              <View style={styles.rowTop}>
                <Pill tone={row.status === 'paid' ? 'green' : 'gold'}>{row.status}</Pill>
                <Text style={styles.pay}>£{(Number(row.amount_pence) / 100).toFixed(2)}</Text>
              </View>
              <Text style={styles.rowTitle}>{row.description || row.entry_type}</Text>
              <Text style={styles.caption}>
                {new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(row.created_at))}
              </Text>
            </Card>
          ))}
        </>
      ) : null}

      <Text style={styles.section}>Campaign history</Text>
      {history.length === 0 ? (
        <Card>
          <Text style={styles.rowTitle}>No active or completed campaigns yet</Text>
          <Text style={styles.caption}>Accept work from the Work tab to start earning.</Text>
        </Card>
      ) : (
        history.map(c => (
          <Card key={c.assignmentId} style={styles.row}>
            <View style={styles.rowTop}>
              <StatusPill status={c.status} />
              <Text style={styles.pay}>£{c.pay.toFixed(0)}</Text>
            </View>
            <Text style={styles.rowTitle}>
              {c.brand}: {c.title}
            </Text>
            <Text style={styles.caption}>
              {c.area} · {c.start} – {c.end}
            </Text>
          </Card>
        ))
      )}

      <Text style={styles.footer}>
        1. Campaign fees when ops marks work complete.{'\n'}
        2. Transaction share when passengers buy products during journeys in your vehicle.
      </Text>
    </ScrollView>
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
  total: { paddingVertical: 22 },
  label: {
    color: C.muted2,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  amount: {
    color: C.paper,
    fontSize: 40,
    fontWeight: '300',
    letterSpacing: -1,
    marginTop: 8,
  },
  muted: { color: C.muted, fontSize: 13, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metric: { flex: 1, minWidth: 100 },
  small: {
    color: C.paper,
    fontSize: 22,
    fontWeight: '400',
    marginTop: 8,
  },
  caption: { color: C.muted, fontSize: 12, marginTop: 6, lineHeight: 17 },
  section: {
    color: C.muted2,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginTop: 12,
  },
  row: { gap: 4 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pay: { color: C.paper, fontSize: 18, fontWeight: '500' },
  rowTitle: { color: C.paper, fontSize: 15, fontWeight: '500', marginTop: 8 },
  footer: { color: C.muted2, fontSize: 12, lineHeight: 18, marginTop: 10 },
});
