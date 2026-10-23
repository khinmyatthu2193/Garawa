import { redirect, notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { QuizResultView } from '@/components/quiz/quiz-result';
import { getQuizCategory } from '@/lib/quiz/questions';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function QuizResultPage({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!getQuizCategory(category)) notFound(); const supabase = await getSupabaseServer(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect(`/login?next=/quiz/${category}/result`); return <><SiteHeader /><QuizResultView categoryId={category} /></>; }
