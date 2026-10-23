import 'server-only';

import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function getShopCatalogForUser(userId: string) {
  const admin = getSupabaseAdmin();
  const [{ data: items, error }, { data: owned, error: inventoryError }] = await Promise.all([
    admin.from('offering_catalog').select('id,name_my,name_en,description,image_path,tier,point_price,sort_order').eq('is_active', true).order('sort_order').order('id'),
    admin.from('user_inventory').select('catalog_item_id,unlocked_at').eq('user_id', userId),
  ]);
  if (error) throw error; if (inventoryError) throw inventoryError;
  const ownership = new Map((owned ?? []).map((item) => [item.catalog_item_id, item.unlocked_at]));
  return (items ?? []).map((item) => ({ ...item, owned: item.tier === 'free' || ownership.has(item.id), unlockedAt: ownership.get(item.id) ?? null }));
}

export async function getUserInventory(userId: string) {
  const { data, error } = await getSupabaseAdmin().from('user_inventory').select('catalog_item_id,unlocked_at,offering_catalog(id,name_my,name_en,description,image_path,tier,point_price)').eq('user_id', userId).order('unlocked_at', { ascending: false });
  if (error) throw error; return data ?? [];
}
