'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Share2, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';
import ProverbAudioButton from './ProverbAudioButton';
import ProverbFavoriteButton from './ProverbFavoriteButton';
import ProverbShareModal from './ProverbShareModal';

interface ProverbCardProps {
  proverb: Proverb;
  priority?: boolean;
}

export default function ProverbCard({ proverb, priority = false }: ProverbCardProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <>
      <article className="manuscript-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative group font-devanagari">
        {/* Top Header: Serial Badge & Actions */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3.5">
            {/* Permanent Serial Badge */}
            <div className="flex items-center gap-1.5">
              <span className="serial-badge text-xs px-2.5 py-1 rounded-md font-bold tracking-wider">
                #{toMarathiNumerals(proverb.serialNumber, 4)}
              </span>
              <span className="text-[11px] text-ink-500 font-sans hidden sm:inline">
                (#{proverb.serialNumber})
              </span>
            </div>

            {/* Quick Actions (Audio, Favorite, Share) */}
            <div className="flex items-center gap-1">
              <ProverbAudioButton text={proverb.proverb} size="sm" showLabel={false} />
              <ProverbFavoriteButton proverb={proverb} size="sm" />
              <button
                onClick={() => setShareModalOpen(true)}
                className="p-1.5 rounded-lg border border-ivory-300 bg-ivory-100/80 text-ink-500 hover:text-saffron-600 hover:bg-ivory-200 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500"
                title="शेअर करा (Share)"
                aria-label="शेअर करा"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Proverb Devanagari Headline */}
          <Link
            href={`/mhani/${proverb.serialNumber}`}
            className="block group-hover:text-saffron-700 transition-colors"
          >
            <h2 className="font-rozha text-2xl sm:text-[26px] font-bold text-ink-950 leading-snug tracking-tight mb-2.5">
              {proverb.proverb}
            </h2>
          </Link>

          {/* Short Marathi Meaning */}
          <p className="text-sm sm:text-base text-ink-800 leading-relaxed mb-3 line-clamp-2">
            <span className="font-semibold text-ink-900">अर्थ:</span> {proverb.meaningMarathi}
          </p>

          {/* English Meaning Snippet */}
          <p className="text-xs text-ink-600 font-sans italic line-clamp-1 mb-4">
            {proverb.meaningEnglish}
          </p>
        </div>

        {/* Card Footer: Category & Detail Link */}
        <div className="pt-3.5 border-t border-ivory-200/80 flex items-center justify-between gap-2 mt-auto text-xs">
          <Link
            href={`/vishay/${encodeURIComponent(proverb.category)}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ivory-200 text-ink-700 hover:bg-saffron-100 hover:text-saffron-800 transition-colors font-medium truncate max-w-[170px]"
            title={`विषय: ${proverb.category}`}
          >
            <Tag className="w-3 h-3 text-saffron-600 shrink-0" />
            <span className="truncate">{proverb.category}</span>
          </Link>

          <Link
            href={`/mhani/${proverb.serialNumber}`}
            className="inline-flex items-center gap-1 font-semibold text-saffron-700 hover:text-saffron-800 hover:translate-x-0.5 transition-all py-1 px-2 rounded focus:outline-none focus:ring-1 focus:ring-saffron-500"
          >
            <span>सविस्तर वाचा</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>

      {/* Share Modal */}
      <ProverbShareModal
        proverb={proverb}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  );
}
