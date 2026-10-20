import React, { useState, useEffect } from 'react';
import {
  Heart,
  Camera,
  Settings,
  Shield,
  ExternalLink,
  LogOut,
  Sparkles,
  Gift,
  LayoutDashboard
} from 'lucide-react';
import { AdminDataResponse } from '../../types.js';
import { api } from '../../services/api.js';
import { WishesManager } from './WishesManager.js';
import { MemoriesManager } from './MemoriesManager.js';
import { SettingsManager } from './SettingsManager.js';
import { SecurityManager } from './SecurityManager.js';

interface AdminDashboardProps {
  onLogout: () => void;
  onPreviewClient: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onPreviewClient }) => {
  const [data, setData] = useState<AdminDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'wishes' | 'memories' | 'content' | 'security'>('overview');

  const loadData = async () => {
    try {
      const res = await api.fetchAdminData();
      setData(res);
    } catch {
      onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#15172F] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#F47BA7] animate-spin mx-auto" />
          <p className="text-xs text-pink-200">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const { stats, settings, wishes, memories, adminEmail } = data;

  return (
    <div className="min-h-screen bg-[#15172F] flex justify-center items-start sm:p-4 select-none">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] bg-gradient-to-b from-[#15172F] via-[#20183b] to-[#15172F] text-slate-100 relative flex flex-col justify-between p-4 sm:rounded-[36px] sm:shadow-[0_0_50px_rgba(244,123,167,0.25)] sm:border sm:border-pink-500/20">
        
        {/* Compact Mobile Top App Bar */}
        <header className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div>
            <h1 className="text-lg font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] to-[#F47BA7]">
              Birthday &amp; Memories
            </h1>
            <p className="text-[10px] text-pink-300/60 -mt-1">
              Admin &middot; {settings.recipientName || 'Surprise Mode'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPreviewClient}
              className="min-h-[36px] px-2.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-200 text-xs font-medium flex items-center gap-1 active:scale-95 cursor-pointer"
              title="Preview Surprise"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={onLogout}
              className="min-h-[36px] w-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-pink-300/70 hover:text-white"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto py-3">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="text-left">
                <h2 className="text-base font-semibold text-white">
                  Welcome to Your Birthday Studio ✨
                </h2>
                <p className="text-xs text-pink-200/70 mt-0.5">
                  Prepare your surprise before sharing the special link.
                </p>
              </div>

              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/10 border border-pink-400/30 text-left">
                  <div className="flex items-center justify-between text-pink-300 mb-1">
                    <Gift className="w-4 h-4" />
                    <span className="text-[10px] font-medium text-pink-300/80">Wishes</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {stats.publishedWishes}
                    <span className="text-xs font-normal text-pink-300/60 ml-1">
                      / {stats.totalWishes}
                    </span>
                  </div>
                  <p className="text-[10px] text-pink-200/60 mt-0.5">Active Wishes</p>
                </div>

                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-pink-400/30 text-left">
                  <div className="flex items-center justify-between text-purple-300 mb-1">
                    <Camera className="w-4 h-4" />
                    <span className="text-[10px] font-medium text-purple-300/80">Memories</span>
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {stats.publishedMemories}
                    <span className="text-xs font-normal text-purple-300/60 ml-1">
                      / {stats.totalMemories}
                    </span>
                  </div>
                  <p className="text-[10px] text-pink-200/60 mt-0.5">Photo Cards</p>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-2 text-left">
                <h3 className="text-xs font-semibold text-pink-200 uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setActiveTab('wishes')}
                    className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-xs text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-pink-400" />
                      <span>Manage Birthday Wishes ({stats.totalWishes})</span>
                    </span>
                    <span className="text-pink-300">&rarr;</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('memories')}
                    className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-xs text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#F7C96B]" />
                      <span>Upload &amp; Edit Memories ({stats.totalMemories})</span>
                    </span>
                    <span className="text-pink-300">&rarr;</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('content')}
                    className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-xs text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-purple-300" />
                      <span>Edit Headings &amp; Surprise Text</span>
                    </span>
                    <span className="text-pink-300">&rarr;</span>
                  </button>
                </div>
              </div>

              {/* Direct Client Link Share Box */}
              <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-400/20 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F7C96B]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Client Website URL</span>
                </div>
                <p className="text-[11px] text-pink-200/80 leading-relaxed">
                  Send this link to the birthday person. They will see the pure, unbranded interactive surprise without any admin buttons:
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-pink-400/30 font-mono text-xs text-pink-300 flex items-center justify-between break-all">
                  <span>{typeof window !== 'undefined' ? window.location.origin + '/' : '/'}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.origin + '/');
                      alert('Surprise URL copied to clipboard!');
                    }}
                    className="ml-2 text-[10px] px-2 py-1 bg-pink-500/30 rounded text-pink-200 hover:text-white shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wishes' && (
            <WishesManager wishes={wishes} onRefresh={loadData} />
          )}

          {activeTab === 'memories' && (
            <MemoriesManager memories={memories} onRefresh={loadData} />
          )}

          {activeTab === 'content' && (
            <SettingsManager settings={settings} onRefresh={loadData} />
          )}

          {activeTab === 'security' && (
            <SecurityManager
              adminEmail={adminEmail}
              onRefresh={loadData}
              onLogout={onLogout}
            />
          )}
        </div>

        {/* Fixed Mobile Bottom Tab Bar */}
        <nav className="border-t border-white/10 pt-2 grid grid-cols-5 items-center shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] transition-colors ${
              activeTab === 'overview' ? 'text-pink-400 font-semibold' : 'text-pink-200/50 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('wishes')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] transition-colors ${
              activeTab === 'wishes' ? 'text-pink-400 font-semibold' : 'text-pink-200/50 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4 mb-0.5" />
            <span>Wishes</span>
          </button>

          <button
            onClick={() => setActiveTab('memories')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] transition-colors ${
              activeTab === 'memories' ? 'text-pink-400 font-semibold' : 'text-pink-200/50 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4 mb-0.5" />
            <span>Photos</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] transition-colors ${
              activeTab === 'content' ? 'text-pink-400 font-semibold' : 'text-pink-200/50 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span>Text</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`min-h-[44px] flex flex-col items-center justify-center text-[10px] transition-colors ${
              activeTab === 'security' ? 'text-pink-400 font-semibold' : 'text-pink-200/50 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 mb-0.5" />
            <span>Security</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
