import 'server-only';
import { createHash } from 'node:crypto';
import { createShareToken, hashShareToken, isValidShareToken } from '@/lib/security/tokens';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { validateCatalogIds } from '@/lib/services/catalog';
import { decryptShareToken, encryptShareToken } from '@/lib/security/recoverable-share-token';
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

export type OwnedOffering = {
  id: string; recipient_name: string; sender_name: string; message: string; wishes: string | null;
  selected_item_ids: string[]; created_at: string; response: { message: string; created_at: string } | null;
  recipientShareToken: string | null;
};

export async function getOwnedOffering(userId: string, id: string): Promise<OwnedOffering | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from('offerings').select('id,recipient_name,sender_name,message,wishes,selected_item_ids,created_at,recipient_share_token_encrypted,recipient_responses(message,created_at)').eq('id', id).eq('sender_user_id', userId).maybeSingle();
  if (error || !data) return null;
  const responses = Array.isArray(data.recipient_responses) ? data.recipient_responses : [];
  return { id: data.id, recipient_name: data.recipient_name, sender_name: data.sender_name, message: data.message, wishes: data.wishes, selected_item_ids: data.selected_item_ids, created_at: data.created_at, response: responses[0] ?? null, recipientShareToken: data.recipient_share_token_encrypted ? decryptShareToken(data.recipient_share_token_encrypted) : null };
}

export async function getOwnedOfferings(userId: string, page = 1, pageSize = 12) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await getSupabaseAdmin().from('offerings').select('id,recipient_name,sender_name,selected_item_ids,created_at,recipient_share_token_encrypted,recipient_responses(message,created_at)', { count: 'exact' }).eq('sender_user_id', userId).order('created_at', { ascending: false }).range(from, to);
  if (error) throw error;
  return { items: (data ?? []).map((item) => ({ ...item, recipientShareToken: item.recipient_share_token_encrypted ? decryptShareToken(item.recipient_share_token_encrypted) : null, response: Array.isArray(item.recipient_responses) ? item.recipient_responses[0] ?? null : null })), total: count ?? 0, hasMore: to + 1 < (count ?? 0) };
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
