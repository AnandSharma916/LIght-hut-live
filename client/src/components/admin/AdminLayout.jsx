import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Sliders,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Plus,
  ShieldAlert,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { LHLogo } from '../common/LHLogo';

export const AdminLayout = () => {
  const { admin, isAuthenticated, loading, logout } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10] text-neutral-200">
        <div className="w-10 h-10 rounded-full border-2 border-[#DC2626] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Route protection
  if (!isAuthenticated) {
    // Redirect to login preserving intended URL
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a0d] p-4 text-center">
        <div className="max-w-md bg-[#14171d] border border-white/10 p-8 rounded-2xl shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-[#DC2626] mx-auto mb-4" />
          <h2 className="text-xl font-serif-luxury text-white font-bold mb-2">
            Authentication Required
          </h2>
          <p className="text-xs text-neutral-400 mb-6">
            The administrative management console is restricted to authenticated managers.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="btn-gold w-full py-2.5 rounded-lg text-xs font-semibold uppercase tracking-luxury"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Product Catalog', path: '/admin/products', icon: Package },
    { name: 'Add Product', path: '/admin/products/new', icon: Plus },
  ];

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/products/new')) return 'Add New Product';
    if (path.includes('/admin/products/edit')) return 'Edit Product';
    return 'Product Catalog';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-neutral-200 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f1117] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin/products" className="flex items-center gap-3 group">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.companyName || 'Lighting Studio'}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <LHLogo className="h-10 w-auto" />
              )}
              <div>
                <span className="font-serif-luxury text-sm font-bold text-white block tracking-wider group-hover:text-[#DC2626] transition-colors">
                  {settings.companyName || 'Lighting Studio'}
                </span>
                <span className="text-[9px] uppercase tracking-luxury text-[#DC2626] font-semibold block">
                  Console Admin
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-luxury transition-all ${
                      isActive
                        ? 'bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20 font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">↗</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Stage */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#111318]/90 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Logo in top header — visible on mobile when sidebar is closed */}
            <Link to="/admin/dashboard" className="flex items-center gap-2.5 lg:hidden">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.companyName || 'Lighting Studio'}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <LHLogo className="h-8 w-auto" />
              )}
              <span className="font-serif-luxury text-sm font-bold text-white tracking-wider">
                {settings.companyName || 'Lighting Studio'}
              </span>
            </Link>
            <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-semibold hidden sm:inline-block">
              {getHeaderTitle()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/products/new"
              className="btn-gold px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-luxury flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Catalog</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-4 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-[#DC2626]/20 border border-[#DC2626]/40 flex items-center justify-center text-xs font-bold text-[#DC2626]">
                {admin.name?.[0] || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-white block leading-tight">
                  {admin.name}
                </span>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  {admin.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
