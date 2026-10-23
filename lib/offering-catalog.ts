import type { OfferingId } from '@/types/offering';

export type OfferingItem = { id: OfferingId; name: string; englishName: string; description: string; emoji: string; color: string };

export const offeringCatalog: OfferingItem[] = [
  { id: 'flowers', name: 'ပန်းစည်း', englishName: 'Flower Bouquet', description: 'မေတ္တာလက်ဆောင်', emoji: '💐', color: '#F8D9D5' },
  { id: 'lotus', name: 'ကြာပန်း', englishName: 'Lotus Flowers', description: 'ငြိမ်းချမ်းခြင်းနှင့် လေးစားခြင်း', emoji: '🪷', color: '#F5E0E8' },
  { id: 'fruits', name: 'သစ်သီးခြင်း', englishName: 'Fruit Basket', description: 'ကျန်းမာပျော်ရွှင်စေဖို့', emoji: '🍎', color: '#F8E8C8' },
  { id: 'snacks', name: 'မြန်မာမုန့်များ', englishName: 'Traditional Snacks', description: 'အိမ်အရသာလေးတစ်စိတ်', emoji: '🍡', color: '#E9E6C9' },
  { id: 'tea', name: 'လက်ဖက်ရည်', englishName: 'Tea', description: 'အတူတူထိုင်သောက်ချင်တဲ့ လက်ဖက်ရည်', emoji: '🍵', color: '#DDE9D8' },
  { id: 'gift', name: 'လက်ဆောင်ခြင်း', englishName: 'Gift Basket', description: 'စိတ်ရင်းနဲ့ ရွေးထားတဲ့ လက်ဆောင်', emoji: '🎁', color: '#E7D9EB' },
  { id: 'premium-gift-basket', name: 'အထူးလက်ဆောင်ခြင်း', englishName: 'Traditional Premium Gift Basket', description: 'ရိုးရာအမှတ်တရများဖြင့် ပြင်ဆင်ထားသော အထူးလက်ဆောင်', emoji: '🎁', color: '#F2D39B' },
  { id: 'premium-lotus-arrangement', name: 'ကြာပန်းအလှဆင်', englishName: 'Decorative Premium Lotus', description: 'ငြိမ်းချမ်းမှုနှင့် ရိုသေမှုကို ကိုယ်စားပြုသော အထူးကြာပန်း', emoji: '🪷', color: '#E9D4E3' },
  { id: 'premium-lantern-gift', name: 'မီးပုံးအလင်းလက်ဆောင်', englishName: 'Lantern Light Gift', description: 'အလင်းရောင်နှင့် မေတ္တာကို မျှဝေသော အထူးလက်ဆောင်', emoji: '🏮', color: '#F3D5B5' },
];

export function getOffering(id: OfferingId) { return offeringCatalog.find((item) => item.id === id); }
