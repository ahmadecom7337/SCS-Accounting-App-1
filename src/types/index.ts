export type TabType = 'orders' | 'purchasing' | 'banking' | 'shipping' | 'reports';

export type OrdersSubPage = 'hub' | 'customers' | 'orders_list' | 'products' | 'services';

export interface Customer {
  id?: string;
  customer_id: string; // Serial generated e.g. 'CUST-0001'
  name: string;
  phone: string;
  email: string;
  address: string;
  company?: string;
  wechat?: string;
  preferred_currency?: string;
  status?: 'active' | 'inactive' | 'vip' | 'lead';
  total_spent?: number;
  orders_count?: number;
  notes?: string;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  sku: string;
  product_name: string;
  quantity: number;
  unit_factory_cny: number;
  unit_price_usd: number;
  total_usd: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  order_date: string;
  status: 'Draft' | 'Confirmed' | 'Factory Production' | 'Quality Inspected' | 'Customs Cleared' | 'In Transit' | 'Delivered' | 'Cancelled';
  currency: string;
  total_amount_usd: number;
  factory_cost_cny: number;
  sourcing_commission_usd: number;
  paid_amount_usd: number;
  items: OrderItem[];
  shipping_terms: string;
  notes?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  factory_cost_cny: number;
  selling_price_usd: number;
  moq: number;
  cbm: number;
  hs_code?: string;
  supplier_name: string;
  image_url?: string;
}

export interface SourcingService {
  id: string;
  service_code: string;
  name: string;
  category: 'Commission' | 'Quality Inspection' | 'Sample Sourcing' | 'Customs/Freight' | 'Factory Audit';
  fee_type: 'percentage' | 'fixed';
  rate: number;
  description: string;
}

export interface Supplier {
  id: string;
  supplier_code: string;
  factory_name: string;
  contact_person: string;
  phone: string;
  wechat_id?: string;
  province_city: string;
  main_products: string;
  rating: number;
  active_pos: number;
}

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  currency: 'USD' | 'CNY' | 'EUR' | 'HKD';
  balance: number;
  bank_name: string;
  account_type: string;
}

export interface Shipment {
  id: string;
  shipment_no: string;
  order_number: string;
  carrier: string;
  freight_type: 'Sea FCL' | 'Sea LCL' | 'Air Cargo' | 'Express DHL';
  origin_port: string;
  destination_port: string;
  container_no?: string;
  bill_of_lading?: string;
  etd: string;
  eta: string;
  status: 'Booking Confirmed' | 'Container Loading' | 'Customs Export' | 'On Vessel / Flight' | 'Customs Import' | 'Out for Delivery' | 'Delivered';
  cbm: number;
  weight_kg: number;
  shipping_cost_usd: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
