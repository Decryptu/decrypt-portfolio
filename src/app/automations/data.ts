export interface Subscription {
  readonly defaultPrice: number;
  readonly id: string;
  readonly name: string;
}

// Annual prices in EUR. Adjust here to change the calculator defaults.
export const subscriptions: readonly Subscription[] = [
  { id: "shutterstock", name: "Shutterstock", defaultPrice: 2400 },
  { id: "getty", name: "Getty Images", defaultPrice: 2000 },
  { id: "adobe-stock", name: "Adobe Stock", defaultPrice: 600 },
  { id: "istock", name: "iStock", defaultPrice: 500 },
  { id: "depositphotos", name: "Depositphotos", defaultPrice: 400 },
  { id: "iconscout", name: "Iconscout", defaultPrice: 240 },
  { id: "envato", name: "Envato Elements", defaultPrice: 200 },
  { id: "freepik", name: "Freepik Premium", defaultPrice: 110 },
  { id: "flaticon", name: "Flaticon", defaultPrice: 100 },
  { id: "figma", name: "Figma (per seat)", defaultPrice: 180 },
  { id: "canva", name: "Canva Pro Teams", defaultPrice: 360 },
  { id: "creative-cloud", name: "Adobe Creative Cloud", defaultPrice: 700 },
  { id: "midjourney", name: "Midjourney", defaultPrice: 350 },
  { id: "chatgpt-team", name: "ChatGPT Team", defaultPrice: 300 },
  { id: "claude-team", name: "Claude Team", defaultPrice: 350 },
  { id: "runway", name: "Runway", defaultPrice: 500 },
] as const;

export const SAVINGS_RATIO = 0.92 as const;
