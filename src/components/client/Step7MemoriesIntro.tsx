import React from 'react';
import { Camera, Heart, Sparkles } from 'lucide-react';
import { SurpriseSettings } from '../../types.js';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step7MemoriesIntroProps {
  settings: SurpriseSettings;
  onNext: () => void;
}

export const Step7MemoriesIntro: React.FC<Step7MemoriesIntroProps> = ({
  settings,
  onNext
}) => {
  const handleOpenMemories = (e: React.MouseEvent) => {
    soundManager.playSparkle();
    particleFx.heartsBurst(e.clientX, e.clientY);
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-6 space-y-6 select-none">
      {/* Decorative camera badge */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500/25 via-purple-500/20 to-amber-400/25 border border-pink-400/40 flex items-center justify-center shadow-[0_0_24px_rgba(244,123,167,0.35)] relative">
        <Camera className="w-9 h-9 text-[#F7C96B]" />
        <div className="absolute -top-1 -right-1 text-pink-300 animate-float">
          <Heart className="w-5 h-5 fill-pink-400" />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-3 px-2">
        <h2 className="text-3xl sm:text-4xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B] leading-tight">
          {settings.memoriesIntroHeading || 'Our Beautiful Memories 📸'}
        </h2>
        
        {/* Intro Prose Card */}
        <div className="bg-white/5 border border-pink-400/20 rounded-2xl p-5 backdrop-blur-sm shadow-inner">
          <p className="text-sm sm:text-base text-pink-100/90 leading-relaxed font-light italic">
            "{settings.memoriesIntroText || "Every picture holds a moment, every moment tells a story, and every memory is a little treasure. Now let's revisit the beautiful moments we've shared."}"
          </p>
        </div>
      </div>

      {/* Floating polaroid silhouette motif */}
      <div className="flex items-center justify-center gap-2 text-xs text-pink-300/60">
        <Sparkles className="w-4 h-4 text-[#F7C96B]" />
        <span>A journey of cherished snapshots</span>
        <Sparkles className="w-4 h-4 text-[#F7C96B]" />
      </div>

      {/* Action Button */}
      <div className="w-full pt-4">
        <button
          onClick={handleOpenMemories}
          className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F47BA7] via-[#D83C79] to-[#F7C96B] text-white font-semibold text-base shadow-[0_4px_24px_rgba(244,123,167,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Let's Relive Our Memories</span>
          <span className="text-lg group-hover:scale-125 transition-transform">💗</span>
        </button>
      </div>
    </div>
  );
};
