export type PriceTier = 'premium' | 'standard' | 'value';

export type CheckoutProductType =
  | 'original'
  | 'print-standard'
  | 'print-large'
  | 'altar-9x12'
  | 'altar-11x14'
  | 'altar-16x20'
  | 'soul-altar-9x12'
  | 'soul-altar-11x14'
  | 'soul-altar-16x20';

const TIER_PRICES: Record<
  PriceTier,
  { original: number; printStandard: number; printLarge: number }
> = {
  premium: { original: 111100, printStandard: 7700, printLarge: 11100 },
  standard: { original: 99900, printStandard: 7700, printLarge: 11100 },
  value: { original: 69900, printStandard: 6600, printLarge: 9900 },
};

export const ALTAR_PRICES = {
  '9x12': 39900,
  '11x14': 49900,
  '16x20': 59900,
} as const;

export function getTierPrices(tier: PriceTier) {
  return TIER_PRICES[tier];
}

export function getCheckoutAmount(type: CheckoutProductType, tier?: PriceTier): number {
  if (type === 'soul-altar-9x12' || type === 'altar-9x12') return ALTAR_PRICES['9x12'];
  if (type === 'soul-altar-11x14' || type === 'altar-11x14') return ALTAR_PRICES['11x14'];
  if (type === 'soul-altar-16x20' || type === 'altar-16x20') return ALTAR_PRICES['16x20'];
  if (!tier) throw new Error('Price tier required for artwork products');
  const prices = getTierPrices(tier);
  if (type === 'original') return prices.original;
  if (type === 'print-standard') return prices.printStandard;
  if (type === 'print-large') return prices.printLarge;
  throw new Error(`Unknown checkout type: ${type}`);
}

export function formatUsd(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function getCheckoutLabel(type: CheckoutProductType): string {
  const labels: Record<CheckoutProductType, string> = {
    original: 'Original Artwork',
    'print-standard': 'Standard Print (11×14 in)',
    'print-large': 'Large Print (16×20 in)',
    'altar-9x12': 'Soul Art Altar (9×12 in)',
    'altar-11x14': 'Soul Art Altar (11×14 in)',
    'altar-16x20': 'Soul Art Altar (16×20 in)',
    'soul-altar-9x12': 'Soul Activation Art Altar (9×12 in)',
    'soul-altar-11x14': 'Soul Activation Art Altar (11×14 in)',
    'soul-altar-16x20': 'Soul Activation Art Altar (16×20 in)',
  };
  return labels[type];
}

export function getCheckoutDescription(type: CheckoutProductType): string {
  if (type === 'original') {
    return 'One-of-one original hand-drawn artwork. 11×14 inches. Colored pencils & ink on paper.';
  }
  if (type === 'print-standard') {
    return 'High-quality archival standard print, 11×14 inches. Made to order. Certificate of authenticity included.';
  }
  if (type === 'print-large') {
    return 'High-quality archival large print, 16×20 inches. Made to order. Certificate of authenticity included.';
  }
  if (type.startsWith('altar-')) {
    return 'Framed Soul Art Altar — a sacred display piece featuring your chosen OM\'RAK artwork, ready for your sacred space.';
  }
  return 'Soul Activation Art Altar — a custom sacred mirror of your essence, created through Alina\'s alien channeling. Includes questionnaire, ritual activation, microchip integration, and full digital access.';
}
