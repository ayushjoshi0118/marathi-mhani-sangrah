import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Load dataset directly from disk
const jsonPath = path.join(process.cwd(), 'src', 'data', 'proverbs.json');
const allProverbs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Pure logic implementations mirroring devanagari.ts
const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

function toMarathiNumerals(num, padToDigits = 0) {
  const str = String(num);
  const marathi = str.replace(/[0-9]/g, (digit) => MARATHI_DIGITS[parseInt(digit, 10)]);
  if (padToDigits > 0 && str.length < padToDigits) {
    return MARATHI_DIGITS[0].repeat(padToDigits - str.length) + marathi;
  }
  return marathi;
}

function normalizeMarathiText(text) {
  if (!text) return '';
  return text
    .normalize('NFC')
    .replace(/[\u0964\u0965]/g, ' ')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function matchesSearch(proverb, query) {
  if (!query || !query.trim()) return true;
  const rawQuery = query.trim();
  const normalizedQuery = normalizeMarathiText(rawQuery);

  // 1. Direct serial search
  const cleanedSerialStr = rawQuery.replace(/^#/, '').trim();
  const arabicDigits = cleanedSerialStr.replace(/[०-९]/g, (d) =>
    '०१२३४५६७८९'.indexOf(d).toString()
  );
  if (/^\d+$/.test(arabicDigits)) {
    if (parseInt(arabicDigits, 10) === proverb.serialNumber) {
      return true;
    }
  }

  // 2. Exact or partial normalized Marathi proverb search
  if (proverb.normalized.includes(normalizedQuery)) return true;

  // 3. Marathi meaning
  if (normalizeMarathiText(proverb.meaningMarathi).includes(normalizedQuery)) return true;

  // 4. English meaning or equivalent
  const englishLower = rawQuery.toLowerCase();
  if (proverb.meaningEnglish.toLowerCase().includes(englishLower)) return true;
  if (proverb.englishEquivalent && proverb.englishEquivalent.toLowerCase().includes(englishLower)) return true;

  // 5. Category or tags
  if (proverb.category.toLowerCase().includes(englishLower) || proverb.category.includes(rawQuery)) return true;
  if (proverb.tags.some((t) => t.toLowerCase().includes(englishLower) || t.includes(rawQuery))) return true;

  return false;
}

function getDailyProverb(targetDate) {
  const d = targetDate || new Date();
  const kolkataDateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [year, month, day] = kolkataDateStr.split('-').map(Number);
  const dayOfYear = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / (24 * 60 * 60 * 1000)
  );
  const index = Math.abs((year * 365 + dayOfYear * 17) % allProverbs.length);
  return {
    proverb: allProverbs[index],
    dateString: kolkataDateStr,
  };
}

test('Audit Suite 1: Full Dataset & Serial Number Integrity', async (t) => {
  await t.test('database has exactly 1,000 proverbs published', () => {
    assert.strictEqual(allProverbs.length, 1000);
    const published = allProverbs.filter((p) => p.status === 'published');
    assert.strictEqual(published.length, 1000);
  });

  await t.test('permanent serial numbers are strictly 1 to 1000 in unbroken sequence', () => {
    for (let i = 0; i < 1000; i++) {
      assert.strictEqual(allProverbs[i].serialNumber, i + 1);
    }
  });

  await t.test('each proverb has unique non-empty slug and id', () => {
    const slugs = new Set(allProverbs.map((p) => p.slug));
    const ids = new Set(allProverbs.map((p) => p.id));
    assert.strictEqual(slugs.size, 1000);
    assert.strictEqual(ids.size, 1000);
  });

  await t.test('no duplicate proverbs exist in the entire database', () => {
    const textSet = new Set(allProverbs.map((p) => p.proverb.trim()));
    assert.strictEqual(textSet.size, 1000);
  });

  await t.test('every proverb has valid non-empty Marathi and English meanings and examples', () => {
    for (const p of allProverbs) {
      assert.ok(p.meaningMarathi && p.meaningMarathi.trim().length > 0);
      assert.ok(p.meaningEnglish && p.meaningEnglish.trim().length > 0);
      assert.ok(p.exampleMarathi && p.exampleMarathi.trim().length > 0);
      assert.ok(p.exampleEnglish && p.exampleEnglish.trim().length > 0);
      assert.ok(p.context && p.context.trim().length > 0);
    }
  });
});

test('Audit Suite 2: Search Engine & Relevance Verification', async (t) => {
  await t.test('exact Devanagari title search finds the exact proverb', () => {
    const matched = allProverbs.filter((p) => matchesSearch(p, 'अति तिथे माती'));
    assert.ok(matched.length >= 1);
    assert.strictEqual(matched[0].serialNumber, 1);
  });

  await t.test('numeric serial search ("1" or "#12") targets exact entry without noise', () => {
    const matched1 = allProverbs.filter((p) => matchesSearch(p, '1'));
    assert.ok(matched1.some((p) => p.serialNumber === 1));

    const matched12 = allProverbs.filter((p) => matchesSearch(p, '#12'));
    assert.strictEqual(matched12.length, 1);
    assert.strictEqual(matched12[0].serialNumber, 12);
  });

  await t.test('Devanagari numeral search ("१२" or "#१२") resolves strictly', () => {
    const matched = allProverbs.filter((p) => matchesSearch(p, '१२'));
    assert.strictEqual(matched.length, 1);
    assert.strictEqual(matched[0].serialNumber, 12);
  });

  await t.test('Marathi meaning keyword search matches relevant proverb', () => {
    const matched = allProverbs.filter((p) => matchesSearch(p, 'नुकसानीस'));
    assert.ok(matched.some((p) => p.serialNumber === 1));
  });

  await t.test('English keyword search works (e.g., "excess")', () => {
    const matched = allProverbs.filter((p) => matchesSearch(p, 'excess'));
    assert.ok(matched.some((p) => p.serialNumber === 1));
  });

  await t.test('punctuation tolerance strips purna viram and punctuation', () => {
    const normalized = normalizeMarathiText('अति तिथे माती।');
    assert.strictEqual(normalized, 'अति तिथे माती');
  });
});

test('Audit Suite 3: 16 Cultural Categories Distribution', async (t) => {
  const categoriesFound = new Set(allProverbs.map((p) => p.category));

  await t.test('all 16 categories are represented in the 1,000 collection', () => {
    assert.strictEqual(categoriesFound.size, 16);
  });

  await t.test('every single category contains at least one published proverb', () => {
    categoriesFound.forEach((cat) => {
      const count = allProverbs.filter((p) => p.category === cat).length;
      assert.ok(count > 0, `Category ${cat} has 0 proverbs`);
    });
  });
});

test('Audit Suite 4: Asia/Kolkata Deterministic Daily Proverb', async (t) => {
  const { proverb: p1, dateString: d1 } = getDailyProverb();
  assert.ok(p1 && p1.proverb);
  assert.ok(d1 && d1.length === 10);

  await t.test('same date yields the exact same proverb on repeated calls', () => {
    const { proverb: p2 } = getDailyProverb();
    assert.strictEqual(p1.id, p2.id);
    assert.strictEqual(p1.serialNumber, p2.serialNumber);
  });

  await t.test('consecutive dates evaluate smoothly to valid proverbs', () => {
    const dateYesterday = new Date(Date.now() - 86400000);
    const { proverb: pYesterday } = getDailyProverb(dateYesterday);
    assert.ok(pYesterday && pYesterday.serialNumber >= 1 && pYesterday.serialNumber <= 1000);
  });
});
