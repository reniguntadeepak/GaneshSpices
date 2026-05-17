export const SPICE_CATEGORIES = [
  'Whole Spices',
  'Ground Spices',
  'Spice Blends',
  'Chilies & Peppers',
  'Seeds & Nuts',
  'Herbs & Leaves',
  'Other',
];

const CATEGORY_EMOJI = {
  'Whole Spices': '🫘',
  'Ground Spices': '🟡',
  'Spice Blends': '🍛',
  'Chilies & Peppers': '🌶️',
  'Seeds & Nuts': '🥜',
  'Herbs & Leaves': '🍃',
  Other: '✨',
};

const NAME_EMOJI = {
  turmeric: '🟡',
  cumin: '🟤',
  coriander: '🌿',
  chili: '🌶️',
  chilli: '🌶️',
  pepper: '⚫',
  cardamom: '💚',
  cinnamon: '🟫',
  clove: '🌸',
  nutmeg: '🥜',
  garam: '🍛',
  masala: '🍛',
  ginger: '🫚',
  garlic: '🧄',
  mustard: '🟡',
  fenugreek: '🌱',
  saffron: '🧡',
  bay: '🍃',
  star: '⭐',
  paprika: '🔴',
  ajwain: '🌿',
  fennel: '🌼',
};

export function getSpiceEmoji(category, name = '') {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(NAME_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return CATEGORY_EMOJI[category] || '🌶️';
}

export function getCategorySlug(category) {
  return (category || 'other')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-');
}

export const HOME_CATEGORIES = [
  { label: 'Whole Spices', emoji: '🫘', desc: 'Bold aroma, slow-released flavor' },
  { label: 'Ground Spices', emoji: '🟡', desc: 'Fine powders for everyday cooking' },
  { label: 'Spice Blends', emoji: '🍛', desc: 'Curated masalas & regional mixes' },
  { label: 'Chilies & Peppers', emoji: '🌶️', desc: 'Heat levels for every palate' },
];
