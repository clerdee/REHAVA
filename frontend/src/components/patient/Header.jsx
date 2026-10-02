import React, { useState, useRef, useEffect } from 'react';

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  onOpenAIInsights, 
  activeNav, 
  onViewPreviousNotifications 
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'exercise',
      title: 'Daily Exercise Target',
      message: 'Huwag kalimutan ang iyong Ankle Dorsiflexion pulls (3 sets × 12 reps) ngayong hapon.',
      time: '15m ago',
      unread: true
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Session Confirmed',
      message: 'Kinumpirma ni Ms. Christine Joy Cabardo, PTRP ang iyong Parallel Bar assessment bukas ng 9:30 AM.',
      time: '2h ago',
      unread: true
    },
    {
      id: 3,
      type: 'hardware',
      title: 'Hardware Link Ready',
      message: 'Naka-pair ang ESP32 Insole Node. 94% ang battery level.',
      time: '1d ago',
      unread: false
    }
  ]);

  const titles = {
    overview: 'Patient Overview',
    telemetry: 'Live Sensor Telemetry',
    exercises: 'Daily & Weekly Exercise Targets',
    sessions: 'Therapy Session History',
    appointments: 'Clinical Appointments',
    profile: 'Profile & Stroke Baseline',
    notifications: 'Notification History'
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const displayedNotifications = notifications.filter(item => {
    if (filterMode === 'unread') return item.unread;
    return true;
  });

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 select-none">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2.5 text-xs font-semibold">
        <span className="text-slate-400">Rehabilitation</span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-black text-slate-900 tracking-tight">
          {titles[activeNav] || 'Patient Overview'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Field */}
        <div className="relative w-72 hidden sm:block">
          <input
            type="text"
            placeholder="Search exercises, logs, metrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white transition shadow-2xs"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Notifications Icon Button & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-10 h-10 rounded-2xl border transition relative shadow-2xs flex items-center justify-center ${
              showNotifications 
                ? 'bg-pink-50 border-pink-300 text-pink-600' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-pink-600 hover:bg-white hover:border-pink-200'
            }`}
            title="Clinical Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-white absolute top-2 right-2 animate-pulse"></span>
            )}
          </button>

          {/* NOTIFICATION POPUP DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-4 px-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Header na may All / Unread Tabs at Mark All as Read */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1 rounded-lg transition ${
                      filterMode === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterMode('unread')}
                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                      filterMode === 'unread'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>Unread</span>
                    {unreadCount > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    )}
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-bold text-pink-600 hover:text-pink-700 transition"
                  >
                    Mark read
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto my-1">
                {displayedNotifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    {filterMode === 'unread' 
                      ? 'Walang unread notifications.' 
                      : 'Walang bagong notifications sa ngayon.'}
                  </div>
                ) : (
                  displayedNotifications.map((item) => (
                    <div 
                      key={item.id} 
                      className={`py-3 px-2 rounded-2xl transition flex items-start gap-3 hover:bg-slate-50 ${
                        item.unread ? 'bg-pink-50/30' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 text-sm mt-0.5">
                        {item.type === 'exercise' && '🎯'}
                        {item.type === 'appointment' && '📅'}
                        {item.type === 'hardware' && '⚡'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                      </div>

                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-pink-500 mt-2 shrink-0"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer: "See Previous Notification" Button */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    if (onViewPreviousNotifications) {
                      onViewPreviousNotifications();
                    }
                  }}
                  className="w-full text-xs font-bold text-pink-600 hover:text-pink-700 py-1.5 rounded-xl hover:bg-pink-50/60 transition flex items-center justify-center gap-1.5"
                >
                  <span>See Previous Notifications</span>
                  <span>→</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* AI Insight Pill */}
        <button
          onClick={onOpenAIInsights}
          className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-extrabold text-[12.5px] px-4.5 py-2.5 rounded-2xl shadow-md shadow-pink-200 flex items-center gap-2 transition active:scale-95"
        >
          <span className="text-sm">✦</span>
          <span>Get AI Insight</span>
        </button>
      </div>
    </header>
  );
}