import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';
import { CustomersPage } from '../pages/CustomersPage';
import { OrdersManagementPage } from '../pages/OrdersManagementPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ServicesPage } from '../pages/ServicesPage';
import { 
  Users, 
  ShoppingCart, 
  Tag, 
  Briefcase, 
  ChevronRight, 
  TrendingUp
} from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const { 
    ordersSubPage, 
    setOrdersSubPage, 
    customers, 
    orders, 
    products, 
    services,
    setIsAddCustomerOpen
  } = useApp();

  if (ordersSubPage === 'customers') {
    return <CustomersPage />;
  }
  if (ordersSubPage === 'orders_list') {
    return <OrdersManagementPage />;
  }
  if (ordersSubPage === 'products') {
    return <ProductsPage />;
  }
  if (ordersSubPage === 'services') {
    return <ServicesPage />;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount_usd, 0);
  const totalCommission = orders.reduce((sum, o) => sum + o.sourcing_commission_usd, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="flex flex-col min-h-full pb-6">
      <Header title="CHINASOURCE" subtitle="Orders & Client Hub" />

      {/* Main KPI Card */}
      <div className="p-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-900/60 via-slate-800 to-slate-850 border border-rose-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between text-xs text-rose-200 mb-1">
            <span className="font-semibold tracking-wide uppercase text-[10px]">Total Sourcing Turnover</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <TrendingUp className="w-3 h-3" /> +18.4% MoM
            </span>
          </div>

          <div className="text-2xl font-black font-mono text-white tracking-tight">
            ${totalRevenue.toLocaleString()}{' '}
            <span className="text-xs font-sans font-medium text-slate-300">USD</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Sourcing Commission (Net)</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                +${totalCommission.toLocaleString()} USD
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Active China POs</span>
              <span className="text-sm font-bold font-mono text-amber-300">
                {activeOrdersCount} in Production/Transit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Main Navigation Buttons */}
      <div className="px-4 space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Orders Modules
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">Select a section</span>
        </div>

        {/* 1. Customers Button */}
        <button
          onClick={() => setOrdersSubPage('customers')}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-750 hover:to-slate-800 border border-slate-700/80 hover:border-rose-500/40 shadow-card-soft flex items-center justify-between transition-all group active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-950/40">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                  1. Customers
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 border border-slate-700">
                  {customers.length} Clients
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Client directory, auto-serial IDs & addresses (客户管理)
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 2. Orders Button */}
        <button
          onClick={() => setOrdersSubPage('orders_list')}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-750 hover:to-slate-800 border border-slate-700/80 hover:border-rose-500/40 shadow-card-soft flex items-center justify-between transition-all group active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-950/40">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  2. Orders
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-rose-400 border border-slate-700">
                  {orders.length} Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Client purchase orders, FOB prices & invoices (采购订单)
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 3. Products Button */}
        <button
          onClick={() => setOrdersSubPage('products')}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-750 hover:to-slate-800 border border-slate-700/80 hover:border-rose-500/40 shadow-card-soft flex items-center justify-between transition-all group active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-950/40">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  3. Products
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 border border-slate-700">
                  {products.length} SKUs
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Factory catalog, RMB unit costs, MOQs & CBM (产品目录)
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* 4. Services Button */}
        <button
          onClick={() => setOrdersSubPage('services')}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-750 hover:to-slate-800 border border-slate-700/80 hover:border-rose-500/40 shadow-card-soft flex items-center justify-between transition-all group active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-950/40">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  4. Services
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-indigo-400 border border-slate-700">
                  {services.length} Types
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Inspection, sourcing commission & factory audit tariffs (服务项目)
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Quick Action */}
      <div className="px-4 mt-4">
        <button
          onClick={() => {
            setOrdersSubPage('customers');
            setIsAddCustomerOpen(true);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Users className="w-4 h-4" />
          <span>Quick Add Customer (Auto Serial ID)</span>
        </button>
      </div>
    </div>
  );
};
