import React from 'react';
import Link from 'next/link';
import { BookOpen, Home, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-sand-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-sand-300 p-8 sm:p-10 text-center shadow-card space-y-6">
        <div className="w-16 h-16 bg-saffron-100 text-saffron-700 rounded-2xl flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-600 font-sans">
            त्रुटी ४०४ • Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-950 font-rozha mt-1">
            पृष्ठ सापडले नाही
          </h1>
          <p className="text-sm text-ink-600 font-mukta mt-2 leading-relaxed">
            क्षमस्व, आपण शोधत असलेले पृष्ठ अस्तित्वात नाही किंवा त्याचा पत्ता बदलला असावा.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>मुख्यपृष्ठ</span>
          </Link>
          <Link
            href="/mhani"
            className="px-5 py-2.5 bg-sand-100 hover:bg-sand-200 text-ink-800 font-semibold rounded-xl text-sm transition-colors inline-flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>सर्व म्हणी</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
