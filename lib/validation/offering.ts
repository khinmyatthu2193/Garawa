import { z } from 'zod';

export const offeringInputSchema = z.object({
  recipientName: z.string().trim().min(1, 'လက်ခံသူအမည် ဖြည့်ပေးပါ။').max(80, 'အမည်ကို စာလုံး ၈၀ ထက် မကျော်ပါစေနဲ့။'),
  senderName: z.string().trim().min(1, 'ပေးပို့သူအမည် ဖြည့်ပေးပါ။').max(80, 'အမည်ကို စာလုံး ၈၀ ထက် မကျော်ပါစေနဲ့။'),
  selectedOfferings: z.array(z.string()).min(1, 'လက်ဆောင်တစ်မျိုး အနည်းဆုံး ရွေးပေးပါ။').max(20),
  message: z.string().trim().min(1, 'ကန်တော့စာလေး ရေးပေးပါ။').max(500, 'ကန်တော့စာကို စာလုံး ၅၀၀ ထက် မကျော်ပါစေနဲ့။'),
  wishes: z.string().max(300, 'ဆုတောင်းစာကို စာလုံး ၃၀၀ ထက် မကျော်ပါစေနဲ့။').optional().default(''),
});

export const responseInputSchema = z.object({
  message: z.string().trim().min(1, 'စာလေး ရေးပေးပါ။').max(300, 'စာကို စာလုံး ၃၀၀ ထက် မကျော်ပါစေနဲ့။'),
});
