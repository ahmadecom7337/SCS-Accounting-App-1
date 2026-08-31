import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, setOrdersSubPage } = useApp();

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
                Sourcing Services
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {services.length}
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Commission & Service Rates (服务项目)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="p-4 space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-card-soft space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {service.service_code}
              </span>
              <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {service.fee_type === 'percentage' ? `${service.rate}% FOB Value` : `$${service.rate} USD / item`}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">{service.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{service.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>Category: <strong className="text-slate-200">{service.category}</strong></span>
              <span className="text-rose-400 font-medium">Standard China Tariff</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
