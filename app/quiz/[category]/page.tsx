import { redirect, notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { QuizPlayer } from '@/components/quiz/quiz-player';
import { getQuizCategory } from '@/lib/quiz/questions';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function QuizGameplayPage({ params }: { params: Promise<{ category: string }> }) { const { category: categoryId } = await params; const category = getQuizCategory(categoryId); if (!category) notFound(); const supabase = await getSupabaseServer(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect(`/login?next=/quiz/${categoryId}`); return <><SiteHeader /><QuizPlayer category={category} /></>; }
