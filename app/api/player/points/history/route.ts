import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/quiz/api-auth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() { const user = await getAuthenticatedUser(); if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); const { data, error } = await getSupabaseAdmin().from('point_transactions').select('amount,transaction_type,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30); if (error) return NextResponse.json({ error: 'Unable to load point history.' }, { status: 500 }); return NextResponse.json({ transactions: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } }); }
