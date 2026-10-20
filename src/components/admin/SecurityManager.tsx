import React, { useState } from 'react';
import { Lock, Shield, RotateCcw, AlertTriangle, Check, User } from 'lucide-react';
import { api } from '../../services/api.js';

interface SecurityManagerProps {
  adminEmail: string;
  onRefresh: () => void;
  onLogout: () => void;
}

export const SecurityManager: React.FC<SecurityManagerProps> = ({
  adminEmail,
  onRefresh,
  onLogout
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword.length < 6) {
      setPassMessage({ text: 'New password must be at least 6 characters.', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage({ text: 'New passwords do not match.', isError: true });
      return;
    }

    setSavingPass(true);
    try {
      await api.updatePassword(currentPassword, newPassword);
      setPassMessage({ text: 'Password changed successfully!', isError: false });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPassMessage({ text: err.message, isError: true });
      } else {
        setPassMessage({ text: 'Failed to change password.', isError: true });
      }
    } finally {
      setSavingPass(false);
    }
  };

  const handleResetDefaults = async () => {
    setResetting(true);
    try {
      await api.resetDefaults();
      setShowResetConfirm(false);
      onRefresh();
      alert('Content has been reset to original defaults.');
    } catch {
      alert('Failed to reset content.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-5 text-left">
      <div>
        <h2 className="text-base font-semibold text-white">Security &amp; Account</h2>
        <p className="text-xs text-pink-200/60">
          Manage administrator credentials and database
        </p>
      </div>

      {/* Account Info */}
      <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Logged in as</div>
            <div className="text-[11px] text-pink-200/70">{adminEmail}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-xs font-medium cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Change Password Form */}
      <div className="p-4 rounded-2xl bg-white/5 border border-pink-400/20 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-pink-300 uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          <span>Change Password</span>
        </div>

        {passMessage && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              passMessage.isError
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
            }`}
          >
            {passMessage.isError ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{passMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              New Password (min 6 characters)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-pink-200/80 block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-black/30 border border-pink-400/20 text-white text-xs focus:outline-none focus:border-pink-400"
            />
          </div>

          <button
            type="submit"
            disabled={savingPass}
            className="w-full h-10 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-xs shadow-md disabled:opacity-50 cursor-pointer"
          >
            {savingPass ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Database Reset Action */}
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-wider">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Content</span>
        </div>
        <p className="text-[11px] text-pink-200/70 leading-relaxed">
          Restore the initial romantic birthday wishes, demo photographs, and default surprise settings.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="h-9 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-xs font-medium cursor-pointer"
          >
            Reset to Sample Data
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 space-y-2">
            <p className="text-xs text-rose-200 font-medium">
              Are you sure? This will replace current wishes and memories with sample defaults.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaults}
                disabled={resetting}
                className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset Everything'}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="h-8 px-3 rounded-lg text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
