import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  MessageSquare, 
  ChevronRight,
  Star,
  Users,
  DollarSign
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { 
    customers, 
    setOrdersSubPage, 
    setIsAddCustomerOpen, 
    setSelectedCustomer 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'vip' | 'active'>('all');

  const filteredCustomers = customers.filter((customer) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !q ||
      customer.name.toLowerCase().includes(q) ||
      customer.customer_id.toLowerCase().includes(q) ||
      customer.phone.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      (customer.company && customer.company.toLowerCase().includes(q)) ||
      (customer.address && customer.address.toLowerCase().includes(q));

    const matchesFilter = 
      selectedFilter === 'all' || 
      (selectedFilter === 'vip' && customer.status === 'vip') ||
      (selectedFilter === 'active' && customer.status === 'active');

    return matchesQuery && matchesFilter;
  });

  const totalSourcedSum = customers.reduce((acc, c) => acc + (c.total_spent || 0), 0);

  return (
    <div className="flex flex-col min-h-full pb-6">
      {/* Top App Bar with Back Button */}
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
                Customers
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {customers.length}
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Client Directory & Addresses (客户管理)</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-rose-950/40 transition-all active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID (CUST-001), phone, email..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 mt-2.5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Clients ({customers.length})
          </button>
          <button
            onClick={() => setSelectedFilter('vip')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
              selectedFilter === 'vip'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400" /> VIP ({customers.filter(c => c.status === 'vip').length})
          </button>
          <button
            onClick={() => setSelectedFilter('active')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              selectedFilter === 'active'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({customers.filter(c => c.status === 'active').length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="p-4 grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/70 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Clients</span>
            <Users className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-mono font-bold text-white leading-tight">
            {customers.length}
          </div>
          <span className="text-[9px] text-emerald-400 font-medium">Auto-serial IDs synced</span>
        </div>

        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/70 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Sourced</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-mono font-bold text-emerald-400 leading-tight">
            ${totalSourcedSum.toLocaleString()}
          </div>
          <span className="text-[9px] text-slate-400 font-medium">USD FOB value</span>
        </div>
      </div>

      {/* Customer List */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Added Customers ({filteredCustomers.length})
          </span>
          <span className="text-[10px] text-slate-500">Tap card for details</span>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-850/50 border border-dashed border-slate-700 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">No Customers Found</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {searchQuery ? 'Try adjusting your search query.' : 'Add your first China sourcing client to get started.'}
              </p>
            </div>
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-md shadow-rose-950/40"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Customer
            </button>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.customer_id}
              onClick={() => setSelectedCustomer(customer)}
              className="group p-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/70 hover:border-rose-500/40 shadow-card-soft transition-all duration-200 active:scale-[0.99] cursor-pointer relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {customer.customer_id}
                  </span>
                  {customer.status === 'vip' && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      <Star className="w-2.5 h-2.5 fill-rose-300" /> VIP
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                  <span>${(customer.total_spent || 0).toLocaleString()}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 transition-colors" />
                </div>
              </div>

              <div className="mb-2">
                <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                  {customer.name}
                </h3>
                {customer.company && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                    <Building className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{customer.company}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-700/60 text-xs">
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span className="flex items-center gap-1.5 font-mono text-slate-200">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                    {customer.phone}
                  </span>
                  <a
                    href={`tel:${customer.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-[10px]"
                  >
                    Call
                  </a>
                </div>

                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-300 truncate max-w-[210px] sm:max-w-[260px]">
                    <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </span>
                  <a
                    href={`mailto:${customer.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-[10px]"
                  >
                    Email
                  </a>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pt-0.5">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{customer.address}</span>
                </div>

                {customer.wechat && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 pt-0.5">
                    <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>WeChat: <strong className="font-mono text-slate-200">{customer.wechat}</strong></span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
