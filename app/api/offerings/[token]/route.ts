import { NextResponse } from 'next/server';
import { getOfferingByToken } from '@/lib/services/offerings';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const offering = await getOfferingByToken(token);
    if (!offering) return NextResponse.json({ error: 'ဒီကန်တော့လက်ဆောင်ကို ရှာမတွေ့ပါ။' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return NextResponse.json({ offering }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'ကန်တော့လက်ဆောင်ကို ယခုမဖွင့်နိုင်သေးပါ။' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
