import React, { useEffect } from 'react';

export default function NotificationToast({ type = 'error', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      iconBg: 'bg-rose-500 text-white',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      ),
      label: 'Validation Error',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      iconBg: 'bg-amber-500 text-white',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      label: 'Reminder',
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      iconBg: 'bg-emerald-500 text-white',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      ),
      label: 'Success',
    },
  }[type] || styles.error;

  return (
    <aside
      aria-label="Notification Alert"
      className="fixed top-5 right-5 z-50 max-w-sm w-full animate-bounce-short transition duration-300"
    >
      <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${styles.bg}`}>
        <div className={`p-1.5 rounded-xl shrink-0 ${styles.iconBg}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {styles.icon}
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider">{styles.label}</p>
          <p className="text-xs mt-0.5 leading-relaxed font-medium">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition p-1 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}