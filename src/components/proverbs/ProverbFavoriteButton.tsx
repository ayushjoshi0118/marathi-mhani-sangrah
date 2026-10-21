'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Proverb } from '@/types';

interface ProverbFavoriteButtonProps {
  proverb: Proverb;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ProverbFavoriteButton({
  proverb,
  size = 'md',
  showLabel = false,
}: ProverbFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('marathi_mhani_favorites');
      if (saved) {
        const parsed: Proverb[] = JSON.parse(saved);
        setIsFavorite(parsed.some((p) => p.serialNumber === proverb.serialNumber));
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [proverb.serialNumber]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved = localStorage.getItem('marathi_mhani_favorites');
      let list: Proverb[] = saved ? JSON.parse(saved) : [];

      if (isFavorite) {
        list = list.filter((p) => p.serialNumber !== proverb.serialNumber);
        setIsFavorite(false);
      } else {
        list.push(proverb);
        setIsFavorite(true);
      }

      localStorage.setItem('marathi_mhani_favorites', JSON.stringify(list));
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (e) {
      console.error('Failed to update favorites:', e);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'px-3.5 py-2 text-sm font-medium gap-1.5',
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`inline-flex items-center justify-center rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 ${sizeClasses[size]} ${
        isFavorite
          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
          : 'bg-ivory-100/80 border-ivory-300 text-ink-500 hover:text-rose-600 hover:bg-ivory-200'
      }`}
      title={isFavorite ? 'आवडत्या म्हणीतून काढा (Remove from favorites)' : 'आवडत्या म्हणींमध्ये जोडा (Add to favorites)'}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-4 h-4 transition-transform ${
          isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-ink-500 hover:scale-110'
        }`}
      />
      {showLabel && (
        <span className="text-xs">{isFavorite ? 'जतन केले' : 'जतन करा'}</span>
      )}
    </button>
  );
}
