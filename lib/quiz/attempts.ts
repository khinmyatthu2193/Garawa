import 'server-only';

import { createHash, randomUUID } from 'node:crypto';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getApprovedQuestions, getQuestionById, toPublicQuestion } from '@/lib/quiz/questions';
import type { QuizCategoryId, PublicQuizQuestion } from '@/lib/quiz/types';

export type StartedQuiz = { id: string; categoryId: QuizCategoryId; questions: PublicQuizQuestion[]; questionIds: string[]; walletBalance: number };

export async function startQuizAttempt(userId: string, categoryId: QuizCategoryId): Promise<StartedQuiz | null> {
  const bank = getApprovedQuestions(categoryId);
  if (bank.length < 5) return null;
  const { data: rewarded } = await getSupabaseAdmin().from('rewarded_questions').select('question_id').eq('user_id', userId).in('question_id', bank.map((question) => question.id));
  const rewardedIds = new Set((rewarded ?? []).map((row) => row.question_id));
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  const preferred = shuffled.filter((question) => !rewardedIds.has(question.id));
  const selected = [...preferred, ...shuffled.filter((question) => rewardedIds.has(question.id))].slice(0, 5);
  const questionIds = selected.map((question) => question.id);
  const canonicalHash = createHash('sha256').update([...questionIds].sort().join('|')).digest('hex');
  const admin = getSupabaseAdmin();
  const { data: attempt, error } = await admin.from('quiz_attempts').insert({ id: randomUUID(), user_id: userId, category_id: categoryId, canonical_question_set_hash: canonicalHash }).select('id').single();
  if (error || !attempt) throw error ?? new Error('Unable to create quiz attempt.');
  const { error: questionError } = await admin.from('quiz_attempt_questions').insert(selected.map((question, index) => ({ attempt_id: attempt.id, question_id: question.id, position: index + 1 })));
  if (questionError) throw questionError;
  const { data: wallet } = await admin.from('user_wallets').select('balance').eq('user_id', userId).maybeSingle();
  return { id: attempt.id, categoryId, questions: selected.map(toPublicQuestion), questionIds, walletBalance: wallet?.balance ?? 0 };
}

export async function getAttemptForUser(userId: string, attemptId: string) {
  const admin = getSupabaseAdmin();
  const { data: attempt, error } = await admin.from('quiz_attempts').select('id,user_id,category_id,status,started_at,completed_at,canonical_question_set_hash').eq('id', attemptId).eq('user_id', userId).maybeSingle();
  if (error || !attempt) return null;
  const { data: rows, error: questionError } = await admin.from('quiz_attempt_questions').select('question_id,position,submitted_answer,is_correct,answered_at').eq('attempt_id', attemptId).order('position');
  if (questionError) throw questionError;
  return { ...attempt, questions: (rows ?? []).map((row) => ({ ...row, question: getQuestionById(row.question_id) })) };
}
