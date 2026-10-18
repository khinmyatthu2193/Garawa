import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';
const profileSchema = z.object({ displayName: z.string().trim().min(1).max(80) });
export async function PUT(request: Request) { const supabase = await getSupabaseServer(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: 'ဝင်ရောက်ရန် လိုအပ်ပါသည်။' }, { status: 401 }); const parsed = profileSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: 'အမည်ကို ပြန်စစ်ပါ။' }, { status: 400 }); const { error } = await supabase.from('profiles').update({ display_name: parsed.data.displayName, updated_at: new Date().toISOString() }).eq('id', user.id); if (error) return NextResponse.json({ error: 'အမည်သိမ်းမရသေးပါ။' }, { status: 500 }); return NextResponse.json({ ok: true }); }
