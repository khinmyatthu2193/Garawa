import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/quiz/api-auth';
import { getAttemptForUser } from '@/lib/quiz/attempts';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { checkRateLimit, requestKey } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';
const answerSchema = z.object({ questionId: z.string().min(1).max(100), answer: z.string().min(1).max(500) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(); if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const limit = await checkRateLimit(`quiz-answer:${user.id}:${requestKey(request)}`); if (!limit.allowed) return NextResponse.json({ error: 'Please try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  const parsed = answerSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: 'Invalid answer.' }, { status: 400 });
  const { id: attemptId } = await params; const attempt = await getAttemptForUser(user.id, attemptId); if (!attempt) return NextResponse.json({ error: 'Attempt not found.' }, { status: 404 });
  const row = attempt.questions.find((item) => item.question_id === parsed.data.questionId); const question = row?.question;
  if (!row || !question) return NextResponse.json({ error: 'Question is not in this attempt.' }, { status: 400 });
  if (attempt.status === 'completed') return NextResponse.json({ error: 'This attempt is already complete.' }, { status: 409 });
  if (row.answered_at) return NextResponse.json({ correct: Boolean(row.is_correct), pointsAwarded: 0, completionBonus: 0, alreadyAnswered: true, explanation: question.explanation, answer: question.answer, walletBalance: await walletBalance(user.id) }, { headers: { 'Cache-Control': 'no-store' } });
  const normalized = parsed.data.answer.trim(); const isCorrect = normalized === question.answer; const points = isCorrect ? (question.type === 'fill-blank' ? 15 : 10) : 0; const willComplete = attempt.questions.filter((item) => item.answered_at).length === 4;
  const { data, error } = await getSupabaseAdmin().rpc('record_quiz_answer', { p_user_id: user.id, p_attempt_id: attemptId, p_question_id: question.id, p_submitted_answer: normalized, p_is_correct: isCorrect, p_question_points: points, p_complete: willComplete });
  if (error || !data?.[0]) { const status = error?.message.includes('completed') || error?.message.includes('answered') ? 409 : 500; return NextResponse.json({ error: status === 409 ? 'This answer was already submitted.' : 'Unable to record answer.' }, { status }); }
  const result = data[0]; return NextResponse.json({ correct: isCorrect, pointsAwarded: Number(result.question_points_awarded), completionBonus: Number(result.completion_bonus_awarded), alreadyAnswered: false, explanation: question.explanation, answer: question.answer, walletBalance: Number(result.wallet_balance), completed: Boolean(result.attempt_completed) }, { headers: { 'Cache-Control': 'no-store' } });
}

async function walletBalance(userId: string) { const { data } = await getSupabaseAdmin().from('user_wallets').select('balance').eq('user_id', userId).maybeSingle(); return data?.balance ?? 0; }
