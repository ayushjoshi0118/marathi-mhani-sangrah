import test from 'node:test';
import assert from 'node:assert';

const BASE = 'http://localhost:3008';

console.log('=== RUNNING LIVE HTTP AUDIT AGAINST LOCAL SERVER ===');

test('Live HTTP Audit Suite', async (t) => {
  await t.test('1. GET / (Homepage) renders successfully with live 1,000 count', async () => {
    const res = await fetch(`${BASE}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('मराठी म्हणी'), 'Contains branding');
    assert.ok(html.includes('१,०००') || html.includes('1000') || html.includes('१०००'), 'Contains live 1000 count');
    assert.ok(html.includes('आजची म्हण वाचा'), 'Contains CTA');
  });

  await t.test('2. GET /mhani renders proverb directory and search box', async () => {
    const res = await fetch(`${BASE}/mhani`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('सर्व') || html.includes('म्हणी'), 'Contains header');
    assert.ok(html.includes('अति तिथे माती'), 'Renders proverbs list');
  });

  await t.test('3. GET /mhani/1 renders proverb detail page with JSON-LD schema', async () => {
    const res = await fetch(`${BASE}/mhani/1`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('अति तिथे माती'), 'Contains proverb text');
    assert.ok(html.includes('application/ld+json'), 'Contains JSON-LD script');
    assert.ok(html.includes('DefinedTerm'), 'Contains Schema.org DefinedTerm');
  });

  await t.test('4. GET /mhani/mhan-1 resolves slug lookup seamlessly', async () => {
    const res = await fetch(`${BASE}/mhani/mhan-1`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('अति तिथे माती'), 'Slug resolved to entry');
  });

  await t.test('5. GET /vishay renders all 16 cultural categories index', async () => {
    const res = await fetch(`${BASE}/vishay`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('शहाणपण आणि व्यवहारज्ञान'), 'Contains category 1');
    assert.ok(html.includes('मेहनत आणि कष्ट'), 'Contains category 2');
  });

  await t.test('6. GET /vishay/shahanpan-vyavahar renders category proverb listing', async () => {
    const res = await fetch(`${BASE}/vishay/shahanpan-vyavahar`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('शहाणपण आणि व्यवहारज्ञान'), 'Contains category header');
  });

  await t.test('7. GET /aajchi-mhan renders Proverb of the Day with Asia/Kolkata date', async () => {
    const res = await fetch(`${BASE}/aajchi-mhan`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('आजची म्हण'), 'Contains page title');
    assert.ok(html.includes('Asia/Kolkata'), 'Contains Asia/Kolkata attribution');
  });

  await t.test('8. GET /khel renders interactive learning games hub', async () => {
    const res = await fetch(`${BASE}/khel`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('म्हणींचे खेळ व ज्ञानचाचणी'), 'Contains games title');
    assert.ok(html.includes('म्हण ओळखा'), 'Contains game 1');
  });

  await t.test('9. GET /aavadtaye-mhani renders offline favorites page', async () => {
    const res = await fetch(`${BASE}/aavadtaye-mhani`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('आवडत्या म्हणी'), 'Contains favorites header');
  });

  await t.test('10. GET /suchva renders community suggestion form', async () => {
    const res = await fetch(`${BASE}/suchva`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('नवी म्हण सुचवा'), 'Contains suggestion heading');
  });

  await t.test('11. GET /durusti renders correction reporting form', async () => {
    const res = await fetch(`${BASE}/durusti`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('दुरुस्ती किंवा त्रुटी नोंदवा'), 'Contains correction heading');
  });

  await t.test('12. GET /aamchyavishayi renders cultural mission and editorial criteria', async () => {
    const res = await fetch(`${BASE}/aamchyavishayi`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('आमच्याविषयी'), 'Contains about title');
  });

  await t.test('13. GET /gopaniyata renders privacy policy', async () => {
    const res = await fetch(`${BASE}/gopaniyata`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('गोपनीयता धोरण'), 'Contains privacy title');
  });

  await t.test('14. GET /niyam-va-aati renders terms of service', async () => {
    const res = await fetch(`${BASE}/niyam-va-aati`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('नियम व अटी'), 'Contains terms title');
  });

  await t.test('15. GET /sitemap.xml returns valid dynamic XML sitemap', async () => {
    const res = await fetch(`${BASE}/sitemap.xml`);
    assert.strictEqual(res.status, 200);
    const xml = await res.text();
    assert.ok(xml.includes('<?xml') || xml.includes('<urlset'), 'Valid sitemap XML');
    assert.ok(xml.includes('/mhani/'), 'Indexes proverbs');
    assert.ok(xml.includes('/vishay/'), 'Indexes categories');
  });

  await t.test('16. GET /robots.txt returns valid robots file', async () => {
    const res = await fetch(`${BASE}/robots.txt`);
    assert.strictEqual(res.status, 200);
    const txt = await res.text();
    assert.ok(txt.includes('User-Agent: *') || txt.includes('user-agent: *'), 'Specifies user agent');
    assert.ok(txt.includes('Disallow: /admin') || txt.includes('disallow: /admin'), 'Protects admin');
  });

  await t.test('17. API: GET /api/mhani?stats=true returns total count 1000 and 16 categories', async () => {
    const res = await fetch(`${BASE}/api/mhani?stats=true`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.total, 1000);
    assert.strictEqual(data.categories.length, 16);
  });

  await t.test('18. API: GET /api/mhani?q=माती returns filtered search results', async () => {
    const res = await fetch(`${BASE}/api/mhani?q=माती`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.items.length > 0);
    assert.ok(data.items.some(p => p.serialNumber === 1));
  });

  await t.test('19. API: POST /api/suchva validates required fields', async () => {
    const res = await fetch(`${BASE}/api/suchva`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proverb: '', meaning: '' }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });

  await t.test('20. API: POST /api/suchva accepts valid contribution', async () => {
    const res = await fetch(`${BASE}/api/suchva`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proverb: 'अंथरूण पाहून पाय पसरावे',
        meaning: 'आपल्या ऐपतीप्रमाणे खर्च करावा.',
        suggestedCategory: 'पैसा आणि व्यवहार',
        contributorName: 'चाचणी परीक्षक',
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.submission.id);
  });

  await t.test('21. API: POST /api/durusti validates description length', async () => {
    const res = await fetch(`${BASE}/api/durusti`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proverbText: 'अति तिथे माती', description: 'अ' }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });

  await t.test('22. API: POST /api/durusti accepts valid correction report', async () => {
    const res = await fetch(`${BASE}/api/durusti`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proverbId: 'mhan-1',
        proverbText: 'अति तिथे माती',
        issueType: 'spelling',
        description: 'लाइव्ह HTTP चाचणी दुरुस्ती नोंद',
        reporterName: 'परीक्षक',
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  await t.test('23. API: GET /api/admin blocks unauthorized access with 401', async () => {
    const res = await fetch(`${BASE}/api/admin`);
    assert.strictEqual(res.status, 401);
  });

  await t.test('24. API: GET /api/admin?key=mhani2026 allows authorized admin session', async () => {
    const res = await fetch(`${BASE}/api/admin?key=mhani2026`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.stats.totalProverbs, 1000);
    assert.strictEqual(data.stats.published, 1000);
    assert.ok(Array.isArray(data.suggestions));
    assert.ok(Array.isArray(data.corrections));
  });

  await t.test('25. GET /non-existent-xyz-404 returns 404 with custom Not Found page', async () => {
    const res = await fetch(`${BASE}/non-existent-xyz-404`);
    assert.strictEqual(res.status, 404);
    const html = await res.text();
    assert.ok(html.includes('पृष्ठ सापडले नाही'), 'Renders custom Marathi 404 page');
  });
});
