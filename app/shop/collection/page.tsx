import { redirect } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { CollectionPage } from '@/components/shop/collection-page';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export default async function CollectionRoute() { const { data: { user } } = await (await getSupabaseServer()).auth.getUser(); if (!user) redirect('/login?next=/shop/collection'); return <><SiteHeader /><CollectionPage /></>; }
