import React, { useState } from 'react';
import Sidebar from './patient/Sidebar';
import Header from './patient/Header';
import OverviewView from './patient/OverviewView';
import PreviousNotificationsView from './patient/PreviousNotificationsView';
import ExerciseTargetsView from './patient/ExerciseTargetsView';
import SessionLogsView from './patient/SessionLogsView';
import AppointmentsView from './patient/AppointmentsView';
import ProfileBaselineView from './patient/ProfileBaselineView';

export default function PatientDashboard({ user, onLogout, onLaunchLiveTelemetry }) {
  // Navigation State: 'overview' | 'telemetry' | 'exercises' | 'sessions' | 'appointments' | 'profile' | 'notifications'
  const [activeNav, setActiveNav] = useState('overview'); 
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 flex font-sans antialiased selection:bg-pink-100 selection:text-pink-700">
      
      {/* 1. KALIWANG SIDEBAR NAVIGATOR */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onLaunchLiveTelemetry={onLaunchLiveTelemetry}
        user={user}
        onLogout={onLogout}
      />

      {/* 2. GITNANG MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <Header
          activeNav={activeNav}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenAIInsights={() => alert('AI Gait Insights')}
          onViewPreviousNotifications={() => setActiveNav('notifications')}
        />

        {/* Dynamic Pages Canvas */}
        <main className="p-8 max-w-[1500px] w-full mx-auto flex-1 flex flex-col">
          
          {/* DEFAULT LANDING PAGE: Overview / Dashboard (Aktibong nakakabit na) */}
          {activeNav === 'overview' && (
            <OverviewView
              user={user}
              onNavigate={(page) => setActiveNav(page)}
              onLaunchLiveTelemetry={onLaunchLiveTelemetry}
            />
          )}

          {/* PAGE: Previous Notifications Archive */}
          {activeNav === 'notifications' && (
            <PreviousNotificationsView onBackToOverview={() => setActiveNav('overview')} />
          )}

          {/* PAGE 2: Live Telemetry */}
          {activeNav === 'telemetry' && (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Live Hardware Telemetry</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time FSR plantar ground pressure at MPU-6050 joint orientation angles.
                  </p>
                </div>
                <button
                  onClick={onLaunchLiveTelemetry}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Launch Full Stream Console →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Heel Contact (FSR)</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">2,410 ADC</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Sagittal Knee Pitch</span>
                  <div className="text-2xl font-black text-indigo-600 mt-1">14.8°</div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: Daily & Weekly Exercise Targets */}
          {activeNav === 'exercises' && (
            <ExerciseTargetsView />
          )}

          {/* PAGE 4: Session Logs */}
          {activeNav === 'sessions' && (
            <SessionLogsView onLaunchLiveTelemetry={onLaunchLiveTelemetry} />
          )}

          {/* PAGE 5: Appointments Manager */}
          {activeNav === 'appointments' && (
            <AppointmentsView />
          )}

          {/* PAGE 6: Profile & Baseline */}
          {activeNav === 'profile' && (
            <ProfileBaselineView user={user} />
          )}

        </main>
      </div>

    </div>
  );
}