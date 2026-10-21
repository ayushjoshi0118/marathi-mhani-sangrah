'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, Filter } from 'lucide-react';

interface SearchBoxProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export default function SearchBox({
  initialQuery = '',
  onSearch,
  autoFocus = false,
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // Keyboard shortcut '/' to focus search input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
      const params = new URLSearchParams(currentSearch);
      if (query.trim()) {
        params.set('q', query.trim());
      } else {
        params.delete('q');
      }
      params.set('page', '1');
      router.push(`/mhani?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    } else {
      const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
      const params = new URLSearchParams(currentSearch);
      params.delete('q');
      params.set('page', '1');
      router.push(`/mhani?${params.toString()}`);
    }
    inputRef.current?.focus();
  };

  const suggestions = [
    'अति तिथे माती',
    'कष्टाविना फळ नाही',
    'चोराच्या मनात चांदणे',
    'नशीब आणि प्रयत्न',
    '#१ (No. 1)',
  ];

  return (
    <div className="w-full font-devanagari">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-ink-400">
            <Search className="w-5 h-5 text-saffron-600" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder="म्हण, अर्थ, विषय किंवा क्रमांक शोधा... (उदा. अति तिथे माती, #1)"
            className="w-full pl-12 pr-24 py-4 rounded-2xl bg-white border-2 border-ivory-300 focus:border-saffron-600 focus:ring-4 focus:ring-saffron-500/15 shadow-manuscript text-ink-950 placeholder-ink-400 text-base sm:text-lg transition-all outline-none"
            autoFocus={autoFocus}
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-full text-ink-400 hover:text-ink-700 hover:bg-ivory-200 transition-colors"
                title="शोध साफ करा"
                aria-label="शोध मजकूर साफ करा"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              शोधा
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Search Pills */}
      <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-ink-600">
        <span className="font-semibold flex items-center gap-1 text-ink-700">
          <Sparkles className="w-3.5 h-3.5 text-antiquegold-500" />
          लोकप्रिय शोध:
        </span>
        {suggestions.map((sug) => (
          <button
            key={sug}
            onClick={() => {
              const clean = sug.split(' ')[0];
              setQuery(clean);
              if (onSearch) {
                onSearch(clean);
              } else {
                router.push(`/mhani?q=${encodeURIComponent(clean)}`);
              }
            }}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-saffron-50 hover:border-saffron-300 border border-ivory-300 text-ink-700 hover:text-saffron-700 transition-all font-medium"
          >
            {sug}
          </button>
        ))}
      </div>
    </div>
  );
}
