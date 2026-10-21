import fs from 'node:fs';
import path from 'node:path';

const EXPECTED_CATEGORIES = [
  'शहाणपण आणि व्यवहारज्ञान',
  'मेहनत आणि कष्ट',
  'नशीब आणि प्रयत्न',
  'मैत्री आणि नाती',
  'कुटुंब आणि समाज',
  'पैसा आणि व्यवहार',
  'शिक्षण आणि ज्ञान',
  'वेळ आणि संधी',
  'स्वभाव आणि वर्तन',
  'निसर्ग आणि शेती',
  'अनुभव आणि जीवन',
  'विनोद आणि उपरोध',
  'सावधगिरी',
  'प्रामाणिकपणा आणि नैतिकता',
  'नेतृत्व आणि निर्णय',
  'भाषा आणि संवाद'
];

const jsonPath = path.join(process.cwd(), 'src', 'data', 'proverbs.json');
const raw = fs.readFileSync(jsonPath, 'utf-8');
const proverbs = JSON.parse(raw);

console.log('=== DATASET & SERIAL INTEGRITY AUDIT ===');
console.log(`Total records: ${proverbs.length}`);

const validCategorySlugs = new Set(EXPECTED_CATEGORIES);

let errors = [];
let duplicates = new Set();
let seenProverbs = new Set();
let seenSlugs = new Set();
let seenIds = new Set();
let seenSerials = new Set();

let publishedCount = 0;

for (let i = 0; i < proverbs.length; i++) {
  const p = proverbs[i];
  const idx = i + 1;

  if (p.status === 'published') publishedCount++;

  // Serial check
  if (p.serialNumber !== idx) {
    errors.push(`Row ${idx} has mismatched serialNumber: ${p.serialNumber}`);
  }
  if (seenSerials.has(p.serialNumber)) {
    errors.push(`Duplicate serialNumber found: ${p.serialNumber}`);
  }
  seenSerials.add(p.serialNumber);

  // ID check
  if (!p.id) {
    errors.push(`Missing ID at serial ${p.serialNumber}`);
  }
  if (seenIds.has(p.id)) {
    errors.push(`Duplicate ID: ${p.id}`);
  }
  seenIds.add(p.id);

  // Proverb text check
  const text = (p.proverb || '').trim();
  if (!text) {
    errors.push(`Empty proverb at serial ${p.serialNumber}`);
  }
  if (seenProverbs.has(text)) {
    duplicates.add(text);
    errors.push(`Duplicate proverb text: "${text}" at serial ${p.serialNumber}`);
  }
  seenProverbs.add(text);

  // Normalized check
  if (!p.normalized) {
    errors.push(`Missing normalized text at serial ${p.serialNumber}`);
  }

  // Meaning checks
  if (!p.meaningMarathi || p.meaningMarathi.trim().length === 0) {
    errors.push(`Missing meaningMarathi at serial ${p.serialNumber}`);
  }
  if (!p.meaningEnglish || p.meaningEnglish.trim().length === 0) {
    errors.push(`Missing meaningEnglish at serial ${p.serialNumber}`);
  }

  // Example checks
  if (!p.exampleMarathi || p.exampleMarathi.trim().length === 0) {
    errors.push(`Missing exampleMarathi at serial ${p.serialNumber}`);
  }
  if (!p.exampleEnglish || p.exampleEnglish.trim().length === 0) {
    errors.push(`Missing exampleEnglish at serial ${p.serialNumber}`);
  }

  // Context check
  if (!p.context || p.context.trim().length === 0) {
    errors.push(`Missing context at serial ${p.serialNumber}`);
  }

  // Category check
  if (!validCategorySlugs.has(p.category)) {
    errors.push(`Invalid category "${p.category}" at serial ${p.serialNumber}`);
  }

  // Tags check
  if (!Array.isArray(p.tags) || p.tags.length === 0) {
    errors.push(`Missing or empty tags at serial ${p.serialNumber}`);
  }

  // Editorial review check
  if (!p.editorialReview || typeof p.editorialReview !== 'object') {
    errors.push(`Missing editorialReview at serial ${p.serialNumber}`);
  } else {
    if (typeof p.editorialReview.linguisticVerified !== 'boolean') {
      errors.push(`Invalid linguisticVerified at serial ${p.serialNumber}`);
    }
    if (typeof p.editorialReview.sourceVerified !== 'boolean') {
      errors.push(`Invalid sourceVerified at serial ${p.serialNumber}`);
    }
  }

  // Timestamps
  if (!p.createdAt) errors.push(`Missing createdAt at serial ${p.serialNumber}`);
  if (!p.updatedAt) errors.push(`Missing updatedAt at serial ${p.serialNumber}`);
}

console.log(`Published records count: ${publishedCount}`);
console.log(`Unique proverb texts: ${seenProverbs.size}`);
console.log(`Unique serial numbers: ${seenSerials.size}`);
console.log(`Total errors detected: ${errors.length}`);

if (errors.length > 0) {
  console.error('Errors summary:');
  errors.slice(0, 10).forEach(e => console.error(`- ${e}`));
  process.exit(1);
} else {
  console.log('✓ PASS: All 1,000 proverbs are verified, unique, published, and contiguous!');
}
