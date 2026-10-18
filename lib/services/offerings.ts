import 'server-only';
import { createHash } from 'node:crypto';
import { createShareToken, hashShareToken, isValidShareToken } from '@/lib/security/tokens';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { validateCatalogIds } from '@/lib/services/catalog';
import { encryptShareToken } from '@/lib/security/recoverable-share-token';
import type { OfferingId, RecipientOffering } from '@/types/offering';

export async function createOffering(input: { recipientName: string; senderName: string; selectedOfferings: string[]; message: string; wishes: string; senderUserId: string; idempotencyKey?: string }) {
  const selectedIds = await validateCatalogIds(input.selectedOfferings);
  if (!selectedIds) return { kind: 'invalid_catalog' as const };
  const requestKeyHash = input.idempotencyKey ? createHash('sha256').update(input.idempotencyKey).digest('hex') : null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const recipientToken = createShareToken();
    const senderToken = createShareToken();
    const { data, error } = await getSupabaseAdmin().from('offerings').insert({ share_token_hash: recipientToken.hash, recipient_share_token_encrypted: encryptShareToken(recipientToken.raw), sender_access_token_hash: senderToken.hash, request_key_hash: requestKeyHash, sender_user_id: input.senderUserId, recipient_name: input.recipientName, sender_name: input.senderName, message: input.message, wishes: input.wishes || null, selected_item_ids: selectedIds, status: 'active' }).select('id').single();
    if (!error && data) return { kind: 'created' as const, recipientToken: recipientToken.raw, senderToken: senderToken.raw };
    if (error?.code !== '23505') throw error;
    if (requestKeyHash) return { kind: 'duplicate' as const };
  }
  throw new Error('Unable to create a unique share token.');
}

export async function getOfferingByToken(rawToken: string): Promise<RecipientOffering | null> {
  if (!isValidShareToken(rawToken)) return null;
  const { data, error } = await getSupabaseAdmin().from('offerings').select('recipient_name,sender_name,message,wishes,selected_item_ids,status').eq('share_token_hash', hashShareToken(rawToken)).eq('status', 'active').maybeSingle();
  if (error || !data) return null;
  const { data: catalog, error: catalogError } = await getSupabaseAdmin().from('offering_catalog').select('id').eq('is_active', true).in('id', data.selected_item_ids);
  if (catalogError) return null;
  const known = new Set((catalog ?? []).map((item) => item.id));
  if (!data.selected_item_ids.every((id: string) => known.has(id))) return null;
  return { recipientName: data.recipient_name, senderName: data.sender_name, message: data.message, wishes: data.wishes ?? '', selectedOfferings: data.selected_item_ids as OfferingId[] };
}

export async function getOfferingId(rawToken: string) {
  if (!isValidShareToken(rawToken)) return null;
  const { data } = await getSupabaseAdmin().from('offerings').select('id').eq('share_token_hash', hashShareToken(rawToken)).eq('status', 'active').maybeSingle();
  return data?.id ?? null;
}

export type SenderInboxOffering = {
  recipientName: string;
  senderName: string;
  response: { message: string; createdAt: string } | null;
};

export async function getOfferingBySenderToken(rawToken: string): Promise<SenderInboxOffering | null> {
  if (!isValidShareToken(rawToken)) return null;
  const { data, error } = await getSupabaseAdmin().from('offerings').select('id,recipient_name,sender_name,status').eq('sender_access_token_hash', hashShareToken(rawToken)).eq('status', 'active').maybeSingle();
  if (error || !data) return null;
  const { data: response, error: responseError } = await getSupabaseAdmin().from('recipient_responses').select('message,created_at').eq('offering_id', data.id).maybeSingle();
  if (responseError) return null;
  return { recipientName: data.recipient_name, senderName: data.sender_name, response: response ? { message: response.message, createdAt: response.created_at } : null };
}
