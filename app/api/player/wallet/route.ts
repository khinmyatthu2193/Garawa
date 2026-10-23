import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/quiz/api-auth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() { const user = await getAuthenticatedUser(); if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); const { data, error } = await getSupabaseAdmin().from('user_wallets').select('balance').eq('user_id', user.id).maybeSingle(); if (error) return NextResponse.json({ error: 'Unable to load wallet.' }, { status: 500 }); return NextResponse.json({ balance: data?.balance ?? 0 }, { headers: { 'Cache-Control': 'no-store' } }); }
