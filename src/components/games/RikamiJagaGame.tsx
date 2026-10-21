'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight, HelpCircle } from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';

interface RikamiJagaGameProps {
  proverbsPool: Proverb[];
}

export default function RikamiJagaGame({ proverbsPool }: RikamiJagaGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const [questions, setQuestions] = useState(() => generateQuestions(proverbsPool, 5));

  function generateQuestions(pool: Proverb[], count: number) {
    if (!pool || pool.length < 4) return [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map((p) => {
      const words = p.proverb.split(' ');
      // Pick a word with length >= 2
      const candidateIndices = words
        .map((w, i) => (w.length >= 2 ? i : -1))
        .filter((i) => i !== -1);

      const blankIndex =
        candidateIndices.length > 0
          ? candidateIndices[Math.floor(Math.random() * candidateIndices.length)]
          : words.length - 1;

      const missingWord = words[blankIndex];
      const maskedWords = [...words];
      maskedWords[blankIndex] = '_______';
      const maskedSentence = maskedWords.join(' ');

      // Pick 3 distractors from words in other proverbs
      const distractorWords: string[] = [];
      for (const other of pool) {
        if (other.id === p.id) continue;
        for (const w of other.proverb.split(' ')) {
          if (w.length >= 2 && w !== missingWord && !distractorWords.includes(w)) {
            distractorWords.push(w);
            if (distractorWords.length >= 3) break;
          }
        }
        if (distractorWords.length >= 3) break;
      }

      const options = [missingWord, ...distractorWords]
        .sort(() => Math.random() - 0.5);

      return {
        maskedSentence,
        missingWord,
        fullProverb: p,
        options,
      };
    });
  }

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const q = questions[currentQuestionIndex];
    if (option === q.missingWord) {
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
      setShowHint(false);
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
    setShowHint(false);
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
        <h2 className="font-rozha text-3xl font-bold text-ink-950 mb-2">खेळ संपला!</h2>
        <p className="text-sm text-ink-600 mb-6">रिकामी जागा भरा फेरीत तुमचा अंतिम निकाल:</p>

        <div className="bg-ivory-100 rounded-2xl p-6 mb-8 border border-ivory-300">
          <p className="text-xs uppercase font-bold text-ink-500 mb-1">मिळालेले गुण (Score)</p>
          <p className="font-rozha text-5xl font-bold text-saffron-600 mb-2">
            {toMarathiNumerals(score)} / ५
          </p>
          <p className="text-sm font-medium text-ink-700">
            {score === 5
              ? 'अफाट ज्ञान! तुमच्या अचूक शब्दांची कमाल आहे! 🌟'
              : score >= 3
              ? 'छान कामगिरी! मराठी शब्दसंग्रह आणखी वाढवत राहा. 👍'
              : 'पुन्हा प्रयत्न करून शब्द ओळखा! 📖'}
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
          म्हणीतील योग्य शब्द निवडून रिकामी जागा भरा:
        </h3>
        <div className="p-6 rounded-2xl bg-ivory-100 border border-ivory-300 text-center">
          <p className="font-rozha text-2xl sm:text-3xl font-bold text-ink-950 leading-snug">
            &ldquo;{q.maskedSentence}&rdquo;
          </p>
        </div>

        {/* Hint toggle */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-saffron-700 hover:underline flex items-center gap-1 font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'इशारा लपवा' : 'इशारा हवा आहे? (Show Hint)'}</span>
          </button>
          <span className="text-ink-500">विषय: {q.fullProverb.category}</span>
        </div>

        {showHint && (
          <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 animate-in fade-in">
            <span className="font-bold">अर्थ:</span> {q.fullProverb.meaningMarathi}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {q.options.map((opt, idx) => {
          let style = 'bg-white border-ivory-300 text-ink-900 hover:bg-ivory-100 hover:border-ivory-400';
          let icon = null;

          if (isAnswered) {
            if (opt === q.missingWord) {
              style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
              icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
            } else if (opt === selectedOption) {
              style = 'bg-rose-50 border-rose-300 text-rose-900';
              icon = <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
            } else {
              style = 'opacity-50 bg-ivory-50 border-ivory-200 text-ink-400';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border-2 text-center text-lg sm:text-xl font-bold transition-all flex items-center justify-center gap-2 ${style}`}
            >
              <span>{opt}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next */}
      {isAnswered && (
        <div className="pt-4 border-t border-ivory-200 flex items-center justify-between gap-4 animate-in fade-in">
          <div>
            <p className="text-xs sm:text-sm text-ink-800">
              <span className="font-bold">पूर्ण म्हण:</span> &ldquo;{q.fullProverb.proverb}&rdquo;
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
