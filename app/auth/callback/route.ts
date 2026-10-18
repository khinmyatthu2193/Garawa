import { NextResponse } from 'next/server';
import { safeNext } from '@/lib/auth/redirect';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next'));

  // Supabase can return an OAuth error before an application authorization
  // code exists. Never pass that error to exchangeCodeForSession().
  if (url.searchParams.get('error') || url.searchParams.get('error_code') || url.searchParams.get('error_description')) {
    return NextResponse.redirect(new URL('/login?error=oauth', request.url));
  }

  const code = url.searchParams.get('code');
  if (!code) return NextResponse.redirect(new URL('/login?error=oauth', request.url));

  // This is the single exchange for the one-time Supabase authorization code.
  // Do not retry it: a second exchange would report the code as already used.
  const { error } = await (await getSupabaseServer()).auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/login?error=oauth', request.url));

  return NextResponse.redirect(new URL(next, request.url));
}
