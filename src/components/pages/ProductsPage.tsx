import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Search, Factory } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, setOrdersSubPage, fxRateUSDCNY } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full pb-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setOrdersSubPage('hub')}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Product Catalog
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {products.length}
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Sourced SKUs & Factory Costs (产品目录)</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, product title, supplier, HS code..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 space-y-3">
        {filtered.map((product) => {
          const factoryCostUSD = (product.factory_cost_cny / fxRateUSDCNY).toFixed(2);

          return (
            <div
              key={product.id}
              className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-card-soft space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {product.sku}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                  {product.category}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white leading-snug">{product.name}</h4>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Factory className="w-3 h-3 text-slate-500" />
                  {product.supplier_name}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center">
                <div className="bg-slate-900/50 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 block">Factory Cost</span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    ¥{product.factory_cost_cny}
                  </span>
                  <span className="text-[8px] text-slate-500 block">~${factoryCostUSD}</span>
                </div>

                <div className="bg-slate-900/50 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 block">Client Price</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${product.selling_price_usd}
                  </span>
                  <span className="text-[8px] text-emerald-500 block">USD FOB</span>
                </div>

                <div className="bg-slate-900/50 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 block">MOQ / CBM</span>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {product.moq} pcs
                  </span>
                  <span className="text-[8px] text-slate-500 block">{product.cbm} m³</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
