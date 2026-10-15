import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const windowMs = 60_000;
const maxRequests = 10;

export function checkDevelopmentRateLimit(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (bucket.count >= maxRequests) return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function requestKey(request: Request) {
  const forwarded = process.env.TRUST_PROXY === 'true' ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() : null;
  return forwarded || 'local-development';
}

export async function checkRateLimit(key: string) {
  if (process.env.NODE_ENV !== 'production') return checkDevelopmentRateLimit(key);
  const { data, error } = await getSupabaseAdmin().rpc('consume_rate_limit', { p_key: key, p_limit: maxRequests, p_window_seconds: 60 });
  if (error || !data?.[0]) return { allowed: false, retryAfter: 60 };
  return { allowed: Boolean(data[0].allowed), retryAfter: Number(data[0].retry_after) || 0 };
}
