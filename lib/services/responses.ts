import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function createRecipientResponse(offeringId: string, message: string) {
  return getSupabaseAdmin().from('recipient_responses').insert({ offering_id: offeringId, message }).select('id').single();
}

export function isDuplicateResponseError(error: { code?: string } | null) {
  return error?.code === '23505';
}
