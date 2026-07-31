import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, Space } from '@/src/constants/theme';
import { Card, ScreenTitle, MetricTile } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatMinutes, getDailyReport } from '@/src/data/dailyReport';

export default function RoutesReportScreen() {
  const { driver, campaigns } = useApp();
  const report = getDailyReport(driver?.id);
  const earned = campaigns
    .filter(c => c.status === 'complete' || c.status === 'completed')
    .reduce((s, c) => s + c.pay, 0);
  const activePay = campaigns
    .filter(c => ['accepted', 'active', 'review'].includes(c.status))
    .reduce((s, c) => s + c.pay, 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page}>
      <ScreenTitle
        eyebrow="Routes & analytics"
        title="Daily travel report."
        copy="How far you went, how many passenger journeys, and how commercial time performed."
      />

      <Card style={styles.hero}>
        <Text style={styles.heroLabel}>{report.dateLabel}</Text>
        <Text style={styles.heroValue}>{report.distanceKm} km</Text>
        <Text style={styles.heroHint}>Total distance travelled today</Text>
        <Text style={styles.note}>{report.note}</Text>
      </Card>

      <View style={styles.metrics}>
        <MetricTile label="Journeys" value={String(report.journeys)} hint="Passenger trips" />
        <MetricTile label="On road" value={formatMinutes(report.activeMinutes)} hint="Active time" />
      </View>
      <View style={[styles.metrics, { marginTop: 10 }]}>
        <MetricTile
          label="Campaign time"
          value={`${report.campaignHours}h`}
          hint="Commercial window"
        />
        <MetricTile
          label="Idle share"
          value={`${report.idleShare}%`}
          hint="Between trips"
        />
      </View>

      <Text style={styles.section}>Coverage</Text>
      <Card>
        <Text style={styles.rowLabel}>Primary area today</Text>
        <Text style={styles.rowValue}>{report.topArea}</Text>
        <Text style={styles.rowMeta}>
          Used for brand matching and density reporting. Live GPS corridors will refine this in a later
          release.
        </Text>
      </Card>

      <Text style={styles.section}>Commercial</Text>
      <View style={styles.metrics}>
        <MetricTile label="Est. today" value={`£${report.estimatedEarnings.toFixed(0)}`} />
        <MetricTile label="In progress" value={`£${activePay.toFixed(0)}`} />
      </View>
      <Card style={{ marginTop: 10 }}>
        <Text style={styles.rowLabel}>Completed campaign pay (all time)</Text>
        <Text style={styles.bigMoney}>£{earned.toFixed(2)}</Text>
      </Card>

      <Text style={styles.footer}>
        Distance and journey counts are pilot estimates until vehicle telemetry is connected. Earnings
        figures combine live campaign data with daily estimates.
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
  hero: { paddingVertical: 24 },
  heroLabel: {
    color: C.champagne,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroValue: {
    color: C.paper,
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -1.4,
    marginTop: 10,
  },
  heroHint: { color: C.muted, fontSize: 14, marginTop: 4 },
  note: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 16 },
  metrics: { flexDirection: 'row', gap: 10 },
  section: {
    color: C.muted2,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 2,
  },
  rowLabel: {
    color: C.muted2,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rowValue: {
    color: C.paper,
    fontSize: 20,
    fontWeight: '400',
    marginTop: 8,
  },
  rowMeta: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  bigMoney: {
    color: C.champagne,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.8,
    marginTop: 8,
  },
  footer: { color: C.muted2, fontSize: 12, lineHeight: 18, marginTop: 14 },
});
