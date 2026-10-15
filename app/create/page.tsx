import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { OfferingWizard } from '@/components/creator/offering-wizard';

export default function CreatePage() {
  return <><SiteHeader /><main><OfferingWizard /></main><SiteFooter /></>;
}
