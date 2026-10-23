import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/quiz/api-auth';
import { getAttemptForUser } from '@/lib/quiz/attempts';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser(); if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { id } = await params; const attempt = await getAttemptForUser(user.id, id); if (!attempt) return NextResponse.json({ error: 'Attempt not found.' }, { status: 404 });
  return NextResponse.json({ ...attempt, questions: attempt.questions.map(({ question, ...row }) => ({ ...row, question: question ? toPublicQuestionSafe(question) : null })) }, { headers: { 'Cache-Control': 'no-store' } });
}

function toPublicQuestionSafe(question: NonNullable<Awaited<ReturnType<typeof getAttemptForUser>>['questions'][number]['question']>) { const { answer: _answer, source: _source, reviewStatus: _reviewStatus, ...safe } = question; return safe; }
