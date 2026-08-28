import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, R, Space } from '@/src/constants/theme';
import { Card, ScreenTitle, MetricTile } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatMinutes, getDailyReport } from '@/src/data/dailyReport';

export default function RoutesReportScreen() {
  const {
    driver,
    campaigns,
    dailyReport,
    tracking,
    trackingEnabled,
    setTrackingEnabled,
    refresh,
    refreshing,
  } = useApp();
  const report = dailyReport ?? getDailyReport(driver?.id);
  const live = report.source === 'live';
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
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>{report.dateLabel}</Text>
          <View style={[styles.sourcePill, live ? styles.sourceLive : styles.sourceEst]}>
            <Text style={styles.sourceText}>{live ? 'Live GPS' : 'Estimate'}</Text>
          </View>
        </View>
        <Text style={styles.heroValue}>{report.distanceKm} km</Text>
        <Text style={styles.heroHint}>
          {live
            ? `Total distance from ${report.pointCount} GPS samples`
            : 'Pilot estimate until route tracking collects samples'}
        </Text>
        <Text style={styles.note}>{report.note}</Text>
      </Card>

      <Card style={styles.trackCard}>
        <View style={styles.trackHead}>
          <View style={{ flex: 1 }}>
            <Text style={styles.trackTitle}>Route tracking</Text>
            <Text style={styles.trackMeta}>
              {tracking.permission === 'denied'
                ? 'Permission denied — enable location for live distance.'
                : tracking.tracking
                  ? `Recording · ${tracking.buffered} buffered`
                  : trackingEnabled
                    ? 'Requesting location…'
                    : 'Paused — turn on to measure this shift.'}
            </Text>
          </View>
          <Pressable onPress={() => setTrackingEnabled(!trackingEnabled)} style={styles.trackBtn}>
            <Text style={styles.trackBtnText}>{trackingEnabled ? 'Pause' : 'Start'}</Text>
          </Pressable>
        </View>
        {tracking.lastError ? (
          <Text style={styles.trackError}>{tracking.lastError}</Text>
        ) : null}
        <Pressable onPress={() => void refresh()} disabled={refreshing}>
          <Text style={styles.refreshLink}>{refreshing ? 'Refreshing…' : 'Refresh report →'}</Text>
        </Pressable>
      </Card>

      <View style={styles.metrics}>
        <MetricTile label="Journeys" value={String(report.journeys)} hint="Trip segments" />
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
          Used for brand matching and density reporting. Corridor maps improve as live samples grow.
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
        {live
          ? 'Distance and journey segments are calculated from your device GPS. Earnings combine campaign data with distance-aware estimates.'
          : 'Enable route tracking so distance and journey counts use live GPS instead of pilot estimates.'}
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
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLabel: {
    color: C.champagne,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sourcePill: {
    borderRadius: R.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  sourceLive: { borderColor: C.liveBorder, backgroundColor: C.liveFill },
  sourceEst: { borderColor: C.line, backgroundColor: C.panel2 },
  sourceText: { color: C.muted, fontSize: 10, fontWeight: '600' },
  heroValue: {
    color: C.paper,
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -1.4,
    marginTop: 10,
  },
  heroHint: { color: C.muted, fontSize: 14, marginTop: 4 },
  note: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 16 },
  trackCard: { gap: 10 },
  trackHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trackTitle: { color: C.paper, fontSize: 15, fontWeight: '500' },
  trackMeta: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  trackBtn: {
    borderWidth: 1,
    borderColor: C.lineStrong,
    borderRadius: R.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  trackBtnText: { color: C.paper, fontSize: 12, fontWeight: '600' },
  trackError: { color: C.danger, fontSize: 12, lineHeight: 17 },
  refreshLink: { color: C.paper, fontSize: 13, fontWeight: '600' },
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
    color: C.paper,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.8,
    marginTop: 8,
  },
  footer: { color: C.muted2, fontSize: 12, lineHeight: 18, marginTop: 14 },
});
