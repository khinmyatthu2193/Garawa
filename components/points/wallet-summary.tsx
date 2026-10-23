'use client';

import { useEffect, useState } from 'react';

type Transaction = { amount: number; transaction_type: string; created_at: string };

export function WalletSummary({ history = false }: { history?: boolean }) {
  const [balance, setBalance] = useState<number | null>(null); const [transactions, setTransactions] = useState<Transaction[]>([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([fetch('/api/player/wallet').then((response) => response.json()), history ? fetch('/api/player/points/history').then((response) => response.json()) : Promise.resolve({ transactions: [] })]).then(([wallet, ledger]) => { if (typeof wallet.balance !== 'number') throw new Error(wallet.error); setBalance(wallet.balance); setTransactions(ledger.transactions ?? []); }).catch((caught) => setError(caught instanceof Error ? caught.message : 'Points ကို ဖတ်မရသေးပါ။')); }, [history]);
  if (error) return <p role="alert" className="text-sm text-[var(--red)]">{error}</p>;
  return <div className="storybook-card p-5"><p className="text-sm text-[var(--muted)]">သင့် Garawa Points</p><p className="mt-2 text-3xl font-extrabold text-[var(--red)]">{balance === null ? '—' : balance}</p><p className="mt-2 text-xs leading-6 text-[var(--muted)]">လေ့လာရေးရမှတ်များသာ ဖြစ်ပြီး ငွေကြေးတန်ဖိုးမရှိပါ။</p>{history && <div className="mt-5 border-t border-[var(--line)] pt-4"><h3 className="font-bold">Points မှတ်တမ်း</h3>{transactions.length ? <div className="mt-3 space-y-2">{transactions.map((transaction) => <div key={`${transaction.created_at}-${transaction.transaction_type}`} className="flex justify-between gap-4 text-sm"><span>{transaction.transaction_type === 'completion_bonus' ? 'Quiz ပြီးဆုံးဆု' : 'မေးခွန်းအဖြေဆု'}</span><strong className="text-[var(--green)]">+{transaction.amount}</strong></div>)}</div> : <p className="mt-2 text-sm text-[var(--muted)]">Points မှတ်တမ်း မရှိသေးပါ။</p>}</div>}</div>;
}
