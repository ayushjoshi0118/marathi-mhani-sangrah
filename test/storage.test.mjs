import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('Verify 1,000 Proverbs Dataset Integrity', async (t) => {
  const jsonPath = path.join(process.cwd(), 'src', 'data', 'proverbs.json');
  assert.ok(fs.existsSync(jsonPath), 'proverbs.json must exist');

  const content = fs.readFileSync(jsonPath, 'utf-8');
  const proverbs = JSON.parse(content);

  await t.test('has exactly 1,000 proverbs', () => {
    assert.strictEqual(proverbs.length, 1000);
  });

  await t.test('has 1,000 unique proverbs without duplicates', () => {
    const uniqueProverbs = new Set(proverbs.map((p) => p.proverb.trim()));
    assert.strictEqual(uniqueProverbs.size, 1000);
  });

  await t.test('has contiguous serial numbers from 1 to 1000', () => {
    for (let i = 0; i < 1000; i++) {
      assert.strictEqual(proverbs[i].serialNumber, i + 1);
    }
  });

  await t.test('first proverb is "अति तिथे माती"', () => {
    assert.strictEqual(proverbs[0].proverb, 'अति तिथे माती');
    assert.strictEqual(proverbs[0].serialNumber, 1);
  });

  await t.test('every proverb has valid non-empty required fields', () => {
    for (const p of proverbs) {
      assert.ok(p.id, `ID missing for serial ${p.serialNumber}`);
      assert.ok(p.slug, `Slug missing for serial ${p.serialNumber}`);
      assert.ok(p.proverb, `Proverb missing for serial ${p.serialNumber}`);
      assert.ok(p.normalized, `Normalized text missing for serial ${p.serialNumber}`);
      assert.ok(p.meaningMarathi, `Marathi meaning missing for serial ${p.serialNumber}`);
      assert.ok(p.meaningEnglish, `English meaning missing for serial ${p.serialNumber}`);
      assert.ok(p.exampleMarathi, `Marathi example missing for serial ${p.serialNumber}`);
      assert.ok(p.exampleEnglish, `English example missing for serial ${p.serialNumber}`);
      assert.ok(p.context, `Context missing for serial ${p.serialNumber}`);
      assert.ok(p.category, `Category missing for serial ${p.serialNumber}`);
      assert.ok(Array.isArray(p.tags) && p.tags.length > 0, `Tags missing for serial ${p.serialNumber}`);
      assert.strictEqual(p.status, 'published');
    }
  });
});
