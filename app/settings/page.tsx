import { redirect } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SettingsForm } from '@/components/auth/settings-form';
import { getSupabaseServer } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
export default async function SettingsPage() { const supabase = await getSupabaseServer(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/login?next=/settings'); const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle(); return <><SiteHeader /><main className="container-page section-pad max-w-2xl"><p className="eyebrow">SETTINGS</p><h1 className="section-title mt-2">အကောင့်ဆက်တင်များ</h1><p className="mt-3 mb-8 text-[var(--muted)]">သင့်အကောင့်အချက်အလက်တွေကို ပြင်ဆင်ပါ။</p><SettingsForm email={user.email ?? ''} displayName={profile?.display_name ?? ''} /></main></> }
