import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';
import { ArrowRightLeft } from 'lucide-react';

export const BankingTab: React.FC = () => {
  const { bankAccounts, fxRateUSDCNY } = useApp();
  const [convertUsd, setConvertUsd] = useState<string>('1000');

  const calculatedRmb = (parseFloat(convertUsd || '0') * fxRateUSDCNY).toFixed(2);

  return (
    <div className="flex flex-col min-h-full pb-6">
      <Header title="BANKING" subtitle="Multi-Currency Wallets (资金管理)" />

      {/* FX Live Converter Card */}
      <div className="p-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-slate-800 to-slate-850 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-emerald-200 mb-2">
            <span className="font-semibold uppercase text-[10px] flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" /> China FX Converter
            </span>
            <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              1 USD = ¥{fxRateUSDCNY}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
              <label className="block text-[10px] text-slate-400 mb-1">USD Amount ($)</label>
              <input
                type="number"
                value={convertUsd}
                onChange={(e) => setConvertUsd(e.target.value)}
                className="w-full bg-transparent font-mono text-base font-bold text-white focus:outline-none"
              />
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
              <label className="block text-[10px] text-slate-400 mb-1">RMB Output (¥)</label>
              <div className="font-mono text-base font-bold text-amber-300 pt-0.5">
                ¥{calculatedRmb}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Accounts List */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Settlement Accounts ({bankAccounts.length})
          </h3>
        </div>

        {bankAccounts.map((acc) => (
          <div
            key={acc.id}
            className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-card-soft space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                  acc.currency === 'USD' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  acc.currency === 'CNY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}>
                  {acc.currency === 'USD' ? '$' : acc.currency === 'CNY' ? '¥' : '€'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{acc.account_name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{acc.account_number} • {acc.bank_name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
              <span className="text-[10px] text-slate-400">{acc.account_type}</span>
              <span className="text-sm font-bold font-mono text-white">
                {acc.currency === 'USD' && '$'}
                {acc.currency === 'CNY' && '¥'}
                {acc.currency === 'EUR' && '€'}
                {acc.balance.toLocaleString()} <span className="text-[10px] text-slate-400">{acc.currency}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
