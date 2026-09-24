import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { LHLogo } from '../../components/common/LHLogo';

export const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both administrative email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/products', { replace: true });
      } else {
        setErrorMsg(res.message || 'Authentication rejected.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@lighthut.com');
    setPassword('admin123456');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#090a0d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#DC2626]/10 blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#14171d] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LHLogo className="h-12 w-auto" />
          </div>
          <span className="text-[10px] uppercase tracking-luxury text-[#DC2626] font-semibold block mb-1">
            Administrative Console
          </span>
          <h1 className="text-2xl font-serif-luxury font-bold text-white tracking-tight">
            {settings.companyName || 'LightHut'} Control Center
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Sign in to manage the product catalog
          </p>
        </div>

        {/* Quick Fill Credentials Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-neutral-300">
          <div className="text-left font-mono text-[11px]">
            <div className="text-neutral-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Admin Credentials:</span>
            </div>
            <div className="mt-0.5">
              <span className="text-[#DC2626] font-semibold">admin@lighthut.com</span>{' '}
              <span className="text-neutral-500">/</span>{' '}
              <span className="text-neutral-300 font-semibold">admin123456</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-3 py-1.5 rounded-lg bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all text-[10px] font-semibold tracking-wider uppercase shrink-0 shadow-sm"
          >
            Quick Fill
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-200 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lighthut.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090a0d] border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#DC2626] text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-luxury text-neutral-400 mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090a0d] border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#DC2626] text-sm transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-luxury flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  <span>Sign In To Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Encrypted with bcrypt & HTTP-only JWT sessions</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
