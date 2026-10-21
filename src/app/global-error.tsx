'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical Global Error:', error);
  }, [error]);

  return (
    <html lang="mr">
      <body className="min-h-screen bg-[#FAF6EF] text-[#1A1F32] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#E3DAC9] shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold mb-2">अनपेक्षित त्रुटी उद्भवली</h1>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            अनुप्रयोगामध्ये गंभीर त्रुटी आली आहे. कृपया पृष्ठ पुन्हा लोड करण्याचा प्रयत्न करा.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 bg-[#D95D24] hover:bg-[#B34515] text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            पुन्हा प्रयत्न करा (Try Again)
          </button>
        </div>
      </body>
    </html>
  );
}
