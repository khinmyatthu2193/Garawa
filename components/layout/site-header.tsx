import Image from 'next/image';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/auth/logout-button';

export async function SiteHeader() {
  const isConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const { data: { user } } = isConfigured ? await (await getSupabaseServer()).auth.getUser() : { data: { user: null } };
  return <header className="relative z-20 border-b border-[#e9dfd0]/70"><nav aria-label="Main navigation" className="container-page flex min-h-[78px] items-center justify-between gap-4"><Link href="/" className="shrink-0" aria-label="Garawa home"><Image src="/logo.png" alt="Garawa" width={170} height={102} priority className="h-16 w-[112px] object-contain object-left sm:h-[70px] sm:w-[150px]" /></Link><div className="flex items-center gap-3 sm:gap-7"><a href="/#how-it-works" className="hidden text-sm font-semibold text-[#665b50] hover:text-[#8D3430] sm:inline">ဘယ်လိုအလုပ်လုပ်သလဲ</a>{user ? <><Link href="/dashboard" className="text-sm font-bold text-[var(--red)]">အကောင့်</Link><LogoutButton /></> : <Link href="/login" className="text-sm font-bold text-[var(--red)]">ဝင်ရောက်မယ်</Link>}<Link href="/create" className="rounded-full border border-[#8D3430] px-4 py-2.5 text-sm font-bold text-[#8D3430] transition hover:bg-[#8D3430] hover:text-white">ပေးပို့မယ် <span aria-hidden="true">↗</span></Link></div></nav></header>;
}
