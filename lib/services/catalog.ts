import 'server-only';
import { offeringCatalog } from '@/lib/offering-catalog';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { OfferingId } from '@/types/offering';

export async function getActiveCatalog() {
  const { data, error } = await getSupabaseAdmin().from('offering_catalog').select('id,name_my,name_en,description,image_path,tier,point_price,sort_order').eq('is_active', true).order('sort_order').order('id');
  if (error) throw error;
  return data ?? [];
}

export async function validateCatalogIds(ids: string[], userId?: string) {
  const { data, error } = await getSupabaseAdmin().from('offering_catalog').select('id,tier').eq('is_active', true).in('id', ids);
  if (error) throw error;
  const validIds = new Set((data ?? []).map((item) => item.id));
  if (!ids.every((id) => validIds.has(id))) return null;
  if (!userId) return ids as OfferingId[];
  const premiumIds = (data ?? []).filter((item) => item.tier === 'premium').map((item) => item.id);
  if (!premiumIds.length) return ids as OfferingId[];
  const { data: owned, error: inventoryError } = await getSupabaseAdmin().from('user_inventory').select('catalog_item_id').eq('user_id', userId).in('catalog_item_id', premiumIds);
  if (inventoryError) throw inventoryError;
  const ownedIds = new Set((owned ?? []).map((item) => item.catalog_item_id));
  return premiumIds.every((id) => ownedIds.has(id)) ? ids as OfferingId[] : null;
}

export async function canUserUseOffering(userId: string, catalogItemId: string) {
  const { data: item, error } = await getSupabaseAdmin().from('offering_catalog').select('id,tier,is_active').eq('id', catalogItemId).maybeSingle();
  if (error || !item?.is_active) return false;
  if (item.tier === 'free') return true;
  const { data: owned } = await getSupabaseAdmin().from('user_inventory').select('catalog_item_id').eq('user_id', userId).eq('catalog_item_id', catalogItemId).maybeSingle();
  return Boolean(owned);
}

export function fallbackCatalog() {
  return offeringCatalog.map((item) => ({ id: item.id, name_my: item.name, name_en: item.englishName, description: item.description, image_path: null }));
}
