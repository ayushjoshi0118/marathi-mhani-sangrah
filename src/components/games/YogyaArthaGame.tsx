'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight, HelpCircle } from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';

interface YogyaArthaGameProps {
  proverbsPool: Proverb[];
}

export default function YogyaArthaGame({ proverbsPool }: YogyaArthaGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const [questions, setQuestions] = useState(() => generateQuestions(proverbsPool, 5));

  function generateQuestions(pool: Proverb[], count: number) {
    if (!pool || pool.length < 4) return [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map((correctProverb) => {
      // Pick 3 distractors from the rest of the pool
      const distractors = pool
        .filter((p) => p.id !== correctProverb.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [correctProverb.meaningMarathi, ...distractors.map((d) => d.meaningMarathi)]
        .sort(() => Math.random() - 0.5);

      return {
        proverbText: correctProverb.proverb,
        correctMeaning: correctProverb.meaningMarathi,
        fullProverb: correctProverb,
        options,
      };
    });
  }

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const q = questions[currentQuestionIndex];
    if (option === q.correctMeaning) {
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
      if (score >= 4) {
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        } catch (e) {}
      }
    }
  };

  const handleRestart = () => {
    setQuestions(generateQuestions(proverbsPool, 5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-ink-600 font-devanagari">
        खेळ सुरू करण्यासाठी पुरेसा डेटा उपलब्ध नाही.
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-ivory-300 shadow-manuscript-lg text-center font-devanagari max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-saffron-100 text-saffron-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="font-rozha text-3xl font-bold text-ink-950 mb-2">अभिनंदन! खेळ संपला!</h2>
        <p className="text-sm text-ink-600 mb-6">योग्य अर्थ निवडा फेरीत तुमचा अंतिम निकाल:</p>

        <div className="bg-ivory-100 rounded-2xl p-6 mb-8 border border-ivory-300">
          <p className="text-xs uppercase font-bold text-ink-500 mb-1">मिळालेले गुण (Score)</p>
          <p className="font-rozha text-5xl font-bold text-saffron-600 mb-2">
            {toMarathiNumerals(score)} / ५
          </p>
          <p className="text-sm font-medium text-ink-700">
            {score === 5
              ? 'अचूक अर्थबोध! मराठी म्हणींचे अर्थ तुम्हाला अगदी तोंडपाठ आहेत! 🌟'
              : score >= 3
              ? 'उत्तम कामगिरी! थोड्या सरावाने पूर्ण गुण मिळतील. 👍'
              : 'अधिक म्हणी वाचा आणि पुन्हा प्रयत्न करा! 📖'}
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
        >
          <RotateCcw className="w-5 h-5" />
          <span>पुन्हा खेळा (Play Again)</span>
        </button>
      </div>
    );
  }

  const q = questions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-ivory-300 shadow-manuscript-lg font-devanagari max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between border-b border-ivory-200 pb-4 mb-6">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 border border-saffron-300">
          प्रश्न {toMarathiNumerals(currentQuestionIndex + 1)} / ५
        </span>
        <span className="text-sm font-semibold text-ink-700">
          गुण: {toMarathiNumerals(score)} / ५
        </span>
      </div>

      {/* Question Prompt */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 mb-2">
          खालील म्हणीचा सर्वात अचूक अर्थ कोणता?
        </h3>
        <div className="p-6 rounded-2xl bg-ivory-100 border border-ivory-300 text-center">
          <p className="font-rozha text-2xl sm:text-4xl font-bold text-ink-950 leading-snug">
            &ldquo;{q.proverbText}&rdquo;
          </p>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {q.options.map((opt, idx) => {
          let style = 'bg-white border-ivory-300 text-ink-900 hover:bg-ivory-100 hover:border-ivory-400';
          let icon = null;

          if (isAnswered) {
            if (opt === q.correctMeaning) {
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
                <span className="w-7 h-7 rounded-lg bg-ivory-200 text-ink-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {isAnswered && (
        <div className="pt-4 border-t border-ivory-200 flex items-center justify-between gap-4 animate-in fade-in">
          <div>
            <p className="text-xs text-ink-600 italic">
              उदा: &ldquo;{q.fullProverb.exampleMarathi}&rdquo;
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
