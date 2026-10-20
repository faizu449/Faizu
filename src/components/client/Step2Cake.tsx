import React, { useState } from 'react';
import { Sparkles, Wind, CheckCircle2 } from 'lucide-react';
import { SurpriseSettings } from '../../types.js';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step2CakeProps {
  settings: SurpriseSettings;
  onNext: () => void;
}

interface Candle {
  id: number;
  isLit: boolean;
  isSmoking: boolean;
  color: string;
  stripeColor: string;
  xPos: number; // pixel offset from center
  height: number;
}

export const Step2Cake: React.FC<Step2CakeProps> = ({ settings, onNext }) => {
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, isLit: true, isSmoking: false, color: '#F47BA7', stripeColor: '#FFE1EC', xPos: -68, height: 44 },
    { id: 2, isLit: true, isSmoking: false, color: '#DCCBFF', stripeColor: '#FFFFFF', xPos: -34, height: 50 },
    { id: 3, isLit: true, isSmoking: false, color: '#F7C96B', stripeColor: '#FFE1EC', xPos: 0, height: 56 },
    { id: 4, isLit: true, isSmoking: false, color: '#D83C79', stripeColor: '#FFFFFF', xPos: 34, height: 50 },
    { id: 5, isLit: true, isSmoking: false, color: '#93C5FD', stripeColor: '#FFE1EC', xPos: 68, height: 44 },
  ]);

  const allCandlesExtinguished = candles.every((c) => !c.isLit);
  const remainingLit = candles.filter((c) => c.isLit).length;

  const handleBlowCandle = (id: number, clientX?: number, clientY?: number) => {
    const target = candles.find((c) => c.id === id);
    if (!target || !target.isLit) return;

    soundManager.playCandleBlow();
    const burstX = clientX ?? window.innerWidth / 2;
    const burstY = clientY ?? window.innerHeight * 0.42;
    particleFx.sparklesBurst(burstX, burstY);
    // Automatic celebratory party popper burst on candle blow
    particleFx.burst({
      x: burstX,
      y: burstY,
      count: 25,
      shapes: ['star', 'ribbon', 'rect', 'heart'],
      colors: ['#F7C96B', '#F47BA7', '#FFFFFF', '#DCCBFF', '#D83C79']
    });

    // Turn off flame and show smoke
    setCandles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLit: false, isSmoking: true } : c))
    );

    // Stop smoke after 1.4s
    setTimeout(() => {
      setCandles((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isSmoking: false } : c))
      );
    }, 1400);

    // If this was the last candle - trigger automatic party popper & cannon!
    const remainingCount = candles.filter((c) => c.id !== id && c.isLit).length;
    if (remainingCount === 0) {
      setTimeout(() => {
        soundManager.playConfetti();
        particleFx.partyCannon();
        particleFx.showerFromTop();
      }, 250);
    }
  };

  const handleBlowAll = () => {
    if (allCandlesExtinguished) return;

    soundManager.playCandleBlow();

    setCandles((prev) =>
      prev.map((c) => ({ ...c, isLit: false, isSmoking: true }))
    );

    // Automatically fire the celebratory party popper & confetti cannon!
    setTimeout(() => {
      soundManager.playConfetti();
      particleFx.partyCannon();
      particleFx.showerFromTop();
    }, 200);

    setTimeout(() => {
      setCandles((prev) =>
        prev.map((c) => ({ ...c, isSmoking: false }))
      );
    }, 1400);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-4 space-y-4 select-none">
      {/* Heading & Subtitle */}
      <div className="space-y-1 px-2">
        <h2 className="text-3xl sm:text-4xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B] drop-shadow-[0_2px_10px_rgba(244,123,167,0.3)]">
          {settings.cakeHeading || 'Happy Birthday! 🎂'}
        </h2>
        <p className="text-xs sm:text-sm text-pink-100/75 max-w-xs mx-auto">
          {settings.cakeSubtitle || 'Make your sweetest wish before blowing out each candle...'}
        </p>
      </div>

      {/* Instruction & Status with Blow All Action */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/20 text-xs">
          <Wind className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
          <span className="text-pink-200">
            {!allCandlesExtinguished
              ? `Tap candles individually (${remainingLit} lit)`
              : 'All candles blown! Your wish is made! ✨'}
          </span>
        </div>

        {/* Quick blow-all option so user never gets stuck */}
        {!allCandlesExtinguished && (
          <button
            onClick={handleBlowAll}
            className="text-[11px] text-[#F7C96B] hover:text-white underline decoration-pink-400/50 underline-offset-4 cursor-pointer py-1 px-2 active:scale-95 transition-transform"
          >
            Or blow all candles at once 💨
          </button>
        )}
      </div>

      {/* Cake Container */}
      <div className="relative w-72 sm:w-80 h-72 my-1 flex items-center justify-center">
        {/* Soft background candle warmth glow */}
        <div
          className={`absolute w-60 h-60 rounded-full bg-amber-400/15 blur-2xl transition-opacity duration-700 pointer-events-none ${
            remainingLit > 0 ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* CANDLES ROW - Absolute positioned with distinct pixel coordinates */}
        <div className="absolute top-2 inset-x-0 h-28 pointer-events-auto z-20">
          {candles.map((candle) => (
            <button
              key={candle.id}
              onClick={(e) => handleBlowCandle(candle.id, e.clientX, e.clientY)}
              onTouchEnd={(e) => {
                const touch = e.changedTouches[0];
                handleBlowCandle(candle.id, touch?.clientX, touch?.clientY);
              }}
              className="absolute bottom-0 w-8 h-24 flex flex-col items-center justify-end cursor-pointer focus:outline-none group active:scale-95 transition-transform"
              style={{
                left: `calc(50% + ${candle.xPos}px)`,
                transform: 'translateX(-50%)'
              }}
              aria-label={`Candle ${candle.id}, ${candle.isLit ? 'lit - tap to blow out' : 'extinguished'}`}
            >
              {/* Flame or Smoke Container */}
              <div className="h-10 flex items-center justify-center relative mb-0.5">
                {candle.isLit ? (
                  <div className="relative flex flex-col items-center animate-flicker">
                    {/* Outer flame glow */}
                    <div className="w-5 h-7 rounded-[50%_50%_35%_35%] bg-gradient-to-t from-[#D83C79] via-[#F7C96B] to-[#FFF7F0] shadow-[0_0_14px_#F7C96B]" />
                    {/* Inner flame core */}
                    <div className="w-2.5 h-4 absolute bottom-0 rounded-[50%_50%_30%_30%] bg-gradient-to-t from-[#F47BA7] to-[#FFFFFF]" />
                  </div>
                ) : candle.isSmoking ? (
                  /* Soft drifting smoke wisps */
                  <div className="relative flex flex-col items-center">
                    <span className="w-2 h-4 bg-slate-300/60 rounded-full blur-[1px] -translate-y-2 animate-ping" />
                    <span className="w-1.5 h-3 bg-pink-200/40 rounded-full blur-[0.5px] -translate-y-1" />
                  </div>
                ) : (
                  /* Extinguished charred wick */
                  <div className="w-0.5 h-3 bg-slate-400/80 rounded-t-sm" />
                )}
              </div>

              {/* Candle Body */}
              <div
                className="w-3.5 rounded-t-sm relative shadow-md overflow-hidden transition-all group-hover:brightness-110"
                style={{
                  height: `${candle.height}px`,
                  backgroundColor: candle.color
                }}
              >
                {/* Diagonal stripes */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${candle.stripeColor}, ${candle.stripeColor} 3px, transparent 3px, transparent 6px)`
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* 3-TIER BIRTHDAY CAKE ILLUSTRATION */}
        <div className="absolute bottom-6 flex flex-col items-center z-10 pointer-events-none">
          {/* Top Tier */}
          <div className="w-44 h-14 rounded-2xl bg-gradient-to-b from-[#FFF7F0] via-[#FFE1EC] to-[#fcd5e5] border-t-4 border-[#FFF7F0] shadow-md relative flex items-center justify-around overflow-hidden">
            {/* Frosting drips */}
            <div className="absolute top-0 inset-x-0 flex justify-between px-2">
              <span className="w-3 h-3 bg-[#FFF7F0] rounded-b-full shadow-sm" />
              <span className="w-4 h-4 bg-[#FFF7F0] rounded-b-full shadow-sm" />
              <span className="w-3.5 h-3 bg-[#FFF7F0] rounded-b-full shadow-sm" />
              <span className="w-4 h-4 bg-[#FFF7F0] rounded-b-full shadow-sm" />
              <span className="w-3 h-2.5 bg-[#FFF7F0] rounded-b-full shadow-sm" />
            </div>
            {/* Berries / sugar pearls */}
            <div className="w-full flex justify-around px-3 z-10 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D83C79] shadow-sm" />
              <span className="w-2 h-2 rounded-full bg-[#F7C96B] shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F47BA7] shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#DCCBFF] shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D83C79] shadow-sm" />
            </div>
          </div>

          {/* Middle Tier */}
          <div className="w-56 h-16 rounded-2xl bg-gradient-to-b from-[#FFE1EC] via-[#f7bccc] to-[#f29ebb] border-t-4 border-[#FFF7F0] shadow-lg -mt-2 relative flex items-center justify-around overflow-hidden">
            {/* Frosting Swirls */}
            <div className="absolute inset-x-0 top-0 flex justify-around px-4">
              <span className="w-4 h-3 bg-[#FFF7F0] rounded-b-full" />
              <span className="w-5 h-4 bg-[#FFF7F0] rounded-b-full" />
              <span className="w-4 h-3 bg-[#FFF7F0] rounded-b-full" />
              <span className="w-5 h-4 bg-[#FFF7F0] rounded-b-full" />
              <span className="w-4 h-3 bg-[#FFF7F0] rounded-b-full" />
            </div>
            {/* Delicate piped cream banner */}
            <div className="w-full text-center pt-2">
              <span className="text-[10px] font-['Dancing_Script',cursive] text-[#8e1948] font-bold tracking-widest">
                Happy Birthday
              </span>
            </div>
          </div>

          {/* Bottom Cake Stand / Plate */}
          <div className="w-64 sm:w-72 h-4 rounded-full bg-gradient-to-r from-amber-200 via-[#FFF7F0] to-amber-200 shadow-[0_6px_20px_rgba(0,0,0,0.5)] border border-amber-300/40 relative -mt-1 flex items-center justify-center">
            <div className="w-28 h-2 rounded-b-full bg-amber-400/30" />
          </div>
        </div>
      </div>

      {/* Celebratory Message and Action Button */}
      <div className="w-full pt-1 min-h-[64px] flex flex-col items-center justify-center">
        {allCandlesExtinguished ? (
          <div className="w-full space-y-3 animate-fade-in">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#F7C96B] font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Wish granted! May it all come true!</span>
            </div>
            <button
              onClick={() => {
                soundManager.playSparkle();
                onNext();
              }}
              className="w-full min-h-[50px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F47BA7] via-[#D83C79] to-[#F7C96B] text-white font-semibold text-base shadow-[0_4px_20px_rgba(244,123,167,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <Sparkles className="w-4 h-4 text-[#F7C96B]" />
            </button>
          </div>
        ) : (
          <p className="text-xs text-pink-300/60 italic">
            Tap each candle until every flame goes out ✨
          </p>
        )}
      </div>
    </div>
  );
};
