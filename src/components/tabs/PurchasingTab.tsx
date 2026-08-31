import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';
import { Search, Phone, MessageSquare, MapPin, Star } from 'lucide-react';

export const PurchasingTab: React.FC = () => {
  const { suppliers, orders, fxRateUSDCNY } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.factory_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.province_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.main_products.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFactoryPayablesCNY = orders.reduce((sum, o) => sum + o.factory_cost_cny, 0);

  return (
    <div className="flex flex-col min-h-full pb-6">
      <Header title="PURCHASING" subtitle="China Factories & POs (采购管理)" />

      {/* Purchasing KPI */}
      <div className="p-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-800 to-slate-850 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between text-xs text-amber-200 mb-1">
            <span className="font-semibold uppercase text-[10px]">Total Factory Commitments</span>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              RMB Settled
            </span>
          </div>

          <div className="text-2xl font-black font-mono text-amber-400">
            ¥{totalFactoryPayablesCNY.toLocaleString()}{' '}
            <span className="text-xs font-sans text-slate-400 font-normal">
              (~${(totalFactoryPayablesCNY / fxRateUSDCNY).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Vetted Factories</span>
              <span className="text-sm font-bold font-mono text-white">{suppliers.length} Suppliers</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Production Milestones</span>
              <span className="text-sm font-bold font-mono text-emerald-400">100% On Schedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search factories in Yiwu, Shenzhen, Ningbo..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Suppliers List */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            China Sourcing Factories ({filteredSuppliers.length})
          </h3>
        </div>

        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-card-soft space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {supplier.supplier_code}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{supplier.rating} / 5.0</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">{supplier.factory_name}</h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                {supplier.province_city}
              </p>
            </div>

            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-[11px] space-y-1">
              <div className="text-slate-300">
                <span className="text-slate-500">Products: </span>
                {supplier.main_products}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500">Contact: </span>
                {supplier.contact_person}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <div className="flex items-center gap-1 text-slate-300 font-mono">
                <Phone className="w-3 h-3 text-emerald-400" />
                {supplier.phone}
              </div>
              {supplier.wechat_id && (
                <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                  <MessageSquare className="w-3 h-3" />
                  <span>{supplier.wechat_id}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
