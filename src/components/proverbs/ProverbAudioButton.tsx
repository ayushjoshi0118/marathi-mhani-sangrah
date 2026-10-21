'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface ProverbAudioButtonProps {
  text: string;
  meaning?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ProverbAudioButton({
  text,
  meaning,
  size = 'md',
  showLabel = true,
}: ProverbAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!('speechSynthesis' in window)) {
        setIsSupported(false);
      } else {
        // Pre-warm voices cache
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported || typeof window === 'undefined') return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'mr-IN';
    utterance.rate = 0.85; // Natural deliberate cadence for proverbs
    utterance.pitch = 1.0;

    // Pick Marathi or fallback voice
    const voices = window.speechSynthesis.getVoices();
    const marathiVoice = voices.find(
      (v) => v.lang === 'mr-IN' || v.lang.startsWith('mr') || v.name.toLowerCase().includes('marathi')
    );
    const hindiVoice = voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi'));

    if (marathiVoice) {
      utterance.voice = marathiVoice;
    } else if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-3 py-1.5 text-xs sm:text-sm',
    lg: 'px-4 py-2.5 text-sm sm:text-base font-semibold',
  };

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-saffron-500 ${sizeClasses[size]} ${
        isPlaying
          ? 'bg-saffron-600 border-saffron-700 text-white shadow-md'
          : 'bg-ivory-100/80 hover:bg-ivory-200 border-ivory-300 text-ink-700 hover:text-saffron-700'
      }`}
      title={isPlaying ? 'थांबवा (Stop audio)' : 'उच्चार ऐका (Listen to pronunciation)'}
      aria-label={`Listen to proverb: ${text}`}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-4 w-4 justify-center">
            <span className="w-1 bg-white rounded-full audio-bar-1"></span>
            <span className="w-1 bg-white rounded-full audio-bar-2"></span>
            <span className="w-1 bg-white rounded-full audio-bar-3"></span>
          </div>
          {showLabel && <span>ऐकवत आहे...</span>}
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-saffron-600" />
          {showLabel && <span>ऐका</span>}
        </>
      )}
    </button>
  );
}
