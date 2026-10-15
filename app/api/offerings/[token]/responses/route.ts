import { NextResponse } from 'next/server';
import { createRecipientResponse, isDuplicateResponseError } from '@/lib/services/responses';
import { getOfferingId } from '@/lib/services/offerings';
import { checkRateLimit, requestKey } from '@/lib/security/rate-limit';
import { hasAcceptableBodySize, isAllowedMutationOrigin } from '@/lib/security/request';
import { responseInputSchema } from '@/lib/validation/offering';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!hasAcceptableBodySize(request, 8_192) || !isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'တောင်းဆိုချက်ကို လက်မခံနိုင်ပါ။' }, { status: 400 });
  const limit = await checkRateLimit(`response:${requestKey(request)}`);
  if (!limit.allowed) return NextResponse.json({ error: 'ခဏနားပြီးမှ ထပ်ကြိုးစားပေးပါ။' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  const { token } = await params;
  try {
    const offeringId = await getOfferingId(token);
    if (!offeringId) return NextResponse.json({ error: 'ဒီကန်တော့လက်ဆောင်ကို ရှာမတွေ့ပါ။' }, { status: 404 });
    const parsed = responseInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'စာကို ပြန်စစ်ပေးပါ။' }, { status: 400 });
    const { error } = await createRecipientResponse(offeringId, parsed.data.message);
    if (isDuplicateResponseError(error)) return NextResponse.json({ error: 'တုံ့ပြန်မှုတစ်ခု ရှိပြီးဖြစ်ပါတယ်။' }, { status: 409 });
    if (error) throw error;
    return NextResponse.json({ saved: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'တုံ့ပြန်မှုကို ယခုသိမ်းမရသေးပါ။ နောက်တစ်ကြိမ် ထပ်ကြိုးစားပေးပါ။' }, { status: 500 });
  }
}
