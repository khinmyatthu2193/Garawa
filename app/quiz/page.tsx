import { redirect } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { QuizCenter } from '@/components/quiz/quiz-center';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function QuizPage() { const supabase = await getSupabaseServer(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login?next=/quiz'); return <><SiteHeader /><QuizCenter /></>; }
