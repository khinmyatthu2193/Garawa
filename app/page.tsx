import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { HeroSection } from '@/components/landing/hero-section';
import { MeaningSection } from '@/components/landing/meaning-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { OfferingShowcase } from '@/components/landing/offering-showcase';
import { RecipientPreview } from '@/components/landing/recipient-preview';
import { FinalCta } from '@/components/landing/final-cta';

export default function Home() { return <><SiteHeader /><main><HeroSection /><MeaningSection /><HowItWorks /><OfferingShowcase /><RecipientPreview /><FinalCta /></main><SiteFooter /></>; }
