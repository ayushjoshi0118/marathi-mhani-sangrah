import { NextRequest, NextResponse } from 'next/server';
import {
  getStats,
  getSuggestions,
  getCorrections,
  updateSuggestionStatus,
  updateCorrectionStatus,
  getAllProverbs,
  createProverb,
  updateProverb,
} from '@/data/storage';
import { normalizeMarathiText, generateSlug } from '@/lib/devanagari';

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'mhani2026';

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === ADMIN_KEY) return true;
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get('key') === ADMIN_KEY) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'अनधिकृत प्रवेश. वैध ॲडमीन की आवश्यक.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'export_json') {
    const all = getAllProverbs();
    return new NextResponse(JSON.stringify(all, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="marathi-mhani-sangrah-export.json"',
      },
    });
  }

  if (action === 'export_csv') {
    const all = getAllProverbs();
    const headers = ['Serial', 'Proverb', 'Meaning', 'English Meaning', 'Category', 'Status', 'Slug'];
    const rows = all.map((p) => [
      p.serialNumber,
      `"${p.proverb.replace(/"/g, '""')}"`,
      `"${(p.meaningMarathi || '').replace(/"/g, '""')}"`,
      `"${(p.meaningEnglish || '').replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.status,
      p.slug,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="marathi-mhani-sangrah-export.csv"',
      },
    });
  }

  const stats = getStats();
  const suggestions = getSuggestions();
  const corrections = getCorrections();

  return NextResponse.json({
    stats,
    suggestions,
    corrections,
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'अनधिकृत प्रवेश. वैध ॲडमीन की आवश्यक.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'update_suggestion') {
      const { id, status, adminNotes } = body;
      const updated = updateSuggestionStatus(id, status, adminNotes);
      if (!updated) {
        return NextResponse.json({ error: 'सुझाव सापडला नाही.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, updated });
    }

    if (action === 'update_correction') {
      const { id, status, adminNotes } = body;
      const updated = updateCorrectionStatus(id, status, adminNotes);
      if (!updated) {
        return NextResponse.json({ error: 'दुरुस्ती नोंद सापडली नाही.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, updated });
    }

    if (action === 'create_proverb') {
      const {
        proverb,
        meaningMarathi,
        meaning,
        meaningEnglish,
        englishMeaning,
        exampleMarathi,
        usageExample,
        exampleEnglish,
        englishUsageExample,
        context,
        contextExplanation,
        englishEquivalent,
        category,
        tags,
        status,
      } = body;

      const finalMeaningMarathi = (meaningMarathi || meaning || '').trim();
      if (!proverb || !finalMeaningMarathi || !category) {
        return NextResponse.json({ error: 'म्हण, अर्थ आणि वर्गवारी अनिवार्य आहेत.' }, { status: 400 });
      }

      const normalized = normalizeMarathiText(proverb);
      const slug = generateSlug(proverb);

      const created = createProverb({
        slug,
        proverb: proverb.trim(),
        normalized,
        meaningMarathi: finalMeaningMarathi,
        meaningEnglish: (meaningEnglish || englishMeaning || '').trim(),
        exampleMarathi: (exampleMarathi || usageExample || '').trim(),
        exampleEnglish: (exampleEnglish || englishUsageExample || '').trim(),
        context: (context || contextExplanation || '').trim(),
        englishEquivalent: (englishEquivalent || '').trim() || null,
        category: category.trim(),
        tags: Array.isArray(tags) ? tags : [],
        status: status || 'published',
        editorialReview: {
          reviewedBy: 'Chief Editor',
          reviewedAt: new Date().toISOString(),
          linguisticVerified: true,
          sourceVerified: true,
        },
      });

      return NextResponse.json({ success: true, created }, { status: 201 });
    }

    if (action === 'update_proverb') {
      const { id, updates } = body;
      if (!id || !updates) {
        return NextResponse.json({ error: 'आयडी आणि बदल अनिवार्य आहेत.' }, { status: 400 });
      }

      if (updates.proverb) {
        updates.normalized = normalizeMarathiText(updates.proverb);
      }

      const updated = updateProverb(id, updates);
      if (!updated) {
        return NextResponse.json({ error: 'म्हण सापडली नाही.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, updated });
    }

    return NextResponse.json({ error: 'अवैध कृती.' }, { status: 400 });
  } catch (error) {
    console.error('API /api/admin error:', error);
    return NextResponse.json({ error: 'ॲडमीन सर्व्हर त्रुटी.' }, { status: 500 });
  }
}
