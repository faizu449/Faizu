import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step3BalloonsProps {
  onNext: () => void;
}

interface Balloon {
  id: number;
  color: string;
  gradient: string;
  stringColor: string;
  top: string;
  left: string;
  size: number;
  isPopped: boolean;
  swayDuration: string;
  delay: string;
  wishText: string;
}

export const Step3Balloons: React.FC<Step3BalloonsProps> = ({ onNext }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([
    {
      id: 1,
      color: '#F47BA7',
      gradient: 'from-[#ff9ec2] via-[#F47BA7] to-[#d83c79]',
      stringColor: '#f9a8d4',
      top: '12%',
      left: '12%',
      size: 76,
      isPopped: false,
      swayDuration: '4.2s',
      delay: '0s',
      wishText: 'Joy!'
    },
    {
      id: 2,
      color: '#DCCBFF',
      gradient: 'from-[#ede4ff] via-[#DCCBFF] to-[#a78bfa]',
      stringColor: '#c4b5fd',
      top: '8%',
      left: '60%',
      size: 82,
      isPopped: false,
      swayDuration: '5.1s',
      delay: '0.8s',
      wishText: 'Love!'
    },
    {
      id: 3,
      color: '#F7C96B',
      gradient: 'from-[#fff0b3] via-[#F7C96B] to-[#f59e0b]',
      stringColor: '#fde68a',
      top: '38%',
      left: '34%',
      size: 88,
      isPopped: false,
      swayDuration: '4.7s',
      delay: '0.4s',
      wishText: 'Smiles!'
    },
    {
      id: 4,
      color: '#FB7185',
      gradient: 'from-[#fecdd3] via-[#fb7185] to-[#e11d48]',
      stringColor: '#fda4af',
      top: '52%',
      left: '10%',
      size: 78,
      isPopped: false,
      swayDuration: '4.4s',
      delay: '1.2s',
      wishText: 'Magic!'
    },
    {
      id: 5,
      color: '#A78BFA',
      gradient: 'from-[#ddd6fe] via-[#a78bfa] to-[#7c3aed]',
      stringColor: '#c4b5fd',
      top: '46%',
      left: '64%',
      size: 84,
      isPopped: false,
      swayDuration: '5.3s',
      delay: '1.6s',
      wishText: 'Dreams!'
    },
    {
      id: 6,
      color: '#F47BA7',
      gradient: 'from-[#fed7e2] via-[#f47ba7] to-[#be185d]',
      stringColor: '#fbcfe8',
      top: '72%',
      left: '38%',
      size: 74,
      isPopped: false,
      swayDuration: '4.8s',
      delay: '0.6s',
      wishText: 'Peace!'
    }
  ]);

  const [poppedWish, setPoppedWish] = useState<string | null>(null);

  const remaining = balloons.filter((b) => !b.isPopped).length;
  const allPopped = remaining === 0;

  const handlePop = (balloon: Balloon, e: React.MouseEvent) => {
    if (balloon.isPopped) return;

    soundManager.playBalloonPop();
    particleFx.burst({
      x: e.clientX,
      y: e.clientY,
      count: 35,
      shapes: ['rect', 'star', 'ribbon', 'heart'],
      colors: [balloon.color, '#FFFFFF', '#FFE1EC', '#F7C96B', '#DCCBFF']
    });

    setPoppedWish(balloon.wishText);

    setBalloons((prev) =>
      prev.map((b) => (b.id === balloon.id ? { ...b, isPopped: true } : b))
    );

    const nextRemaining = balloons.filter((b) => b.id !== balloon.id && !b.isPopped).length;
    if (nextRemaining === 0) {
      setTimeout(() => {
        soundManager.playConfetti();
        particleFx.partyCannon();
        particleFx.showerFromTop();
      }, 200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] py-4 text-center select-none">
      {/* Header */}
      <div className="space-y-1 px-2 z-10">
        <h2 className="text-3xl sm:text-4xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B] drop-shadow-[0_2px_10px_rgba(244,123,167,0.3)]">
          So Many Wishes for You! 🎈
        </h2>
        <p className="text-xs sm:text-sm text-pink-100/75">
          {allPopped
            ? 'All wishes released into the universe!'
            : 'Tap the balloons to pop them and unlock their wishes!'}
        </p>

        {/* Counter */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/20 text-xs text-pink-200 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-[#F7C96B]" />
          <span>
            {remaining > 0 ? `${remaining} balloons floating` : 'All 6 balloons popped! 🎉'}
          </span>
          {poppedWish && (
            <span className="text-amber-300 font-semibold ml-1">
              +{poppedWish}
            </span>
          )}
        </div>
      </div>

      {/* Floating Balloon Play Area */}
      <div className="relative w-full flex-1 my-3 min-h-[380px] overflow-hidden">
        {balloons.map((balloon) => {
          if (balloon.isPopped) return null;

          return (
            <div
              key={balloon.id}
              className="absolute group cursor-pointer animate-float"
              style={{
                top: balloon.top,
                left: balloon.left,
                animationDuration: balloon.swayDuration,
                animationDelay: balloon.delay,
              }}
            >
              <button
                onClick={(e) => handlePop(balloon, e)}
                className="flex flex-col items-center focus:outline-none min-h-[48px] min-w-[48px] cursor-pointer"
                style={{ width: `${balloon.size}px` }}
                aria-label={`Pop ${balloon.wishText} balloon`}
              >
                {/* Balloon Body */}
                <div
                  className={`w-full rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${balloon.gradient} shadow-[0_8px_20px_rgba(0,0,0,0.35)] relative overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95`}
                  style={{ height: `${balloon.size * 1.25}px` }}
                >
                  {/* Glossy Reflection Highlight */}
                  <div className="absolute top-2 left-2 w-4 h-8 rounded-[50%] bg-white/40 blur-[1px] rotate-[-25deg]" />
                  <div className="absolute top-4 left-4 w-1.5 h-3 rounded-[50%] bg-white/60 blur-[0.5px] rotate-[-25deg]" />

                  {/* Wish word on balloon */}
                  <span className="text-[11px] font-bold text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] tracking-wider">
                    {balloon.wishText}
                  </span>
                </div>

                {/* Balloon Knot */}
                <div
                  className="w-3.5 h-2 rounded-[50%] -mt-1 z-10 shadow-sm"
                  style={{ backgroundColor: balloon.color }}
                />

                {/* Dangling String */}
                <svg
                  className="w-4 h-12 -mt-0.5 overflow-visible pointer-events-none opacity-60"
                  viewBox="0 0 10 40"
                >
                  <path
                    d="M 5 0 Q 8 10 3 20 T 6 40"
                    fill="none"
                    stroke={balloon.stringColor}
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Completion Button */}
      <div className="w-full z-10 pt-1 min-h-[56px] flex items-center justify-center">
        {allPopped ? (
          <button
            onClick={() => {
              soundManager.playSparkle();
              onNext();
            }}
            className="w-full min-h-[50px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F47BA7] via-[#D83C79] to-[#F7C96B] text-white font-semibold text-base shadow-[0_4px_20px_rgba(244,123,167,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer animate-fade-in"
          >
            <span>Continue</span>
            <Heart className="w-4 h-4 text-pink-200 fill-pink-200" />
          </button>
        ) : (
          <p className="text-xs text-pink-300/60 italic">
            Pop all balloons to uncover what's next! 🎈
          </p>
        )}
      </div>
    </div>
  );
};
