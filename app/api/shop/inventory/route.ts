import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/quiz/api-auth';
import { getUserInventory } from '@/lib/shop/catalog';

export const dynamic = 'force-dynamic';

export async function GET() { const user = await getAuthenticatedUser(); if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 }); try { return NextResponse.json({ items: await getUserInventory(user.id) }, { headers: { 'Cache-Control': 'no-store' } }); } catch { return NextResponse.json({ error: 'Unable to load collection.' }, { status: 500 }); } }
