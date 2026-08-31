import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';
import { Ship, Navigation } from 'lucide-react';

export const ShippingTab: React.FC = () => {
  const { shipments } = useApp();

  return (
    <div className="flex flex-col min-h-full pb-6">
      <Header title="LOGISTICS" subtitle="China Freight & Customs (物流管理)" />

      {/* Shipping List */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Active Container & Air Cargo Shipments ({shipments.length})
          </h3>
        </div>

        {shipments.map((shipment) => (
          <div
            key={shipment.id}
            className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-card-soft space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-400">
                {shipment.shipment_no}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-semibold border border-sky-500/30 flex items-center gap-1">
                <Navigation className="w-2.5 h-2.5 animate-pulse" /> {shipment.status}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                {shipment.carrier} • <span className="text-slate-400 font-normal text-[11px]">{shipment.freight_type}</span>
              </h4>
              {shipment.bill_of_lading && (
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  B/L: {shipment.bill_of_lading} {shipment.container_no && `• ${shipment.container_no}`}
                </p>
              )}
            </div>

            {/* Route */}
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 block uppercase">Origin</span>
                <span className="font-semibold text-slate-200">{shipment.origin_port}</span>
                <span className="text-[10px] text-slate-400 block font-mono">ETD: {shipment.etd}</span>
              </div>

              <div className="flex flex-col items-center px-2">
                <Ship className="w-4 h-4 text-sky-400 mb-0.5" />
                <span className="w-12 h-0.5 bg-slate-700 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                </span>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-[9px] text-slate-500 block uppercase">Destination</span>
                <span className="font-semibold text-slate-200">{shipment.destination_port}</span>
                <span className="text-[10px] text-slate-400 block font-mono">ETA: {shipment.eta}</span>
              </div>
            </div>

            {/* Specs */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-[11px] text-slate-400 font-mono">
              <span>{shipment.cbm} CBM • {shipment.weight_kg.toLocaleString()} kg</span>
              <span className="text-emerald-400 font-bold font-mono">Freight: ${shipment.shipping_cost_usd} USD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
