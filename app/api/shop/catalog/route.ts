import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/quiz/api-auth';
import { getShopCatalogForUser } from '@/lib/shop/catalog';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() { const user = await getAuthenticatedUser(); if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); try { const [items, wallet] = await Promise.all([getShopCatalogForUser(user.id), getSupabaseAdmin().from('user_wallets').select('balance').eq('user_id', user.id).maybeSingle()]); return NextResponse.json({ items, balance: wallet.data?.balance ?? 0 }, { headers: { 'Cache-Control': 'no-store' } }); } catch { return NextResponse.json({ error: 'Unable to load shop catalog.' }, { status: 500 }); } }
