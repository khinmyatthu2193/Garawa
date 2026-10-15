import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { CeremonyExperience } from '@/components/ceremony/ceremony-experience';
import { mockOffering } from '@/lib/mock-offering';

export default function CeremonyDemoPage() {
  return <><SiteHeader /><CeremonyExperience offering={mockOffering} /><SiteFooter /></>;
}
