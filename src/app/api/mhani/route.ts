import { NextRequest, NextResponse } from 'next/server';
import { searchProverbs, getPublishedProverbs, getCategoriesWithCounts } from '@/data/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || searchParams.get('query') || '';
    const category = searchParams.get('category') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const sortBy = (searchParams.get('sortBy') as 'serial' | 'alpha' | 'recent') || 'serial';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '24', 10)));

    // Quick stats mode
    if (searchParams.get('stats') === 'true') {
      const all = getPublishedProverbs();
      const categories = getCategoriesWithCounts();
      return NextResponse.json({
        total: all.length,
        categories,
      });
    }

    const result = searchProverbs({
      query,
      category,
      tag,
      sortBy,
      sortOrder,
      page,
      pageSize,
      status: 'published',
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('API /api/mhani error:', error);
    return NextResponse.json(
      { error: 'म्हणी शोधताना त्रुटी उद्भवली.' },
      { status: 500 }
    );
  }
}
