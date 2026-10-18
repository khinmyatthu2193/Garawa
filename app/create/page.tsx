import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { OfferingWizard } from '@/components/creator/offering-wizard';
import { getSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CreatePage() {
  try {
    const { data: { user } } = await (await getSupabaseServer()).auth.getUser();
    if (!user) redirect('/login?next=/create');
  } catch {
    redirect('/login?next=/create');
  }
  return <><SiteHeader /><main><OfferingWizard /></main><SiteFooter /></>;
}
