export type OfferingId = 'flowers' | 'lotus' | 'fruits' | 'snacks' | 'tea' | 'gift';
export type OfferingForm = { recipientName: string; senderName: string; selectedOfferings: OfferingId[]; message: string; wishes: string };
export type WizardStep = 1 | 2 | 3 | 4;
