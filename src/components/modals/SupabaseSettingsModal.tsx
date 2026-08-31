import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Database, CheckCircle2, AlertCircle, Sparkles, Key, Link as LinkIcon, Code2 } from 'lucide-react';

export const SupabaseSettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, supabaseConfig, updateSupabaseConfig } = useApp();

  const [url, setUrl] = useState<string>(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState<string>(supabaseConfig.anonKey || '');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  if (!isSettingsOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setStatusMessage({ type: '', text: '' });

    const result = await updateSupabaseConfig(url, anonKey);
    setIsTesting(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        setIsSettingsOpen(false);
      }, 1500);
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleClear = () => {
    setUrl('');
    setAnonKey('');
    updateSupabaseConfig('', '');
    setStatusMessage({ type: 'success', text: 'Supabase disconnected. Using local storage mode.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Supabase Backend</h3>
              <p className="text-xs text-slate-400">Connect cloud PostgreSQL database</p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {statusMessage.text && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-200' 
                : 'bg-rose-950/60 border-rose-600/40 text-rose-200'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Connected Cloud Database</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time sync between your mobile app and Supabase PostgreSQL.
            </p>
          </div>

          {/* Project URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Supabase Project URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://lryywkmlcgptpcvbazsu.supabase.co"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Anon Public Key */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Supabase Anon Public API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {supabaseConfig.isConnected && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold"
              >
                Disconnect
              </button>
            )}

            <button
              type="submit"
              disabled={isTesting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Database className="w-4 h-4" />
              {isTesting ? 'Testing Connection...' : 'Save & Connect to Supabase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
