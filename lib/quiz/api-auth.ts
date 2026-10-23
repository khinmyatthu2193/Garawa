import 'server-only';

import { getSupabaseServer } from '@/lib/supabase/server';

export async function getAuthenticatedUser() {
  const { data: { user } } = await (await getSupabaseServer()).auth.getUser();
  return user;
}
