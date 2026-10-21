import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Compass, BookOpen, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { getCategoriesWithCounts, getStats } from '@/data/storage';
import { toMarathiNumerals } from '@/lib/devanagari';

export const metadata: Metadata = {
  title: 'विषयानुसार मराठी म्हणी — १६ सांस्कृतिक वर्ग | Categories of Marathi Proverbs',
  description:
    'शहाणपण, मेहनत, नशीब, मैत्री, कुटुंब, पैसा, शेती, शिक्षण आणि नीती अशा १६ प्रमुख विषयानुसार मराठी म्हणींचा संग्रह.',
};

export default function VishayIndexPage() {
  const categories = getCategoriesWithCounts();
  const stats = getStats();

  return (
    <div className="font-devanagari text-ink-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>वर्गीकृत डिजिटल संग्रह</span>
          </div>

          <h1 className="font-rozha text-3xl sm:text-5xl font-bold text-ink-950 tracking-tight leading-tight mb-4">
            विषयानुसार मराठी म्हणी
          </h1>

          <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
            मराठी म्हणी या केवळ शब्दांचे खेळ नसून आपल्या पूर्वजांचे व्यावहारिक जीवनशास्त्र आहे.
            येथे १,००० म्हणींचे १६ जीवनोपयोगी विषयांमध्ये काळजीपूर्वक संपादन व वर्गीकरण करण्यात आले आहे.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/vishay/${cat.slug}`}
              className="manuscript-card rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 font-bold border border-saffron-200">
                    {toMarathiNumerals(cat.count || 0)} म्हणी
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-ivory-100 text-saffron-700 flex items-center justify-center group-hover:bg-saffron-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="font-rozha text-2xl font-bold text-ink-950 mb-1 group-hover:text-saffron-700 transition-colors">
                  {cat.titleMarathi}
                </h2>

                <p className="text-xs text-ink-500 font-sans font-medium mb-3">
                  {cat.titleEnglish}
                </p>

                <p className="text-sm text-ink-700 leading-relaxed">
                  {cat.descriptionMarathi}
                </p>
              </div>

              <div className="pt-4 border-t border-ivory-200 mt-6 flex items-center justify-between text-xs font-semibold text-saffron-700 group-hover:text-saffron-800">
                <span>सर्व म्हणी वाचा</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
