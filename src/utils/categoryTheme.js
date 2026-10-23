// Themed look for a product when its photo is missing or fails to load,
// so the grid never shows a broken image or an unrelated random photo.
const THEMES = {
  'emergency kits': { icon: 'kit', from: '#7a2e4d', to: '#b4566f' },
  dresses: { icon: 'hanger', from: '#5e2039', to: '#c9762c' },
  kurtis: { icon: 'sparkle', from: '#a9502f', to: '#e0a15a' },
  footwear: { icon: 'shoe', from: '#3b2a4a', to: '#8d5a86' },
  accessories: { icon: 'gem', from: '#2f6f5e', to: '#7fb3a0' },
}
const DEFAULT_THEME = { icon: 'bag', from: '#7a2e4d', to: '#c9762c' }

export function themeFor(categoryName) {
  return THEMES[(categoryName || '').trim().toLowerCase()] ?? DEFAULT_THEME
}