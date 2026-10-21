import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Flame, Calendar, Sparkles, BookOpen, Share2, ArrowRight, Quote } from 'lucide-react';
import { getDailyProverb, getPublishedProverbs } from '@/data/storage';
import { toMarathiNumerals } from '@/lib/devanagari';
import ProverbAudioButton from '@/components/proverbs/ProverbAudioButton';
import ProverbFavoriteButton from '@/components/proverbs/ProverbFavoriteButton';

export const metadata: Metadata = {
  title: 'आजची म्हण — दैनिक मराठी सुविचार व शहाणपण | Proverb of the Day',
  description:
    'प्रत्येक दिवसासाठी एक खास निवडक मराठी म्हण, तिचा सविस्तर अर्थ, दैनंदिन व्यवहारातील उदाहरण आणि सांस्कृतिक संदर्भ.',
};

export default function AajchiMhanPage() {
  const { proverb, dateString } = getDailyProverb();
  const allProverbs = getPublishedProverbs();

  // Generate the last 7 days of daily proverbs for the archive
  const pastDays = [];
  const today = new Date();
  for (let i = 1; i <= 6; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    const { proverb: p, dateString: ds } = getDailyProverb(pastDate);
    pastDays.push({ proverb: p, dateString: ds });
  }

  return (
    <div className="font-devanagari text-ink-900 py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Ribbon */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-4 shadow-xs">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>दैनिक मराठी शहाणपण (Daily Wisdom)</span>
          </div>

          <h1 className="font-rozha text-3xl sm:text-5xl font-bold text-ink-950 mb-3 tracking-tight">
            आजची म्हण
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-ink-600 font-medium">
            <Calendar className="w-4 h-4 text-saffron-600" />
            <span>दिनांक: {dateString} (Asia/Kolkata वेळेनुसार)</span>
          </div>
        </div>

        {/* Featured Daily Proverb Card */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-antiquegold-300 shadow-manuscript-lg relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 p-8 text-ivory-200/40 pointer-events-none select-none">
            <Quote className="w-36 h-36 rotate-180" />
          </div>

          <div className="flex items-center justify-between gap-2 mb-6 relative z-10 border-b border-ivory-200 pb-4">
            <span className="serial-badge text-xs sm:text-sm px-3 py-1 rounded-md font-bold">
              क्रमांक #{toMarathiNumerals(proverb.serialNumber, 4)} ({proverb.serialNumber})
            </span>

            <div className="flex items-center gap-2">
              <ProverbAudioButton text={proverb.proverb} size="md" showLabel={true} />
              <ProverbFavoriteButton proverb={proverb} size="md" showLabel={true} />
            </div>
          </div>

          {/* Proverb Title */}
          <div className="relative z-10 my-6 text-center sm:text-left">
            <h2 className="font-rozha text-3xl sm:text-5xl lg:text-6xl font-bold text-ink-950 leading-tight tracking-tight mb-4 text-balance">
              &ldquo;{proverb.proverb}&rdquo;
            </h2>

            {proverb.englishEquivalent && (
              <p className="text-sm sm:text-base text-saffron-800 font-sans italic mb-6">
                English Parallel: &ldquo;{proverb.englishEquivalent}&rdquo;
              </p>
            )}
          </div>

          {/* Meaning Block */}
          <div className="relative z-10 bg-ivory-100/90 rounded-2xl p-6 border border-ivory-300 my-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सोपा मराठी अर्थ:</span>
            </h3>
            <p className="text-lg sm:text-xl font-bold text-ink-950 leading-relaxed mb-3">
              {proverb.meaningMarathi}
            </p>
            <p className="text-xs sm:text-sm text-ink-600 font-sans">
              {proverb.meaningEnglish}
            </p>
          </div>

          {/* Everyday Example Block */}
          <div className="relative z-10 bg-gradient-to-r from-amber-50/70 to-ivory-100 rounded-2xl p-6 border border-antiquegold-200 my-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-antiquegold-600" />
              <span>दैनंदिन जीवनातील वापर (Everyday Usage):</span>
            </h3>
            <p className="text-base sm:text-lg text-ink-900 leading-relaxed italic mb-1">
              &ldquo;{proverb.exampleMarathi}&rdquo;
            </p>
            <p className="text-xs text-ink-600 font-sans">
              {proverb.exampleEnglish}
            </p>
          </div>

          {/* Context Block */}
          <div className="relative z-10 my-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700 mb-2">
              सांस्कृतिक संदर्भ व मर्म:
            </h3>
            <p className="text-sm sm:text-base text-ink-800 leading-relaxed bg-white p-4 rounded-xl border border-ivory-300">
              {proverb.context}
            </p>
          </div>

          {/* Card Footer Link */}
          <div className="relative z-10 pt-6 border-t border-ivory-200 flex items-center justify-between">
            <Link
              href={`/vishay/${encodeURIComponent(proverb.category)}`}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-ivory-200 text-ink-700 hover:bg-saffron-100 hover:text-saffron-800 transition-colors"
            >
              विषय: {proverb.category}
            </Link>

            <Link
              href={`/mhani/${proverb.serialNumber}`}
              className="inline-flex items-center gap-1 text-sm font-bold text-saffron-700 hover:text-saffron-800"
            >
              <span>सविस्तर पान पहा</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>

        {/* Past Days Archive */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-ink-900">
              मागील दिवसांच्या म्हणी (Recent Days)
            </h2>
            <Link href="/mhani" className="text-xs sm:text-sm font-semibold text-saffron-700 hover:underline">
              सर्व १,००० म्हणी पहा →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastDays.map(({ proverb: p, dateString: ds }) => (
              <Link
                key={ds}
                href={`/mhani/${p.serialNumber}`}
                className="manuscript-card rounded-2xl p-5 block group"
              >
                <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
                  <span className="font-medium">{ds}</span>
                  <span className="font-bold text-saffron-700">
                    #{toMarathiNumerals(p.serialNumber, 4)}
                  </span>
                </div>
                <h3 className="font-rozha text-xl font-bold text-ink-950 group-hover:text-saffron-700 transition-colors mb-2 leading-snug">
                  {p.proverb}
                </h3>
                <p className="text-xs text-ink-700 line-clamp-2">
                  {p.meaningMarathi}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
