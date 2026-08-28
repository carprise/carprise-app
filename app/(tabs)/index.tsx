import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, R, Space } from '@/src/constants/theme';
import { Card, StatusPill, StatusDot, MetricTile } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatMinutes, getDailyReport } from '@/src/data/dailyReport';

export default function TodayScreen() {
  const {
    driver,
    vehicle,
    campaigns,
    dailyReport,
    tracking,
    trackingEnabled,
    setTrackingEnabled,
    refreshing,
    refresh,
    cabinRequests,
    resolveCabinRequest,
  } = useApp();
  const active = campaigns.find(
    c => c.status === 'active' || c.status === 'accepted' || c.status === 'review',
  );
  const invited = campaigns.find(c => c.status === 'invited');
  const firstName = driver?.firstName || driver?.name || 'Driver';
  const report = dailyReport ?? getDailyReport(driver?.id);
  const live = report.source === 'live';
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      void refresh();
    }, 20000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.page}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.paper} />
      }
    >
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Text style={styles.product}>Driver operations</Text>
          <Text style={styles.hello}>Good to see you, {firstName}</Text>
          <Text style={styles.date}>{report.dateLabel}</Text>
        </View>
        <View style={styles.statusChip}>
          <StatusDot live={Boolean(driver?.verified)} />
          <Text style={styles.statusText}>
            {driver?.verified ? 'Vehicle verified' : 'Awaiting review'}
          </Text>
        </View>
      </View>

      <View style={styles.sectionRow}>
        <Text style={[styles.section, styles.sectionInline]}>Today&apos;s report</Text>
        <View style={[styles.sourcePill, live ? styles.sourceLive : styles.sourceEst]}>
          <Text style={styles.sourceText}>{live ? 'Live GPS' : 'Estimate'}</Text>
        </View>
      </View>
      <View style={styles.metrics}>
        <MetricTile label="Distance" value={`${report.distanceKm} km`} hint="Travelled today" />
        <MetricTile label="Journeys" value={String(report.journeys)} hint={report.topArea} />
      </View>
      <View style={[styles.metrics, { marginTop: 10 }]}>
        <MetricTile
          label="On road"
          value={formatMinutes(report.activeMinutes)}
          hint={`${report.idleShare}% idle`}
        />
        <MetricTile
          label="Est. earn"
          value={`£${report.estimatedEarnings.toFixed(0)}`}
          hint={`${report.campaignHours}h campaign time`}
        />
      </View>

      <Pressable
        onPress={() => setTrackingEnabled(!trackingEnabled)}
        style={styles.trackRow}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.trackTitle}>
            Route tracking · {tracking.tracking ? 'On' : trackingEnabled ? 'Starting…' : 'Off'}
          </Text>
          <Text style={styles.trackMeta}>
            {tracking.permission === 'denied'
              ? 'Location permission denied — enable in browser/settings for live distance.'
              : report.trackingHint ||
                (tracking.tracking
                  ? `${tracking.buffered} samples buffered`
                  : 'Enable to record live distance for this shift.')}
          </Text>
        </View>
        <View style={[styles.toggle, trackingEnabled && styles.toggleOn]}>
          <View style={[styles.toggleKnob, trackingEnabled && styles.toggleKnobOn]} />
        </View>
      </Pressable>

      <Pressable onPress={() => router.push('/(tabs)/report')}>
        <Text style={styles.inlineLink}>Full routes report →</Text>
      </Pressable>

      {cabinRequests.length > 0 ? (
        <>
          <Text style={styles.section}>Cabin requests</Text>
          {cabinRequests.map((item) => (
            <Card key={item.id} style={styles.invite}>
              <View style={styles.inviteIcon}>
                <Ionicons name="chatbubble-outline" size={18} color={C.paper} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inviteLabel}>{item.kind}</Text>
                <Text style={styles.inviteTitle}>{item.title}</Text>
                {item.body ? <Text style={styles.inviteMeta}>{item.body}</Text> : null}
              </View>
              <Pressable
                onPress={async () => {
                  setResolving(item.id);
                  await resolveCabinRequest(item.id);
                  setResolving(null);
                }}
                style={styles.smallBtn}
              >
                <Text style={styles.smallBtnText}>{resolving === item.id ? '…' : 'Done'}</Text>
              </Pressable>
            </Card>
          ))}
        </>
      ) : null}

      <Text style={styles.section}>Active work</Text>
      {active ? (
        <Pressable onPress={() => router.push(`/campaign/${active.id}`)}>
          <Card style={styles.workCard}>
            <View style={styles.workTop}>
              <StatusPill status={active.status} />
              <Text style={styles.workPay}>£{active.pay.toFixed(0)}</Text>
            </View>
            <Text style={styles.workBrand}>{active.brand}</Text>
            <Text style={styles.workTitle}>{active.title}</Text>
            <Text style={styles.workMeta}>
              {active.area} · ends {active.end}
            </Text>
            <View style={styles.progress}>
              <View style={[styles.progressFill, { width: `${active.progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{active.progress}% complete</Text>
          </Card>
        </Pressable>
      ) : (
        <Card>
          <Text style={styles.emptyTitle}>No active campaign</Text>
          <Text style={styles.emptyCopy}>
            When Carprise assigns commercial work, it will appear here with checklist and evidence
            steps.
          </Text>
        </Card>
      )}

      {invited && (
        <Pressable onPress={() => router.push(`/campaign/${invited.id}`)}>
          <Card style={styles.invite}>
            <View style={styles.inviteIcon}>
              <Ionicons name="mail-open-outline" size={18} color={C.champagne} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inviteLabel}>New invitation</Text>
              <Text style={styles.inviteTitle}>
                {invited.brand}: {invited.title}
              </Text>
              <Text style={styles.inviteMeta}>£{invited.pay.toFixed(0)} · starts {invited.start}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.muted2} />
          </Card>
        </Pressable>
      )}

      <Text style={styles.section}>Vehicle</Text>
      <Card style={styles.vehicleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.vehicleName}>
            {vehicle
              ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim()
              : 'No vehicle on file'}
          </Text>
          <Text style={styles.vehicleMeta}>
            {vehicle?.registration || 'Add registration'}
            {vehicle?.verificationStatus === 'verified' ? ' · Verified' : ' · Pending review'}
            {vehicle?.journeyCode ? ` · Passenger ${vehicle.journeyCode}` : ''}
          </Text>
        </View>
        <Pressable onPress={() => router.push('/(tabs)/vehicle')} style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Manage</Text>
        </Pressable>
      </Card>

      <Text style={styles.footerNote}>
        This is the driver operations app. Passengers use /j/[code] for drink, shop, listen, ask and
        ride. Ask and cabin requests appear above when the vehicle is live.
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
  top: { marginBottom: 8, gap: 14 },
  product: {
    color: C.champagne,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  hello: {
    color: C.paper,
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: -0.6,
    marginTop: 6,
  },
  date: { color: C.muted, fontSize: 14, marginTop: 4 },
  statusChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: C.panel,
  },
  statusText: { color: C.muted, fontSize: 12, fontWeight: '500' },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 4,
  },
  section: {
    color: C.muted2,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: 18,
    marginBottom: 4,
  },
  sectionInline: { marginTop: 0, marginBottom: 0 },
  sourcePill: {
    borderRadius: R.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  sourceLive: { borderColor: C.liveBorder, backgroundColor: C.liveFill },
  sourceEst: { borderColor: C.line, backgroundColor: C.panel },
  sourceText: { color: C.muted, fontSize: 10, fontWeight: '600', letterSpacing: 0.6 },
  metrics: { flexDirection: 'row', gap: 10 },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: R.lg,
    padding: 16,
    marginTop: 4,
  },
  trackTitle: { color: C.paper, fontSize: 14, fontWeight: '500' },
  trackMeta: { color: C.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.panel3,
    borderWidth: 1,
    borderColor: C.line,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: 'rgba(8, 9, 11, 0.12)', borderColor: C.paper },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.muted2,
  },
  toggleKnobOn: { backgroundColor: C.paper, alignSelf: 'flex-end' },
  inlineLink: {
    color: C.paper,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 4,
  },
  workCard: { gap: 4 },
  workTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  workPay: { color: C.paper, fontSize: 18, fontWeight: '500' },
  workBrand: {
    color: C.champagne,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 16,
  },
  workTitle: {
    color: C.paper,
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: -0.4,
    marginTop: 4,
  },
  workMeta: { color: C.muted, fontSize: 13, marginTop: 6 },
  progress: { height: 2, backgroundColor: C.line, marginTop: 18 },
  progressFill: { height: 2, backgroundColor: C.violet },
  progressText: { color: C.muted2, fontSize: 11, marginTop: 8 },
  emptyTitle: { color: C.paper, fontSize: 17, fontWeight: '500' },
  emptyCopy: { color: C.muted, lineHeight: 21, marginTop: 8 },
  invite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderColor: C.hairline,
  },
  inviteIcon: {
    width: 40,
    height: 40,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteLabel: {
    color: C.champagne,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inviteTitle: { color: C.paper, fontSize: 15, fontWeight: '500', marginTop: 3 },
  inviteMeta: { color: C.muted, fontSize: 12, marginTop: 3 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vehicleName: { color: C.paper, fontSize: 15, fontWeight: '500' },
  vehicleMeta: { color: C.muted, fontSize: 12, marginTop: 4 },
  smallBtn: {
    borderWidth: 1,
    borderColor: C.lineStrong,
    borderRadius: R.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  smallBtnText: { color: C.paper, fontSize: 12, fontWeight: '600' },
  footerNote: {
    color: C.muted2,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 20,
  },
});
