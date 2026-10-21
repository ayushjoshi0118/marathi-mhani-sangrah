import { NextRequest, NextResponse } from 'next/server';
import { submitCorrection } from '@/data/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.proverbText || typeof body.proverbText !== 'string') {
      return NextResponse.json(
        { error: 'कृपया दुरुस्तीसाठी योग्य म्हण निवडा.' },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 5) {
      return NextResponse.json(
        { error: 'कृपया दुरुस्तीचे सविस्तर कारण नमूद करा (किमान ५ अक्षरे).' },
        { status: 400 }
      );
    }

    const issueType = ['spelling', 'meaning', 'usage', 'other'].includes(body.issueType)
      ? body.issueType
      : 'other';

    const correction = submitCorrection({
      proverbId: body.proverbId || 'unknown',
      proverbText: body.proverbText.trim(),
      issueType,
      description: body.description.trim(),
      suggestedCorrection: body.suggestedCorrection?.trim() || '',
      reporterName: body.reporterName?.trim() || undefined,
      reporterEmail: body.reporterEmail?.trim() || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'दुरुस्तीची नोंद घेण्यात आली आहे. संपादक मंडळ याची पडताळणी करेल. सहकार्याबद्दल धन्यवाद!',
        submission: correction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API /api/durusti error:', error);
    return NextResponse.json(
      { error: 'दुरुस्ती नोंदवताना त्रुटी उद्भवली. कृपया पुन्हा प्रयत्न करा.' },
      { status: 500 }
    );
  }
}
