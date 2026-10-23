import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
  return <section className="section-pad"><div className="container-page"><div className="closing-invitation"><div className="closing-art closing-art-fallback" aria-hidden="true"><span /><span /><span /></div><div className="closing-copy"><p className="eyebrow text-[#F4D39A]">A LITTLE OFFERING. A LOT OF LOVE.</p><h2 className="mt-4 text-[clamp(1.8rem,3.4vw,3rem)] font-bold leading-[1.65]">အမှတ်တရလေးတစ်ခုကို ဒီနေ့ ဖန်တီးလိုက်ပါ။</h2><p className="body-my mt-4 max-w-xl text-[#F8E8DF]">မေတ္တာနဲ့ ပြောချင်တဲ့ စကားလေးတွေကို လက်ဆောင်လေးတစ်ခုအဖြစ် ပြောင်းလဲပေးလိုက်ပါ။</p><Link href="/create" className="mt-8 inline-flex min-h-[54px] items-center gap-2 rounded-full bg-white px-7 py-3 font-bold text-[#8D3430] transition hover:bg-[#FFF0D7]">ကန်တော့လက်ဆောင် ဖန်တီးမယ် <ArrowRight size={18} /></Link></div></div></div></section>;
}
