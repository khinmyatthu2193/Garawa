import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { ShareLinkActions } from '@/components/dashboard/share-link-actions';
import { offeringCatalog } from '@/lib/offering-catalog';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getOwnedOfferings } from '@/lib/services/offerings';

export const dynamic = 'force-dynamic';

export default async function OfferingHistoryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { data: { user } } = await (await getSupabaseServer()).auth.getUser();
  if (!user) redirect('/login?next=/dashboard/offerings');
  const page = Math.max(1, Number.parseInt((await searchParams).page ?? '1', 10) || 1);
  const history = await getOwnedOfferings(user.id, page);
  return <><SiteHeader /><main className="container-page section-pad"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">MY GARAWA</p><h1 className="section-title mt-2">á€¡á€¬á€¸á€œá€¯á€¶á€¸á€€á€¼á€Šá€·á€ºá€›á€”á€º</h1><p className="mt-2 text-[var(--muted)]">á€•á€±á€¸á€•á€­á€¯á€·á€‘á€¬á€¸á€á€²á€· á€€á€”á€ºá€á€±á€¬á€·á€œá€€á€ºá€†á€±á€¬á€„á€ºá€¡á€¬á€¸á€œá€¯á€¶á€¸á€€á€­á€¯ á€’á€®á€™á€¾á€¬ á€€á€¼á€Šá€·á€ºá€”á€­á€¯á€„á€ºá€•á€«á€á€šá€ºá‹</p></div><Link href="/create" className="pill-button">á€œá€€á€ºá€†á€±á€¬á€„á€ºá€¡á€žá€…á€º á€•á€±á€¸á€•á€­á€¯á€·á€™á€šá€º</Link></div>{history.items.length ? <div className="mt-10 grid gap-4 md:grid-cols-2">{history.items.map((item) => <article key={item.id} className="storybook-card p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-extrabold">{item.recipient_name}</h2><p className="mt-1 text-sm text-[var(--muted)]">{new Date(item.created_at).toLocaleDateString('my-MM')}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.response ? 'bg-[#E8F0E4] text-[var(--green)]' : 'bg-[#FFF1D8] text-[#8D3430]'}`}>{item.response ? 'á€†á€¯á€á€±á€¬á€„á€ºá€¸á€…á€¬ á€›á€›á€¾á€­á€•á€¼á€®á€¸' : 'á€…á€±á€¬á€„á€·á€ºá€”á€±á€•á€«á€žá€Šá€º'}</span></div><div className="mt-4 flex flex-wrap gap-2">{item.selected_item_ids.map((id: string) => <span key={id} className="rounded-full bg-[#F3DCC9] px-3 py-1 text-xs font-bold text-[#493129]">{offeringCatalog.find((entry) => entry.id === id)?.name ?? id}</span>)}</div><ShareLinkActions url={item.recipientShareToken ? `/offering/${item.recipientShareToken}` : null} /><Link href={`/dashboard/offerings/${item.id}`} className="mt-4 block text-sm font-bold text-[var(--red)] underline underline-offset-4">á€¡á€žá€±á€¸á€…á€­á€á€ºá€€á€¼á€Šá€·á€ºá€™á€Šá€º â†’</Link></article>)}</div> : <div className="storybook-card mt-10 p-8 text-center"><p className="text-4xl" aria-hidden="true">ðŸŒ¸</p><h2 className="mt-3 text-xl font-extrabold">á€•á€±á€¸á€•á€­á€¯á€·á€‘á€¬á€¸á€á€²á€· offering á€™á€›á€¾á€­á€žá€±á€¸á€•á€«</h2><p className="mt-2 text-sm leading-7 text-[var(--muted)]">á€•á€‘á€™á€†á€¯á€¶á€¸ á€†á€¯á€á€±á€¬á€„á€ºá€¸á€œá€€á€ºá€†á€±á€¬á€„á€ºá€á€…á€ºá€á€¯á€€á€­á€¯ á€–á€”á€ºá€á€®á€¸á€œá€­á€¯á€€á€ºá€•á€«á‹</p><Link href="/create" className="pill-button mt-6">á€œá€€á€ºá€†á€±á€¬á€„á€ºá€–á€”á€ºá€á€®á€¸á€™á€Šá€º</Link></div>}{history.hasMore && <div className="mt-8 text-center"><Link href={`/dashboard/offerings?page=${page + 1}`} className="pill-button secondary">á€”á€±á€¬á€€á€ºá€‘á€•á€ºá€€á€¼á€Šá€·á€ºá€™á€Šá€º</Link></div>}</main></>;
}

