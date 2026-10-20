import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api.js';

interface AdminLoginProps {
  onSuccess: (email: string) => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);
      onSuccess(res.email);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#15172F] flex justify-center items-start sm:p-4 select-none">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] bg-gradient-to-b from-[#15172F] via-[#20183b] to-[#15172F] text-slate-100 relative flex flex-col justify-between p-6 sm:rounded-[36px] sm:shadow-[0_0_50px_rgba(244,123,167,0.25)] sm:border sm:border-pink-500/20">
        
        {/* Top return link */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs text-pink-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Surprise</span>
          </button>
          <span className="text-[11px] text-pink-200/50">Admin Portal</span>
        </div>

        {/* Card Form */}
        <div className="my-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-400/30 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-[#F47BA7]" />
            </div>
            <h1 className="text-3xl font-bold font-['Dancing_Script',cursive] text-transparent bg-clip-text bg-gradient-to-r from-[#FFE1EC] via-[#F47BA7] to-[#F7C96B]">
              Birthday &amp; Memories
            </h1>
            <p className="text-xs text-pink-200/70">
              Admin Login &middot; Manage Wishes, Photos &amp; Content
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-pink-200/80 block">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-pink-300/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="w-full h-12 pl-10 pr-3 rounded-xl bg-white/5 border border-pink-400/20 text-white text-sm focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-colors"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-pink-200/80 block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-pink-300/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/5 border border-pink-400/20 text-white text-sm focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300/60 hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[50px] rounded-xl bg-gradient-to-r from-[#F47BA7] to-[#D83C79] text-white font-semibold text-sm shadow-[0_4px_20px_rgba(244,123,167,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <Sparkles className="w-4 h-4 text-[#F7C96B]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-pink-200/40 pb-2">
          Protected Administrative Session
        </div>
      </div>
    </div>
  );
};
