export type OfferingId = 'flowers' | 'lotus' | 'fruits' | 'snacks' | 'tea' | 'gift' | 'premium-gift-basket' | 'premium-lotus-arrangement' | 'premium-lantern-gift';
export type OfferingForm = { recipientName: string; senderName: string; selectedOfferings: OfferingId[]; message: string; wishes: string };
export type WizardStep = 1 | 2 | 3 | 4;
export type CeremonyStage = 'welcome' | 'offerings' | 'message' | 'response' | 'complete';
export type RecipientOffering = Pick<OfferingForm, 'recipientName' | 'senderName' | 'selectedOfferings' | 'message' | 'wishes'>;
