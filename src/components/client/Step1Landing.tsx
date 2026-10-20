import React from 'react';
import { Heart, Sparkles, Gift } from 'lucide-react';
import { SurpriseSettings } from '../../types.js';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step1LandingProps {
  settings: SurpriseSettings;
  onNext: () => void;
}

export const Step1Landing: React.FC<Step1LandingProps> = ({ settings, onNext }) => {
  const handleOpen = (e: React.MouseEvent) => {
    soundManager.playHappyBirthdayChime();
    particleFx.partyCannon();
    particleFx.sparklesBurst(e.clientX, e.clientY);
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-6 space-y-6">
      {/* Decorative Top Heart Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-300 text-xs font-medium tracking-wide animate-pulse">
        <Sparkles className="w-3.5 h-3.5 text-[#F7C96B]" />
        <span>A Special Gift Just For You</span>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-2 px-2">
        <h1 className="text-4xl sm:text-5xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#F47BA7] via-[#FFE1EC] to-[#F7C96B] drop-shadow-[0_2px_12px_rgba(244,123,167,0.4)] leading-tight">
          {settings.title || 'Birthday & Memories'}
        </h1>
        <p className="text-sm sm:text-base text-pink-100/80 font-light max-w-xs mx-auto leading-relaxed">
          {settings.subtitle || 'A little world of wishes, memories, and love.'}
        </p>
      </div>

      {/* Animated Center Hero Illustration */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Soft glowing concentric rings */}
        <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-xl animate-pulse" />
        <div className="absolute w-36 h-36 rounded-full border border-pink-400/20 animate-spin" style={{ animationDuration: '24s' }} />

        {/* Floating Hearts Orbiting */}
        <div className="absolute -top-3 -right-2 text-pink-400 animate-float">
          <Heart className="w-6 h-6 fill-pink-400/60" />
        </div>
        <div className="absolute -bottom-2 -left-3 text-[#F7C96B] animate-float" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Central Magical Birthday Gift Artwork */}
        <div className="relative z-10 w-40 h-40 rounded-3xl bg-gradient-to-br from-[#291b4d] via-[#3a205a] to-[#251343] border border-pink-400/40 p-4 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(244,123,167,0.35)]">
          {/* Candle/Sparkle Motif */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-t from-pink-400 to-amber-300 animate-flicker" />
            <span className="w-1.5 h-7 rounded-full bg-gradient-to-t from-pink-400 to-amber-300 animate-flicker" style={{ animationDelay: '0.3s' }} />
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-t from-pink-400 to-amber-300 animate-flicker" style={{ animationDelay: '0.6s' }} />
          </div>

          <div className="relative">
            <Gift className="w-16 h-16 text-pink-300 stroke-[1.5]" />
            <Heart className="w-6 h-6 text-[#F47BA7] fill-[#F47BA7] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_8px_#F47BA7]" />
          </div>

          <span className="text-[11px] text-pink-200/90 font-medium tracking-wider mt-1 uppercase">
            Touch of Magic
          </span>
        </div>
      </div>

      {/* Recipient note if set */}
      {settings.recipientName && (
        <div className="text-xs text-pink-200/70 italic">
          Prepared with heartfelt care for <span className="text-[#F7C96B] font-semibold">{settings.recipientName}</span>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="w-full pt-2">
        <button
          onClick={handleOpen}
          className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F47BA7] via-[#D83C79] to-[#F7C96B] text-white font-semibold text-base shadow-[0_4px_24px_rgba(244,123,167,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Open Your Surprise</span>
          <span className="text-lg group-hover:scale-125 transition-transform">💗</span>
        </button>
      </div>
    </div>
  );
};
