import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { API_ENDPOINTS } from '../../config/api';

const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    )
  },
  {
    id: 'telemetry',
    label: 'Live Telemetry',
    live: true
  },
  {
    id: 'exercises',
    label: 'Exercise Targets',
    badge: '3 Daily',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" strokeWidth={2} />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </>
    )
  },
  {
    id: 'sessions',
    label: 'Session Logs',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    )
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    )
  },
  {
    id: 'profile',
    label: 'Profile & Baseline',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    )
  }
];

export default function Sidebar({
  activeNav,
  setActiveNav,
  onLaunchLiveTelemetry,
  user,
  onLogout
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const isExpanded = isPinned || isHovered;

  useEffect(() => {
    const cachedUser = JSON.parse(localStorage.getItem('rehava_user') || '{}');
    const targetUser = user || cachedUser;

    if (!targetUser?.email) return;

    fetch(`${API_ENDPOINTS.LOGIN.replace('/auth/login', '')}/auth/profile?email=${targetUser.email}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setProfileData(data);
      })
      .catch(() => {});
  }, [user]);

  const activeUser = profileData || user || JSON.parse(localStorage.getItem('rehava_user') || '{}');
  const displayName = activeUser?.firstName && activeUser?.lastName
    ? `${activeUser.firstName} ${activeUser.lastName}`
    : activeUser?.firstName || 'Patient User';
  const initial = displayName[0]?.toUpperCase() || 'P';
  const affectedSide = activeUser?.affectedSide
    ? `${activeUser.affectedSide.charAt(0).toUpperCase() + activeUser.affectedSide.slice(1)} Hemiparesis`
    : 'Lower-Limb Rehabilitation';

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem('rehava_user');
    localStorage.clear();
    if (onLogout) onLogout();
  };

  return (
    <>
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${
          isExpanded ? 'w-72 shadow-2xl ring-1 ring-slate-900/5' : 'w-20 shadow-xs'
        } bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 h-screen py-7 z-40 transition-all duration-300 ease-in-out select-none overflow-hidden`}
      >
        <div className="flex flex-col">
          <div className={`flex items-center ${isExpanded ? 'justify-between px-5' : 'justify-center'} mb-8 h-10`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center shadow-md shadow-pink-200 shrink-0">
                <img src={logo} alt="REHAVA" className="h-5 w-auto object-contain brightness-0 invert" />
              </div>
              {isExpanded && (
                <div className="flex flex-col leading-none animate-in fade-in duration-200">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    REHA<span className="text-pink-600">VA</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Patient Portal
                  </span>
                </div>
              )}
            </div>

            {isExpanded && (
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`p-1.5 rounded-xl text-xs transition ${
                  isPinned ? 'bg-pink-50 text-pink-600 font-extrabold' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isPinned ? 'Unlock Auto-collapse' : 'Pin Sidebar Open'}
              >
                {isPinned ? '📌' : '📍'}
              </button>
            )}
          </div>

          {isExpanded && (
            <div className="px-6 mb-2 animate-in fade-in duration-150">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Menu
              </span>
            </div>
          )}

          <nav className="space-y-1.5 px-3">
            {NAV_ITEMS.map(item => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'telemetry' && onLaunchLiveTelemetry) onLaunchLiveTelemetry();
                  }}
                  title={!isExpanded ? item.label : ''}
                  className={`w-full flex items-center ${
                    isExpanded ? 'justify-between px-4' : 'justify-center px-0'
                  } py-3.5 rounded-2xl text-[13.5px] font-bold transition-all duration-150 ${
                    item.live
                      ? isActive
                        ? 'bg-pink-100/80 text-pink-700 shadow-xs'
                        : 'text-pink-600 bg-pink-50/70 hover:bg-pink-100/70'
                      : isActive
                      ? 'bg-slate-100 text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className={`flex items-center ${isExpanded ? 'gap-3.5' : 'justify-center'}`}>
                    {item.live ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    ) : (
                      <svg className="w-5 h-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {item.icon}
                      </svg>
                    )}
                    {isExpanded && (
                      <span className="truncate whitespace-nowrap animate-in fade-in duration-200">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {isExpanded && item.live && (
                    <span className="text-[10px] bg-white text-pink-600 px-2 py-0.5 rounded-full border border-pink-200 font-black tracking-wide shrink-0 animate-in fade-in duration-200">
                      LIVE
                    </span>
                  )}

                  {isExpanded && item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 font-extrabold border border-pink-100 shrink-0 animate-in fade-in duration-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className={`pt-4 border-t border-slate-100 flex items-center ${isExpanded ? 'justify-between px-5' : 'justify-center px-2'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0"
              title={displayName}
            >
              {initial}
            </div>
            {isExpanded && (
              <div className="flex flex-col text-left leading-tight overflow-hidden animate-in fade-in duration-200 min-w-0">
                <span className="text-xs font-extrabold text-slate-800 truncate whitespace-nowrap">
                  {displayName}
                </span>
                <span className="text-[11px] text-pink-600 font-semibold mt-0.5 truncate whitespace-nowrap">
                  {affectedSide}
                </span>
              </div>
            )}
          </div>

          {isExpanded && (
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition flex items-center justify-center shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white max-w-sm w-full p-6 rounded-[2rem] shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Sign Out</h3>
                <p className="text-xs text-slate-400 mt-0.5">Are you sure you want to end this session?</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              Your ongoing exercise targets and hardware calibration settings are safely stored.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}