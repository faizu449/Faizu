import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Smile, X } from 'lucide-react';
import { SurpriseSettings } from '../../types.js';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step4QuestionProps {
  settings: SurpriseSettings;
  onNext: () => void;
}

export const Step4Question: React.FC<Step4QuestionProps> = ({ settings, onNext }) => {
  const [showWrongModal, setShowWrongModal] = useState(false);
  const [noTapCount, setNoTapCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSuccess, setIsSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleYes = (e: React.MouseEvent) => {
    soundManager.playHappyBirthdayChime();
    particleFx.partyCannon();
    particleFx.heartsBurst(e.clientX, e.clientY);
    setIsSuccess(true);
    setTimeout(() => {
      onNext();
    }, 1200);
  };

  const handleNo = () => {
    soundManager.playTap();
    if (noTapCount === 0) {
      // First attempt: show cute popup
      setShowWrongModal(true);
      setNoTapCount(1);
    } else {
      // Subsequent attempts: move to a safe position
      setNoTapCount((prev) => prev + 1);
      moveNoButton();
    }
  };

  const moveNoButton = () => {
    // Generate playful offset within safe bounds (-65px to +65px x, -30px to +30px y)
    // Ensures it never covers the YES button (which sits fixed on the left/center)
    // and never overflows the mobile frame
    const offsets = [
      { x: 35, y: -28 },
      { x: -40, y: 22 },
      { x: 50, y: 25 },
      { x: -30, y: -25 },
      { x: 25, y: 35 },
      { x: -45, y: 15 },
    ];
    const nextOffset = offsets[noTapCount % offsets.length];
    setNoPosition(nextOffset);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-4 space-y-5 select-none relative">
      {/* Soft Romantic Glow Card Container */}
      <div className="w-full bg-gradient-to-b from-pink-900/40 via-purple-900/30 to-pink-950/40 border border-pink-400/30 rounded-3xl p-6 shadow-[0_8px_32px_rgba(244,123,167,0.25)] relative overflow-hidden backdrop-blur-sm">
        
        {/* Floating Heart Decorations */}
        <div className="absolute top-3 left-4 text-pink-400/40 animate-float">
          <Heart className="w-5 h-5 fill-pink-400/20" />
        </div>
        <div className="absolute top-4 right-4 text-[#F7C96B]/50 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-5 h-5" />
        </div>

        {/* Cute Illustrated Mascot: Teddy/Bunny SVG */}
        <div className="w-24 h-24 mx-auto mb-3 relative flex items-center justify-center">
          <svg className="w-full h-full drop-shadow-[0_4px_12px_rgba(244,123,167,0.4)]" viewBox="0 0 100 100">
            {/* Bunny Ears */}
            <ellipse cx="36" cy="22" rx="7" ry="18" fill="#FFE1EC" transform="rotate(-10 36 22)" />
            <ellipse cx="36" cy="22" rx="4" ry="12" fill="#F47BA7" transform="rotate(-10 36 22)" />
            <ellipse cx="64" cy="22" rx="7" ry="18" fill="#FFE1EC" transform="rotate(10 64 22)" />
            <ellipse cx="64" cy="22" rx="4" ry="12" fill="#F47BA7" transform="rotate(10 64 22)" />

            {/* Bunny Head */}
            <circle cx="50" cy="52" r="26" fill="#FFF7F0" />

            {/* Rosy Cheeks */}
            <circle cx="36" cy="56" r="4" fill="#F47BA7" opacity="0.6" />
            <circle cx="64" cy="56" r="4" fill="#F47BA7" opacity="0.6" />

            {/* Cute Eyes (blinking smile) */}
            <path d="M 38 48 Q 42 44 46 48" fill="none" stroke="#2D122E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 54 48 Q 58 44 62 48" fill="none" stroke="#2D122E" strokeWidth="2.5" strokeLinecap="round" />

            {/* Nose & Smile */}
            <polygon points="48,54 52,54 50,57" fill="#F47BA7" />
            <path d="M 46 58 Q 50 62 54 58" fill="none" stroke="#2D122E" strokeWidth="2" strokeLinecap="round" />

            {/* Little Bow */}
            <circle cx="50" cy="74" r="3" fill="#D83C79" />
            <polygon points="43,71 50,74 43,77" fill="#F47BA7" />
            <polygon points="57,71 50,74 57,77" fill="#F47BA7" />
          </svg>
        </div>

        {/* Question Text */}
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B] drop-shadow-sm leading-snug">
            {settings.questionText || 'Are you ready to see your special surprise? 💗'}
          </h2>
          <p className="text-xs text-pink-200/70">
            Think carefully before making your choice!
          </p>
        </div>

        {/* Success Feedback banner if YES was clicked */}
        {isSuccess ? (
          <div className="py-4 space-y-2 animate-bounce">
            <div className="text-2xl">🎉 💖 ✨</div>
            <p className="text-base font-semibold text-[#F7C96B]">
              Yay! Here it comes! 💖
            </p>
          </div>
        ) : (
          /* Interactive Button Play Area */
          <div
            ref={containerRef}
            className="relative w-full h-24 flex items-center justify-center gap-4 px-2"
          >
            {/* YES BUTTON: Prominent, pink, inviting */}
            <button
              onClick={handleYes}
              className="min-h-[50px] px-7 py-3 rounded-2xl bg-gradient-to-r from-[#F47BA7] to-[#D83C79] text-white font-semibold text-base shadow-[0_4px_20px_rgba(244,123,167,0.5)] active:scale-95 transition-transform flex items-center gap-2 cursor-pointer z-10"
            >
              <span>YES</span>
              <span className="text-lg">💖</span>
            </button>

            {/* NO BUTTON: Playfully moves after first attempt */}
            <div
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className="z-10"
            >
              <button
                onClick={handleNo}
                onMouseEnter={() => {
                  if (noTapCount > 0) moveNoButton();
                }}
                className="min-h-[50px] px-6 py-3 rounded-2xl border-2 border-pink-400/50 bg-white/10 hover:bg-white/15 text-pink-200 font-medium text-base active:scale-90 transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-sm shadow-sm"
              >
                <span>NO</span>
                <span className="text-base">🙈</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP MODAL for first NO attempt */}
      {showWrongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs bg-gradient-to-b from-[#2d1b47] via-[#23123b] to-[#1a0e2e] border-2 border-pink-400/50 rounded-3xl p-6 text-center space-y-4 shadow-[0_10px_35px_rgba(244,123,167,0.4)] relative">
            {/* Close icon top-right */}
            <button
              onClick={() => setShowWrongModal(false)}
              className="absolute top-3 right-3 text-pink-300/70 hover:text-white p-1 rounded-full"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cute Pouting Bunny/Heart Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center animate-bounce">
              <span className="text-3xl">🐰</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-['Dancing_Script',cursive] text-2xl">
                Oops!
              </h3>
              <p className="text-sm text-pink-100 font-medium leading-relaxed">
                That's not the right answer. Try again! 💗
              </p>
            </div>

            <button
              onClick={() => setShowWrongModal(false)}
              className="w-full min-h-[46px] rounded-xl bg-gradient-to-r from-[#F47BA7] to-[#D83C79] text-white font-semibold text-sm shadow-md active:scale-98 cursor-pointer"
            >
              Okay 💕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
