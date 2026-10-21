'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Calendar,
  Share2,
} from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';

interface DailyQuizGameProps {
  proverbsPool: Proverb[];
}

export default function DailyQuizGame({ proverbsPool }: DailyQuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [dateString, setDateString] = useState('');

  // Daily Streak Tracking
  useEffect(() => {
    try {
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      setDateString(today);

      const savedStreak = localStorage.getItem('marathi_daily_streak');
      const lastPlayed = localStorage.getItem('marathi_last_quiz_date');

      if (savedStreak) {
        setStreak(parseInt(savedStreak, 10));
      }
    } catch (e) {}
  }, []);

  const [questions] = useState(() => {
    if (!proverbsPool || proverbsPool.length < 5) return [];

    // Deterministic selection based on day of year
    const now = new Date();
    const kolkataDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const [y, m, d] = kolkataDateStr.split('-').map(Number);
    const dayOfYear = Math.floor(
      (Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / (24 * 60 * 60 * 1000)
    );

    const qList = [];
    for (let i = 0; i < 5; i++) {
      const index = (dayOfYear * 7 + i * 31) % proverbsPool.length;
      const target = proverbsPool[index];

      // 3 distractors
      const distractors = proverbsPool
        .filter((p) => p.id !== target.id)
        .slice(0, 3)
        .map((d) => d.meaningMarathi);

      const options = [target.meaningMarathi, ...distractors].sort(
        () => 0.5 - ((target.serialNumber + i) % 3)
      );

      qList.push({
        proverb: target,
        options,
      });
    }

    return qList;
  });

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const q = questions[currentQuestionIndex];
    if (option === q.proverb.meaningMarathi) {
      setScore((prev) => prev + 1);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameFinished(true);
      // Update streak in localStorage
      try {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const lastPlayed = localStorage.getItem('marathi_last_quiz_date');
        let newStreak = streak;

        if (lastPlayed !== today) {
          newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem('marathi_daily_streak', newStreak.toString());
          localStorage.setItem('marathi_last_quiz_date', today);
        }

        if (score >= 4) {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        }
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-ink-600 font-devanagari">
        चाचणी सुरू करण्यासाठी माहिती लोड होत आहे...
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-ivory-300 shadow-manuscript-lg text-center font-devanagari max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="font-rozha text-3xl font-bold text-ink-950 mb-2">
          आजचे आव्हान पूर्ण झाले!
        </h2>
        <p className="text-sm text-ink-600 mb-6">
          दैनिक ज्ञानचाचणी (Daily Quiz Challenge) निकाल:
        </p>

        <div className="bg-ivory-100 rounded-2xl p-6 mb-8 border border-ivory-300">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div>
              <p className="text-xs uppercase font-bold text-ink-500 mb-1">गुण (Score)</p>
              <p className="font-rozha text-4xl font-bold text-saffron-600">
                {toMarathiNumerals(score)} / ५
              </p>
            </div>
            <div className="h-10 w-px bg-ivory-300"></div>
            <div>
              <p className="text-xs uppercase font-bold text-ink-500 mb-1">सलग दिवस (Streak)</p>
              <p className="font-rozha text-4xl font-bold text-amber-600 flex items-center justify-center gap-1">
                <Flame className="w-6 h-6 fill-amber-500" />
                <span>{toMarathiNumerals(streak || 1)}</span>
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-ink-800">
            {score === 5
              ? 'अफाट प्रभुत्व! आजच्या सर्व प्रश्नांची अचूक उत्तरे! 🌟'
              : score >= 3
              ? 'छान! तुमची मराठी म्हणींची समज उत्तम आहे! 👍'
              : 'रोज चाचणी सोडवून ज्ञानात भर घाला! 📚'}
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold transition-all shadow-md"
        >
          <RotateCcw className="w-5 h-5" />
          <span>पुन्हा सराव करा</span>
        </button>
      </div>
    );
  }

  const q = questions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-ivory-300 shadow-manuscript-lg font-devanagari max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ivory-200 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-saffron-600" />
          <span className="text-xs font-semibold text-ink-600">
            आजची चाचणी ({dateString})
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
          <span className="text-amber-700 flex items-center gap-1">
            <Flame className="w-4 h-4 fill-amber-500" /> {toMarathiNumerals(streak)} दिवस
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-saffron-100 text-saffron-800">
            {toMarathiNumerals(currentQuestionIndex + 1)} / ५
          </span>
        </div>
      </div>

      {/* Proverb Prompt */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-800 mb-2">
          पुढील म्हणीचा योग्य अर्थ निवडा:
        </h3>
        <div className="p-6 rounded-2xl bg-ivory-100 border border-ivory-300 text-center">
          <p className="font-rozha text-2xl sm:text-4xl font-bold text-ink-950 leading-snug">
            &ldquo;{q.proverb.proverb}&rdquo;
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {q.options.map((opt, idx) => {
          let style = 'bg-white border-ivory-300 text-ink-900 hover:bg-ivory-100';
          let icon = null;

          if (isAnswered) {
            if (opt === q.proverb.meaningMarathi) {
              style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
            } else if (opt === selectedOption) {
              style = 'bg-rose-50 border-rose-300 text-rose-950 font-semibold';
              icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
            } else {
              style = 'opacity-50 bg-ivory-50 border-ivory-200 text-ink-400';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base leading-relaxed transition-all flex items-center justify-between gap-3 ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-ivory-200 text-ink-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {toMarathiNumerals(idx + 1)}
                </span>
                <span>{opt}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Answer & Next */}
      {isAnswered && (
        <div className="pt-4 border-t border-ivory-200 flex items-center justify-between gap-4 animate-in fade-in">
          <div>
            <p className="text-xs text-ink-600">
              <span className="font-bold">विषय:</span> {q.proverb.category}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-sm transition-all shadow-xs"
          >
            <span>{currentQuestionIndex < questions.length - 1 ? 'पुढील प्रश्न' : 'निकाल पहा'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
