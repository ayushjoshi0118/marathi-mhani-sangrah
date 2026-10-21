import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  Filter,
  ArrowUpDown,
  Tag,
  Search,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { searchProverbs, getCategoriesWithCounts, getStats } from '@/data/storage';
import { toMarathiNumerals } from '@/lib/devanagari';
import ProverbCard from '@/components/proverbs/ProverbCard';
import Pagination from '@/components/proverbs/Pagination';
import SearchBox from '@/components/proverbs/SearchBox';

export const metadata: Metadata = {
  title: 'सर्व १,००० मराठी म्हणी संग्रह — अनुक्रमणिका व शोध | All Marathi Proverbs',
  description:
    'कायमस्वरूपी १ ते १००० क्रमांकासह मराठी म्हणींचा अधिकृत डिजिटल संग्रह. अर्थ, उदाहरणे, विषय व इंग्रजी अनुवादासह शोधा.',
};

interface MhaniPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    sort?: 'serial' | 'alpha' | 'recent';
    order?: 'asc' | 'desc';
    page?: string;
  }>;
}

export default async function MhaniDirectoryPage({ searchParams }: MhaniPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const selectedCategory = resolvedParams.category || 'all';
  const selectedTag = resolvedParams.tag || '';
  const sortBy = resolvedParams.sort || 'serial';
  const sortOrder = resolvedParams.order || 'asc';
  const page = parseInt(resolvedParams.page || '1', 10);
  const pageSize = 24;

  const result = searchProverbs({
    query,
    category: selectedCategory,
    tag: selectedTag,
    sortBy,
    sortOrder,
    page,
    pageSize,
    status: 'published',
  });

  const categories = getCategoriesWithCounts();
  const stats = getStats();

  return (
    <div className="font-devanagari text-ink-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-saffron-700 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>अस्सल मराठी भाषेचा अनमोल ठेवा</span>
          </div>

          <h1 className="font-rozha text-3xl sm:text-5xl font-bold text-ink-950 tracking-tight leading-tight mb-3">
            सर्व मराठी म्हणी संग्रह
          </h1>

          <p className="text-sm sm:text-base text-ink-700 max-w-3xl leading-relaxed">
            कायमस्वरूपी क्रमांक १ ते १००० पर्यंत प्रमाणित मराठी म्हणींची संपूर्ण नामावली. प्रत्येक
            म्हणीचा सोपा अर्थ, व्यवहारातील उदाहरण आणि सांस्कृतिक संदर्भ येथे उपलब्ध आहे.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-ivory-300 shadow-sm mb-8 space-y-4">
          <Suspense fallback={<div className="h-14 bg-ivory-100 rounded-xl animate-pulse"></div>}>
            <SearchBox initialQuery={query} />
          </Suspense>

          {/* Filter Pills and Sort Bar */}
          <div className="pt-4 border-t border-ivory-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Category Filter Pills (Horizontal Scrollable) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <span className="font-bold text-ink-700 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-saffron-600" />
                विषय:
              </span>

              <Link
                href={`/mhani?${new URLSearchParams({
                  ...(query && { q: query }),
                  category: 'all',
                  sort: sortBy,
                  page: '1',
                }).toString()}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200'
                }`}
              >
                सर्व विषय ({toMarathiNumerals(stats.published)})
              </Link>

              {categories.map((c) => {
                const isSelected =
                  selectedCategory.toLowerCase() === c.slug.toLowerCase() ||
                  selectedCategory.toLowerCase() === c.titleMarathi.toLowerCase();

                return (
                  <Link
                    key={c.id}
                    href={`/mhani?${new URLSearchParams({
                      ...(query && { q: query }),
                      category: c.slug,
                      sort: sortBy,
                      page: '1',
                    }).toString()}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-saffron-600 text-white shadow-xs'
                        : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200'
                    }`}
                  >
                    {c.titleMarathi} ({toMarathiNumerals(c.count || 0)})
                  </Link>
                );
              })}
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-ink-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> क्रम:
              </span>

              <div className="flex items-center rounded-lg border border-ivory-300 p-0.5 bg-ivory-100">
                <Link
                  href={`/mhani?${new URLSearchParams({
                    ...(query && { q: query }),
                    ...(selectedCategory !== 'all' && { category: selectedCategory }),
                    sort: 'serial',
                    page: '1',
                  }).toString()}`}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    sortBy === 'serial'
                      ? 'bg-white text-saffron-800 shadow-xs font-bold'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                  title="कायमस्वरूपी अनुक्रमांकानुसार (Serial No.)"
                >
                  क्रमांक (#१-#१०००)
                </Link>

                <Link
                  href={`/mhani?${new URLSearchParams({
                    ...(query && { q: query }),
                    ...(selectedCategory !== 'all' && { category: selectedCategory }),
                    sort: 'alpha',
                    page: '1',
                  }).toString()}`}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    sortBy === 'alpha'
                      ? 'bg-white text-saffron-800 shadow-xs font-bold'
                      : 'text-ink-600 hover:text-ink-900'
                  }`}
                  title="अक्षरांच्या क्रमाने (अ ते ज्ञ)"
                >
                  अक्षरांप्रमाणे (अ-ज्ञ)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Results Metadata Header */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-ink-600 mb-6 px-1">
          <div>
            <span>
              एकूण सापडलेल्या म्हणी:{' '}
              <strong className="text-ink-900 font-bold">
                {toMarathiNumerals(result.total)}
              </strong>
            </span>
            {query && (
              <span className="ml-2 text-saffron-700">
                (&ldquo;{query}&rdquo; साठीचे निकाल)
              </span>
            )}
          </div>
          <div>
            <span>
              पृष्ठ {toMarathiNumerals(result.page)} / {toMarathiNumerals(result.totalPages)}
            </span>
          </div>
        </div>

        {/* Proverb Cards Grid */}
        {result.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.items.map((proverb) => (
              <ProverbCard key={proverb.id} proverb={proverb} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-ivory-300 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-saffron-50 text-saffron-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-rozha text-2xl font-bold text-ink-950 mb-2">
              कोणतीही म्हण सापडली नाही
            </h3>
            <p className="text-sm text-ink-600 mb-6">
              &ldquo;{query}&rdquo; या शोधासाठी कोणताही निकाल आढळला नाही. कृपया शब्दरचना बदलून किंवा
              दुसरा शब्द वापरून शोधा.
            </p>
            <Link
              href="/mhani"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>सर्व १,००० म्हणी पुन्हा पहा</span>
            </Link>
          </div>
        )}

        {/* Stable URL Pagination */}
        <Suspense fallback={null}>
          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            baseUrl="/mhani"
          />
        </Suspense>
      </div>
    </div>
  );
}
