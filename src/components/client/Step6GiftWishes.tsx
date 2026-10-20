import React, { useState } from 'react';
import { Heart, Sparkles, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Wish } from '../../types.js';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step6GiftWishesProps {
  wishes: Wish[];
  onNext: () => void;
}

export const Step6GiftWishes: React.FC<Step6GiftWishesProps> = ({ wishes, onNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeWishes = wishes.filter((w) => w.isPublished);

  // If no wishes published, fallback gracefully
  const currentWish: Wish = activeWishes[currentIndex] || {
    id: 'placeholder',
    type: 'gift',
    title: 'Happy Birthday to You! ✨',
    message: 'Wishing you all the joy, love, peace, and wondrous adventures the world has to offer. May your heart be forever light and your smile forever bright.',
    sender: 'With All My Heart',
    emoji: '🌸',
    order: 1,
    isPublished: true
  };

  const hasMultiple = activeWishes.length > 1;
  const isLast = currentIndex === activeWishes.length - 1 || activeWishes.length === 0;

  const handleNextWish = (e: React.MouseEvent) => {
    soundManager.playTap();
    particleFx.sparklesBurst(e.clientX, e.clientY);
    if (currentIndex < activeWishes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevWish = () => {
    soundManager.playTap();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleContinue = (e: React.MouseEvent) => {
    soundManager.playSparkle();
    particleFx.heartsBurst(e.clientX, e.clientY);
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[560px] py-3 space-y-4 select-none">
      {/* Section Header */}
      <div className="space-y-1 text-center px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/20 text-xs text-pink-300">
          <Sparkles className="w-3.5 h-3.5 text-[#F7C96B]" />
          <span>From the Gift Box</span>
        </div>
        <h2 className="text-3xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B]">
          A Special Wish for You 💗
        </h2>
      </div>

      {/* Decorative Greeting Card */}
      <div className="w-full relative">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/15 to-amber-500/20 rounded-3xl blur-xl" />

        {/* Card Body: Warm cream / blush background with floral border */}
        <div className="relative z-10 w-full bg-gradient-to-b from-[#FFF7F0] via-[#FFF3EB] to-[#FFE8F0] text-slate-800 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] border-2 border-pink-200/80">
          
          {/* Card Top Border Floral Ribbon */}
          <div className="flex items-center justify-between pb-3 border-b border-pink-200/60 mb-4">
            <span className="text-xl">{currentWish.emoji || '🌸'}</span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-pink-600/70 tracking-widest uppercase">
              <span>Card</span>
              <span>·</span>
              <span>{hasMultiple ? `${currentIndex + 1} of ${activeWishes.length}` : 'Heartfelt'}</span>
            </div>
            <Heart className="w-4 h-4 text-[#F47BA7] fill-[#F47BA7]/30" />
          </div>

          {/* Wish Title */}
          <h3 className="text-2xl font-bold font-['Dancing_Script',cursive] text-[#8e1948] mb-3 text-center leading-snug">
            {currentWish.title}
          </h3>

          {/* Main Message Prose */}
          <p className="text-sm sm:text-base text-slate-700 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed text-center italic px-1 mb-5">
            "{currentWish.message}"
          </p>

          {/* Card Signature / Author */}
          {currentWish.sender && (
            <div className="text-right pt-2 border-t border-pink-200/50">
              <span className="text-xs font-['Playfair_Display',serif] italic text-pink-800 font-semibold">
                — {currentWish.sender}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls for Multi-Wish */}
      <div className="w-full space-y-3 pt-2">
        {hasMultiple && (
          <div className="flex items-center justify-between px-2">
            <button
              onClick={handlePrevWish}
              disabled={currentIndex === 0}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-opacity ${
                currentIndex === 0
                  ? 'text-pink-300/30 cursor-not-allowed'
                  : 'text-pink-200 hover:text-white cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {activeWishes.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-[#F47BA7] w-4' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {!isLast ? (
              <button
                onClick={handleNextWish}
                className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium text-pink-200 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Next Wish</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="w-16" />
            )}
          </div>
        )}

        {/* Continue to Memories Button */}
        <button
          onClick={handleContinue}
          className="w-full min-h-[50px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F47BA7] via-[#D83C79] to-[#F7C96B] text-white font-semibold text-base shadow-[0_4px_20px_rgba(244,123,167,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to Memories</span>
          <ArrowRight className="w-4 h-4 text-[#F7C96B]" />
        </button>
      </div>
    </div>
  );
};
