'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  HelpCircle,
  Tag,
  BookOpen,
  ArrowLeft,
  Volume2,
  Quote,
  Compass,
} from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';
import ProverbAudioButton from './ProverbAudioButton';
import ProverbFavoriteButton from './ProverbFavoriteButton';
import ProverbShareModal from './ProverbShareModal';
import ProverbCard from './ProverbCard';

interface ProverbDetailViewProps {
  proverb: Proverb;
  relatedProverbs: Proverb[];
  prevSerial?: number | null;
  nextSerial?: number | null;
}

export default function ProverbDetailView({
  proverb,
  relatedProverbs,
  prevSerial,
  nextSerial,
}: ProverbDetailViewProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `मराठी म्हण #${toMarathiNumerals(proverb.serialNumber)}:\n"${proverb.proverb}"\n\nअर्थ: ${proverb.meaningMarathi}\n\nउदाहरण: ${proverb.exampleMarathi}\n\nमराठी म्हणी संग्रह`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-devanagari text-ink-900">
      {/* Top Breadcrumb & Back Link */}
      <div className="flex items-center justify-between text-sm text-ink-600 mb-6">
        <Link
          href="/mhani"
          className="inline-flex items-center gap-1.5 text-saffron-700 hover:text-saffron-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>सर्व म्हणींकडे परत जा (All Proverbs)</span>
        </Link>

        {/* Previous & Next Navigation */}
        <div className="flex items-center gap-1">
          {prevSerial ? (
            <Link
              href={`/mhani/${prevSerial}`}
              className="p-2 rounded-lg border border-ivory-300 bg-white hover:bg-ivory-100 text-ink-800 transition-colors flex items-center gap-1 text-xs font-medium"
              title={`मागील म्हण #${toMarathiNumerals(prevSerial)}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">मागील (#{toMarathiNumerals(prevSerial)})</span>
            </Link>
          ) : (
            <span className="p-2 rounded-lg border border-ivory-200 bg-ivory-100 text-ink-300 cursor-not-allowed text-xs">
              <ChevronLeft className="w-4 h-4" />
            </span>
          )}

          {nextSerial ? (
            <Link
              href={`/mhani/${nextSerial}`}
              className="p-2 rounded-lg border border-ivory-300 bg-white hover:bg-ivory-100 text-ink-800 transition-colors flex items-center gap-1 text-xs font-medium"
              title={`पुढील म्हण #${toMarathiNumerals(nextSerial)}`}
            >
              <span className="hidden sm:inline">पुढील (#{toMarathiNumerals(nextSerial)})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-2 rounded-lg border border-ivory-200 bg-ivory-100 text-ink-300 cursor-not-allowed text-xs">
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>

      {/* Main Manuscript Proverb Feature Card */}
      <article className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-ivory-300 shadow-manuscript-lg relative overflow-hidden mb-12">
        {/* Subtle Decorative Antique Gold Watermark */}
        <div className="absolute top-0 right-0 p-8 text-ivory-200/50 pointer-events-none select-none">
          <Quote className="w-32 h-32 rotate-180" />
        </div>

        {/* Top Badges & Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10 border-b border-ivory-200 pb-5">
          <div className="flex items-center gap-2">
            <span className="serial-badge text-sm sm:text-base px-3.5 py-1 rounded-lg font-bold">
              कायमस्वरूपी क्रमांक #{toMarathiNumerals(proverb.serialNumber, 4)} ({proverb.serialNumber})
            </span>
            <Link
              href={`/vishay/${encodeURIComponent(proverb.category)}`}
              className="px-3 py-1 rounded-lg bg-ivory-200 text-ink-800 hover:bg-saffron-100 hover:text-saffron-800 text-xs sm:text-sm font-medium transition-colors"
            >
              {proverb.category}
            </Link>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <ProverbAudioButton text={proverb.proverb} size="md" showLabel={true} />
            <ProverbFavoriteButton proverb={proverb} size="md" showLabel={true} />
            <button
              onClick={() => setShareModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-ivory-300 bg-ivory-100 hover:bg-ivory-200 text-ink-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
              title="शेअर करा"
            >
              <Share2 className="w-4 h-4 text-saffron-600" />
              <span className="hidden sm:inline">शेअर</span>
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg border border-ivory-300 bg-ivory-100 hover:bg-ivory-200 text-ink-700 transition-colors"
              title="मजकूर कॉपी करा"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Primary Proverb Typography */}
        <div className="relative z-10 my-4 text-center sm:text-left">
          <h1 className="font-rozha text-3xl sm:text-5xl lg:text-[54px] font-bold text-ink-950 leading-tight tracking-tight mb-4 text-balance">
            &ldquo;{proverb.proverb}&rdquo;
          </h1>
          {proverb.englishEquivalent && (
            <p className="text-sm sm:text-base text-saffron-800 font-sans font-medium mb-6 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-saffron-100 text-saffron-900 text-xs font-semibold uppercase">
                English Equivalent
              </span>
              <span>&ldquo;{proverb.englishEquivalent}&rdquo;</span>
            </p>
          )}
        </div>

        {/* Section 1: Marathi & English Meaning */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 my-8 pt-6 border-t border-ivory-200">
          <div className="bg-ivory-100/70 rounded-2xl p-5 border border-ivory-300">
            <h2 className="text-xs font-bold uppercase tracking-wider text-saffron-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सोपा मराठी अर्थ (Simple Meaning)</span>
            </h2>
            <p className="text-base sm:text-lg text-ink-950 leading-relaxed font-medium">
              {proverb.meaningMarathi}
            </p>
          </div>

          <div className="bg-ivory-100/70 rounded-2xl p-5 border border-ivory-300 font-sans">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-600 mb-2 flex items-center gap-1.5">
              <span>English Meaning & Context</span>
            </h2>
            <p className="text-sm sm:text-base text-ink-800 leading-relaxed">
              {proverb.meaningEnglish}
            </p>
          </div>
        </div>

        {/* Section 2: Everyday Usage Example Sentence */}
        <div className="relative z-10 bg-gradient-to-r from-amber-50/70 via-ivory-100 to-amber-50/70 rounded-2xl p-6 border border-antiquegold-200 my-6">
          <h2 className="text-sm font-bold text-ink-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-antiquegold-600" />
            <span>दैनंदिन जीवनातील समर्पक उदाहरण (Usage in Everyday Life)</span>
          </h2>
          <p className="text-base sm:text-lg text-ink-900 leading-relaxed italic mb-2">
            &ldquo;{proverb.exampleMarathi}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-ink-600 font-sans">
            {proverb.exampleEnglish}
          </p>
        </div>

        {/* Section 3: In-Depth Cultural Context and Nuances */}
        <div className="relative z-10 my-6 pt-4">
          <h2 className="text-sm font-bold text-ink-900 mb-2.5 flex items-center gap-2">
            <Compass className="w-4 h-4 text-saffron-600" />
            <span>सविस्तर संदर्भ व वापर (Linguistic & Cultural Context)</span>
          </h2>
          <p className="text-sm sm:text-base text-ink-800 leading-relaxed bg-white rounded-xl p-4 border border-ivory-300">
            {proverb.context}
          </p>
        </div>

        {/* Tags */}
        {proverb.tags && proverb.tags.length > 0 && (
          <div className="relative z-10 pt-4 border-t border-ivory-200 flex items-center flex-wrap gap-2 text-xs">
            <span className="font-semibold text-ink-600 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              टॅग्ज:
            </span>
            {proverb.tags.map((tag) => (
              <Link
                key={tag}
                href={`/mhani?tag=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 rounded-md bg-ivory-200 text-ink-700 hover:bg-saffron-100 hover:text-saffron-800 transition-colors font-medium"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Feedback / Report Correction Link */}
        <div className="relative z-10 mt-6 pt-4 border-t border-ivory-200 flex items-center justify-between text-xs text-ink-500">
          <span>संपादकीय पडताळणी: मराठी भाषा संपादन मंडळ द्वारे प्रमाणित</span>
          <Link
            href={`/durusti?id=${proverb.id}&serial=${proverb.serialNumber}&text=${encodeURIComponent(proverb.proverb)}`}
            className="text-saffron-700 hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>काही चूक आढळली? दुरुस्ती नोंदवा</span>
          </Link>
        </div>
      </article>

      {/* Related Proverbs Grid */}
      {relatedProverbs && relatedProverbs.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-rozha text-2xl sm:text-3xl font-bold text-ink-900">
                या विषयावरील इतर म्हणी
              </h2>
              <p className="text-xs sm:text-sm text-ink-600 mt-1">
                More proverbs related to &lsquo;{proverb.category}&rsquo;
              </p>
            </div>
            <Link
              href={`/vishay/${encodeURIComponent(proverb.category)}`}
              className="text-xs sm:text-sm font-semibold text-saffron-700 hover:underline"
            >
              सर्व पहा ({proverb.category}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {relatedProverbs.map((rel) => (
              <ProverbCard key={rel.id} proverb={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      <ProverbShareModal
        proverb={proverb}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}
