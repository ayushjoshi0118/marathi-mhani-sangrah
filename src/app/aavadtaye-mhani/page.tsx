'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Download,
  Upload,
  Printer,
  Trash2,
  BookOpen,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';
import ProverbCard from '@/components/proverbs/ProverbCard';

export default function AavadtayeMhaniPage() {
  const [favorites, setFavorites] = useState<Proverb[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('marathi_mhani_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
    setLoaded(true);
  }, []);

  const handleClearAll = () => {
    if (confirm('तुम्हाला सर्व आवडत्या म्हणी काढून टाकायच्या आहेत का?')) {
      localStorage.removeItem('marathi_mhani_favorites');
      setFavorites([]);
      window.dispatchEvent(new Event('favorites-updated'));
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'aavadtaye_marathi_mhani.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported: Proverb[] = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          // Merge with existing
          const existingIds = new Set(favorites.map((f) => f.serialNumber));
          const merged = [...favorites];
          for (const item of imported) {
            if (item.serialNumber && !existingIds.has(item.serialNumber)) {
              merged.push(item);
            }
          }
          localStorage.setItem('marathi_mhani_favorites', JSON.stringify(merged));
          setFavorites(merged);
          window.dispatchEvent(new Event('favorites-updated'));
          alert(`${imported.length} म्हणी यशस्वीरीत्या आयात केल्या!`);
        }
      } catch (err) {
        alert('अवैध JSON फाईल. कृपया खरी फाईल निवडा.');
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="font-devanagari text-ink-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>वैयक्तिक संग्रह (Personal Favorites)</span>
            </div>

            <h1 className="font-rozha text-3xl sm:text-5xl font-bold text-ink-950 tracking-tight">
              आवडत्या म्हणी
            </h1>

            <p className="text-sm sm:text-base text-ink-600 mt-2">
              तुम्ही जतन केलेल्या म्हणींची यादी. ही माहिती तुमच्या ब्राऊझरमध्ये स्थानिक स्वरूपात
              सुरक्षित साठवली जाते.
            </p>
          </div>

          {/* Action Toolbar */}
          {favorites.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 text-xs font-semibold print:hidden">
              <button
                onClick={handleExport}
                className="px-3 py-2 rounded-xl bg-white border border-ivory-300 hover:bg-ivory-100 text-ink-800 transition-colors flex items-center gap-1.5 shadow-xs"
                title="JSON फाईल म्हणून सेव्ह करा"
              >
                <Download className="w-3.5 h-3.5 text-saffron-600" />
                <span>निर्यात करा (Export)</span>
              </button>

              <label className="px-3 py-2 rounded-xl bg-white border border-ivory-300 hover:bg-ivory-100 text-ink-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>आयात करा (Import)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-white border border-ivory-300 hover:bg-ivory-100 text-ink-800 transition-colors flex items-center gap-1.5 shadow-xs"
                title="प्रिंट करा"
              >
                <Printer className="w-3.5 h-3.5 text-ink-600" />
                <span>प्रिंट करा</span>
              </button>

              <button
                onClick={handleClearAll}
                className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5 shadow-xs"
                title="सर्व काढा"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>सर्व पुसा</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {!loaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div>
            <p className="text-xs text-ink-500 mb-6">
              एकूण जतन केलेल्या म्हणी: <strong>{toMarathiNumerals(favorites.length)}</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((proverb) => (
                <ProverbCard key={proverb.id} proverb={proverb} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty Favorites State */
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-ivory-300 max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-rozha text-2xl font-bold text-ink-950 mb-2">
              अजून कोणतीही म्हण जतन केलेली नाही
            </h2>
            <p className="text-sm text-ink-600 mb-6">
              कोणत्याही म्हणीच्या कार्डावरील हृदय चिन्हावर (❤️) क्लिक करून तुम्ही ती म्हण येथे जतन
              करू शकता.
            </p>
            <Link
              href="/mhani"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm transition-all shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>म्हणी शोधायला सुरुवात करा</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
