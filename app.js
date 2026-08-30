// Sourcing Accounting App Core Controller
(function() {
  'use strict';

  class SourcingApp {
    constructor() {
      this.currentTab = 'orders';
      this.currentPage = 'tab-orders';
      this.customers = [];
      this.supabase = null;
      this.isSupabaseConnected = false;

      this.init();
    }

    async init() {
      // 1. Initialize Icons
      if (window.lucide) {
        lucide.createIcons();
      }

      // 2. Initialize Supabase if keys available
      this.initSupabase();

      // 3. Setup Event Listeners
      this.bindEvents();

      // 4. Load Customer Data
      await this.loadCustomers();

      // 5. Update UI stats
      this.updateStats();
    }

    initSupabase() {
      const url = window.APP_CONFIG?.SUPABASE_URL?.trim();
      const key = window.APP_CONFIG?.SUPABASE_ANON_KEY?.trim();
      const badge = document.getElementById('connection-badge');

      if (url && key && window.supabase) {
        try {
          this.supabase = window.supabase.createClient(url, key);
          this.isSupabaseConnected = true;
          if (badge) {
            badge.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20';
            badge.title = 'Supabase Cloud Connected';
          }
        } catch (e) {
          console.error('Supabase initialization error:', e);
          this.supabase = null;
          this.isSupabaseConnected = false;
          if (badge) {
            badge.className = 'w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20';
            badge.title = 'Supabase Config Error (Using Local Storage)';
          }
        }
      } else {
        this.supabase = null;
        this.isSupabaseConnected = false;
        if (badge) {
          badge.className = 'w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20';
          badge.title = 'Offline / Local Storage Mode';
        }
      }
    }

    bindEvents() {
      // Tab Navigation
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.getAttribute('data-tab');
          this.switchTab(targetTab);
        });
      });

      // Navigation: Orders -> Customers sub-page
      const btnGotoCustomers = document.getElementById('btn-goto-customers');
      if (btnGotoCustomers) {
        btnGotoCustomers.addEventListener('click', () => {
          this.openSubPage('page-customers', 'Customers', 'Client Directory');
        });
      }

      // Back Button in Header
      const backBtn = document.getElementById('nav-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          this.goBackToOrdersTab();
        });
      }

      // Open Add Customer Modal
      const openModalBtn = document.getElementById('open-add-customer-modal');
      const emptyAddBtn = document.getElementById('empty-add-customer-btn');
      if (openModalBtn) openModalBtn.addEventListener('click', () => this.openAddCustomerModal());
      if (emptyAddBtn) emptyAddBtn.addEventListener('click', () => this.openAddCustomerModal());

      // Close Add Customer Modal
      const closeModalBtn = document.getElementById('close-customer-modal-btn');
      const cancelModalBtn = document.getElementById('cancel-customer-modal-btn');
      if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeAddCustomerModal());
      if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => this.closeAddCustomerModal());

      // Form Submit
      const form = document.getElementById('add-customer-form');
      if (form) {
        form.addEventListener('submit', (e) => this.handleCustomerSubmit(e));
      }

      // Search Customers Input
      const searchInput = document.getElementById('customer-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.filterCustomers(e.target.value);
        });
      }

      // Settings Modal
      const configBtn = document.getElementById('config-btn');
      const closeConfigBtn = document.getElementById('close-config-modal-btn');
      const configForm = document.getElementById('config-form');
      const resetConfigBtn = document.getElementById('reset-config-btn');

      if (configBtn) configBtn.addEventListener('click', () => this.openConfigModal());
      if (closeConfigBtn) closeConfigBtn.addEventListener('click', () => this.closeConfigModal());
      if (configForm) configForm.addEventListener('submit', (e) => this.saveConfigSettings(e));
      if (resetConfigBtn) resetConfigBtn.addEventListener('click', () => this.resetConfigSettings());
    }

    // ================= ROUTING & VIEWS =================
    switchTab(tabName) {
      this.currentTab = tabName;
      
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
          btn.classList.add('active', 'text-amber-500');
          btn.classList.remove('text-slate-400');
        } else {
          btn.classList.remove('active', 'text-amber-500');
          btn.classList.add('text-slate-400');
        }
      });

      document.querySelectorAll('.tab-view').forEach(el => el.classList.add('hidden'));
      const customersPage = document.getElementById('page-customers');
      if (customersPage) customersPage.classList.add('hidden');

      const backBtn = document.getElementById('nav-back-btn');
      if (backBtn) backBtn.classList.add('hidden');

      const targetView = document.getElementById(`tab-${tabName}`);
      if (targetView) targetView.classList.remove('hidden');

      const titleEl = document.getElementById('page-title');
      const subtitleEl = document.getElementById('page-subtitle');

      const titles = {
        orders: { title: '<span class="text-amber-500">🇨🇳</span> China Sourcing', subtitle: 'Orders & Trade Hub' },
        purchasing: { title: '<span class="text-blue-500">📦</span> Factory Purchasing', subtitle: '1688 / Taobao / Suppliers' },
        banking: { title: '<span class="text-emerald-500">🏦</span> Multi-Currency Bank', subtitle: 'RMB, USD, PKR Accounts' },
        shipping: { title: '<span class="text-indigo-500">🚢</span> Freight & Logistics', subtitle: 'Containers & Air Cargo' },
        reports: { title: '<span class="text-purple-500">📊</span> Accounting & Ledgers', subtitle: 'Financial Statements' }
      };

      if (titles[tabName]) {
        titleEl.innerHTML = titles[tabName].title;
        subtitleEl.textContent = titles[tabName].subtitle;
      }

      if (window.lucide) lucide.createIcons();
    }

    openSubPage(pageId, title, subtitle) {
      this.currentPage = pageId;

      document.querySelectorAll('.tab-view').forEach(el => el.classList.add('hidden'));
      
      const subPageEl = document.getElementById(pageId);
      if (subPageEl) subPageEl.classList.remove('hidden');

      const backBtn = document.getElementById('nav-back-btn');
      if (backBtn) backBtn.classList.remove('hidden');

      const titleEl = document.getElementById('page-title');
      const subtitleEl = document.getElementById('page-subtitle');
      if (titleEl) titleEl.textContent = title;
      if (subtitleEl) subtitleEl.textContent = subtitle;

      if (window.lucide) lucide.createIcons();
    }

    goBackToOrdersTab() {
      this.switchTab('orders');
    }

    // ================= CUSTOMER SERIAL ID GENERATOR =================
    getNextCustomerId() {
      const prefix = window.APP_CONFIG?.ID_PREFIX || 'CUST-';
      
      if (!this.customers || this.customers.length === 0) {
        return `${prefix}0001`;
      }

      const nums = this.customers.map(c => {
        const code = c.customer_code || c.id || '';
        const match = code.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      });

      const maxNum = Math.max(0, ...nums);
      const nextNum = maxNum + 1;
      return `${prefix}${String(nextNum).padStart(4, '0')}`;
    }

    // ================= DATA LOADING =================
    async loadCustomers() {
      if (this.isSupabaseConnected && this.supabase) {
        try {
          const { data, error } = await this.supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          this.customers = data || [];
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to localStorage:', err);
          this.loadLocalCustomers();
        }
      } else {
        this.loadLocalCustomers();
      }

      this.renderCustomerList(this.customers);
      this.updateStats();
    }

    loadLocalCustomers() {
      try {
        const local = localStorage.getItem('china_sourcing_customers');
        if (local) {
          this.customers = JSON.parse(local);
        } else {
          this.customers = [
            {
              id: 'local-1',
              customer_code: 'CUST-0001',
              name: 'Silk Road Imports LLC',
              mobile: '+92 300 8472910',
              email: 'procurement@silkroadimports.com',
              address: 'Shop 42, Shah Alam Market, Lahore, Pakistan',
              created_at: new Date().toISOString()
            }
          ];
          this.saveLocalCustomers();
        }
      } catch (e) {
        this.customers = [];
      }
    }

    saveLocalCustomers() {
      try {
        localStorage.setItem('china_sourcing_customers', JSON.stringify(this.customers));
      } catch (e) {
        console.error('Failed to save to local storage', e);
      }
    }

    // ================= MODAL CONTROLS =================
    openAddCustomerModal() {
      const modal = document.getElementById('add-customer-modal');
      const idPreview = document.getElementById('preview-customer-id');
      const form = document.getElementById('add-customer-form');

      if (form) form.reset();
      const nextId = this.getNextCustomerId();
      if (idPreview) idPreview.textContent = nextId;

      if (modal) modal.classList.add('modal-active');
      if (window.lucide) lucide.createIcons();
    }

    closeAddCustomerModal() {
      const modal = document.getElementById('add-customer-modal');
      if (modal) modal.classList.remove('modal-active');
    }

    // ================= SUBMIT CUSTOMER =================
    async handleCustomerSubmit(e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById('save-customer-btn');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Saving...</span>`;
      }

      const name = document.getElementById('cust-name').value.trim();
      const mobile = document.getElementById('cust-mobile').value.trim();
      const email = document.getElementById('cust-email').value.trim();
      const address = document.getElementById('cust-address').value.trim();
      const customer_code = this.getNextCustomerId();

      const newCustomerPayload = {
        customer_code,
        name,
        mobile,
        email: email || null,
        address: address || null,
        created_at: new Date().toISOString()
      };

      try {
        if (this.isSupabaseConnected && this.supabase) {
          const { data, error } = await this.supabase
            .from('customers')
            .insert([newCustomerPayload])
            .select();

          if (error) throw error;
          
          const savedCustomer = (data && data[0]) ? data[0] : newCustomerPayload;
          this.customers.unshift(savedCustomer);
        } else {
          newCustomerPayload.id = 'local_' + Date.now();
          this.customers.unshift(newCustomerPayload);
          this.saveLocalCustomers();
        }

        this.showToast(`Customer ${customer_code} added successfully!`, 'success');
        this.closeAddCustomerModal();
        this.renderCustomerList(this.customers);
        this.updateStats();

      } catch (err) {
        console.error('Error adding customer:', err);
        this.showToast(`Failed: ${err.message || 'Check database connection'}`, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          if (window.lucide) lucide.createIcons();
        }
      }
    }

    // ================= RENDER LIST =================
    renderCustomerList(list) {
      const container = document.getElementById('customers-list-container');
      const emptyState = document.getElementById('customers-empty-state');
      const countEl = document.getElementById('customer-list-count');

      if (!container) return;

      if (countEl) {
        countEl.textContent = `${list.length} Customer${list.length === 1 ? '' : 's'}`;
      }

      if (!list || list.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');

      container.innerHTML = list.map(c => {
        const code = c.customer_code || 'CUST-XXXX';
        const formattedDate = c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';
        const cleanMobile = c.mobile ? c.mobile.replace(/[^\d+]/g, '') : '';

        return `
          <div class="bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-4 transition shadow-sm space-y-2.5">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-2.5">
                <div class="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/20">
                  ${this.getInitials(c.name)}
                </div>
                <div>
                  <h4 class="font-bold text-white text-base leading-tight">${this.escapeHtml(c.name)}</h4>
                  <div class="flex items-center space-x-2 mt-0.5">
                    <span class="font-mono text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">${code}</span>
                    <span class="text-[10px] text-slate-400">${formattedDate}</span>
                  </div>
                </div>
              </div>
              
              <button onclick="app.copyText('${code}', 'Customer ID${code}')" class="p-1.5 rounded-lg bg-slate-750 text-slate-400 hover:text-white transition" title="Copy ID">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <div class="space-y-1 text-xs text-slate-300 pt-1 border-t border-slate-750/70">
              <div class="flex items-center justify-between py-0.5">
                <span class="text-slate-400 flex items-center gap-1.5">
                  <i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i>
                  ${this.escapeHtml(c.mobile)}
                </span>
                <div class="flex items-center space-x-1">
                  <a href="tel:${cleanMobile}" class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-medium hover:bg-blue-500 hover:text-white transition">Call</a>
                  <a href="https://wa.me/${cleanMobile.replace('+', '')}" target="_blank" class="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-medium hover:bg-emerald-500 hover:text-white transition">WhatsApp</a>
                </div>
              </div>

              ${c.email ? `
                <div class="flex items-center space-x-1.5 text-slate-300 py-0.5">
                  <i data-lucide="mail" class="w-3.5 h-3.5 text-slate-400 flex-shrink-0"></i>
                  <a href="mailto:${this.escapeHtml(c.email)}" class="hover:underline truncate">${this.escapeHtml(c.email)}</a>
                </div>
              ` : ''}

              ${c.address ? `
                <div class="flex items-start space-x-1.5 text-slate-300 py-0.5">
                  <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5"></i>
                  <span class="text-slate-300">${this.escapeHtml(c.address)}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) lucide.createIcons();
    }

    filterCustomers(query) {
      if (!query || !query.trim()) {
        this.renderCustomerList(this.customers);
        return;
      }

      const q = query.toLowerCase().trim();
      const filtered = this.customers.filter(c => {
        return (c.name && c.name.toLowerCase().includes(q)) ||
               (c.customer_code && c.customer_code.toLowerCase().includes(q)) ||
               (c.mobile && c.mobile.includes(q)) ||
               (c.email && c.email.toLowerCase().includes(q)) ||
               (c.address && c.address.toLowerCase().includes(q));
      });

      this.renderCustomerList(filtered);
    }

    // ================= STATS & UTILS =================
    updateStats() {
      const total = this.customers ? this.customers.length : 0;
      const statOrders = document.getElementById('orders-customer-count');
      const statActive = document.getElementById('stat-active-customers');

      if (statOrders) statOrders.textContent = `${total} Client${total === 1 ? '' : 's'}`;
      if (statActive) statActive.textContent = `${total}`;
    }

    getInitials(name) {
      if (!name) return 'C';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    copyText(text, label = 'Copied') {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast(`${label} copied to clipboard!`, 'info');
        });
      } else {
        this.showToast(text, 'info');
      }
    }

    showPlaceholder(feature, desc) {
      this.showToast(`${feature}:${desc}`, 'info');
    }

    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      const colors = {
        success: 'bg-emerald-600 text-white border-emerald-400/40',
        error: 'bg-rose-600 text-white border-rose-400/40',
        info: 'bg-slate-800 text-amber-300 border-amber-500/40'
      };

      toast.className = `p-3 rounded-xl border shadow-xl text-xs font-medium flex items-center justify-between space-x-2 animate-bounce transition-all pointer-events-auto ${colors[type] || colors.info}`;
      toast.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>${this.escapeHtml(message)}</span>
        </div>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    // ================= CONFIG MODAL =================
    openConfigModal() {
      const modal = document.getElementById('config-modal');
      const urlInput = document.getElementById('cfg-supabase-url');
      const keyInput = document.getElementById('cfg-supabase-key');

      if (urlInput) urlInput.value = localStorage.getItem('SB_URL') || window.APP_CONFIG?.SUPABASE_URL || '';
      if (keyInput) keyInput.value = localStorage.getItem('SB_KEY') || window.APP_CONFIG?.SUPABASE_ANON_KEY || '';

      if (modal) modal.classList.add('modal-active');
      if (window.lucide) lucide.createIcons();
    }

    closeConfigModal() {
      const modal = document.getElementById('config-modal');
      if (modal) modal.classList.remove('modal-active');
    }

    saveConfigSettings(e) {
      e.preventDefault();
      const url = document.getElementById('cfg-supabase-url').value.trim();
      const key = document.getElementById('cfg-supabase-key').value.trim();

      localStorage.setItem('SB_URL', url);
      localStorage.setItem('SB_KEY', key);

      window.APP_CONFIG.SUPABASE_URL = url;
      window.APP_CONFIG.SUPABASE_ANON_KEY = key;

      this.initSupabase();
      this.closeConfigModal();
      this.loadCustomers();
      this.showToast('Supabase connected!', 'success');
    }

    resetConfigSettings() {
      localStorage.removeItem('SB_URL');
      localStorage.removeItem('SB_KEY');
      window.APP_CONFIG.SUPABASE_URL = '';
      window.APP_CONFIG.SUPABASE_ANON_KEY = '';

      const urlInput = document.getElementById('cfg-supabase-url');
      const keyInput = document.getElementById('cfg-supabase-key');
      if (urlInput) urlInput.value = '';
      if (keyInput) keyInput.value = '';

      this.initSupabase();
      this.showToast('Reverted to Local Storage mode.', 'info');
    }
  }

  // Bootstrap App
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new SourcingApp();
  });
})();