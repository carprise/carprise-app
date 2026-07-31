/** Driver-facing stock snapshot until live inventory is linked per vehicle. */

export type StockItem = {
  id: string;
  name: string;
  sku: string;
  type: 'sample' | 'retail';
  quantity: number;
  lowAt: number;
};

export function getVehicleStock(vehicleId?: string | null): StockItem[] {
  const seed = (vehicleId ?? 'default').length;
  return [
    {
      id: 's1',
      name: 'Brand sample pack',
      sku: 'SAMP-01',
      type: 'sample',
      quantity: 8 + (seed % 12),
      lowAt: 6,
    },
    {
      id: 's2',
      name: 'Retail unit A',
      sku: 'RTL-A',
      type: 'retail',
      quantity: 3 + (seed % 8),
      lowAt: 4,
    },
    {
      id: 's3',
      name: 'Retail unit B',
      sku: 'RTL-B',
      type: 'retail',
      quantity: 1 + (seed % 5),
      lowAt: 3,
    },
  ];
}
