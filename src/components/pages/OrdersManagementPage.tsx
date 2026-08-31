import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { ArrowLeft, Search, Clock, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OrdersManagementPage: React.FC = () => {
  const { orders, setOrdersSubPage, fxRateUSDCNY } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q ||
      order.order_number.toLowerCase().includes(q) ||
      order.customer_name.toLowerCase().includes(q) ||
      order.items.some(i => i.product_name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));

    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Factory Production':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> In Production</span>;
      case 'Quality Inspected':
        return <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30 flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Inspected (AQL)</span>;
      case 'In Transit':
        return <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-semibold border border-sky-500/30 flex items-center gap-1"><Truck className="w-2.5 h-2.5" /> In Transit</span>;
      case 'Delivered':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Delivered</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-semibold">{status}</span>;
    }
  };

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
                Sourcing Orders
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {orders.length}
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Client Orders & Invoicing (采购订单)</p>
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
            placeholder="Search order number, client, SKU..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {filteredOrders.map((order) => {
          const factoryCostUSD = order.factory_cost_cny / fxRateUSDCNY;
          const grossProfitUSD = order.total_amount_usd - factoryCostUSD;
          const marginPercent = ((grossProfitUSD / order.total_amount_usd) * 100).toFixed(1);

          return (
            <div
              key={order.id}
              className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-card-soft space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-rose-400">
                    {order.order_number}
                  </span>
                  <span className="text-[10px] text-slate-400">({order.order_date})</span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{order.customer_name}</h4>
                <p className="text-[10px] text-slate-400">{order.shipping_terms}</p>
              </div>

              {/* Items preview */}
              <div className="bg-slate-900/60 rounded-xl p-2.5 space-y-1.5 border border-slate-800">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 truncate max-w-[200px]">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="font-mono text-slate-200 font-medium">
                      ${item.total_usd.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Accounting Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center">
                <div className="bg-slate-900/40 p-1.5 rounded-lg">
                  <span className="text-[9px] text-slate-400 block">Client Total (USD)</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    ${order.total_amount_usd.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-900/40 p-1.5 rounded-lg">
                  <span className="text-[9px] text-slate-400 block">Factory Cost (RMB)</span>
                  <span className="text-xs font-bold font-mono text-amber-300">
                    ¥{order.factory_cost_cny.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-900/40 p-1.5 rounded-lg">
                  <span className="text-[9px] text-slate-400 block">Commission Margin</span>
                  <span className="text-xs font-bold font-mono text-rose-300">
                    +{marginPercent}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
