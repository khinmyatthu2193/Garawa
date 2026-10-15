import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { CeremonyExperience } from '@/components/ceremony/ceremony-experience';
import { OfferingUnavailable } from '@/components/ceremony/offering-unavailable';
import { getOfferingByToken } from '@/lib/services/offerings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OfferingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const offering = await getOfferingByToken(token);
    if (!offering) return <><SiteHeader /><OfferingUnavailable /><SiteFooter /></>;
    return <><SiteHeader /><CeremonyExperience offering={offering} shareToken={token} /><SiteFooter /></>;
  } catch {
    return <><SiteHeader /><OfferingUnavailable /><SiteFooter /></>;
  }
}
