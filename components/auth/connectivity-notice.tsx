import { Info } from 'lucide-react';

export function ConnectivityNotice({ mode }: { mode: 'login' | 'signup' }) {
  const title = mode === 'login' ? 'အကောင့်ဝင်ရာမှာ အခက်အခဲရှိနေပါသလား? 🌸' : 'အကောင့်ဖွင့်ရာမှာ အခက်အခဲရှိနေပါသလား? 🌸';
  return <aside className="mt-6 rounded-[22px] border border-[#E9DFD0] bg-[#FFF8E9] p-4 text-sm leading-7 text-[#493129]" aria-label="Connectivity information"><div className="flex gap-3"><Info className="mt-1 shrink-0 text-[#8D3430]" size={18} aria-hidden="true" /><div><h2 className="font-extrabold">{title}</h2><p className="mt-1 text-[#746A5F]">အင်တာနက်ချိတ်ဆက်မှု အခြေအနေကြောင့် တစ်ခါတလေ အကောင့်ဝင်တာ၊ အကောင့်ဖွင့်တာတွေ အဆင်မပြေဖြစ်နိုင်ပါတယ်။ အဲဒီလိုဖြစ်ခဲ့ရင် VPN အသုံးပြုပြီး ပြန်လည်ကြိုးစားကြည့်နိုင်ပါတယ်နော်။ အဆင်ပြေနေတယ်ဆိုရင်တော့ VPN သုံးဖို့ မလိုပါဘူး။</p><p className="mt-2 text-xs font-semibold text-[#8D3430]">ဂါရဝကို အသုံးပြုပေးတဲ့အတွက် ကျေးဇူးတင်ပါတယ်။</p></div></div></aside>;
}
