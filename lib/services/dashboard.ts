import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function getDashboardData(userId: string) {
  const admin = getSupabaseAdmin();
  const { count: offeringCount } = await admin.from('offerings').select('id', { count: 'exact', head: true }).eq('sender_user_id', userId);
  const { data: offerings } = await admin.from('offerings').select('id,recipient_name,sender_name,created_at,status').eq('sender_user_id', userId).order('created_at', { ascending: false }).limit(10);
  const { data: blessings } = await admin.from('offerings').select('id,recipient_name,recipient_responses(message,created_at)').eq('sender_user_id', userId).order('created_at', { ascending: false }).limit(20);
  const recentBlessings = (blessings ?? []).flatMap((offering) => (offering.recipient_responses ?? []).map((response) => ({ ...response, offeringId: offering.id, recipientName: offering.recipient_name }))).sort((a, b) => b.created_at.localeCompare(a.created_at));
  return { offerings: offerings ?? [], blessings: recentBlessings, offeringCount: offeringCount ?? 0, blessingCount: recentBlessings.length };
}
