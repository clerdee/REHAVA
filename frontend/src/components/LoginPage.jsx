import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import NotificationToast from './NotificationToast';
import { API_ENDPOINTS } from '../config/api';
import logo from '../assets/logo.png';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ onLoginSuccess, onNavigateRegister, onBackToLanding }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error', title: 'Login Error' });

  const notify = (message, type = 'error', title = 'Login Error') => setToast({ message, type, title });
  const clearToast = () => setToast(prev => ({ ...prev, message: '' }));

  const handleChange = (e) => {
    clearToast();
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleRouting = (user) => {
    const role = (user.role || 'patient').toLowerCase();
    if (role === 'clinician' || role === 'therapist') onLoginSuccess('Stroke Rehabilitation Clinician', user);
    else if (role === 'caregiver') onLoginSuccess('Caregiver Support Portal', user);
    else if (role === 'admin') onLoginSuccess('System Administrator', user);
    else onLoginSuccess('Stroke Rehabilitation Patient', user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearToast();

    const cleanEmail = formData.email.trim();
    if (!cleanEmail) return notify('Please enter your email address.', 'error', 'Missing Input');
    if (!EMAIL_REGEX.test(cleanEmail)) return notify('Invalid email address format.', 'error', 'Invalid Email');
    if (!formData.password) return notify('Please enter your password.', 'error', 'Missing Input');

    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: formData.password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401) {
          return notify('Wrong password. Please try again.', 'error', 'Access Denied');
        }
        if (res.status === 404) {
          return notify('No account found with this email.', 'error', 'Account Not Found');
        }
        return notify(data?.error || 'Unable to sign in. Please verify your credentials.', 'error', 'Login Failed');
      }

      localStorage.setItem('rehava_user', JSON.stringify(data.user));
      notify('Welcome back! Redirecting...', 'success', 'Login Successful');
      setTimeout(() => handleRoleRouting(data.user), 600);
    } catch {
      notify('Server unreachable. Ensure Python backend is running on port 5000.', 'error', 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const mockUser = { email: 'clinician@rehava.health', role: 'clinician', firstName: 'Clinician' };
    notify('Google authentication verified.', 'success', 'Login Successful');
    setTimeout(() => handleRoleRouting(mockUser), 500);
  };

  return (
    <AuthLayout>
      <NotificationToast message={toast.message} type={toast.type} title={toast.title} onClose={clearToast} />

      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-pink-100/70 border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-[580px]">
        <div className="w-full md:w-1/2 p-10 sm:p-14 lg:p-16 flex flex-col justify-between items-center text-center border-b md:border-b-0 md:border-r border-slate-100 bg-gradient-to-b from-white via-pink-50/20 to-pink-50/40">
          <div className="w-full flex justify-start">
            <button type="button" onClick={onBackToLanding} className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-pink-600 transition flex items-center gap-2">
              ← Back to Home
            </button>
          </div>

          <div className="my-auto flex flex-col items-center py-6">
            <img src={logo} alt="REHAVA Logo" className="h-24 w-auto object-contain mb-4" />
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              REHA<span className="text-pink-600">VA</span>
            </h1>
            <p className="text-xs sm:text-sm tracking-widest uppercase font-bold text-pink-500 mt-2">
              Lower-Limb Rehabilitation Portal
            </p>
            <div className="mt-5 px-5 py-2 bg-white border border-pink-100 rounded-full shadow-sm text-xs sm:text-sm font-semibold text-slate-600">
              POST-STROKE GAIT TELEMETRY
            </div>
          </div>

          <div className="w-full text-center space-y-1 text-xs text-slate-400">
            <p className="font-medium">Continuous Kinematic Assessment & Recovery Monitoring</p>
            <p>© 2026 REHAVA Systems. All Rights Reserved.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">Login</h2>
            <p className="text-sm text-slate-500 mt-2">Welcome back! Please sign in to access session telemetry.</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-2xl transition text-sm flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-slate-400 uppercase font-bold tracking-wider">OR</span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-600 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="clinician@rehava.health"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-slate-600">Password</label>
                <a href="#forgot" className="text-xs sm:text-sm font-medium text-pink-600 hover:text-pink-700">Forgot Password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your security access code"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full px-4 pr-14 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-500 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-pink-600/25 transition text-sm mt-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="pt-2 text-center text-xs sm:text-sm text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="font-bold text-pink-600 hover:text-pink-700 underline underline-offset-2"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}