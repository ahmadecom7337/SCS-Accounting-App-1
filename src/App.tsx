import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileContainer } from './components/layout/MobileContainer';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { OrdersTab } from './components/tabs/OrdersTab';
import { PurchasingTab } from './components/tabs/PurchasingTab';
import { BankingTab } from './components/tabs/BankingTab';
import { ShippingTab } from './components/tabs/ShippingTab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { AddCustomerModal } from './components/pages/AddCustomerModal';
import { CustomerDetailModal } from './components/pages/CustomerDetailModal';
import { SupabaseSettingsModal } from './components/modals/SupabaseSettingsModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTab />;
      case 'purchasing':
        return <PurchasingTab />;
      case 'banking':
        return <BankingTab />;
      case 'shipping':
        return <ShippingTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <OrdersTab />;
    }
  };

  return (
    <MobileContainer>
      {/* Active Tab View */}
      {renderActiveTab()}

      {/* Persistent Bottom Tab Bar */}
      <BottomNavigation />

      {/* Global Modals */}
      <AddCustomerModal />
      <CustomerDetailModal />
      <SupabaseSettingsModal />
    </MobileContainer>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
