import React, { useState } from 'react';
import {
  Music,
  Play,
  Square,
  Sparkles,
  Volume2,
  Upload,
  Check,
  Save,
  Radio,
  Sliders
} from 'lucide-react';
import { SurpriseSettings } from '../../types.js';
import { soundManager } from '../../utils/audio.js';
import { api } from '../../services/api.js';

interface MusicManagerProps {
  settings: SurpriseSettings;
  onRefresh: () => void;
}

export const MusicManager: React.FC<MusicManagerProps> = ({ settings, onRefresh }) => {
  const [bgmStyle, setBgmStyle] = useState<SurpriseSettings['bgmStyle']>(
    settings.bgmStyle || 'romantic_lullaby'
  );
  const [customAudioUrl, setCustomAudioUrl] = useState<string>(settings.customAudioUrl || '');
  const [confettiSound, setConfettiSound] = useState<SurpriseSettings['confettiSound']>(
    settings.confettiSound || 'sparkle'
  );
  const [soundFxEnabled, setSoundFxEnabled] = useState<boolean>(settings.soundFxEnabled ?? true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(settings.musicEnabled ?? true);

  const [previewingStyle, setPreviewingStyle] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestBgm = (style: SurpriseSettings['bgmStyle'], url?: string) => {
    if (previewingStyle === style) {
      soundManager.stopBgm();
      setPreviewingStyle(null);
    } else {
      soundManager.startBgm(style, url);
      setPreviewingStyle(style);
    }
  };

  const handleTestConfettiSound = (sound: SurpriseSettings['confettiSound']) => {
    soundManager.playConfetti(sound);
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const uploadedUrl = await api.uploadPhoto(base64, file.name);
          setCustomAudioUrl(uploadedUrl);
          setBgmStyle('custom_url');
          alert('Custom audio uploaded successfully!');
        } catch {
          alert('Failed to upload audio file. You can also paste an audio URL.');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      alert('Could not read audio file');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateSettings({
        bgmStyle,
        customAudioUrl,
        confettiSound,
        soundFxEnabled,
        musicEnabled
      });

      // Update local soundManager live
      soundManager.configure({
        bgmStyle,
        customAudioUrl,
        confettiSound,
        soundFxEnabled,
        musicEnabled
      });

      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Failed to save music settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <h2 className="text-base font-semibold text-white">Music &amp; Sound Studio</h2>
        <p className="text-xs text-pink-200/60">
          Customize background melodies, upload songs, and tune confetti sound effects
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Music and sound settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* 1. Background Music Style Selection */}
        <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>Background Music Theme</span>
            </span>
            {previewingStyle && (
              <span className="text-[10px] text-[#F7C96B] animate-pulse">Preview playing...</span>
            )}
          </div>

          <div className="space-y-2">
            {/* Option 1: Romantic Lullaby */}
            <div
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                bgmStyle === 'romantic_lullaby'
                  ? 'bg-pink-500/20 border-pink-400 text-white'
                  : 'bg-black/20 border-white/10 text-pink-200/70 hover:bg-white/5'
              }`}
            >
              <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="bgmStyle"
                  checked={bgmStyle === 'romantic_lullaby'}
                  onChange={() => setBgmStyle('romantic_lullaby')}
                  className="accent-pink-500"
                />
                <div>
                  <div className="text-xs font-medium text-white">Romantic Lullaby (Soft &amp; Dreamy)</div>
                  <div className="text-[10px] text-pink-300/70">
                    Peaceful, slow music-box bell chime with warm romantic chords
                  </div>
                </div>
              </label>

              <button
                type="button"
                onClick={() => handleTestBgm('romantic_lullaby')}
                className="ml-2 min-h-[36px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1 text-pink-200 cursor-pointer"
              >
                {previewingStyle === 'romantic_lullaby' ? (
                  <>
                    <Square className="w-3 h-3 text-rose-400" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 2: Happy Birthday Melody */}
            <div
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                bgmStyle === 'birthday_musicbox'
                  ? 'bg-pink-500/20 border-pink-400 text-white'
                  : 'bg-black/20 border-white/10 text-pink-200/70 hover:bg-white/5'
              }`}
            >
              <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="bgmStyle"
                  checked={bgmStyle === 'birthday_musicbox'}
                  onChange={() => setBgmStyle('birthday_musicbox')}
                  className="accent-pink-500"
                />
                <div>
                  <div className="text-xs font-medium text-white">Classic Happy Birthday Melody</div>
                  <div className="text-[10px] text-pink-300/70">
                    The traditional birthday song played in gentle glockenspiel bells
                  </div>
                </div>
              </label>

              <button
                type="button"
                onClick={() => handleTestBgm('birthday_musicbox')}
                className="ml-2 min-h-[36px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1 text-pink-200 cursor-pointer"
              >
                {previewingStyle === 'birthday_musicbox' ? (
                  <>
                    <Square className="w-3 h-3 text-rose-400" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 3: Piano Dream */}
            <div
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                bgmStyle === 'piano_dream'
                  ? 'bg-pink-500/20 border-pink-400 text-white'
                  : 'bg-black/20 border-white/10 text-pink-200/70 hover:bg-white/5'
              }`}
            >
              <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="bgmStyle"
                  checked={bgmStyle === 'piano_dream'}
                  onChange={() => setBgmStyle('piano_dream')}
                  className="accent-pink-500"
                />
                <div>
                  <div className="text-xs font-medium text-white">Piano Dream (Acoustic Chords)</div>
                  <div className="text-[10px] text-pink-300/70">
                    Relaxing, gentle piano arpeggios in a warm major scale
                  </div>
                </div>
              </label>

              <button
                type="button"
                onClick={() => handleTestBgm('piano_dream')}
                className="ml-2 min-h-[36px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1 text-pink-200 cursor-pointer"
              >
                {previewingStyle === 'piano_dream' ? (
                  <>
                    <Square className="w-3 h-3 text-rose-400" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 4: Custom Audio Track */}
            <div
              className={`p-3 rounded-xl border transition-all space-y-2 ${
                bgmStyle === 'custom_url'
                  ? 'bg-pink-500/20 border-pink-400 text-white'
                  : 'bg-black/20 border-white/10 text-pink-200/70 hover:bg-white/5'
              }`}
            >
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="bgmStyle"
                  checked={bgmStyle === 'custom_url'}
                  onChange={() => setBgmStyle('custom_url')}
                  className="accent-pink-500"
                />
                <div>
                  <div className="text-xs font-medium text-white">Custom Audio / Favorite Song</div>
                  <div className="text-[10px] text-pink-300/70">
                    Upload an audio file or paste any MP3/audio link
                  </div>
                </div>
              </label>

              {bgmStyle === 'custom_url' && (
                <div className="pt-2 pl-6 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customAudioUrl}
                      onChange={(e) => setCustomAudioUrl(e.target.value)}
                      placeholder="https://example.com/song.mp3"
                      className="flex-1 h-9 px-3 rounded-lg bg-black/40 border border-pink-400/30 text-white text-xs focus:outline-none focus:border-pink-400"
                    />
                    {customAudioUrl && (
                      <button
                        type="button"
                        onClick={() => handleTestBgm('custom_url', customAudioUrl)}
                        className="px-2.5 rounded-lg bg-pink-500 text-white text-xs font-medium cursor-pointer"
                      >
                        {previewingStyle === 'custom_url' ? 'Stop' : 'Play'}
                      </button>
                    )}
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-pink-200 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading audio...' : 'Upload Audio File from Device'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Confetti & Celebration Sound Effect Settings */}
        <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F7C96B]" />
              <span>Confetti Sound Effect</span>
            </span>
          </div>
          <p className="text-[11px] text-pink-200/70">
            Choose what sound plays when the Celebrate / Confetti button is pressed:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'sparkle', label: 'Sweet Sparkle Chime (Fairy Dust)', desc: 'Delicate, soothing celestial bells' },
              { id: 'popper', label: 'Party Popper Snap', desc: 'Crisp party popper crack and sizzle' },
              { id: 'chime', label: 'Happy Birthday Glockenspiel', desc: 'Melodic mini birthday tune' },
              { id: 'horn', label: 'Classic Party Horn', desc: 'Festive birthday party noisemaker buzz' },
              { id: 'silent', label: 'Silent Confetti', desc: 'Only visual colorful confetti, no sound' }
            ].map((snd) => (
              <div
                key={snd.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  confettiSound === snd.id
                    ? 'bg-pink-500/25 border-pink-400 text-white'
                    : 'bg-black/20 border-white/10 text-pink-200/70 hover:bg-white/5'
                }`}
              >
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="confettiSound"
                    checked={confettiSound === snd.id}
                    onChange={() => setConfettiSound(snd.id as any)}
                    className="accent-pink-500"
                  />
                  <div>
                    <div className="text-xs font-medium text-white">{snd.label}</div>
                    <div className="text-[10px] text-pink-300/60">{snd.desc}</div>
                  </div>
                </label>

                {snd.id !== 'silent' && (
                  <button
                    type="button"
                    onClick={() => handleTestConfettiSound(snd.id as any)}
                    className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-pink-200 flex items-center gap-1 cursor-pointer"
                    title="Test this sound"
                  >
                    <Volume2 className="w-3 h-3 text-[#F7C96B]" />
                    <span>Test</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Global Sound Toggles */}
        <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-2">
          <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider block mb-1">
            General Preferences
          </span>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-white/10 cursor-pointer">
            <div>
              <div className="text-xs text-white font-medium">Enable Sound Effects</div>
              <div className="text-[10px] text-pink-300/60">Candle blowing, balloon pops, and button taps</div>
            </div>
            <input
              type="checkbox"
              checked={soundFxEnabled}
              onChange={(e) => setSoundFxEnabled(e.target.checked)}
              className="w-4 h-4 rounded accent-pink-500"
            />
          </label>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full min-h-[48px] rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Audio Settings...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Audio &amp; Music Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
