import React, { useState, useEffect } from 'react';
import { X, Crown, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const AuthModal = () => {
  const { isAuthOpen, closeAuth, authMode, setAuthMode, login, signup } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isAuthOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
      setSuccessMsg('');
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthOpen) {
        closeAuth();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isAuthOpen]);

  if (!isAuthOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!formData.email || !formData.password) {
    setError('Please fill in all required fields.');
    return;
  }

  if (authMode === 'signup') {
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  }

  try {
    if (authMode === 'signup') {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
    } else {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
    }
  } catch (error) {
    setError(error.message || 'Authentication failed. Please try again.');
  }
};


  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-md bg-[#0d0d0d] border border-white/15 shadow-2xl p-8 overflow-hidden text-white">
        {/* Subtle decorative background aura */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#b8860b]/10 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={closeAuth}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="font-serif text-2xl tracking-[0.3em] uppercase">Saarte</span>
            <Crown size={18} className="text-[#b8860b]" />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40">
            {authMode === 'login' ? 'Royale Member Sign In' : 'Exclusive Membership'}
          </p>
        </div>

        {/* Tabs for Sign In vs Sign Up */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => {
              setAuthMode('login');
              setError('');
            }}
            className={`flex-1 py-3 text-xs tracking-[0.2em] uppercase font-serif transition-all duration-200 cursor-pointer ${
              authMode === 'login'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setError('');
            }}
            className={`flex-1 py-3 text-xs tracking-[0.2em] uppercase font-serif transition-all duration-200 cursor-pointer ${
              authMode === 'signup'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success message */}
        {error && (
          <div className="mb-5 p-3 bg-red-950/60 border border-red-500/30 text-red-200 text-xs tracking-wide">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3.5 text-white/40" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Saud Makandar"
                  className="w-full bg-white/5 border border-white/15 focus:border-white py-3 pl-10 pr-4 text-xs tracking-wider text-white placeholder-white/25 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-white/40" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/15 focus:border-white py-3 pl-10 pr-4 text-xs tracking-wider text-white placeholder-white/25 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/15 focus:border-white py-3 pl-10 pr-10 text-xs tracking-wider text-white placeholder-white/25 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {authMode === 'signup' && (
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/15 focus:border-white py-3 pl-10 pr-4 text-xs tracking-wider text-white placeholder-white/25 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {authMode === 'login' && (
            <div className="flex items-center justify-between text-[11px] text-white/50 pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white/80">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-white/20 accent-[#b8860b]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setError('Password reset link sent to registered email.')}
                className="hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3.5 bg-white text-black hover:bg-[#b8860b] hover:text-white font-serif text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300 cursor-pointer shadow-lg"
          >
            {authMode === 'login' ? 'Sign In to Saarte' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
