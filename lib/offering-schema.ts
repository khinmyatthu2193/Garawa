import { z } from 'zod';
const requiredName = z.string().trim().min(1, 'အမည်လေး ဖြည့်ပေးပါ။').max(80, 'အမည်ကို စာလုံး ၈၀ ထက် မကျော်ပါစေနဲ့။');
export const personalDetailsSchema = z.object({ recipientName: requiredName, senderName: requiredName });
export const offeringSelectionSchema = z.object({ selectedOfferings: z.array(z.string()).min(1, 'လက်ဆောင်တစ်မျိုး အနည်းဆုံး ရွေးပေးပါ။') });
export const messageSchema = z.object({ message: z.string().trim().min(1, 'မေတ္တာစာလေး ရေးပေးပါ။').max(500, 'မေတ္တာစာကို စာလုံး ၅၀၀ ထက် မကျော်ပါစေနဲ့။'), wishes: z.string().max(300, 'ဆုတောင်းစာကို စာလုံး ၃၀၀ ထက် မကျော်ပါစေနဲ့။') });
export const offeringSchema = personalDetailsSchema.merge(offeringSelectionSchema).merge(messageSchema);
