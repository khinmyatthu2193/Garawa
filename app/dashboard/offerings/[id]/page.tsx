import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { QrShare } from '@/components/creator/qr-share';
import { ShareLinkActions } from '@/components/dashboard/share-link-actions';
import { offeringCatalog } from '@/lib/offering-catalog';
import { getSupabaseServer } from '@/lib/supabase/server';
import { getOwnedOfferingDetail } from '@/lib/services/owned-offerings';

export const dynamic = 'force-dynamic';

export default async function OfferingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/dashboard/offerings');
  const result = await getOwnedOfferingDetail(supabase, user.id, (await params).id);
  if (result.kind === 'missing') notFound();
  if (result.kind === 'error') return <OfferingDetailsError />;
  const offering = result.offering;
  const shareUrl = offering.recipientShareToken ? `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/offering/${offering.recipientShareToken}` : null;
  return <><SiteHeader /><main className="container-page section-pad"><Link href="/dashboard/offerings" className="text-sm font-bold text-[var(--red)]">← အားလုံးကြည့်ရန်</Link><div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">OFFERING DETAILS</p><h1 className="section-title mt-2">{offering.recipient_name} ထံသို့</h1><p className="mt-2 text-[var(--muted)]">{new Date(offering.created_at).toLocaleString('my-MM')}</p></div></div><div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><section className="storybook-card p-6 sm:p-8"><h2 className="text-xl font-extrabold">မူရင်းကန်တော့လက်ဆောင်</h2><dl className="mt-6 space-y-5"><div><dt className="text-sm font-bold text-[var(--muted)]">ပေးပို့သူ</dt><dd className="mt-1">{offering.sender_name}</dd></div><div><dt className="text-sm font-bold text-[var(--muted)]">လက်ခံသူ</dt><dd className="mt-1">{offering.recipient_name}</dd></div><div><dt className="text-sm font-bold text-[var(--muted)]">ရွေးချယ်ထားသော ပစ္စည်းများ</dt><dd className="mt-2 flex flex-wrap gap-2">{offering.selected_item_ids.map((id) => <span key={id} className="rounded-full bg-[#F3DCC9] px-3 py-1 text-sm font-bold">{offeringCatalog.find((entry) => entry.id === id)?.name ?? id}</span>)}</dd></div><div><dt className="text-sm font-bold text-[var(--muted)]">မူရင်းစာ</dt><dd className="mt-1 whitespace-pre-wrap leading-8">{offering.message}</dd></div>{offering.wishes && <div><dt className="text-sm font-bold text-[var(--muted)]">ဆုတောင်းစကား</dt><dd className="mt-1 whitespace-pre-wrap leading-8">{offering.wishes}</dd></div>}</dl><div className="mt-8 border-t border-[var(--line)] pt-6"><h2 className="text-lg font-extrabold">လက်ခံသူထံ မျှဝေရန်</h2><ShareLinkActions url={shareUrl} />{shareUrl && <QrShare url={shareUrl} />}</div></section><section className="storybook-card p-6 sm:p-8"><h2 className="text-xl font-extrabold">လက်ခံသူ၏ ဆုတောင်းစာ</h2>{offering.response ? <article className="mt-6 rounded-[24px] bg-[#E8F0E4] p-5"><p className="whitespace-pre-wrap text-lg leading-9">{offering.response.message}</p><p className="mt-5 border-t border-[#C8D8C2] pt-4 text-xs text-[var(--muted)]">{new Date(offering.response.created_at).toLocaleString('my-MM')}</p></article> : <div className="mt-6 rounded-[24px] bg-[#F3DCC9] p-6"><p className="text-3xl" aria-hidden="true">🌸</p><p className="mt-3 leading-8">ဆုတောင်းစကားလေး ပြန်လည်ရရှိဖို့ စောင့်မျှော်နေပါတယ်။ 🌸</p></div>}</section></div></main></>;
}

function OfferingDetailsError() { return <><SiteHeader /><main className="container-page section-pad"><section className="storybook-card mx-auto max-w-2xl p-8 text-center sm:p-12"><p className="text-4xl" aria-hidden="true">!</p><h1 className="section-title mt-4">အသေးစိတ်အချက်အလက်များကို မဖွင့်နိုင်သေးပါ</h1><p className="mt-4 leading-8 text-[var(--muted)]">ကန်တော့လက်ဆောင်အချက်အလက်များကို ဖတ်ရာတွင် ပြဿနာတစ်ခု ဖြစ်နေပါတယ်။ ခဏအကြာတွင် ပြန်လည်ကြိုးစားပေးပါ။</p><Link href="/dashboard/offerings" className="pill-button secondary mt-7">← အားလုံးကြည့်ရန်</Link></section></main></>; }
