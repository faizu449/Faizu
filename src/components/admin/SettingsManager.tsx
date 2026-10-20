import React, { useState } from 'react';
import { Save, Check, RefreshCw } from 'lucide-react';
import { SurpriseSettings } from '../../types.js';
import { api } from '../../services/api.js';

interface SettingsManagerProps {
  settings: SurpriseSettings;
  onRefresh: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SurpriseSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateSettings(formData);
      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Surprise Story Content</h2>
          <p className="text-xs text-pink-200/60">
            Customize greetings, messages, and scene texts
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>All text changes have been saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Section 1: Opening Screen */}
        <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-3">
          <h3 className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
            1. Opening Scene
          </h3>
          
          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Surprise Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Opening Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Recipient Name (Optional)
            </label>
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              placeholder="e.g. My Favorite Person"
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>

        {/* Section 2: Birthday Cake */}
        <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-3">
          <h3 className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
            2. Birthday Cake Scene
          </h3>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Cake Heading
            </label>
            <input
              type="text"
              value={formData.cakeHeading}
              onChange={(e) => setFormData({ ...formData, cakeHeading: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Cake Instruction Subtitle
            </label>
            <input
              type="text"
              value={formData.cakeSubtitle}
              onChange={(e) => setFormData({ ...formData, cakeSubtitle: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>

        {/* Section 3: The Special Question */}
        <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-3">
          <h3 className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
            3. The Playful Question
          </h3>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Question Text
            </label>
            <input
              type="text"
              value={formData.questionText}
              onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>

        {/* Section 4: Memories Introduction */}
        <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-3">
          <h3 className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
            4. Memories Introduction Screen
          </h3>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Heading
            </label>
            <input
              type="text"
              value={formData.memoriesIntroHeading}
              onChange={(e) => setFormData({ ...formData, memoriesIntroHeading: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Heartfelt Intro Message
            </label>
            <textarea
              rows={3}
              value={formData.memoriesIntroText}
              onChange={(e) => setFormData({ ...formData, memoriesIntroText: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>

        {/* Section 5: Final Wishes & Footer */}
        <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-3">
          <h3 className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
            5. Final Wishes &amp; Benediction
          </h3>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Final Wishes Heading
            </label>
            <input
              type="text"
              value={formData.finalWishesHeading}
              onChange={(e) => setFormData({ ...formData, finalWishesHeading: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Closing Benediction Message
            </label>
            <textarea
              rows={3}
              value={formData.finalWishesMessage}
              onChange={(e) => setFormData({ ...formData, finalWishesMessage: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Footer Tagline
            </label>
            <input
              type="text"
              value={formData.footerTagline}
              onChange={(e) => setFormData({ ...formData, footerTagline: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>

        {/* Sticky save button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full min-h-[48px] rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Content Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
