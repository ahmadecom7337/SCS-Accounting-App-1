import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Smartphone, Monitor, Database, Wifi, Battery } from 'lucide-react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  const [usePhoneFrame, setUsePhoneFrame] = useState<boolean>(true);
  const { supabaseConfig, setIsSettingsOpen } = useApp();
  
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Desktop Helper Bar */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${supabaseConfig.isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${supabaseConfig.isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="hover:text-slate-200 transition-colors flex items-center gap-1 font-medium"
            title="Configure Supabase Database"
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            {supabaseConfig.isConnected ? 'Supabase Connected' : 'Local Mode (Click for Supabase)'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUsePhoneFrame(!usePhoneFrame)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all"
            title="Toggle Phone Mockup Frame"
          >
            {usePhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" /> Full Width
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" /> Phone Frame
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Device Frame */}
      <div
        className={`w-full bg-slate-900 text-slate-100 flex flex-col overflow-hidden relative transition-all duration-300 ${
          usePhoneFrame
            ? 'sm:max-w-[430px] sm:h-[880px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-phone-frame'
            : 'max-w-md min-h-screen sm:min-h-[850px] sm:rounded-2xl sm:border sm:border-slate-800'
        }`}
        style={{ minHeight: '100dvh' }}
      >
        {/* Status Bar */}
        <div className="w-full pt-2.5 pb-1 px-6 flex items-center justify-between text-xs text-slate-400 font-mono select-none z-30 bg-slate-900/90 backdrop-blur-md">
          <span className="font-semibold tracking-tight text-slate-200 text-[13px]">{currentTime}</span>
          
          {usePhoneFrame && (
            <div className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-1 bg-black rounded-full text-[10px] text-slate-400 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <span className="text-[10px] font-sans font-medium text-slate-300">Yiwu • Shenzhen</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-sans font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative pb-20 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};
