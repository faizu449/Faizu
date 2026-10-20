import React, { useState } from 'react';
import { Sparkles, Heart, X, ChevronLeft, ChevronRight, Calendar, Tag, ArrowRight } from 'lucide-react';
import { Memory } from '../../types.js';
import { soundManager } from '../../utils/audio.js';
import { particleFx } from '../../utils/confetti.js';

interface Step8MemoriesGalleryProps {
  memories: Memory[];
  onNext: () => void;
}

export const Step8MemoriesGallery: React.FC<Step8MemoriesGalleryProps> = ({
  memories,
  onNext
}) => {
  const publishedMemories = memories.filter((m) => m.isPublished);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const openLightbox = (idx: number, e: React.MouseEvent) => {
    soundManager.playTap();
    particleFx.sparklesBurst(e.clientX, e.clientY);
    setSelectedIdx(idx);
  };

  const closeLightbox = () => {
    soundManager.playTap();
    setSelectedIdx(null);
  };

  const nextPhoto = () => {
    soundManager.playTap();
    if (selectedIdx !== null && selectedIdx < publishedMemories.length - 1) {
      setSelectedIdx(selectedIdx + 1);
    } else {
      setSelectedIdx(0);
    }
  };

  const prevPhoto = () => {
    soundManager.playTap();
    if (selectedIdx !== null && selectedIdx > 0) {
      setSelectedIdx(selectedIdx - 1);
    } else {
      setSelectedIdx(publishedMemories.length - 1);
    }
  };

  const activeMemory = selectedIdx !== null ? publishedMemories[selectedIdx] : null;

  return (
    <div className="flex flex-col min-h-[580px] py-2 space-y-4 select-none">
      {/* Header */}
      <div className="text-center space-y-1 px-2">
        <h2 className="text-3xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B]">
          Memory Scrapbook ✨
        </h2>
        <p className="text-xs text-pink-200/70">
          Tap any photograph to look back at the moment
        </p>
      </div>

      {/* Gallery Grid or Graceful Empty State */}
      {publishedMemories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white/5 border border-pink-400/20 rounded-3xl">
          <Heart className="w-10 h-10 text-pink-400/50 mb-3 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">Memories Coming Soon</h3>
          <p className="text-xs text-pink-200/70 max-w-xs mt-1">
            New treasured moments and photographs will be added here shortly!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto pr-1 py-1">
          {publishedMemories.map((memory, idx) => (
            <button
              key={memory.id}
              onClick={(e) => openLightbox(idx, e)}
              className="group text-left bg-gradient-to-b from-white/10 to-white/5 border border-pink-300/30 rounded-2xl p-2 shadow-md hover:border-pink-300 transition-all flex flex-col focus:outline-none cursor-pointer"
            >
              {/* Photo Frame */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-900/60 relative mb-2">
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback container in case of broken path
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {/* Subtle scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                
                {/* Heart badge */}
                <div className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/40 backdrop-blur-sm text-pink-300">
                  <Heart className="w-3 h-3 fill-pink-400" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-0.5 px-1">
                <h4 className="text-xs font-semibold text-pink-100 truncate">
                  {memory.title}
                </h4>
                {memory.date && (
                  <p className="text-[10px] text-pink-300/70 truncate flex items-center gap-1">
                    <span>{memory.date}</span>
                    {memory.category && (
                      <>
                        <span>·</span>
                        <span>{memory.category}</span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Continue to Final Wishes Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            soundManager.playSparkle();
            onNext();
          }}
          className="w-full min-h-[50px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F47BA7] via-[#D83C79] to-[#F7C96B] text-white font-semibold text-sm shadow-[0_4px_20px_rgba(244,123,167,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>One Last Wish Just for You</span>
          <ArrowRight className="w-4 h-4 text-[#F7C96B]" />
        </button>
      </div>

      {/* FULL-SCREEN MOBILE LIGHTBOX VIEWER */}
      {selectedIdx !== null && activeMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-[390px] max-h-[92vh] bg-gradient-to-b from-[#21163b] via-[#1a0f30] to-[#140b24] border border-pink-400/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative text-slate-100">
            
            {/* Top Lightbox Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-xs text-pink-200/80 font-medium">
                Memory {selectedIdx + 1} of {publishedMemories.length}
              </span>
              <button
                onClick={closeLightbox}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-pink-200 hover:text-white rounded-full bg-white/10 active:scale-95"
                aria-label="Close photo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Image Container */}
            <div className="relative w-full aspect-[4/3] bg-black/60 flex items-center justify-center overflow-hidden">
              <img
                src={activeMemory.imageUrl}
                alt={activeMemory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />

              {/* Prev/Next arrows overlay */}
              {publishedMemories.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/70 backdrop-blur-sm"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/70 backdrop-blur-sm"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Memory Caption Details */}
            <div className="p-4 space-y-2 overflow-y-auto">
              <h3 className="text-xl font-bold font-['Dancing_Script',cursive] text-pink-200">
                {activeMemory.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-pink-300/80">
                {activeMemory.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#F7C96B]" />
                    {activeMemory.date}
                  </span>
                )}
                {activeMemory.category && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-pink-400" />
                    {activeMemory.category}
                  </span>
                )}
              </div>

              <p className="text-sm text-pink-100/90 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
                "{activeMemory.caption}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
