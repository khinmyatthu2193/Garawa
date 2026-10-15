import { NextResponse } from 'next/server';
import { getActiveCatalog } from '@/lib/services/catalog';

export async function GET() {
  try {
    const catalog = await getActiveCatalog();
    return NextResponse.json({ items: catalog }, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
  } catch {
    return NextResponse.json({ error: 'ကတ်တလောက်ကို ယခုမဖွင့်နိုင်သေးပါ။' }, { status: 503 });
  }
}
