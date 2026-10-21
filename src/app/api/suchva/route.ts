import { NextRequest, NextResponse } from 'next/server';
import { submitSuggestion } from '@/data/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.proverb || typeof body.proverb !== 'string' || body.proverb.trim().length < 3) {
      return NextResponse.json(
        { error: 'कृपया किमान ३ अक्षरांची वैध म्हण प्रविष्ट करा.' },
        { status: 400 }
      );
    }

    if (!body.meaning || typeof body.meaning !== 'string' || body.meaning.trim().length < 3) {
      return NextResponse.json(
        { error: 'कृपया म्हणीचा सोपा अर्थ प्रविष्ट करा.' },
        { status: 400 }
      );
    }

    const suggestion = submitSuggestion({
      proverb: body.proverb.trim(),
      meaning: body.meaning.trim(),
      englishMeaning: body.englishMeaning?.trim() || undefined,
      usageExample: body.usageExample?.trim() || undefined,
      suggestedCategory: body.suggestedCategory?.trim() || undefined,
      contributorName: body.contributorName?.trim() || undefined,
      contributorEmail: body.contributorEmail?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'तुमची म्हण संपादकीय पडताळणीसाठी यशस्वीपणे नोंदवली गेली आहे. धन्यवाद!',
        submission: suggestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API /api/suchva error:', error);
    return NextResponse.json(
      { error: 'म्हण नोंदवताना सर्व्हर त्रुटी उद्भवली. कृपया पुन्हा प्रयत्न करा.' },
      { status: 500 }
    );
  }
}
