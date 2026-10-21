import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('Verify 1,000 Proverbs Dataset Integrity & Pipeline Curation', async (t) => {
  const jsonPath = path.join(process.cwd(), 'src', 'data', 'proverbs.json');
  assert.ok(fs.existsSync(jsonPath), 'proverbs.json must exist');

  const content = fs.readFileSync(jsonPath, 'utf-8');
  const proverbs = JSON.parse(content);

  await t.test('has exactly 1,000 slots allocated', () => {
    assert.strictEqual(proverbs.length, 1000);
  });

  await t.test('has 1,000 unique records without duplicate slugs or serials', () => {
    const uniqueSerials = new Set(proverbs.map((p) => p.serialNumber));
    const uniqueSlugs = new Set(proverbs.map((p) => p.slug));
    assert.strictEqual(uniqueSerials.size, 1000);
    assert.strictEqual(uniqueSlugs.size, 1000);
  });

  await t.test('has contiguous serial numbers strictly from 1 to 1000', () => {
    for (let i = 0; i < 1000; i++) {
      assert.strictEqual(proverbs[i].serialNumber, i + 1);
    }
  });

  await t.test('first proverb is foundational "अति तिथे माती"', () => {
    assert.strictEqual(proverbs[0].proverb, 'अति तिथे माती');
    assert.strictEqual(proverbs[0].serialNumber, 1);
    assert.strictEqual(proverbs[0].status, 'published');
  });

  await t.test('all published proverbs have verified authentic editorial fields', () => {
    const published = proverbs.filter((p) => p.status === 'published');
    assert.ok(published.length >= 165, `Expected at least 165 published proverbs, got ${published.length}`);

    for (const p of published) {
      assert.ok(p.id, `ID missing for serial ${p.serialNumber}`);
      assert.ok(p.slug, `Slug missing for serial ${p.serialNumber}`);
      assert.ok(p.proverb, `Proverb missing for serial ${p.serialNumber}`);
      assert.ok(p.meaningMarathi, `Marathi meaning missing for serial ${p.serialNumber}`);
      assert.ok(p.meaningEnglish, `English meaning missing for serial ${p.serialNumber}`);
      assert.ok(p.exampleMarathi, `Marathi example missing for serial ${p.serialNumber}`);
      assert.ok(p.exampleEnglish, `English example missing for serial ${p.serialNumber}`);
      assert.ok(p.context, `Context missing for serial ${p.serialNumber}`);
      assert.ok(p.category, `Category missing for serial ${p.serialNumber}`);
      assert.ok(Array.isArray(p.tags) && p.tags.length > 0, `Tags missing for serial ${p.serialNumber}`);
      assert.ok(p.editorialReview.linguisticVerified, `Linguistic verification missing for #${p.serialNumber}`);
      assert.ok(p.editorialReview.sourceVerified, `Source verification missing for #${p.serialNumber}`);
    }
  });

  await t.test('draft slots are honestly designated without fake published claims', () => {
    const drafts = proverbs.filter((p) => p.status === 'draft');
    assert.strictEqual(drafts.length, 1000 - proverbs.filter((p) => p.status === 'published').length);
    for (const d of drafts) {
      assert.strictEqual(d.status, 'draft');
      assert.strictEqual(d.editorialReview.linguisticVerified, false);
    }
  });
});
