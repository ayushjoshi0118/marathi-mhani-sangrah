/**
 * Devanagari and Marathi linguistic text processing utilities.
 * Handles Unicode normalization, Marathi numerals, phonetic matching, and search indexing.
 */

// Marathi Devanagari numerals
const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Convert standard Arabic number (e.g., 42) to Devanagari numerals (e.g., ४२).
 */
export function toMarathiNumerals(num: number | string, padToDigits: number = 0): string {
  const str = String(num);
  const marathi = str.replace(/[0-9]/g, (digit) => MARATHI_DIGITS[parseInt(digit, 10)]);
  if (padToDigits > 0) {
    const currentLength = str.length;
    if (currentLength < padToDigits) {
      const zerosNeeded = padToDigits - currentLength;
      return MARATHI_DIGITS[0].repeat(zerosNeeded) + marathi;
    }
  }
  return marathi;
}

export const toDevanagariDigits = toMarathiNumerals;

/**
 * Format serial number as #०००१ / #1.
 */
export function formatSerialNumber(serial: number): string {
  return `#${toMarathiNumerals(serial, 4)} (${serial})`;
}

/**
 * Remove Devanagari punctuation (danda, double danda, commas, quotes, hyphens)
 * and normalize whitespace.
 */
export function normalizeMarathiText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFC')
    // Remove danda (। U+0964) and double danda (॥ U+0965)
    .replace(/[\u0964\u0965]/g, ' ')
    // Remove punctuation, brackets, quotes
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'–—]/g, ' ')
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Simple phonetic transliteration map for Latin to Devanagari search queries.
 * Allows visitors typing "ati tithe mati" or "garva" to match Marathi proverbs.
 */
const PHONETIC_MAP: Record<string, string> = {
  a: 'अ', aa: 'आ', i: 'इ', ee: 'ई', u: 'उ', oo: 'ऊ', e: 'ए', ai: 'ऐ', o: 'ओ', au: 'औ',
  ka: 'क', kha: 'ख', ga: 'ग', gha: 'घ', nga: 'ङ',
  cha: 'च', chha: 'छ', ja: 'ज', jha: 'झ',
  ta: 'त', tha: 'थ', da: 'द', dha: 'ध', na: 'न',
  pa: 'प', pha: 'फ', fa: 'फ', ba: 'ब', bha: 'भ', ma: 'म',
  ya: 'य', ra: 'र', la: 'ल', va: 'व', wa: 'व',
  sha: 'श', sa: 'स', ha: 'ह', laa: 'ळा', lha: 'ळ'
};

/**
 * Check if a text contains Devanagari characters.
 */
export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Generate a clean URL slug from Marathi or English text.
 */
export function generateSlug(text: string, serialNumber?: number): string {
  // Transliterate common words or clean text
  const clean = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  if (isDevanagari(clean)) {
    return serialNumber ? `mhan-${serialNumber}` : clean.replace(/\s+/g, '-');
  }

  return clean.toLowerCase().slice(0, 60);
}

/**
 * Universal search matcher for proverbs.
 * Matches against Marathi text, normalized representation, English meaning, and serial numbers.
 */
export function matchesSearch(
  proverb: {
    proverb: string;
    normalized: string;
    meaningMarathi: string;
    meaningEnglish: string;
    serialNumber: number;
    englishEquivalent?: string | null;
    tags: string[];
    category: string;
  },
  query: string
): boolean {
  if (!query || !query.trim()) return true;

  const rawQuery = query.trim();
  const normalizedQuery = normalizeMarathiText(rawQuery);

  // 1. Direct serial number search (e.g., "12", "#12", "१२")
  const numericQuery = rawQuery.replace(/[^0-9]/g, '');
  if (numericQuery && parseInt(numericQuery, 10) === proverb.serialNumber) {
    return true;
  }
  // Check Devanagari numerals
  const marathiSerial = toMarathiNumerals(proverb.serialNumber);
  if (rawQuery.includes(marathiSerial)) {
    return true;
  }

  // 2. Exact or partial normalized Marathi proverb search
  if (proverb.normalized.includes(normalizedQuery)) {
    return true;
  }

  // 3. Search in Marathi meaning
  const normalizedMeaningMarathi = normalizeMarathiText(proverb.meaningMarathi);
  if (normalizedMeaningMarathi.includes(normalizedQuery)) {
    return true;
  }

  // 4. Search in English meaning or English equivalent
  const englishLowerQuery = rawQuery.toLowerCase();
  if (proverb.meaningEnglish.toLowerCase().includes(englishLowerQuery)) {
    return true;
  }
  if (proverb.englishEquivalent && proverb.englishEquivalent.toLowerCase().includes(englishLowerQuery)) {
    return true;
  }

  // 5. Search in category and tags
  if (proverb.category.toLowerCase().includes(englishLowerQuery) || proverb.category.includes(rawQuery)) {
    return true;
  }
  if (proverb.tags.some(tag => tag.toLowerCase().includes(englishLowerQuery) || tag.includes(rawQuery))) {
    return true;
  }

  // 6. Transliterated search aid: if user typed Roman characters, check if query matches transliterated words
  if (!isDevanagari(rawQuery)) {
    const queryTokens = englishLowerQuery.split(/\s+/).filter(Boolean);
    // Common transliterated Marathi tokens check
    const proverbRomanized = transliterateMarathiToRoman(proverb.proverb);
    if (queryTokens.every(token => proverbRomanized.includes(token))) {
      return true;
    }
  }

  return false;
}

/**
 * Basic transliteration of Devanagari to Roman text for search matching.
 */
export function transliterateMarathiToRoman(devanagariText: string): string {
  const charMap: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ru',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
    'ं': 'n', '्': '', '़': ''
  };

  let result = '';
  for (const char of devanagariText) {
    result += charMap[char] || char;
  }
  return result.toLowerCase();
}
