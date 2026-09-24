import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Catalog } from './pages/public/Catalog';
import { Categories } from './pages/public/Categories';
import { CategoryPage } from './pages/public/CategoryPage';
import { ProductDetail } from './pages/public/ProductDetail';
import { Projects } from './pages/public/Projects';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { NotFound } from './pages/public/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductList } from './pages/admin/ProductList';
import { ProductForm } from './pages/admin/ProductForm';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { HomepageCms } from './pages/admin/HomepageCms';
import { InquiryList } from './pages/admin/InquiryList';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { SiteSettingsPage } from './pages/admin/SiteSettingsPage';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <BrowserRouter>
            <Routes>
              {/* Public Storefront Layout */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="products" element={<Navigate to="/catalog" replace />} />
                <Route path="categories" element={<Categories />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="category/:slug/:subSlug" element={<CategoryPage />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="projects" element={<Projects />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Portal Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Console - Dedicated Catalog Backend */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/products" replace />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="catalog" element={<Navigate to="/admin/products" replace />} />
                <Route path="dashboard" element={<Navigate to="/admin/products" replace />} />
                <Route path="*" element={<Navigate to="/admin/products" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SettingsProvider>
    </ToastProvider>
  </ErrorBoundary>
  );
}

export default App;
