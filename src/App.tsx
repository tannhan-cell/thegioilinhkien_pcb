import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/shop/CartDrawer';
import { OrderLookupModal } from './components/pcb/OrderLookupModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PCBServicesPage } from './pages/PCBServicesPage';
import { PCBQuotePage } from './pages/PCBQuotePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderLookupPage } from './pages/OrderLookupPage';
import { PolicyPage } from './pages/PolicyPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminPCBRequestsPage } from './pages/admin/AdminPCBRequestsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {!isAdminRoute && <Navbar onOpenLookup={() => setIsLookupOpen(true)} />}

      <div className="flex-1">
        <Routes>
          {/* Public Store & PCB Routes */}
          <Route path="/" element={<HomePage onOpenLookup={() => setIsLookupOpen(true)} />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/pcb-services" element={<PCBServicesPage />} />
          <Route path="/pcb-quote" element={<PCBQuotePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:code" element={<OrderSuccessPage />} />
          <Route path="/order-lookup" element={<OrderLookupPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Management Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
          <Route path="/admin/pcb-requests" element={<AdminLayout><AdminPCBRequestsPage /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />

          {/* Fallback */}
          <Route path="*" element={<HomePage onOpenLookup={() => setIsLookupOpen(true)} />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Global Lookup Modal */}
      <OrderLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
