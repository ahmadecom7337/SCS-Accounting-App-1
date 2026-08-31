import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Customer, Order, Product, SourcingService, Supplier, BankAccount, Shipment, SupabaseConfig } from '../types';
import { initialCustomers, initialOrders, initialProducts, initialServices, initialSuppliers, initialBankAccounts, initialShipments } from '../data/mockData';

const DEFAULT_SUPABASE_URL = 'https://lryywkmlcgptpcvbazsu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeXl3a21sY2dwdHBjdmJhenN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwOTAyMzIsImV4cCI6MjEwMzY2NjIzMn0.FbhhFLY3CfOGzUuFDRJbCc_j_knqC2oLMq_p201zcyk';

const SUPABASE_URL_KEY = 'cs_accounting_supabase_url';
const SUPABASE_ANON_KEY_KEY = 'cs_accounting_supabase_anon_key';

export function getStoredSupabaseConfig(): SupabaseConfig {
  const url = localStorage.getItem(SUPABASE_URL_KEY) || (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = localStorage.getItem(SUPABASE_ANON_KEY_KEY) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  return {
    url,
    anonKey,
    isConnected: Boolean(url && anonKey),
  };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_ANON_KEY_KEY, anonKey.trim());
  supabaseInstance = null;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  const config = getStoredSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
      return supabaseInstance;
    } catch (err) {
      console.error('Failed to init Supabase client:', err);
      return null;
    }
  }
  return null;
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, anonKey);
    const { error } = await testClient.from('customers').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return { success: true, message: 'Connected to Supabase! (Note: tables not created yet).' };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected to SCS Accounting Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

const STORAGE_KEYS = {
  CUSTOMERS: 'cs_accounting_customers',
  ORDERS: 'cs_accounting_orders',
  PRODUCTS: 'cs_accounting_products',
  SERVICES: 'cs_accounting_services',
  SUPPLIERS: 'cs_accounting_suppliers',
  BANK_ACCOUNTS: 'cs_accounting_bank_accounts',
  SHIPMENTS: 'cs_accounting_shipments',
};

export async function fetchCustomersData(): Promise<Customer[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          ...d,
          customer_id: d.customer_id || d.customer_code || `CUST-0001`,
          phone: d.phone || d.mobile || '',
        }));
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mapped));
        return mapped as Customer[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
  return initialCustomers;
}

export async function insertCustomerData(customer: Customer): Promise<Customer> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const payload: any = {
        customer_id: customer.customer_id,
        customer_code: customer.customer_id,
        name: customer.name,
        phone: customer.phone,
        mobile: customer.phone,
        email: customer.email,
        address: customer.address,
        company: customer.company || null,
        wechat: customer.wechat || null,
        preferred_currency: customer.preferred_currency || 'USD',
        status: customer.status || 'active',
        total_spent: customer.total_spent || 0,
        orders_count: customer.orders_count || 0,
        notes: customer.notes || null,
      };

      const { data, error } = await supabase.from('customers').insert([payload]).select().single();
      if (!error && data) {
        return {
          ...data,
          customer_id: data.customer_id || data.customer_code,
          phone: data.phone || data.mobile,
        } as Customer;
      }
      console.warn('Supabase insert returned error:', error);
    } catch (e) {
      console.warn('Supabase insert error, saving locally:', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  const list: Customer[] = stored ? JSON.parse(stored) : [...initialCustomers];
  list.push(customer);
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
  return customer;
}

export async function updateCustomerData(customer: Customer): Promise<Customer> {
  const supabase = getSupabase();
  if (supabase && customer.customer_id) {
    try {
      const payload: any = {
        name: customer.name,
        phone: customer.phone,
        mobile: customer.phone,
        email: customer.email,
        address: customer.address,
        company: customer.company || null,
        wechat: customer.wechat || null,
      };
      await supabase.from('customers').update(payload).or(`customer_id.eq.${customer.customer_id},customer_code.eq.${customer.customer_id}`);
    } catch (e) {
      console.warn('Supabase update error:', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  if (stored) {
    const list: Customer[] = JSON.parse(stored);
    const index = list.findIndex(c => c.customer_id === customer.customer_id);
    if (index !== -1) {
      list[index] = customer;
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
    }
  }
  return customer;
}

export async function deleteCustomerData(customerId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('customers').delete().or(`customer_id.eq.${customerId},customer_code.eq.${customerId}`);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  if (stored) {
    const list: Customer[] = JSON.parse(stored);
    const updated = list.filter(c => c.customer_id !== customerId);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
  }
  return true;
}

export function generateNextCustomerId(existingCustomers: Customer[]): string {
  let highestNum = 0;
  existingCustomers.forEach(c => {
    const idStr = c.customer_id || (c as any).customer_code || '';
    if (idStr) {
      const match = idStr.match(/(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > highestNum) {
          highestNum = num;
        }
      }
    }
  });

  const nextNum = highestNum + 1;
  const padded = String(nextNum).padStart(4, '0');
  return `CUST-${padded}`;
}
