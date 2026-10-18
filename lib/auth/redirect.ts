export function safeNext(value: string | null | undefined, fallback = '/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('://')) return fallback;
  return value;
}

export function authErrorMessage(message: string | undefined) {
  const text = message?.toLowerCase() ?? '';
  if (text.includes('invalid login')) return 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မမှန်ပါ။ ပြန်စစ်ပြီး ထပ်ကြိုးစားပါ။';
  if (text.includes('already registered') || text.includes('already exists')) return 'ဒီအီးမေးလ်နဲ့ အကောင့်ရှိပြီးသားပါ။ ဝင်ရောက်ပါ။';
  if (text.includes('password')) return 'စကားဝှက်ကို အနည်းဆုံး အက္ခရာ ၈ လုံးနဲ့ ထည့်ပါ။';
  if (text.includes('email')) return 'အီးမေးလ်လိပ်စာကို ပြန်စစ်ပါ။';
  return 'တစ်ခုခု အဆင်မပြေပါ။ ပြန်စစ်ပြီး ထပ်ကြိုးစားပါ။';
}
