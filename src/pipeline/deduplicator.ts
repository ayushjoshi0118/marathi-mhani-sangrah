/**
 * Duplicate & Variant Detection Engine for Marathi Proverbs
 * 
 * Computes textual similarity, token overlap, and Levenshtein distance
 * to distinguish between exact duplicates, dialectical variants,
 * and distinct proverbs.
 */

import { normalizeMarathiText } from '../lib/devanagari';

export interface SimilarityResult {
  isExactDuplicate: boolean;
  isLikelyVariant: boolean;
  similarityScore: number; // 0 to 1
  matchedProverb?: string;
  matchedSerial?: number;
  reason?: string;
}

/**
 * Standard Levenshtein Distance implementation
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const n = a.length;
  const m = b.length;

  if (n === 0) return m;
  if (m === 0) return n;

  for (let i = 0; i <= n; i++) matrix[i] = [i];
  for (let j = 0; j <= m; j++) matrix[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[n][m];
}

/**
 * Jaccard token similarity for sets of Marathi words
 */
function jaccardSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(textA.split(/\s+/).filter(Boolean));
  const wordsB = new Set(textB.split(/\s+/).filter(Boolean));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersectionCount = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) intersectionCount++;
  }

  const unionSize = new Set([...wordsA, ...wordsB]).size;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
}

/**
 * Normalized representation for comparing variants
 * Handles common phonetic alternates:
 * तिथे <-> तेथे
 * आणि <-> नि / व
 * नको <-> नकोस
 */
function getPhoneticKey(text: string): string {
  return normalizeMarathiText(text)
    .replace(/तेथे/g, 'तिथे')
    .replace(/आणि/g, '')
    .replace(/ नि /g, ' ')
    .replace(/ व /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check candidate proverb against an array of existing proverbs
 */
export function checkDuplicateOrVariant(
  candidateText: string,
  existingCollection: Array<{ serialNumber: number; proverb: string; normalized?: string }>
): SimilarityResult {
  const candidateNorm = normalizeMarathiText(candidateText);
  const candidatePhonetic = getPhoneticKey(candidateText);

  let highestScore = 0;
  let bestMatch: { serialNumber: number; proverb: string } | undefined;
  let isVariant = false;

  for (const existing of existingCollection) {
    const existingNorm = existing.normalized || normalizeMarathiText(existing.proverb);
    const existingPhonetic = getPhoneticKey(existing.proverb);

    // 1. Exact match on normalized text
    if (candidateNorm === existingNorm) {
      return {
        isExactDuplicate: true,
        isLikelyVariant: false,
        similarityScore: 1.0,
        matchedProverb: existing.proverb,
        matchedSerial: existing.serialNumber,
        reason: 'हुबेहूब जुळणारी म्हण आधीच संग्रहात अस्तित्वात आहे (Exact match in database).',
      };
    }

    // 2. Phonetic normalized match (e.g. अति तेथे माती vs अति तिथे माती)
    if (candidatePhonetic === existingPhonetic) {
      return {
        isExactDuplicate: false,
        isLikelyVariant: true,
        similarityScore: 0.98,
        matchedProverb: existing.proverb,
        matchedSerial: existing.serialNumber,
        reason: 'ही म्हण अस्तित्वात असलेल्या म्हणीचेच उच्चार किंवा प्रादेशिक रूप (Variant) आहे.',
      };
    }

    // 3. Jaccard & Levenshtein scores
    const jaccard = jaccardSimilarity(candidateNorm, existingNorm);
    const maxLen = Math.max(candidateNorm.length, existingNorm.length);
    const levDist = levenshteinDistance(candidateNorm, existingNorm);
    const levSim = maxLen > 0 ? 1 - levDist / maxLen : 0;

    // Combined score: 60% Levenshtein + 40% Jaccard
    const combinedScore = 0.6 * levSim + 0.4 * jaccard;

    if (combinedScore > highestScore) {
      highestScore = combinedScore;
      bestMatch = existing;
      if (jaccard >= 0.70 || levSim >= 0.85) {
        isVariant = true;
      }
    }
  }

  if (highestScore >= 0.90 && bestMatch) {
    return {
      isExactDuplicate: true,
      isLikelyVariant: false,
      similarityScore: highestScore,
      matchedProverb: bestMatch.proverb,
      matchedSerial: bestMatch.serialNumber,
      reason: `अत्यंत उच्च साम्य (${Math.round(highestScore * 100)}%): कदाचित स्पेलिंगचा फरक असलेला डुप्लिकेट आहे.`,
    };
  }

  if (isVariant && bestMatch) {
    return {
      isExactDuplicate: false,
      isLikelyVariant: true,
      similarityScore: highestScore,
      matchedProverb: bestMatch.proverb,
      matchedSerial: bestMatch.serialNumber,
      reason: `पर्यायी किंवा प्रादेशिक रूप (${Math.round(highestScore * 100)}% साम्य).`,
    };
  }

  return {
    isExactDuplicate: false,
    isLikelyVariant: false,
    similarityScore: highestScore,
    matchedProverb: bestMatch?.proverb,
    matchedSerial: bestMatch?.serialNumber,
    reason: highestScore > 0.4 ? `अंशतः साम्य आढळले (${Math.round(highestScore * 100)}%), पण वेगळी म्हण आहे.` : 'पूर्णपणे स्वतंत्र नवीन म्हण.',
  };
}
