import Image from 'next/image';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase/server';
import { SiteNavigation } from '@/components/layout/site-navigation';

export async function SiteHeader() {
  const isConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const { data: { user } } = isConfigured ? await (await getSupabaseServer()).auth.getUser() : { data: { user: null } };
  return <header className="relative z-20 border-b border-[#e9dfd0]/70"><nav aria-label="Main navigation" className="container-page flex min-h-[78px] items-center justify-between gap-4"><Link href="/" className="shrink-0" aria-label="Garawa home"><Image src="/logo.png" alt="Garawa" width={170} height={102} priority className="h-16 w-[112px] object-contain object-left sm:h-[70px] sm:w-[150px]" /></Link><SiteNavigation user={user ? { email: user.email ?? undefined, displayName: user.user_metadata?.display_name, avatarUrl: user.user_metadata?.avatar_url ?? user.user_metadata?.picture } : null} /></nav></header>;
}
