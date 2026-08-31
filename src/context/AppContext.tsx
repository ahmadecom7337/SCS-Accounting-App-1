import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TabType, OrdersSubPage, Customer, Order, Product, SourcingService, Supplier, BankAccount, Shipment, SupabaseConfig } from '../types';
import { initialOrders, initialProducts, initialServices, initialSuppliers, initialBankAccounts, initialShipments } from '../data/mockData';
import { fetchCustomersData, insertCustomerData, updateCustomerData, deleteCustomerData, generateNextCustomerId, getStoredSupabaseConfig, saveStoredSupabaseConfig, testSupabaseConnection } from '../lib/supabase';

interface AppContextType {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  ordersSubPage: OrdersSubPage;
  setOrdersSubPage: (page: OrdersSubPage) => void;
  
  // Data
  customers: Customer[];
  orders: Order[];
  products: Product[];
  services: SourcingService[];
  suppliers: Supplier[];
  bankAccounts: BankAccount[];
  shipments: Shipment[];
  
  // Loading & Sync
  isLoading: boolean;
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;
  
  // Customer Actions
  addCustomer: (customerData: Omit<Customer, 'id' | 'customer_id'> & { customer_id?: string }) => Promise<Customer>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  getNextCustomerId: () => string;
  
  // Modals & UI
  isAddCustomerOpen: boolean;
  setIsAddCustomerOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  
  // FX Rate helper
  fxRateUSDCNY: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [ordersSubPage, setOrdersSubPage] = useState<OrdersSubPage>('hub');
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [services, setServices] = useState<SourcingService[]>(initialServices);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getStoredSupabaseConfig());
  const [fxRateUSDCNY] = useState<number>(7.24);

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const custData = await fetchCustomersData();
      setCustomers(custData);
    } catch (e) {
      console.error('Failed to load customers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getNextCustomerId = (): string => {
    return generateNextCustomerId(customers);
  };

  const addCustomer = async (
    customerData: Omit<Customer, 'id' | 'customer_id'> & { customer_id?: string }
  ): Promise<Customer> => {
    const customer_id = customerData.customer_id || getNextCustomerId();
    const newCustomer: Customer = {
      ...customerData,
      customer_id,
      status: customerData.status || 'active',
      total_spent: customerData.total_spent || 0,
      orders_count: customerData.orders_count || 0,
      preferred_currency: customerData.preferred_currency || 'USD',
      created_at: new Date().toISOString(),
    };

    const saved = await insertCustomerData(newCustomer);
    setCustomers(prev => [...prev, saved]);
    return saved;
  };

  const updateCustomer = async (customer: Customer): Promise<void> => {
    await updateCustomerData(customer);
    setCustomers(prev => prev.map(c => (c.customer_id === customer.customer_id ? customer : c)));
  };

  const deleteCustomer = async (customerId: string): Promise<void> => {
    await deleteCustomerData(customerId);
    setCustomers(prev => prev.filter(c => c.customer_id !== customerId));
  };

  const updateSupabaseConfig = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
    const testResult = await testSupabaseConnection(url, key);
    if (testResult.success) {
      saveStoredSupabaseConfig(url, key);
      setSupabaseConfig({ url, anonKey: key, isConnected: true });
      await refreshData();
    }
    return testResult;
  };

  const handleSetActiveTab = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        ordersSubPage,
        setOrdersSubPage,
        customers,
        orders,
        products,
        services,
        suppliers,
        bankAccounts,
        shipments,
        isLoading,
        supabaseConfig,
        updateSupabaseConfig,
        refreshData,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getNextCustomerId,
        isAddCustomerOpen,
        setIsAddCustomerOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        selectedCustomer,
        setSelectedCustomer,
        fxRateUSDCNY,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
