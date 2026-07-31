/** Vehicle stock — live from ops inventory, with pilot fallback. */
import { supabase } from '@/src/lib/supabase';

export type StockItem = {
  id: string;
  name: string;
  sku: string;
  type: 'sample' | 'retail';
  quantity: number;
  lowAt: number;
  productId?: string;
};

export type StockSnapshot = {
  items: StockItem[];
  source: 'live' | 'estimate';
  updatedAt?: string | null;
};

function estimateStock(vehicleId?: string | null): StockItem[] {
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

export function getVehicleStock(vehicleId?: string | null): StockItem[] {
  return estimateStock(vehicleId);
}

export async function fetchVehicleStock(vehicleId?: string | null): Promise<StockSnapshot> {
  if (!supabase || !vehicleId) {
    return { items: estimateStock(vehicleId), source: 'estimate' };
  }

  try {
    const { data, error } = await supabase
      .from('inventory')
      .select(
        'id, quantity, reserved, low_at, updated_at, product:products(id, name, sku, product_type, active)',
      )
      .eq('vehicle_id', vehicleId)
      .order('updated_at', { ascending: false });

    if (error || !data?.length) {
      return { items: estimateStock(vehicleId), source: 'estimate' };
    }

    const items: StockItem[] = data
      .map((row: any) => {
        const product = Array.isArray(row.product) ? row.product[0] : row.product;
        if (!product || product.active === false) return null;
        const type = product.product_type === 'sample' ? 'sample' : 'retail';
        return {
          id: row.id as string,
          productId: product.id as string,
          name: (product.name as string) || 'Product',
          sku: (product.sku as string) || '—',
          type: type as 'sample' | 'retail',
          quantity: Number(row.quantity ?? 0),
          lowAt: Number(row.low_at ?? 3),
        };
      })
      .filter(Boolean) as StockItem[];

    if (!items.length) {
      return { items: estimateStock(vehicleId), source: 'estimate' };
    }

    const updatedAt = data.reduce((latest: string | null, row: any) => {
      const t = row.updated_at as string | null;
      if (!t) return latest;
      if (!latest || t > latest) return t;
      return latest;
    }, null as string | null);

    return { items, source: 'live', updatedAt };
  } catch {
    return { items: estimateStock(vehicleId), source: 'estimate' };
  }
}
