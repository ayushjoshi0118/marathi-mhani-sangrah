'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, Trophy, Sparkles, Layers } from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';

interface MhanJulvaGameProps {
  proverbsPool: Proverb[];
}

interface MatchCard {
  id: string; // e.g., 'p-1', 'm-1'
  proverbId: string;
  type: 'proverb' | 'meaning';
  text: string;
}

export default function MhanJulvaGame({ proverbsPool }: MhanJulvaGameProps) {
  const [round, setRound] = useState(1);
  const [selectedCard, setSelectedCard] = useState<MatchCard | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);

  const [cards, setCards] = useState(() => initCards(proverbsPool));

  function initCards(pool: Proverb[]): { proverbs: MatchCard[]; meanings: MatchCard[] } {
    if (!pool || pool.length < 4) return { proverbs: [], meanings: [] };
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 4);

    const proverbCards: MatchCard[] = selected.map((p) => ({
      id: `p-${p.id}`,
      proverbId: p.id,
      type: 'proverb',
      text: p.proverb,
    }));

    const meaningCards: MatchCard[] = selected.map((p) => ({
      id: `m-${p.id}`,
      proverbId: p.id,
      type: 'meaning',
      text: p.meaningMarathi,
    }));

    return {
      proverbs: proverbCards.sort(() => Math.random() - 0.5),
      meanings: meaningCards.sort(() => Math.random() - 0.5),
    };
  }

  const handleCardClick = (card: MatchCard) => {
    if (matchedIds.includes(card.proverbId)) return;

    if (!selectedCard) {
      setSelectedCard(card);
      return;
    }

    if (selectedCard.id === card.id) {
      setSelectedCard(null);
      return;
    }

    // Must click one proverb and one meaning
    if (selectedCard.type === card.type) {
      setSelectedCard(card);
      return;
    }

    setAttempts((prev) => prev + 1);

    // Check match
    if (selectedCard.proverbId === card.proverbId) {
      const newMatched = [...matchedIds, card.proverbId];
      setMatchedIds(newMatched);
      setSelectedCard(null);

      if (newMatched.length === 4) {
        setRoundFinished(true);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } else {
      // Mismatch
      setTimeout(() => {
        setSelectedCard(null);
      }, 700);
    }
  };

  const handleNewRound = () => {
    setCards(initCards(proverbsPool));
    setMatchedIds([]);
    setSelectedCard(null);
    setAttempts(0);
    setRoundFinished(false);
    setRound((prev) => prev + 1);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-ivory-300 shadow-manuscript-lg font-devanagari max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ivory-200 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-saffron-600" />
          <h2 className="font-rozha text-2xl font-bold text-ink-950">म्हण जुळवा (Match Pairs)</h2>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
          <span className="text-ink-600">फेरी {toMarathiNumerals(round)}</span>
          <span className="text-saffron-700">प्रयत्न: {toMarathiNumerals(attempts)}</span>
          <span className="text-emerald-700">जोड्या: {toMarathiNumerals(matchedIds.length)} / ४</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-ink-600 mb-6 text-center">
        डावीकडील म्हण आणि उजवीकडील त्याचा अचूक अर्थ यांच्या जोड्या लावा:
      </p>

      {roundFinished ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="font-rozha text-3xl font-bold text-ink-950 mb-2">सर्व जोड्या जुळल्या!</h3>
          <p className="text-sm text-ink-600 mb-6">
            तुम्ही {toMarathiNumerals(attempts)} प्रयत्नांत ४ अचूक जोड्या पूर्ण केल्या!
          </p>
          <button
            onClick={handleNewRound}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>पुढील फेरी खेळा (Next Round)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Proverbs Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-800 mb-2">
              मराठी म्हणी
            </h3>
            {cards.proverbs?.map((c) => {
              const isMatched = matchedIds.includes(c.proverbId);
              const isSelected = selectedCard?.id === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => handleCardClick(c)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all font-rozha text-lg sm:text-xl font-bold ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 opacity-90 cursor-default'
                      : isSelected
                      ? 'bg-saffron-50 border-saffron-600 text-saffron-950 ring-2 ring-saffron-400 scale-[1.01]'
                      : 'bg-white border-ivory-300 text-ink-900 hover:bg-ivory-100 hover:border-ivory-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{c.text}</span>
                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Meanings Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-800 mb-2">
              अचूक अर्थ
            </h3>
            {cards.meanings?.map((c) => {
              const isMatched = matchedIds.includes(c.proverbId);
              const isSelected = selectedCard?.id === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => handleCardClick(c)}
                  disabled={isMatched}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all text-xs sm:text-sm leading-relaxed ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 opacity-90 cursor-default font-medium'
                      : isSelected
                      ? 'bg-saffron-50 border-saffron-600 text-saffron-950 ring-2 ring-saffron-400 scale-[1.01]'
                      : 'bg-white border-ivory-300 text-ink-800 hover:bg-ivory-100 hover:border-ivory-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{c.text}</span>
                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
