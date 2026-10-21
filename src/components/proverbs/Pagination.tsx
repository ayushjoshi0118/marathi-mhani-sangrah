'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { toMarathiNumerals } from '@/lib/devanagari';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = '/mhani',
}: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate sensible page window
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-2); // ellipsis
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-1.5 font-devanagari mt-12 select-none"
      aria-label="पृष्ठ नेव्हिगेशन"
    >
      {/* Previous Page */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-ivory-300 bg-white hover:bg-ivory-100 text-ink-800 transition-colors flex items-center gap-1 text-sm font-medium"
          aria-label="मागील पृष्ठ"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">मागे</span>
        </Link>
      ) : (
        <span className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-ivory-200 bg-ivory-100 text-ink-300 cursor-not-allowed flex items-center gap-1 text-sm font-medium">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">मागे</span>
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p < 0) {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-ink-400">
                •••
              </span>
            );
          }

          const isCurrent = p === currentPage;

          return isCurrent ? (
            <span
              key={p}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-saffron-600 text-white font-bold flex items-center justify-center text-sm sm:text-base shadow-sm"
              aria-current="page"
            >
              {toMarathiNumerals(p)}
            </span>
          ) : (
            <Link
              key={p}
              href={createPageUrl(p)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-ivory-300 bg-white hover:bg-ivory-100 text-ink-800 font-medium flex items-center justify-center text-sm sm:text-base transition-colors"
            >
              {toMarathiNumerals(p)}
            </Link>
          );
        })}
      </div>

      {/* Next Page */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-ivory-300 bg-white hover:bg-ivory-100 text-ink-800 transition-colors flex items-center gap-1 text-sm font-medium"
          aria-label="पुढील पृष्ठ"
        >
          <span className="hidden sm:inline">पुढे</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-ivory-200 bg-ivory-100 text-ink-300 cursor-not-allowed flex items-center gap-1 text-sm font-medium">
          <span className="hidden sm:inline">पुढे</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
