import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step5GiftBoxProps {
  onNext: () => void;
}

export const Step5GiftBox: React.FC<Step5GiftBoxProps> = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenGift = (e: React.MouseEvent) => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    soundManager.playGiftOpen();
    particleFx.partyCannon();
    particleFx.showerFromTop();
    particleFx.burst({
      x: e.clientX,
      y: e.clientY,
      count: 50,
      shapes: ['heart', 'star', 'ribbon', 'circle'],
      colors: ['#F47BA7', '#F7C96B', '#DCCBFF', '#FFE1EC', '#FFFFFF']
    });

    setIsOpen(true);

    // After opening fanfare and warm light beam, proceed to wishes screen
    setTimeout(() => {
      onNext();
    }, 1400);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-4 space-y-5 select-none">
      {/* Heading */}
      <div className="space-y-1 px-2">
        <h2 className="text-3xl sm:text-4xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B] drop-shadow-[0_2px_10px_rgba(244,123,167,0.3)]">
          A Little Surprise for You! 🎁
        </h2>
        <p className="text-xs sm:text-sm text-pink-100/75">
          {!isOpen ? 'Tap the gift to open it.' : 'Opening your special surprise... ✨'}
        </p>
      </div>

      {/* Gift Box Container */}
      <div className="relative w-72 h-72 my-4 flex items-center justify-center">
        {/* Warm Golden Glow emerging from inside */}
        <div
          className={`absolute w-64 h-64 rounded-full bg-gradient-to-tr from-amber-300/30 via-pink-400/30 to-purple-400/20 blur-2xl transition-all duration-700 pointer-events-none ${
            isOpen ? 'scale-150 opacity-100' : 'scale-75 opacity-40 animate-pulse'
          }`}
        />

        {/* Floating Sparks around the gift */}
        <div className="absolute top-4 left-6 text-[#F7C96B] animate-float">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute top-6 right-6 text-pink-300 animate-float" style={{ animationDelay: '1.2s' }}>
          <Heart className="w-5 h-5 fill-pink-300/40" />
        </div>

        {/* Interactive 3D Gift Box Button */}
        <button
          onClick={handleOpenGift}
          disabled={isOpen || isOpening}
          className="relative group min-w-[200px] min-h-[220px] flex flex-col items-center justify-center focus:outline-none cursor-pointer"
          aria-label="Tap to open the birthday gift box"
        >
          {/* GIFT LID (Lifts up and tilts back when opened) */}
          <div
            className="relative z-30 transition-transform duration-700 origin-bottom-left"
            style={{
              transform: isOpen
                ? 'translateY(-60px) rotate(-28deg) scale(0.95)'
                : 'translateY(0) rotate(0deg)'
            }}
          >
            {/* Satin Ribbon Bow on Top */}
            <div className="flex justify-center -mb-2 relative z-10">
              {/* Left loop */}
              <div className="w-9 h-7 rounded-[50%_50%_10%_50%] border-2 border-amber-200 bg-gradient-to-br from-[#F7C96B] to-[#e6a836] rotate-[-30deg] -mr-1 shadow-md" />
              {/* Knot center */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#FFF0B3] to-[#F7C96B] border border-amber-200 z-20 shadow-md -mt-1" />
              {/* Right loop */}
              <div className="w-9 h-7 rounded-[50%_50%_50%_10%] border-2 border-amber-200 bg-gradient-to-bl from-[#F7C96B] to-[#e6a836] rotate-[30deg] -ml-1 shadow-md" />
            </div>

            {/* Lid rim */}
            <div className="w-48 h-10 rounded-xl bg-gradient-to-r from-[#F47BA7] via-[#f794b7] to-[#D83C79] border-t-2 border-pink-200 shadow-lg relative flex items-center justify-center overflow-hidden">
              {/* Vertical Gold Ribbon segment */}
              <div className="w-7 h-full bg-gradient-to-r from-amber-300 via-[#FFF0B3] to-amber-300 shadow-sm" />
            </div>
          </div>

          {/* INSIDE GLOW & EMERGING CARD (Visible when lid opens) */}
          <div
            className={`absolute z-20 transition-all duration-700 flex flex-col items-center ${
              isOpen
                ? 'opacity-100 -translate-y-16 scale-100'
                : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
            }`}
          >
            {/* Peeking Greeting Card */}
            <div className="w-36 h-28 rounded-xl bg-gradient-to-b from-[#FFF7F0] to-[#FFE1EC] border border-pink-300 p-2 shadow-2xl flex flex-col items-center justify-center text-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 mb-1 animate-pulse" />
              <span className="text-[11px] font-['Dancing_Script',cursive] text-rose-800 font-bold">
                A Special Wish
              </span>
              <span className="text-[9px] text-pink-700/80">Inside for You</span>
            </div>

            {/* Light beam */}
            <div className="w-24 h-12 bg-amber-300/40 blur-lg rounded-full" />
          </div>

          {/* GIFT BOX BODY */}
          <div className="w-44 h-36 rounded-b-2xl bg-gradient-to-b from-[#ea6394] via-[#D83C79] to-[#ad1d55] border-x-2 border-b-2 border-pink-400/40 shadow-[0_12px_30px_rgba(0,0,0,0.4)] relative flex items-center justify-center overflow-hidden z-10 -mt-2">
            {/* Satin Horizontal Ribbon */}
            <div className="absolute inset-x-0 h-6 bg-gradient-to-b from-amber-300 via-[#FFF0B3] to-amber-400 shadow-sm opacity-90" />

            {/* Satin Vertical Ribbon */}
            <div className="w-7 h-full bg-gradient-to-r from-amber-300 via-[#FFF0B3] to-amber-400 shadow-md relative z-10" />

            {/* Subtle Texture Highlights */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          </div>
        </button>
      </div>

      {/* Tap Instruction / Prompt */}
      <div className="pt-2">
        {!isOpen ? (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs text-pink-200 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#F7C96B]" />
            <span>Tap the box to uncover your gift!</span>
          </div>
        ) : (
          <div className="text-sm font-semibold text-[#F7C96B] animate-fade-in">
            Unwrapping your heartfelt wish... ✨
          </div>
        )}
      </div>
    </div>
  );
};
