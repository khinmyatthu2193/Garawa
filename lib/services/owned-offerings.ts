import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { decryptShareToken } from '@/lib/security/recoverable-share-token';

export type OwnedOfferingDetail = {
  id: string; recipient_name: string; sender_name: string; message: string; wishes: string | null;
  selected_item_ids: string[]; created_at: string; response: { message: string; created_at: string } | null;
  recipientShareToken: string | null;
};

type QueryResult = { kind: 'found'; offering: OwnedOfferingDetail } | { kind: 'missing' } | { kind: 'error'; error: Error };

export async function getOwnedOfferingDetail(supabase: SupabaseClient, userId: string, id: string): Promise<QueryResult> {
  const { data, error } = await supabase.from('offerings').select('id,recipient_name,sender_name,message,wishes,selected_item_ids,created_at').eq('id', id).eq('sender_user_id', userId).maybeSingle();
  if (error) return { kind: 'error', error };
  if (!data) return { kind: 'missing' };

  const { data: response, error: responseError } = await supabase.from('recipient_responses').select('message,created_at').eq('offering_id', data.id).maybeSingle();
  if (responseError) return { kind: 'error', error: responseError };

  // This column was added after the original schema. A missing migration must
  // not make the complete offering detail page fail.
  let recipientShareToken: string | null = null;
  const { data: tokenData } = await supabase.from('offerings').select('recipient_share_token_encrypted').eq('id', data.id).eq('sender_user_id', userId).maybeSingle();
  if (tokenData?.recipient_share_token_encrypted) recipientShareToken = decryptShareToken(tokenData.recipient_share_token_encrypted);
  return { kind: 'found', offering: { ...data, response: response ?? null, recipientShareToken } };
}

export async function getOwnedOfferingHistory(supabase: SupabaseClient, userId: string, page = 1, pageSize = 12) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await supabase.from('offerings').select('id,recipient_name,sender_name,selected_item_ids,created_at', { count: 'exact' }).eq('sender_user_id', userId).order('created_at', { ascending: false }).range(from, to);
  if (error) throw error;
  const items = await Promise.all((data ?? []).map(async (item) => {
    const { data: response } = await supabase.from('recipient_responses').select('message,created_at').eq('offering_id', item.id).maybeSingle();
    const { data: tokenData } = await supabase.from('offerings').select('recipient_share_token_encrypted').eq('id', item.id).eq('sender_user_id', userId).maybeSingle();
    return { ...item, response: response ?? null, recipientShareToken: tokenData?.recipient_share_token_encrypted ? decryptShareToken(tokenData.recipient_share_token_encrypted) : null };
  }));
  return { items, total: count ?? 0, hasMore: to + 1 < (count ?? 0) };
}
