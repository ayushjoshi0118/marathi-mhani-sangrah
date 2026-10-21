'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';

interface MhanOlkhaGameProps {
  proverbsPool: Proverb[];
}

export default function MhanOlkhaGame({ proverbsPool }: MhanOlkhaGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  // Generate 5 question rounds
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

      const options = [correctProverb, ...distractors]
        .sort(() => Math.random() - 0.5)
        .map((p) => p.proverb);

      return {
        prompt: correctProverb.meaningMarathi,
        example: correctProverb.exampleMarathi,
        correctAnswer: correctProverb.proverb,
        fullProverb: correctProverb,
        options,
      };
    });
  }

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = questions[currentQuestionIndex];
    if (option === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    } else {
      setStreak(0);
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
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch (e) {}
      }
    }
  };

  const handleRestart = () => {
    setQuestions(generateQuestions(proverbsPool, 5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
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
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="font-rozha text-3xl font-bold text-ink-950 mb-2">खेळ पूर्ण झाला!</h2>
        <p className="text-sm text-ink-600 mb-6">तुम्ही ५ पैकी सर्व प्रश्नांची उत्तरे दिली.</p>

        <div className="bg-ivory-100 rounded-2xl p-6 mb-8 border border-ivory-300">
          <p className="text-xs uppercase font-bold text-ink-500 mb-1">तुमचा गुणसंख्या (Score)</p>
          <p className="font-rozha text-5xl font-bold text-saffron-600 mb-2">
            {toMarathiNumerals(score)} / ५
          </p>
          <p className="text-sm font-medium text-ink-700">
            {score === 5
              ? 'उत्कृष्ट! तुम्ही मराठी भाषेचे जाणकार आहात! 🌟'
              : score >= 3
              ? 'छान प्रयत्न! अधिक सरावाने आणखी उत्तम गुण मिळतील. 👍'
              : 'पुन्हा प्रयत्न करा आणि नवीन म्हणी शिका! 📚'}
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

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-ivory-300 shadow-manuscript-lg font-devanagari max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between border-b border-ivory-200 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 border border-saffron-300">
            प्रश्न {toMarathiNumerals(currentQuestionIndex + 1)} / ५
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <span className="text-ink-600">गुण: {toMarathiNumerals(score)}</span>
          {streak > 1 && (
            <span className="text-amber-600 flex items-center gap-1">
              🔥 {toMarathiNumerals(streak)} सलग!
            </span>
          )}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>दिलेल्या अर्थावरून योग्य म्हण ओळखा:</span>
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-ink-950 leading-snug bg-ivory-100 p-5 rounded-2xl border border-ivory-300">
          &ldquo;{currentQ.prompt}&rdquo;
        </p>
        {currentQ.example && (
          <p className="text-xs sm:text-sm text-ink-600 mt-2 px-1 italic">
            उदा: &ldquo;{currentQ.example}&rdquo;
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((option, idx) => {
          let btnStyle = 'bg-white border-ivory-300 text-ink-900 hover:bg-ivory-100 hover:border-ivory-400';
          let icon = null;

          if (isAnswered) {
            if (option === currentQ.correctAnswer) {
              btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs';
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
            } else if (option === selectedOption) {
              btnStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-semibold';
              icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
            } else {
              btnStyle = 'opacity-60 bg-ivory-50 border-ivory-200 text-ink-400';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border-2 text-left text-base sm:text-lg transition-all flex items-center justify-between gap-3 ${btnStyle} focus:outline-none focus:ring-2 focus:ring-saffron-500`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-ivory-200 text-ink-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Next Button */}
      {isAnswered && (
        <div className="pt-4 border-t border-ivory-200 flex items-center justify-between gap-4 animate-in fade-in">
          <div>
            <p className="text-xs sm:text-sm text-ink-700">
              <span className="font-bold">उत्तर:</span> {currentQ.correctAnswer}
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
