import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, Space } from '@/src/constants/theme';
import { Card, ScreenTitle, Pill } from '@/src/components/ui';
import { useApp } from '@/src/context/AppContext';
import { getVehicleStock } from '@/src/data/stock';

export default function StockScreen() {
  const { vehicle } = useApp();
  const stock = getVehicleStock(vehicle?.id);
  const low = stock.filter(s => s.quantity <= s.lowAt);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.page}>
      <ScreenTitle
        eyebrow="Vehicle stock"
        title="Inventory on board."
        copy="Samples and retail units carried for passenger journeys. Restock from Carprise ops when levels run low."
      />

      <Card style={styles.summary}>
        <Text style={styles.summaryLabel}>Vehicle</Text>
        <Text style={styles.summaryValue}>
          {vehicle
            ? `${vehicle.registration || 'No reg'} · ${vehicle.make} ${vehicle.model}`
            : 'No vehicle linked yet'}
        </Text>
        <Text style={styles.summaryMeta}>
          {low.length
            ? `${low.length} item${low.length === 1 ? '' : 's'} at or below restock level`
            : 'Stock levels look healthy'}
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
        Stock counts will sync from Carprise ops inventory once this vehicle is linked to live stock
        records. Until then, figures are pilot estimates for planning.
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
  summaryLabel: {
    color: C.muted2,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
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
