import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/quiz/api-auth';
import { startQuizAttempt } from '@/lib/quiz/attempts';
import { checkRateLimit, requestKey } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';
const startSchema = z.object({ categoryId: z.enum(['proverbs', 'spelling', 'knowledge', 'childhood']) });

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const limit = await checkRateLimit(`quiz-start:${user.id}:${requestKey(request)}`);
  if (!limit.allowed) return NextResponse.json({ error: 'Please try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  const parsed = startSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid quiz category.' }, { status: 400 });
  try { const attempt = await startQuizAttempt(user.id, parsed.data.categoryId); if (!attempt) return NextResponse.json({ error: 'This quiz is not available yet.' }, { status: 409 }); return NextResponse.json(attempt, { status: 201, headers: { 'Cache-Control': 'no-store' } }); } catch { return NextResponse.json({ error: 'Unable to start quiz.' }, { status: 500 }); }
}
