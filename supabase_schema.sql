-- ==============================================================================
-- Supabase Schema for China Sourcing Mobile Accounting ERP
-- Run this SQL in your Supabase project's SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

create extension if not exists "uuid-ossp";

-- Sequence for Serial Customer IDs
create sequence if not exists customer_serial_seq start 1;

-- CUSTOMERS TABLE
create table if not exists public.customers (
    id uuid primary key default uuid_generate_v4(),
    customer_id text unique not null, -- e.g. 'CUST-0001'
    customer_code text,
    name text not null,
    phone text not null,
    mobile text,
    email text not null,
    address text not null,
    company text,
    wechat text,
    preferred_currency text default 'USD',
    status text default 'active' check (status in ('active', 'inactive', 'vip', 'lead')),
    total_spent numeric(15, 2) default 0.00,
    orders_count integer default 0,
    notes text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_customers_search on public.customers (customer_id, name, phone, email);

-- PRODUCTS CATALOG TABLE (Sourced items in China)
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    sku text unique not null,
    name text not null,
    category text default 'General',
    factory_cost_cny numeric(12, 2) default 0.00,
    selling_price_usd numeric(12, 2) default 0.00,
    moq integer default 100,
    cbm numeric(8, 4) default 0.0000,
    hs_code text,
    supplier_name text,
    image_url text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- SOURCING SERVICES TABLE
create table if not exists public.services (
    id uuid primary key default uuid_generate_v4(),
    service_code text unique not null,
    name text not null,
    category text default 'Commission',
    fee_type text default 'percentage',
    rate numeric(10, 2) default 5.00,
    description text,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ORDERS TABLE
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text unique not null,
    customer_id text references public.customers(customer_id) on update cascade on delete set null,
    customer_name text not null,
    order_date date default current_date,
    status text default 'Draft',
    currency text default 'USD',
    total_amount_usd numeric(15, 2) default 0.00,
    factory_cost_cny numeric(15, 2) default 0.00,
    sourcing_commission_usd numeric(15, 2) default 0.00,
    paid_amount_usd numeric(15, 2) default 0.00,
    items jsonb default '[]'::jsonb,
    shipping_terms text default 'FOB Ningbo',
    notes text,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- SUPPLIERS & FACTORIES TABLE (China Vendors)
create table if not exists public.suppliers (
    id uuid primary key default uuid_generate_v4(),
    supplier_code text unique not null,
    factory_name text not null,
    contact_person text,
    phone text,
    wechat_id text,
    province_city text,
    main_products text,
    bank_details_cny text,
    rating numeric(3, 1) default 5.0,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- BANK ACCOUNTS & FX WALLETS TABLE
create table if not exists public.bank_accounts (
    id uuid primary key default uuid_generate_v4(),
    account_name text not null,
    account_number text not null,
    currency text not null check (currency in ('USD', 'CNY', 'EUR', 'HKD')),
    balance numeric(15, 2) default 0.00,
    bank_name text not null,
    account_type text default 'Business Checking',
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- SHIPMENTS / LOGISTICS TABLE
create table if not exists public.shipments (
    id uuid primary key default uuid_generate_v4(),
    shipment_no text unique not null,
    order_number text,
    carrier text,
    freight_type text default 'Sea FCL',
    origin_port text default 'Ningbo Port',
    destination_port text not null,
    container_no text,
    bill_of_lading text,
    etd date,
    eta date,
    status text default 'Port Departure',
    cbm numeric(8, 2) default 0.00,
    weight_kg numeric(10, 2) default 0.00,
    shipping_cost_usd numeric(12, 2) default 0.00,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.suppliers enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.shipments enable row level security;
