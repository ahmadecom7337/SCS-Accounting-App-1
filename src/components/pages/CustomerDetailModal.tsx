import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { X, Phone, Mail, MapPin, Building, MessageSquare, Copy, Trash2, Edit3, Check } from 'lucide-react';

export const CustomerDetailModal: React.FC = () => {
  const { selectedCustomer, setSelectedCustomer, deleteCustomer, updateCustomer, orders } = useApp();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editCompany, setEditCompany] = useState<string>('');
  const [editWechat, setEditWechat] = useState<string>('');

  if (!selectedCustomer) return null;

  const customerOrders = orders.filter(o => o.customer_id === selectedCustomer.customer_id);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete customer ${selectedCustomer.name} (${selectedCustomer.customer_id})?`)) {
      await deleteCustomer(selectedCustomer.customer_id);
      setSelectedCustomer(null);
    }
  };

  const handleStartEdit = () => {
    setEditName(selectedCustomer.name);
    setEditPhone(selectedCustomer.phone);
    setEditEmail(selectedCustomer.email);
    setEditAddress(selectedCustomer.address);
    setEditCompany(selectedCustomer.company || '');
    setEditWechat(selectedCustomer.wechat || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const updated: Customer = {
      ...selectedCustomer,
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      address: editAddress.trim(),
      company: editCompany.trim() || undefined,
      wechat: editWechat.trim() || undefined,
    };
    await updateCustomer(updated);
    setSelectedCustomer(updated);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {selectedCustomer.customer_id}
            </span>
            <span className="text-xs uppercase px-2 py-0.5 rounded font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {selectedCustomer.status || 'Active'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                title="Edit Customer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 text-xs"
              title="Delete Customer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedCustomer(null);
              }}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {!isEditing ? (
            <>
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/80 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCustomer.name}</h3>
                  {selectedCustomer.company && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {selectedCustomer.company}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-slate-300">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total Sourced Value</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      ${(selectedCustomer.total_spent || 0).toLocaleString()} {selectedCustomer.preferred_currency || 'USD'}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Sourcing Orders</span>
                    <span className="text-sm font-bold text-rose-400 font-mono">
                      {selectedCustomer.orders_count || customerOrders.length} Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact & Sourcing Details</h4>

                {/* Mobile */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Mobile Phone</span>
                      <span className="text-xs font-mono font-medium text-slate-100">{selectedCustomer.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px]"
                    >
                      Call
                    </a>
                    <button
                      onClick={() => copyToClipboard(selectedCustomer.phone, 'phone')}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                    >
                      {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 block">Email Address</span>
                      <span className="text-xs font-medium text-slate-100 truncate block max-w-[170px] sm:max-w-[220px]">
                        {selectedCustomer.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`mailto:${selectedCustomer.email}`}
                      className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-[10px]"
                    >
                      Email
                    </a>
                    <button
                      onClick={() => copyToClipboard(selectedCustomer.email, 'email')}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                    >
                      {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Destination Address</span>
                      <span className="text-xs text-slate-200 leading-relaxed">{selectedCustomer.address}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedCustomer.address, 'address')}
                    className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 mt-1"
                  >
                    {copiedField === 'address' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {/* WeChat */}
                {selectedCustomer.wechat && (
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">WeChat ID (微信)</span>
                        <span className="text-xs font-mono font-medium text-emerald-300">{selectedCustomer.wechat}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedCustomer.wechat!, 'wechat')}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                    >
                      {copiedField === 'wechat' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Customer Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Company</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Address</label>
                <textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
