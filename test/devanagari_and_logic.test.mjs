import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Helper tests for pure logic
test('Devanagari Normalization & Search Helpers', async (t) => {
  const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

  function toDevanagariDigits(num) {
    return String(num)
      .split('')
      .map((ch) => {
        const d = parseInt(ch, 10);
        return isNaN(d) ? ch : DEVANAGARI_DIGITS[d];
      })
      .join('');
  }

  function toMarathiNumerals(num, pad = 0) {
    const s = String(num).padStart(pad, '0');
    return toDevanagariDigits(s);
  }

  function normalizeMarathiText(text) {
    if (!text) return '';
    let norm = text.normalize('NFC');
    norm = norm.replace(/[\u0964\u0965]/g, ' ');
    norm = norm.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'–—]/g, ' ');
    norm = norm.replace(/\s+/g, ' ').trim();
    return norm.toLowerCase();
  }

  function generateSlug(text) {
    const norm = normalizeMarathiText(text);
    return norm.replace(/\s+/g, '-');
  }

  await t.test('converts numbers to Devanagari numerals accurately', () => {
    assert.strictEqual(toDevanagariDigits(1), '१');
    assert.strictEqual(toDevanagariDigits(10), '१०');
    assert.strictEqual(toDevanagariDigits(100), '१००');
    assert.strictEqual(toDevanagariDigits(1000), '१०००');
    assert.strictEqual(toMarathiNumerals(5, 3), '००५');
  });

  await t.test('normalizes Marathi punctuation and dandas', () => {
    const raw = '  अति तिथे माती।  ';
    assert.strictEqual(normalizeMarathiText(raw), 'अति तिथे माती');
  });

  await t.test('generates URL safe slug', () => {
    const raw = 'अति तिथे माती';
    assert.strictEqual(generateSlug(raw), 'अति-तिथे-माती');
  });
});

test('Categories Catalog Verification', async (t) => {
  const catPath = path.join(process.cwd(), 'src', 'data', 'categories.ts');
  assert.ok(fs.existsSync(catPath), 'categories.ts must exist');

  const content = fs.readFileSync(catPath, 'utf-8');
  assert.ok(content.includes('export const CATEGORIES'), 'CATEGORIES must be exported');
  assert.ok(content.includes('shahanpan-vyavahar'), 'shahanpan-vyavahar category must exist');
  assert.ok(content.includes('mehnat-kashta'), 'mehnat-kashta category must exist');
});

test('Proverbs JSON Integrity & Category Distribution', async (t) => {
  const jsonPath = path.join(process.cwd(), 'src', 'data', 'proverbs.json');
  const proverbs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  await t.test('all 16 categories are represented in the 1,000 collection', () => {
    const categoriesInCollection = new Set(proverbs.map((p) => p.category));
    assert.strictEqual(categoriesInCollection.size, 16);
  });

  await t.test('every proverb has valid editorial verification and timestamps', () => {
    for (const p of proverbs) {
      assert.ok(p.editorialReview.linguisticVerified, `Linguistic verification missing for #${p.serialNumber}`);
      assert.ok(p.editorialReview.sourceVerified, `Source verification missing for #${p.serialNumber}`);
      assert.ok(p.createdAt, `createdAt missing for #${p.serialNumber}`);
      assert.ok(p.publishedAt, `publishedAt missing for #${p.serialNumber}`);
    }
  });

  await t.test('serial numbers are strictly 1 to 1000 in ascending order', () => {
    proverbs.forEach((p, idx) => {
      assert.strictEqual(p.serialNumber, idx + 1);
    });
  });
});
