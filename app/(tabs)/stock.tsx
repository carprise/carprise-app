import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, R, Space } from '@/src/constants/theme';
import { Card, ScreenTitle, Pill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';

export default function StockScreen() {
  const { vehicle, stock, stockSource, stockUpdatedAt, refreshing, refresh } = useApp();
  const low = stock.filter(s => s.quantity <= s.lowAt);
  const live = stockSource === 'live';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.page}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.champagne} />
      }
    >
      <ScreenTitle
        eyebrow="Vehicle stock"
        title="Inventory on board."
        copy="Samples and retail units carried for passenger journeys. Levels sync from Carprise ops when assigned to this vehicle."
      />

      <Card style={styles.summary}>
        <View style={styles.summaryTop}>
          <Text style={styles.summaryLabel}>Vehicle</Text>
          <View style={[styles.sourcePill, live ? styles.sourceLive : styles.sourceEst]}>
            <Text style={styles.sourceText}>{live ? 'Live from ops' : 'Estimate'}</Text>
          </View>
        </View>
        <Text style={styles.summaryValue}>
          {vehicle
            ? `${vehicle.registration || 'No reg'} · ${vehicle.make} ${vehicle.model}`
            : 'No vehicle linked yet'}
        </Text>
        <Text style={styles.summaryMeta}>
          {low.length
            ? `${low.length} item${low.length === 1 ? '' : 's'} at or below restock level`
            : 'Stock levels look healthy'}
          {live && stockUpdatedAt
            ? ` · Updated ${new Intl.DateTimeFormat('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(stockUpdatedAt))}`
            : ''}
        </Text>
      </Card>

      {stock.map(item => {
        const isLow = item.quantity <= item.lowAt;
        return (
          <Card key={item.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.rowTop}>
                <Pill tone={item.type === 'sample' ? 'violet' : 'gold'}>{item.type}</Pill>
                {isLow ? <Pill tone="warning">Restock</Pill> : null}
              </View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sku}>{item.sku}</Text>
            </View>
            <View style={styles.qtyWrap}>
              <Text style={[styles.qty, isLow && styles.qtyLow]}>{item.quantity}</Text>
              <Text style={styles.qtyLabel}>units</Text>
            </View>
          </Card>
        );
      })}

      <Text style={styles.note}>
        {live
          ? 'These counts come from ops inventory for this vehicle. Pull to refresh after restock.'
          : 'No live inventory rows for this vehicle yet. Assign stock in /ops → Inventory, or figures stay as pilot estimates.'}
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
  summary: { marginBottom: 6 },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: C.muted2,
    fontSize: 10,
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
  sourceLive: { borderColor: 'rgba(168,217,106,0.35)', backgroundColor: 'rgba(168,217,106,0.1)' },
  sourceEst: { borderColor: C.line, backgroundColor: C.panel2 },
  sourceText: { color: C.muted, fontSize: 10, fontWeight: '600' },
  summaryValue: {
    color: C.paper,
    fontSize: 17,
    fontWeight: '400',
    marginTop: 8,
  },
  summaryMeta: { color: C.muted, fontSize: 13, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowTop: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  name: { color: C.paper, fontSize: 16, fontWeight: '500' },
  sku: { color: C.muted2, fontSize: 12, marginTop: 4 },
  qtyWrap: { alignItems: 'flex-end' },
  qty: { color: C.paper, fontSize: 28, fontWeight: '300', letterSpacing: -0.8 },
  qtyLow: { color: C.champagne },
  qtyLabel: { color: C.muted2, fontSize: 11, marginTop: 2 },
  note: { color: C.muted2, fontSize: 12, lineHeight: 18, marginTop: 12 },
});
