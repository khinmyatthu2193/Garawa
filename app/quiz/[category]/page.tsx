import { redirect, notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { QuizPlayer } from '@/components/quiz/quiz-player';
import { getApprovedQuestions, getQuizCategory } from '@/lib/quiz/questions';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function QuizGameplayPage({ params }: { params: Promise<{ category: string }> }) { const { category: categoryId } = await params; const category = getQuizCategory(categoryId); if (!category) notFound(); const supabase = await getSupabaseServer(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect(`/login?next=/quiz/${categoryId}`); const questions = getApprovedQuestions(category.id); return <><SiteHeader />{questions.length < 5 ? <main className="container-page section-pad"><div className="storybook-card mx-auto max-w-xl p-8 text-center"><h1 className="section-title">ဒီအမျိုးအစားကို မကြာမီ ပြင်ဆင်ပေးပါမယ်</h1><p className="mt-4 leading-7 text-[var(--muted)]">အတည်ပြုထားသော မေးခွန်း ၅ ခု မပြည့်သေးပါ။ မေးခွန်းများကို ထပ်မံစစ်ဆေးပြီးမှ ဖွင့်ပေးပါမည်။</p></div></main> : <QuizPlayer category={category} questions={questions.slice(0, 5)} />}</>; }
