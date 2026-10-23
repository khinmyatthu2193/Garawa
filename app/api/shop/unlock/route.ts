import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/quiz/api-auth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { checkRateLimit, requestKey } from '@/lib/security/rate-limit';
import { hasAcceptableBodySize, isAllowedMutationOrigin } from '@/lib/security/request';

export const dynamic = 'force-dynamic';
const unlockSchema = z.object({ itemId: z.string().min(1).max(100) });

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(); if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (!hasAcceptableBodySize(request) || !isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  const limit = await checkRateLimit(`shop-unlock:${user.id}:${requestKey(request)}`); if (!limit.allowed) return NextResponse.json({ error: 'Please try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  const parsed = unlockSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: 'Invalid catalog item.' }, { status: 400 });
  const idempotencyKey = request.headers.get('Idempotency-Key')?.trim().slice(0, 128); if (!idempotencyKey) return NextResponse.json({ error: 'Idempotency-Key is required.' }, { status: 400 });
  const { data, error } = await getSupabaseAdmin().rpc('unlock_premium_offering', { p_user_id: user.id, p_catalog_item_id: parsed.data.itemId, p_idempotency_key: idempotencyKey });
  if (error || !data?.[0]) return NextResponse.json({ error: 'Unable to process unlock.' }, { status: 500 });
  const result = data[0]; const statusMap: Record<string, number> = { unlocked: 200, already_owned: 200, insufficient_points: 409, unavailable: 404 }; const status = statusMap[result.status] ?? 500;
  return NextResponse.json({ status: result.status, price: Number(result.price), balance: Number(result.wallet_balance), unlockedAt: result.unlocked_at ?? null }, { status, headers: { 'Cache-Control': 'no-store' } });
}
