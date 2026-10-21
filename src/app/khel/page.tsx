'use client';

import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  HelpCircle,
  Layers,
  Flame,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
import MhanOlkhaGame from '@/components/games/MhanOlkhaGame';
import RikamiJagaGame from '@/components/games/RikamiJagaGame';
import YogyaArthaGame from '@/components/games/YogyaArthaGame';
import MhanJulvaGame from '@/components/games/MhanJulvaGame';
import DailyQuizGame from '@/components/games/DailyQuizGame';
import { Proverb } from '@/types';
import rawData from '@/data/proverbs.json';

type GameTab = 'mhan-olkha' | 'rikami-jaga' | 'yogya-artha' | 'mhan-julva' | 'daily-quiz';

export default function GamesHubPage() {
  const [activeTab, setActiveTab] = useState<GameTab>('daily-quiz');
  const proverbs = rawData as Proverb[];

  const tabs = [
    {
      id: 'daily-quiz' as GameTab,
      label: 'आजची ज्ञानचाचणी',
      en: 'Daily Challenge',
      icon: Flame,
      color: 'text-amber-500',
      badge: 'दैनिक',
    },
    {
      id: 'mhan-olkha' as GameTab,
      label: 'म्हण ओळखा',
      en: 'Guess Proverb',
      icon: Sparkles,
      color: 'text-saffron-500',
    },
    {
      id: 'rikami-jaga' as GameTab,
      label: 'रिकामी जागा भरा',
      en: 'Fill in the Blanks',
      icon: HelpCircle,
      color: 'text-blue-500',
    },
    {
      id: 'yogya-artha' as GameTab,
      label: 'योग्य अर्थ निवडा',
      en: 'Choose Meaning',
      icon: CheckCircle,
      color: 'text-emerald-500',
    },
    {
      id: 'mhan-julva' as GameTab,
      label: 'म्हण जुळवा',
      en: 'Match Pairs',
      icon: Layers,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="font-devanagari text-ink-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-100 text-saffron-900 border border-saffron-300 text-xs font-bold mb-3 shadow-xs">
            <Gamepad2 className="w-4 h-4 text-saffron-600" />
            <span>मराठी भाषा ज्ञान केंद्र व मनोरंजक खेळ</span>
          </div>

          <h1 className="font-rozha text-3xl sm:text-5xl font-bold text-ink-950 mb-3 tracking-tight">
            म्हणींचे खेळ व ज्ञानचाचणी
          </h1>

          <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
            खेळता खेळता शिका मराठी म्हणींचे अर्थ, वाक्यप्रयोग आणि सौंदर्य. कोणतीही फी किंवा खाते न
            उघडता सर्व खेळ विनामूल्य खेळा!
          </p>
        </div>

        {/* Game Navigation Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
                  isActive
                    ? 'bg-saffron-600 text-white border-saffron-700 shadow-md scale-105'
                    : 'bg-white text-ink-700 border-ivory-300 hover:bg-ivory-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
                      isActive ? 'bg-white text-saffron-800' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Game Container */}
        <div className="transition-all animate-in fade-in">
          {activeTab === 'daily-quiz' && <DailyQuizGame proverbsPool={proverbs} />}
          {activeTab === 'mhan-olkha' && <MhanOlkhaGame proverbsPool={proverbs} />}
          {activeTab === 'rikami-jaga' && <RikamiJagaGame proverbsPool={proverbs} />}
          {activeTab === 'yogya-artha' && <YogyaArthaGame proverbsPool={proverbs} />}
          {activeTab === 'mhan-julva' && <MhanJulvaGame proverbsPool={proverbs} />}
        </div>
      </div>
    </div>
  );
}
