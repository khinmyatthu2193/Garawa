'use client';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
export function LogoutButton() { return <button onClick={async () => { await createSupabaseBrowserClient().auth.signOut(); window.location.assign('/'); }} className="text-sm font-bold text-[var(--red)]">ထွက်မယ်</button>; }
