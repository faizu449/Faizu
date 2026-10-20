import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Heart, Gift, Sparkles, Check, X } from 'lucide-react';
import { Wish } from '../../types.js';
import { api } from '../../services/api.js';

interface WishesManagerProps {
  wishes: Wish[];
  onRefresh: () => void;
}

export const WishesManager: React.FC<WishesManagerProps> = ({ wishes, onRefresh }) => {
  const [filterType, setFilterType] = useState<'all' | 'gift' | 'final'>('all');
  const [editingWish, setEditingWish] = useState<Partial<Wish> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredWishes = wishes.filter(
    (w) => filterType === 'all' || w.type === filterType
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWish || !editingWish.title || !editingWish.message) return;
    setSaving(true);
    try {
      if (isCreating) {
        await api.createWish({
          type: editingWish.type || 'gift',
          title: editingWish.title,
          message: editingWish.message,
          sender: editingWish.sender || '',
          emoji: editingWish.emoji || '🌸',
          date: editingWish.date || '',
          accentColor: editingWish.accentColor || '#F47BA7',
          order: editingWish.order || wishes.length + 1,
          isPublished: editingWish.isPublished ?? true
        });
      } else if (editingWish.id) {
        await api.updateWish(editingWish.id, editingWish);
      }
      setEditingWish(null);
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      alert('Failed to save wish');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (wish: Wish) => {
    try {
      await api.updateWish(wish.id, { isPublished: !wish.isPublished });
      onRefresh();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteWish(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch {
      alert('Failed to delete wish');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Birthday Wishes</h2>
          <p className="text-xs text-pink-200/60">
            {wishes.length} wishes ({wishes.filter((w) => w.isPublished).length} published)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingWish({
              type: 'gift',
              title: '',
              message: '',
              sender: '',
              emoji: '🌸',
              order: wishes.length + 1,
              isPublished: true
            });
            setIsCreating(true);
          }}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Wish</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-white/5 p-1 border border-pink-400/20 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
            filterType === 'all' ? 'bg-pink-500 text-white' : 'text-pink-200/70 hover:text-white'
          }`}
        >
          All ({wishes.length})
        </button>
        <button
          onClick={() => setFilterType('gift')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
            filterType === 'gift' ? 'bg-pink-500 text-white' : 'text-pink-200/70 hover:text-white'
          }`}
        >
          Gift Box ({wishes.filter((w) => w.type === 'gift').length})
        </button>
        <button
          onClick={() => setFilterType('final')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
            filterType === 'final' ? 'bg-pink-500 text-white' : 'text-pink-200/70 hover:text-white'
          }`}
        >
          Final ({wishes.filter((w) => w.type === 'final').length})
        </button>
      </div>

      {/* Wishes List */}
      <div className="space-y-3">
        {filteredWishes.length === 0 ? (
          <div className="p-6 text-center text-xs text-pink-200/50 bg-white/5 rounded-2xl border border-white/5">
            No wishes found in this category. Tap "New Wish" to add one!
          </div>
        ) : (
          filteredWishes.map((wish) => (
            <div
              key={wish.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                wish.isPublished
                  ? 'bg-white/10 border-pink-400/30'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{wish.emoji || (wish.type === 'gift' ? '🎁' : '💖')}</span>
                  <div>
                    <h3 className="text-xs font-semibold text-white leading-tight">
                      {wish.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-pink-200/60 mt-0.5">
                      <span className="capitalize">{wish.type} Wish</span>
                      <span>·</span>
                      <span>Order #{wish.order}</span>
                      {wish.sender && (
                        <>
                          <span>·</span>
                          <span className="italic">{wish.sender}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(wish)}
                    className="p-1.5 rounded-lg text-pink-300 hover:text-white hover:bg-white/10"
                    title={wish.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {wish.isPublished ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingWish(wish);
                      setIsCreating(false);
                    }}
                    className="p-1.5 rounded-lg text-pink-300 hover:text-white hover:bg-white/10"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(wish.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-pink-100/80 line-clamp-2 italic pl-6">
                "{wish.message}"
              </p>

              {deleteConfirmId === wish.id && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs flex items-center justify-between">
                  <span className="text-rose-200 text-[11px]">Delete this wish permanently?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(wish.id)}
                      className="px-2.5 py-1 rounded bg-rose-500 text-white font-medium text-[11px]"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 rounded text-slate-300 hover:text-white text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* EDIT / CREATE MODAL */}
      {editingWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm max-h-[92vh] bg-[#20183b] border border-pink-400/40 rounded-3xl p-5 overflow-y-auto space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">
                {isCreating ? 'Create Birthday Wish' : 'Edit Birthday Wish'}
              </h3>
              <button
                onClick={() => setEditingWish(null)}
                className="text-pink-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-left">
              <div>
                <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                  Wish Category
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setEditingWish({ ...editingWish, type: 'gift' })}
                    className={`py-2 rounded-xl font-medium border flex items-center justify-center gap-1.5 ${
                      editingWish.type === 'gift'
                        ? 'bg-pink-500/30 border-pink-400 text-white'
                        : 'bg-white/5 border-white/10 text-pink-200/60'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Gift Box Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingWish({ ...editingWish, type: 'final' })}
                    className={`py-2 rounded-xl font-medium border flex items-center justify-center gap-1.5 ${
                      editingWish.type === 'final'
                        ? 'bg-pink-500/30 border-pink-400 text-white'
                        : 'bg-white/5 border-white/10 text-pink-200/60'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Final Wishes</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                  Title / Greeting
                </label>
                <input
                  type="text"
                  required
                  value={editingWish.title || ''}
                  onChange={(e) => setEditingWish({ ...editingWish, title: e.target.value })}
                  placeholder="e.g. To My Favorite Person ✨"
                  className="w-full h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                  Heartfelt Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingWish.message || ''}
                  onChange={(e) => setEditingWish({ ...editingWish, message: e.target.value })}
                  placeholder="Write your personal birthday message here..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                    Signature / From
                  </label>
                  <input
                    type="text"
                    value={editingWish.sender || ''}
                    onChange={(e) => setEditingWish({ ...editingWish, sender: e.target.value })}
                    placeholder="e.g. Forever with love"
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                    Decorative Emoji
                  </label>
                  <input
                    type="text"
                    value={editingWish.emoji || ''}
                    onChange={(e) => setEditingWish({ ...editingWish, emoji: e.target.value })}
                    placeholder="🌸"
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingWish.order || 1}
                    onChange={(e) => setEditingWish({ ...editingWish, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingWish.isPublished ?? true}
                      onChange={(e) => setEditingWish({ ...editingWish, isPublished: e.target.checked })}
                      className="rounded accent-pink-500"
                    />
                    <span className="text-xs text-pink-200">Publish Now</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingWish(null)}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-11 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Wish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
