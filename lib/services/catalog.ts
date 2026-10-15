import 'server-only';
import { offeringCatalog } from '@/lib/offering-catalog';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { OfferingId } from '@/types/offering';

export async function getActiveCatalog() {
  const { data, error } = await getSupabaseAdmin().from('offering_catalog').select('id,name_my,name_en,description,image_path').eq('is_active', true).order('id');
  if (error) throw error;
  return data ?? [];
}

export async function validateCatalogIds(ids: string[]) {
  const { data, error } = await getSupabaseAdmin().from('offering_catalog').select('id').eq('is_active', true).in('id', ids);
  if (error) throw error;
  const validIds = new Set((data ?? []).map((item) => item.id));
  return ids.every((id) => validIds.has(id)) ? ids as OfferingId[] : null;
}

export function fallbackCatalog() {
  return offeringCatalog.map((item) => ({ id: item.id, name_my: item.name, name_en: item.englishName, description: item.description, image_path: null }));
}
