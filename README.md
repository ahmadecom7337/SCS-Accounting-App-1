# 🇨🇳 SCS Accounting App 1 - China Sourcing Mobile Accounting ERP

A mobile-only accounting and enterprise management application designed specifically for **China Sourcing Businesses, Trading Houses, and Sourcing Agents**.

Built with **React + TypeScript + Vite + Tailwind CSS + Lucide Icons** and seamlessly integrated with **Supabase PostgreSQL Backend** and **GitHub Pages Hosting**.

---

## 📱 Key Features & Structure

### 1. 5 Core Navigation Tabs
- **📋 Orders (订单)**: Sourcing hub with 4 quick-access modules:
  1. **👤 Customers (客户管理)**: Client directory, serial-wise auto-generated IDs (`CUST-0001`, `CUST-0002`...), one-tap Call/Email/WeChat actions, billing & destination shipping addresses.
  2. **📦 Orders (采购订单)**: Sourcing Purchase Orders, FOB USD client prices, RMB factory costs, commission margin breakdown.
  3. **🏷️ Products (产品目录)**: China factory SKU catalog, RMB unit costs, selling prices, MOQ, CBM, and HS Codes.
  4. **💼 Services (服务项目)**: Standard China tariff rates (Sourcing commission %, Pre-shipment AQL 2.5 inspection, sample consolidation, customs declaration).
- **🏭 Purchasing (采购)**: China factory supplier directory (Yiwu, Shenzhen, Ningbo, Zhongshan), supplier ratings, WeChat IDs, and RMB factory commitments.
- **💳 Banking (资金)**: Multi-currency wallets (USD $, CNY ¥, EUR €, HKD $), live USD/RMB exchange rate calculator (1 USD = ¥7.24), and factory remittance tracking.
- **🚢 Shipping (物流)**: Active Sea Freight (FCL/LCL), Air Cargo, Express DHL tracking, Bill of Lading, Container numbers, and China port status (Ningbo/Shanghai/Shenzhen).
- **📊 Reports (报表)**: Sourcing gross profit margins %, P&L, Accounts Receivable from overseas clients, and factory payouts in RMB.

---

## 🗄️ Supabase Database Architecture

The backend is connected to the **SCS Accounting App 1** Supabase project (`lryywkmlcgptpcvbazsu`):
- `customers`: Client directory with sequential serial codes (`customer_id` / `customer_code`), contact details, destination address, and total turnover.
- `orders`: Sourcing POs, client USD pricing, factory RMB expenses, and order status workflow.
- `products`: Sourced items, unit factory RMB costs, MOQ, CBM, and HS codes.
- `services`: Sourcing commissions, inspection tariffs, and factory audit rates.
- `suppliers`: Chinese factories in Yiwu, Shenzhen, Ningbo, and Zhongshan.
- `bank_accounts`: Multi-currency global settlement accounts.
- `shipments`: Sea & Air freight tracking.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build static production files
npm run build
```

---

## 🌐 GitHub Pages Deployment

To view your app live on GitHub Pages:
1. In this repository, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **Deploy from a branch** (select `main` and folder `/dist` or `/root`).
3. Or enable **GitHub Actions** workflow for automated static deployments.

---

## 📄 License
MIT License
