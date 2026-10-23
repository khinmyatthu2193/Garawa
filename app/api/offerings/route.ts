import { NextResponse } from 'next/server';
import { createOffering } from '@/lib/services/offerings';
import { checkRateLimit, requestKey } from '@/lib/security/rate-limit';
import { hasAcceptableBodySize, isAllowedMutationOrigin } from '@/lib/security/request';
import { offeringInputSchema } from '@/lib/validation/offering';
import { getSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let user;
  try {
    const result = await (await getSupabaseServer()).auth.getUser();
    user = result.data.user;
  } catch {
    return NextResponse.json({ error: 'ဆက်လက်လုပ်ဆောင်ရန် အရင်ဝင်ရောက်ပါ။' }, { status: 401 });
  }
  if (!user) return NextResponse.json({ error: 'ဆက်လက်လုပ်ဆောင်ရန် အရင်ဝင်ရောက်ပါ။' }, { status: 401 });
  if (!hasAcceptableBodySize(request) || !isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'တောင်းဆိုချက်ကို လက်မခံနိုင်ပါ။' }, { status: 400 });
  const limit = await checkRateLimit(`publish:${requestKey(request)}`);
  if (!limit.allowed) return NextResponse.json({ error: 'ခဏနားပြီးမှ ထပ်ကြိုးစားပေးပါ။' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  try {
    const body: unknown = await request.json();
    const parsed = offeringInputSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'အချက်အလက်များကို ပြန်စစ်ပေးပါ။' }, { status: 400 });
    const result = await createOffering({ ...parsed.data, senderUserId: user.id, idempotencyKey: request.headers.get('idempotency-key')?.slice(0, 128) });
    if (result.kind === 'invalid_catalog') return NextResponse.json({ error: 'ရွေးထားသော လက်ဆောင်အချို့ကို အသုံးပြုခွင့်မရှိသေးပါ။ ရွေးချယ်မှုကို ပြန်စစ်ပါ။' }, { status: 422 });
    if (result.kind === 'duplicate') return NextResponse.json({ error: 'ဤဖန်တီးမှုကို လက်ခံရရှိပြီးဖြစ်ပါတယ်။ ထပ်မံမပို့ဘဲ ပြန်စစ်ပေးပါ။' }, { status: 409 });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    return NextResponse.json({ shareUrl: `${baseUrl.replace(/\/$/, '')}/offering/${result.recipientToken}`, senderInboxUrl: `${baseUrl.replace(/\/$/, '')}/inbox/${result.senderToken}` }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'ကန်တော့လက်ဆောင်ကို ယခုမဖန်တီးနိုင်သေးပါ။ နောက်တစ်ကြိမ် ထပ်ကြိုးစားပေးပါ။' }, { status: 500 });
  }
}
