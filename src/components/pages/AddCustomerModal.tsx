import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Phone, Mail, MapPin, Building, MessageSquare, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';

export const AddCustomerModal: React.FC = () => {
  const { isAddCustomerOpen, setIsAddCustomerOpen, addCustomer, getNextCustomerId } = useApp();

  const [serialId, setSerialId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [wechat, setWechat] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isAddCustomerOpen) {
      setSerialId(getNextCustomerId());
      setError('');
    }
  }, [isAddCustomerOpen]);

  if (!isAddCustomerOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!mobile.trim()) {
      setError('Mobile number is required');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!address.trim()) {
      setError('Address is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const fullPhone = mobile.startsWith('+') ? mobile : `${countryCode} ${mobile.trim()}`;
      await addCustomer({
        customer_id: serialId,
        name: name.trim(),
        phone: fullPhone,
        email: email.trim(),
        address: address.trim(),
        company: company.trim() || undefined,
        wechat: wechat.trim() || undefined,
        preferred_currency: currency,
        notes: notes.trim() || undefined,
        status: 'active',
        total_spent: 0,
        orders_count: 0,
      });

      setName('');
      setMobile('');
      setEmail('');
      setAddress('');
      setCompany('');
      setWechat('');
      setNotes('');
      setIsAddCustomerOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to add customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm transition-all">
      <div 
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Add New Customer</h2>
              <p className="text-xs text-slate-400">Add client for China sourcing orders</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsAddCustomerOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/40 text-rose-200 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              {error}
            </div>
          )}

          {/* Auto Generated Serial Customer ID Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-850 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Serial Customer ID (Auto-Generated)
                </span>
                <span className="text-sm font-mono font-bold text-amber-300">
                  {serialId}
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
              Unique Sequential
            </span>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Customer Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Company / Business Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Company / Organization Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Pacific Imports LLC"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Mobile Number & Country Code */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Mobile Number <span className="text-rose-400">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                aria-label="Country Dialing Code"
                className="w-24 bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="+1">🇺🇸 +1 (US/CA)</option>
                <option value="+86">🇨🇳 +86 (China)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+971">🇦🇪 +971 (UAE)</option>
                <option value="+55">🇧🇷 +55 (Brazil)</option>
                <option value="+49">🇩🇪 +49 (Germany)</option>
                <option value="+33">🇫🇷 +33 (France)</option>
                <option value="+92">🇵🇰 +92 (PK)</option>
                <option value="+91">🇮🇳 +91 (India)</option>
                <option value="+61">🇦🇺 +61 (Aus)</option>
                <option value="+852">🇭🇰 +852 (HK)</option>
              </select>

              <div className="relative flex-1">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="555-0192 or 13800138000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@pacificgoods.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Address (Shipping / Billing) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, City, State/Province, Country, Postal Code"
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500 transition-colors resize-none"
                required
              />
            </div>
          </div>

          {/* WeChat ID & Preferred Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                WeChat / WhatsApp
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-emerald-500" />
                <input
                  type="text"
                  value={wechat}
                  onChange={(e) => setWechat(e.target.value)}
                  placeholder="ID / Username"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Settlement Currency
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-amber-400" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  aria-label="Settlement Currency"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-rose-500 font-mono"
                >
                  <option value="USD">USD ($)</option>
                  <option value="CNY">CNY (¥)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="HKD">HKD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sourcing Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Sourcing Notes & Target Products
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sourcing consumer electronics, factory inspection required..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-100 text-xs focus:outline-none focus:border-rose-500 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 pb-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Saving Customer...' : `Save Customer (${serialId})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
