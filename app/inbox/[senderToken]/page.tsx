import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SenderInbox } from '@/components/inbox/sender-inbox';
import { OfferingUnavailable } from '@/components/ceremony/offering-unavailable';
import { getOfferingBySenderToken } from '@/lib/services/offerings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { referrer: 'no-referrer', robots: { index: false, follow: false } };

export default async function SenderInboxPage({ params }: { params: Promise<{ senderToken: string }> }) {
  const { senderToken } = await params;
  try {
    const inbox = await getOfferingBySenderToken(senderToken);
    return <><SiteHeader />{inbox ? <SenderInbox inbox={inbox} /> : <OfferingUnavailable /> }<SiteFooter /></>;
  } catch {
    return <><SiteHeader /><OfferingUnavailable /><SiteFooter /></>;
  }
}
