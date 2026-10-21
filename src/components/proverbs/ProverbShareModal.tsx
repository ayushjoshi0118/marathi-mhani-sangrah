'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, X, MessageSquare, Twitter, Facebook, Send } from 'lucide-react';
import { Proverb } from '@/types';
import { toMarathiNumerals } from '@/lib/devanagari';

interface ProverbShareModalProps {
  proverb: Proverb;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProverbShareModal({
  proverb,
  isOpen,
  onClose,
}: ProverbShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  if (!isOpen) return null;

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/mhani/${proverb.serialNumber}`
    : `/mhani/${proverb.serialNumber}`;

  const shareText = `मराठी म्हण #${toMarathiNumerals(proverb.serialNumber)}:\n"${proverb.proverb}"\n\nअर्थ: ${proverb.meaningMarathi}\n\nसविस्तर वाचा मराठी म्हणी संग्रह वर: ${url}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `मराठी म्हण: ${proverb.proverb}`,
          text: `"${proverb.proverb}" — ${proverb.meaningMarathi}`,
          url: url,
        });
      } catch (err) {
        // User cancelled
      }
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(proverb.proverb + ' — ' + proverb.meaningMarathi)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-ivory-50 rounded-2xl max-w-md w-full border border-ivory-300 shadow-manuscript-lg p-6 relative font-devanagari text-ink-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-ink-500 hover:text-ink-900 hover:bg-ivory-200 transition-colors"
          aria-label="बंद करा"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-saffron-100 text-saffron-700">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">म्हण शेअर करा</h3>
            <p className="text-xs text-ink-500 font-sans">Share this timeless wisdom</p>
          </div>
        </div>

        {/* Card Quote Preview */}
        <div className="bg-white rounded-xl p-4 border border-ivory-300 shadow-xs mb-5">
          <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
            <span className="font-semibold text-saffron-700">#{toMarathiNumerals(proverb.serialNumber)}</span>
            <span>{proverb.category}</span>
          </div>
          <p className="font-rozha text-xl font-bold text-ink-900 mb-1.5 leading-snug">
            &ldquo;{proverb.proverb}&rdquo;
          </p>
          <p className="text-xs text-ink-700 leading-relaxed">
            <span className="font-semibold">अर्थ:</span> {proverb.meaningMarathi}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Quick Copy Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-ivory-300 bg-white hover:bg-ivory-100 text-xs font-semibold text-ink-800 transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-ink-600" />}
              <span>{copiedLink ? 'लिंक कॉपी झाली!' : 'लिंक कॉपी करा'}</span>
            </button>

            <button
              onClick={handleCopyQuote}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-ivory-300 bg-white hover:bg-ivory-100 text-xs font-semibold text-ink-800 transition-all"
            >
              {copiedQuote ? <Check className="w-4 h-4 text-emerald-600" /> : <MessageSquare className="w-4 h-4 text-ink-600" />}
              <span>{copiedQuote ? 'मजकूर कॉपी झाला!' : 'संपूर्ण म्हण कॉपी करा'}</span>
            </button>
          </div>

          {/* Social Channels */}
          <div className="pt-2 border-t border-ivory-200">
            <p className="text-xs text-ink-500 mb-2 font-medium">थेट पाठवा (Send directly):</p>
            <div className="grid grid-cols-4 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-200"
              >
                <Send className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-medium">WhatsApp</span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors border border-sky-200"
              >
                <Twitter className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-medium">X (Twitter)</span>
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200"
              >
                <Facebook className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-medium">Facebook</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 transition-colors border border-cyan-200"
              >
                <Send className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-medium">Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
