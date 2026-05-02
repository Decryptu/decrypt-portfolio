export interface Subscription {
  readonly defaultPrice: number;
  readonly id: string;
  readonly name: string;
}

// Typical annual prices in USD. Adjust here to change the calculator defaults.
export const subscriptions: readonly Subscription[] = [
  { id: "shutterstock", name: "Shutterstock", defaultPrice: 4000 },
  { id: "getty", name: "Getty Images", defaultPrice: 3000 },
  { id: "adobe-stock", name: "Adobe Stock", defaultPrice: 2400 },
  { id: "istock", name: "iStock", defaultPrice: 1200 },
  { id: "depositphotos", name: "Depositphotos", defaultPrice: 2000 },
  { id: "iconscout", name: "Iconscout", defaultPrice: 300 },
  { id: "envato", name: "Envato Elements", defaultPrice: 468 },
  { id: "freepik", name: "Freepik Premium+", defaultPrice: 294 },
  { id: "flaticon", name: "Flaticon", defaultPrice: 120 },
  { id: "figma", name: "Figma (per seat)", defaultPrice: 192 },
  { id: "canva", name: "Canva Pro Teams", defaultPrice: 360 },
  { id: "creative-cloud", name: "Adobe Creative Cloud", defaultPrice: 1200 },
  { id: "midjourney", name: "Midjourney Pro", defaultPrice: 576 },
  { id: "chatgpt-team", name: "ChatGPT Team", defaultPrice: 300 },
  { id: "claude-team", name: "Claude Team", defaultPrice: 300 },
  { id: "runway", name: "Runway Unlimited", defaultPrice: 912 },
  { id: "zapier", name: "Zapier Team", defaultPrice: 828 },
  { id: "elevenlabs", name: "ElevenLabs Scale", defaultPrice: 3588 },
] as const;

export const SAVINGS_RATIO = 0.92 as const;
