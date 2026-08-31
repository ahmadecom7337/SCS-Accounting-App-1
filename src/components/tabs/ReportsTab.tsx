import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';
import { ArrowDownRight } from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const { orders, customers, fxRateUSDCNY } = useApp();

  const totalRevenueUSD = orders.reduce((sum, o) => sum + o.total_amount_usd, 0);
  const totalFactoryCostRMB = orders.reduce((sum, o) => sum + o.factory_cost_cny, 0);
  const totalFactoryCostUSD = totalFactoryCostRMB / fxRateUSDCNY;
  const totalCommissionProfitUSD = totalRevenueUSD - totalFactoryCostUSD;
  const overallMarginPercent = totalRevenueUSD > 0 ? ((totalCommissionProfitUSD / totalRevenueUSD) * 100).toFixed(1) : '0';

  const totalPaidByClients = orders.reduce((sum, o) => sum + o.paid_amount_usd, 0);
  const accountsReceivableUSD = totalRevenueUSD - totalPaidByClients;

  return (
    <div className="flex flex-col min-h-full pb-6">
      <Header title="REPORTS" subtitle="China Sourcing Analytics (财务报表)" />

      {/* Main Sourcing Margin Card */}
      <div className="p-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-800 to-slate-850 border border-indigo-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
            <span className="font-semibold uppercase text-[10px]">Net Sourcing Gross Profit</span>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              +{overallMarginPercent}% Margin
            </span>
          </div>

          <div className="text-2xl font-black font-mono text-emerald-400">
            +${totalCommissionProfitUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-sans text-slate-300 font-normal">USD</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Total Sourced (FOB)</span>
              <span className="text-sm font-bold font-mono text-white">
                ${totalRevenueUSD.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Factory Outflows (RMB)</span>
              <span className="text-sm font-bold font-mono text-amber-300">
                ¥{totalFactoryCostRMB.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accounting Breakdown Cards */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
          Balance & Working Capital
        </h3>

        {/* Accounts Receivable */}
        <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-card-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Accounts Receivable (Client Due)</span>
            <div className="text-sm font-bold font-mono text-rose-400 mt-0.5">
              ${accountsReceivableUSD.toLocaleString()} USD
            </div>
            <span className="text-[10px] text-slate-400">Pending final container balance</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        {/* Client Revenue Ranking */}
        <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-card-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase">Top Sourcing Clients</span>
            <span className="text-[10px] text-slate-500">By Turnover</span>
          </div>

          <div className="space-y-2 pt-1">
            {customers.map((c, i) => (
              <div key={c.customer_id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px] font-mono font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-slate-200 font-medium">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">
                  ${(c.total_spent || 0).toLocaleString()} USD
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
