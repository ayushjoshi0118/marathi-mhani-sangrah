/**
 * Devanagari Text Validator & Orthographic Sanitizer
 * 
 * Verifies that candidate Marathi proverbs, meanings, and examples
 * conform strictly to standard Devanagari orthography and contain
 * no extraneous Latin, corrupted glyphs, or invalid formatting.
 */

export interface ValidationCheckResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  normalizedText: string;
}

// Allowed Devanagari characters, matras, viramas, numerals, and standard punctuation
// Devanagari Unicode Block: U+0900 to U+097F
const DEVANAGARI_REGEX = /^[\u0900-\u097F0-9\s।,?!:;'"’‘“”\-–—.]*$/;
const LATIN_REGEX = /[a-zA-Z]/;
const ORPHAN_MATRA_REGEX = /^[\u093E-\u094C\u094D\u0902\u0903]/;

export function validateDevanagariProverb(text: string): ValidationCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!text || typeof text !== 'string') {
    return {
      valid: false,
      errors: ['म्हणीचा मजकूर रिक्त किंवा अवैध आहे (Text is empty or not a string).'],
      warnings: [],
      normalizedText: '',
    };
  }

  const trimmed = text.trim();

  // 1. Length validation
  if (trimmed.length < 3) {
    errors.push('म्हण अत्यंत लहान आहे (Proverb is too short; minimum 3 characters).');
  }
  if (trimmed.length > 120) {
    warnings.push('म्हण असामान्यपणे लांब आहे (Proverb is unusually long; >120 characters).');
  }

  // 2. Reject Latin characters in Devanagari text
  if (LATIN_REGEX.test(trimmed)) {
    errors.push('मराठी मजकुरात इंग्रजी/लॅटिन अक्षरे सापडली (Contains English/Latin characters).');
  }

  // 3. Devanagari character set check
  if (!DEVANAGARI_REGEX.test(trimmed)) {
    // Find unauthorized characters
    const invalidChars = trimmed
      .split('')
      .filter((char) => !DEVANAGARI_REGEX.test(char))
      .slice(0, 5);
    errors.push(
      `अवैध किंवा विकृत अक्षरे सापडली: ${invalidChars.join(', ')} (Invalid or corrupted characters).`
    );
  }

  // 4. Broken orthography: standalone matra at start of text
  if (ORPHAN_MATRA_REGEX.test(trimmed)) {
    errors.push('सुरुवातीलाच अनाथ मात्रा किंवा अनुस्वार सापडला (Text starts with orphan matra/anusvara).');
  }

  // 5. Replace pipe '|' with proper Devanagari danda '।'
  let sanitized = trimmed.replace(/\|{2}/g, '॥').replace(/\|/g, '।');

  // 6. Multiple consecutive spaces
  sanitized = sanitized.replace(/\s+/g, ' ');

  // 7. Word count check (traditional proverbs typically have at least 2 words)
  const words = sanitized.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    warnings.push('म्हणीमध्ये फक्त एकच शब्द आहे. ही म्हण नसून केवळ वाक्प्रचार असू शकतो.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    normalizedText: sanitized,
  };
}

export function validateDevanagariMeaningAndExample(
  meaning: string,
  example: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!meaning || meaning.trim().length < 5) {
    errors.push('मराठी अर्थ अपूर्ण किंवा रिक्त आहे (Marathi meaning is missing or too short).');
  } else if (LATIN_REGEX.test(meaning)) {
    errors.push('मराठी अर्थामध्ये इंग्रजी अक्षरे आहेत (Marathi meaning contains Latin characters).');
  }

  if (!example || example.trim().length < 10) {
    errors.push('मराठी उदाहरण अपूर्ण किंवा रिक्त आहे (Marathi usage example is missing or too short).');
  } else if (LATIN_REGEX.test(example)) {
    errors.push('मराठी उदाहरणामध्ये इंग्रजी अक्षरे आहेत (Marathi example contains Latin characters).');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
