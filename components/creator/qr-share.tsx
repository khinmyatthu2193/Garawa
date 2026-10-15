'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

export function QrShare({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setReady(false);
    setError('');
    QRCode.toCanvas(canvas, url, { errorCorrectionLevel: 'M', margin: 4, width: 220, color: { dark: '#302820', light: '#FFFFFF' } })
      .then(() => setReady(true))
      .catch(() => setError('QR ကုဒ်ကို ယခုဖန်တီး၍ မရသေးပါ။'));
  }, [url]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) { setError('QR ကုဒ် အဆင်သင့်မဖြစ်သေးပါ။ ခဏစောင့်ပြီး ထပ်ကြိုးစားပါ။'); return; }
    try {
      const link = document.createElement('a');
      link.download = 'garawa-offering-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch { setError('QR ပုံကို ဒေါင်းလုဒ်မလုပ်နိုင်သေးပါ။'); }
  };

  return <div className="mt-6 rounded-[24px] border border-[#E9DFD0] bg-[#FFFDF7] p-5 text-center"><p className="font-bold text-[#493129]">QR ကုဒ်ဖြင့် မျှဝေမည်</p><div className="mx-auto mt-4 flex min-h-[252px] max-w-[252px] items-center justify-center rounded-xl bg-white p-4"><canvas ref={canvasRef} aria-label="QR code for the recipient offering" /></div>{error && <p role="alert" className="mt-3 text-sm text-[#8D3430]">{error}</p>}<button type="button" onClick={download} disabled={!ready} className="pill-button secondary mt-4 disabled:cursor-not-allowed disabled:opacity-50"><Download size={17} /> QR ပုံ ဒေါင်းလုဒ်မည်</button></div>;
}
