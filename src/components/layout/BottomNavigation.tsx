import React from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import { ShoppingCart, Factory, Landmark, Ship, BarChart3 } from 'lucide-react';

interface TabItem {
  id: TabType;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, orders, shipments } = useApp();

  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const activeShipmentsCount = shipments.filter(s => s.status !== 'Delivered').length;

  const tabs: TabItem[] = [
    {
      id: 'orders',
      label: 'Orders',
      subLabel: '订单',
      icon: ShoppingCart,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'purchasing',
      label: 'Purchasing',
      subLabel: '采购',
      icon: Factory,
    },
    {
      id: 'banking',
      label: 'Banking',
      subLabel: '资金',
      icon: Landmark,
    },
    {
      id: 'shipping',
      label: 'Shipping',
      subLabel: '物流',
      icon: Ship,
      badge: activeShipmentsCount > 0 ? activeShipmentsCount : undefined,
    },
    {
      id: 'reports',
      label: 'Reports',
      subLabel: '报表',
      icon: BarChart3,
    },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
  };

  return (
    <div className="fixed sm:absolute bottom-0 left-0 right-0 z-30 glass-nav px-2 py-1.5 safe-area-bottom">
      <nav className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-rose-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center border border-slate-900">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-1 tracking-tight leading-none">{tab.label}</span>
              <span className="text-[8px] text-slate-500 font-normal leading-tight">{tab.subLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
