import React from 'react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { SurpriseSettings, Wish } from '../../types.js';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step9FinalWishesProps {
  settings: SurpriseSettings;
  finalWishes: Wish[];
  onReplay: () => void;
}

export const Step9FinalWishes: React.FC<Step9FinalWishesProps> = ({
  settings,
  finalWishes,
  onReplay
}) => {
  const published = finalWishes.filter((w) => w.isPublished);

  // Trigger celebration on reaching final wishes
  React.useEffect(() => {
    soundManager.playHappyBirthdayChime();
    particleFx.partyCannon();
  }, []);

  const handleReplayClick = () => {
    soundManager.playPartyHorn();
    particleFx.partyCannon();
    onReplay();
  };

  return (
    <div className="flex flex-col min-h-[580px] py-4 space-y-5 select-none">
      {/* Heading */}
      <div className="text-center space-y-1 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-400/25 text-xs text-pink-300">
          <Sparkles className="w-3.5 h-3.5 text-[#F7C96B]" />
          <span>Blessings &amp; Hopes</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B]">
          {settings.finalWishesHeading || 'Wishes Just for You 💖'}
        </h2>
      </div>

      {/* Vertically Scrollable Cards List */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 py-1">
        {published.length === 0 ? (
          <div className="p-5 text-center bg-white/5 border border-pink-400/20 rounded-2xl text-pink-200 text-sm">
            May your year ahead be as radiant and lovely as you are! 🌸
          </div>
        ) : (
          published.map((wish) => (
            <div
              key={wish.id}
              className="relative p-4 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-pink-900/10 border border-pink-400/25 shadow-md backdrop-blur-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold font-['Dancing_Script',cursive] text-pink-200">
                  {wish.title}
                </h4>
                <Heart className="w-4 h-4 text-[#F47BA7] fill-[#F47BA7]/40" />
              </div>

              <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-light italic">
                "{wish.message}"
              </p>

              {(wish.sender || wish.date) && (
                <div className="pt-1.5 flex items-center justify-between text-[11px] text-pink-300/70 border-t border-white/5">
                  <span>{wish.sender ? `— ${wish.sender}` : ''}</span>
                  <span>{wish.date || ''}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Admin-Customized Final Benediction Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-pink-500/20 via-purple-500/15 to-transparent border border-pink-400/30 text-center space-y-2">
        <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-['Playfair_Display',serif] italic">
          "{settings.finalWishesMessage || 'May your life always be filled with happiness, beautiful memories, and endless reasons to smile. 💗'}"
        </p>

        <div className="pt-1 text-xs text-[#F7C96B] font-semibold tracking-wider font-['Dancing_Script',cursive] text-lg">
          {settings.footerTagline || 'Made with Love ♡'}
        </div>
      </div>

      {/* Replay the Surprise Button */}
      <div className="pt-1">
        <button
          onClick={handleReplayClick}
          className="w-full min-h-[48px] px-6 py-3 rounded-2xl border border-pink-400/40 bg-white/10 hover:bg-white/15 text-pink-100 font-medium text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4 text-[#F7C96B]" />
          <span>Replay the Surprise</span>
        </button>
      </div>
    </div>
  );
};
