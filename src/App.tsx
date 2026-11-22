import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SupportPage } from './pages/SupportPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages (Bảo Mật: /admin270906)
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminPCBRequestsPage } from './pages/admin/AdminPCBRequestsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin270906');
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8]">
      {!isAdminRoute && <Navbar onOpenLookup={() => setIsLookupOpen(true)} />}

      <div className="flex-1">
        <Routes>
          {/* Public Store & PCB Routes */}
          <Route path="/" element={<HomePage onOpenLookup={() => setIsLookupOpen(true)} />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/pcb-services" element={<PCBServicesPage />} />
          
          {/* Dual PCB Fabrication & Assembly Routes */}
          <Route path="/pcb-quote" element={<PCBQuotePage />} />
          <Route path="/pcb-assembly" element={<PCBQuotePage />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:code" element={<OrderSuccessPage />} />
          <Route path="/order-lookup" element={<OrderLookupPage />} />
          <Route path="/policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* CHE GIẤU HOÀN TOÀN /admin -> Tự động chuyển về trang chủ */}
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />

          {/* ADMIN PORTAL BẢO MẬT: /admin270906 */}
          <Route path="/admin270906" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin270906/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
          <Route path="/admin270906/pcb-requests" element={<AdminLayout><AdminPCBRequestsPage /></AdminLayout>} />
          <Route path="/admin270906/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
          <Route path="/admin270906/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />

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
