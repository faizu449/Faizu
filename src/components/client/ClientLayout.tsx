import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio.js';

interface ClientLayoutProps {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (step: number) => void;
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({
  currentStep,
  totalSteps,
  children
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [isBgmOn, setIsBgmOn] = useState(false);

  useEffect(() => {
    setIsMuted(soundManager.isMuted);
    setIsBgmOn(soundManager.isBgmActive);
  }, []);

  const handleToggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
    setIsBgmOn(soundManager.isBgmActive);
  };

  const handleToggleBgm = () => {
    const active = soundManager.toggleBgm();
    setIsBgmOn(active);
    setIsMuted(soundManager.isMuted);
  };

  // Generate fixed twinkling stars for ambient night sky
  const stars = [
    { top: '6%', left: '12%', size: 'w-1 h-1', delay: '0s' },
    { top: '10%', left: '84%', size: 'w-1.5 h-1.5', delay: '1.2s' },
    { top: '18%', left: '30%', size: 'w-1 h-1', delay: '0.6s' },
    { top: '24%', left: '72%', size: 'w-2 h-2', delay: '1.8s' },
    { top: '35%', left: '15%', size: 'w-1 h-1', delay: '2.4s' },
    { top: '48%', left: '88%', size: 'w-1 h-1', delay: '0.8s' },
    { top: '62%', left: '8%', size: 'w-1.5 h-1.5', delay: '1.4s' },
    { top: '75%', left: '80%', size: 'w-1 h-1', delay: '2.1s' },
    { top: '88%', left: '22%', size: 'w-1.5 h-1.5', delay: '0.4s' },
    { top: '92%', left: '68%', size: 'w-1 h-1', delay: '1.7s' },
  ];

  return (
    <div className="min-h-screen bg-[#15172F] flex justify-center items-start sm:p-4 select-none">
      {/* Mobile viewport frame */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] bg-gradient-to-b from-[#15172F] via-[#20183b] to-[#15172F] text-slate-100 relative flex flex-col justify-between overflow-hidden sm:rounded-[36px] sm:shadow-[0_0_50px_rgba(244,123,167,0.25)] sm:border sm:border-pink-500/20">
        
        {/* Twinkling stars layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map((star, idx) => (
            <div
              key={idx}
              className={`absolute ${star.size} bg-pink-100 rounded-full animate-pulse`}
              style={{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
                boxShadow: '0 0 8px #F7C96B'
              }}
            />
          ))}

          {/* Gentle ambient glow orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top Header Bar: Progress Dots & Sound Controls */}
        <header className="relative z-20 flex items-center justify-between px-4 pt-4 pb-2">
          {/* Subtle Progress Dots */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  i + 1 === currentStep
                    ? 'w-4 h-1.5 bg-gradient-to-r from-[#F47BA7] to-[#F7C96B] shadow-[0_0_8px_#F47BA7]'
                    : i + 1 < currentStep
                    ? 'w-1.5 h-1.5 bg-pink-300/80'
                    : 'w-1.5 h-1.5 bg-white/20'
                }`}
                title={`Scene ${i + 1}`}
              />
            ))}
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBgm}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors border ${
                isBgmOn
                  ? 'bg-pink-500/25 border-pink-400/50 text-pink-300 shadow-[0_0_10px_rgba(244,123,167,0.4)]'
                  : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
              }`}
              aria-label={isBgmOn ? 'Turn off ambient music' : 'Turn on gentle music box'}
              title={isBgmOn ? 'Music Box Playing' : 'Play Music Box'}
            >
              <Music className={`w-4 h-4 ${isBgmOn ? 'animate-bounce' : ''}`} />
            </button>

            <button
              onClick={handleToggleSound}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors border ${
                !isMuted
                  ? 'bg-pink-500/20 border-pink-400/40 text-pink-300'
                  : 'bg-black/30 border-white/10 text-slate-500'
              }`}
              aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              title={isMuted ? 'Muted' : 'Sound Effects Active'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 flex flex-col justify-center px-4 py-3">
          {children}
        </main>

        {/* Quiet Mobile Footer with Discloseable Admin Route */}
        <footer className="relative z-20 px-4 py-2 text-center text-[11px] text-pink-200/40 flex items-center justify-between">
          <span>Birthday &amp; Memories</span>
          <a
            href="/admin/login"
            className="text-[10px] text-pink-200/30 hover:text-pink-200/70 transition-colors"
          >
            Admin
          </a>
        </footer>
      </div>
    </div>
  );
};
