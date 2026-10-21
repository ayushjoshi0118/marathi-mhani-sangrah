'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-sand-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-sand-300 p-8 sm:p-10 text-center shadow-card space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 font-rozha">
            तांत्रिक समस्या उद्भवली
          </h1>
          <p className="text-sm text-ink-600 font-mukta mt-2 leading-relaxed">
            माहिती लोड करताना अनपेक्षित अडचण आली आहे. कृपया पृष्ठ पुन्हा लोड करून पहा.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>पुन्हा प्रयत्न करा</span>
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-sand-100 hover:bg-sand-200 text-ink-800 font-semibold rounded-xl text-sm transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>मुख्यपृष्ठ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
