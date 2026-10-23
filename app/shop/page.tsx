import { redirect } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { ShopPage } from '@/components/shop/shop-page';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export default async function ShopRoute() { const { data: { user } } = await (await getSupabaseServer()).auth.getUser(); if (!user) redirect('/login?next=/shop'); return <><SiteHeader /><ShopPage /></>; }
