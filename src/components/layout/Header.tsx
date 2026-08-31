import React from 'react';
import { useApp } from '../../context/AppContext';
import { Database, RefreshCw } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showFxTicker?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "CHINASOURCE", 
  subtitle = "Accounting & ERP",
  showFxTicker = true 
}) => {
  const { supabaseConfig, setIsSettingsOpen, refreshData, isLoading, fxRateUSDCNY } = useApp();

  return (
    <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40 text-white font-bold text-base">
            <span>中</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              {title}
              <span className="text-[10px] uppercase tracking-wider bg-rose-500/20 text-rose-300 font-semibold px-1.5 py-0.2 rounded border border-rose-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium leading-none">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {showFxTicker && (
            <div className="hidden min-[380px]:flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 px-2 py-1 rounded-lg text-[11px] font-mono text-amber-300">
              <span className="text-slate-400 text-[10px]">USD/RMB:</span>
              <span className="font-bold">¥{fxRateUSDCNY}</span>
            </div>
          )}

          <button
            onClick={() => refreshData()}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
              supabaseConfig.isConnected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
            }`}
            title="Supabase Database Settings"
          >
            <Database className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
