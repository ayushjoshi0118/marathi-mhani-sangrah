import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Compass, BookOpen, Tag } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { searchProverbs, getCategoriesWithCounts } from '@/data/storage';
import { toMarathiNumerals } from '@/lib/devanagari';
import ProverbCard from '@/components/proverbs/ProverbCard';
import Pagination from '@/components/proverbs/Pagination';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const category = CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === decodedSlug ||
      c.id.toLowerCase() === decodedSlug ||
      c.titleMarathi.toLowerCase() === decodedSlug
  );

  if (!category) {
    return { title: 'विषय सापडला नाही | मराठी म्हणी संग्रह' };
  }

  return {
    title: `${category.titleMarathi} — मराठी म्हणी संग्रह | ${category.titleEnglish}`,
    description: `${category.titleMarathi}: ${category.descriptionMarathi} मराठी म्हणींचा प्रमाणित संग्रह.`,
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  const category = CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === decodedSlug ||
      c.id.toLowerCase() === decodedSlug ||
      c.titleMarathi.toLowerCase() === decodedSlug
  );

  if (!category) {
    notFound();
  }

  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = 24;

  const result = searchProverbs({
    category: category.slug,
    page,
    pageSize,
    status: 'published',
  });

  return (
    <div className="font-devanagari text-ink-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/vishay"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>सर्व विषयांकडे परत जा (All Categories)</span>
          </Link>
        </div>

        {/* Category Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-300 shadow-manuscript mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-800 uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5 text-saffron-600" />
            <span>विषय संग्रह</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-rozha text-3xl sm:text-5xl font-bold text-ink-950 tracking-tight">
                {category.titleMarathi}
              </h1>
              <p className="text-xs sm:text-sm text-ink-500 font-sans mt-0.5">
                {category.titleEnglish}
              </p>
            </div>

            <div className="self-start md:self-auto px-4 py-2 rounded-xl bg-saffron-50 text-saffron-900 border border-saffron-200 text-sm font-bold">
              एकूण {toMarathiNumerals(result.total)} म्हणी
            </div>
          </div>

          <p className="text-sm sm:text-base text-ink-700 max-w-3xl leading-relaxed pt-2 border-t border-ivory-200">
            {category.descriptionMarathi}
          </p>
        </div>

        {/* Proverb Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.items.map((proverb) => (
            <ProverbCard key={proverb.id} proverb={proverb} />
          ))}
        </div>

        {/* Pagination */}
        <Suspense fallback={null}>
          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            baseUrl={`/vishay/${category.slug}`}
          />
        </Suspense>
      </div>
    </div>
  );
}
