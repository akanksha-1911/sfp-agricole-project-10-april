import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { ProductProvider } from '../contexts/ProductContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp, ScrollToTop } from './components/shared';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { AuthPages } from '../pages/AuthPages';
import { AboutPage, ContactPage, WishlistPage, FAQPage, TermsPage, PrivacyPage, RefundPage } from '../pages/OtherPages';
import { AdminPanel } from '../pages/AdminPanel';
import { ProfilePage } from '../pages/ProfilePage';
import { EnquiriesPage } from '../pages/EnquiriesPage';

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<string>('');

  const navigate = (page: string) => {
    // Handle page with params (e.g., "product/123")
    const parts = page.split('/');
    if (parts.length > 1) {
      setCurrentPage(parts[0]);
      setPageParams(parts[1]);
    } else if (page.includes('?')) {
      const [pageName, params] = page.split('?');
      setCurrentPage(pageName);
      setPageParams(params);
    } else {
      setCurrentPage(page);
      setPageParams('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render the appropriate page based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'products':
        return <ProductsPage onNavigate={navigate} searchQuery={pageParams.replace('search=', '')} />;
      case 'product':
        return <ProductDetailPage productId={pageParams} onNavigate={navigate} />;
      case 'cart':
        return <CartPage onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigate} />;
      case 'wishlist':
        return <WishlistPage onNavigate={navigate} />;
      case 'login':
      case 'signup':
        return <AuthPages onNavigate={navigate} initialTab={currentPage as 'login' | 'signup'} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'enquiries':
        return <EnquiriesPage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} />;
      case 'faq':
        return <FAQPage onNavigate={navigate} />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'refund':
        return <RefundPage />;
      case 'admin':
        return <AdminPanel onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-white">
              {/* Only show header and footer on non-auth pages */}
              {currentPage !== 'login' && currentPage !== 'signup' && (
                <Header onNavigate={navigate} currentPage={currentPage} />
              )}
              
              <main className="flex-1">
                {renderPage()}
              </main>
              
              {currentPage !== 'login' && currentPage !== 'signup' && (
                <Footer onNavigate={navigate} />
              )}
              
              <Toaster position="top-right" richColors />
              <FloatingWhatsApp />
              <ScrollToTop />
            </div>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}