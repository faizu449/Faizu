import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Camera, Upload, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { Memory } from '../../types.js';
import { api } from '../../services/api.js';

interface MemoriesManagerProps {
  memories: Memory[];
  onRefresh: () => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Fairy Lights Picnic',
    url: '/src/assets/images/memory_stargazing_picnic_1792484692955.jpg'
  },
  {
    name: 'Sunset Beach Walk',
    url: '/src/assets/images/memory_sunset_beach_walk_1792484692216.jpg'
  },
  {
    name: 'Cozy Cafe Birthday',
    url: '/src/assets/images/memory_cozy_cafe_birthday_1792484693270.jpg'
  },
  {
    name: 'Peonies & Soft Ribbons',
    url: '/src/assets/images/memory_flower_bouquet_gift_1792484692842.jpg'
  }
];

export const MemoriesManager: React.FC<MemoriesManagerProps> = ({ memories, onRefresh }) => {
  const [editingMemory, setEditingMemory] = useState<Partial<Memory> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const uploadedUrl = await api.uploadPhoto(base64, file.name);
          setEditingMemory((prev) => ({
            ...prev,
            imageUrl: uploadedUrl
          }));
        } catch (err) {
          alert('Failed to upload image');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      alert('Could not read image file');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory || !editingMemory.title || !editingMemory.imageUrl) {
      alert('Please provide a title and photograph.');
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        await api.createMemory({
          title: editingMemory.title,
          caption: editingMemory.caption || '',
          date: editingMemory.date || '',
          category: editingMemory.category || 'Memory',
          imageUrl: editingMemory.imageUrl,
          order: editingMemory.order || memories.length + 1,
          isPublished: editingMemory.isPublished ?? true
        });
      } else if (editingMemory.id) {
        await api.updateMemory(editingMemory.id, editingMemory);
      }
      setEditingMemory(null);
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      alert('Failed to save memory');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (memory: Memory) => {
    try {
      await api.updateMemory(memory.id, { isPublished: !memory.isPublished });
      onRefresh();
    } catch {
      alert('Failed to update memory status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMemory(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch {
      alert('Failed to delete memory');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Photo Memories</h2>
          <p className="text-xs text-pink-200/60">
            {memories.length} photographs ({memories.filter((m) => m.isPublished).length} published)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMemory({
              title: '',
              caption: '',
              date: '',
              category: 'Memory',
              imageUrl: PRESET_PHOTOS[0].url,
              order: memories.length + 1,
              isPublished: true
            });
            setIsCreating(true);
          }}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Memory</span>
        </button>
      </div>

      {/* Grid of existing memories */}
      <div className="space-y-3">
        {memories.length === 0 ? (
          <div className="p-6 text-center text-xs text-pink-200/50 bg-white/5 rounded-2xl border border-white/5">
            No memories yet. Tap "New Memory" to upload or create one!
          </div>
        ) : (
          memories.map((mem) => (
            <div
              key={mem.id}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                mem.isPublished
                  ? 'bg-white/10 border-pink-400/30'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-black/40 overflow-hidden shrink-0 border border-white/10">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-left">
                <h3 className="text-xs font-semibold text-white truncate">
                  {mem.title}
                </h3>
                <p className="text-[10px] text-pink-200/60 truncate mt-0.5">
                  {mem.date ? mem.date : 'No date'} &middot; {mem.category || 'Memory'} &middot; #{mem.order}
                </p>
                <p className="text-[11px] text-pink-100/70 truncate italic mt-0.5">
                  "{mem.caption}"
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleTogglePublish(mem)}
                  className="p-1.5 rounded-lg text-pink-300 hover:text-white hover:bg-white/10"
                  title={mem.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {mem.isPublished ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setEditingMemory(mem);
                    setIsCreating(false);
                  }}
                  className="p-1.5 rounded-lg text-pink-300 hover:text-white hover:bg-white/10"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(mem.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation dialog */}
      {deleteConfirmId && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs flex items-center justify-between">
          <span className="text-rose-200 text-[11px]">Delete this memory photo permanently?</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleDelete(deleteConfirmId)}
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

      {/* EDIT / CREATE MEMORY MODAL */}
      {editingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm max-h-[92vh] bg-[#20183b] border border-pink-400/40 rounded-3xl p-5 overflow-y-auto space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">
                {isCreating ? 'Add Memory Photograph' : 'Edit Memory'}
              </h3>
              <button
                onClick={() => setEditingMemory(null)}
                className="text-pink-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-left">
              {/* Photo Preview & Upload */}
              <div>
                <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                  Memory Photograph
                </label>
                <div className="w-full aspect-[4/3] rounded-2xl bg-black/50 border-2 border-dashed border-pink-400/30 overflow-hidden relative mb-2 flex items-center justify-center">
                  {editingMemory.imageUrl ? (
                    <img
                      src={editingMemory.imageUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-pink-300/50">
                      <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-xs">No photograph selected</span>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-white">
                      Uploading photo...
                    </div>
                  )}
                </div>

                {/* Upload or Choose Presets */}
                <div className="flex gap-2">
                  <label className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-200 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Phone</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Options Carousel */}
                <div className="mt-2">
                  <span className="text-[10px] text-pink-300/60 block mb-1">Or pick a curated aesthetic photo:</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESET_PHOTOS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditingMemory({ ...editingMemory, imageUrl: p.url })}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          editingMemory.imageUrl === p.url
                            ? 'border-pink-400 scale-95 shadow-md'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                        title={p.name}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingMemory.title || ''}
                  onChange={(e) => setEditingMemory({ ...editingMemory, title: e.target.value })}
                  placeholder="e.g. Under the Fairy Lights"
                  className="w-full h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                  Caption / Story
                </label>
                <textarea
                  rows={3}
                  value={editingMemory.caption || ''}
                  onChange={(e) => setEditingMemory({ ...editingMemory, caption: e.target.value })}
                  placeholder="What made this moment so special?"
                  className="w-full p-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editingMemory.date || ''}
                    onChange={(e) => setEditingMemory({ ...editingMemory, date: e.target.value })}
                    placeholder="e.g. October 14"
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingMemory.category || ''}
                    onChange={(e) => setEditingMemory({ ...editingMemory, category: e.target.value })}
                    placeholder="e.g. Travel, Celebration"
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingMemory.order || 1}
                    onChange={(e) => setEditingMemory({ ...editingMemory, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 h-10 px-3 rounded-xl bg-white/5 border border-pink-400/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingMemory.isPublished ?? true}
                      onChange={(e) => setEditingMemory({ ...editingMemory, isPublished: e.target.checked })}
                      className="rounded accent-pink-500"
                    />
                    <span className="text-xs text-pink-200">Publish Now</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMemory(null)}
                  className="flex-1 h-11 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 h-11 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
