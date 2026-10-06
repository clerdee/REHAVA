import React, { useState } from 'react';
import Sidebar from './patient/Sidebar';
import Header from './patient/Header';
import OverviewView from './patient/OverviewView';
import PreviousNotificationsView from './patient/PreviousNotificationsView';
import ExerciseTargetsView from './patient/ExerciseTargetsView';
import SessionLogsView from './patient/SessionLogsView';
import AppointmentsView from './patient/AppointmentsView';
import ProfileBaselineView from './patient/ProfileBaselineView';
import NotificationToast from './NotificationToast';

export default function PatientDashboard({ user, onLogout, onLaunchLiveTelemetry }) {
  const [activeNav, setActiveNav] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info', title: 'System Notice' });

  const notify = (message, type = 'info', title = 'System Notice') => setToast({ message, type, title });
  const clearToast = () => setToast(prev => ({ ...prev, message: '' }));

  const handleLogout = () => {
    localStorage.removeItem('rehava_user');
    localStorage.clear();
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 flex font-sans antialiased selection:bg-pink-100 selection:text-pink-700">
      <NotificationToast message={toast.message} type={toast.type} title={toast.title} onClose={clearToast} />

      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onLaunchLiveTelemetry={onLaunchLiveTelemetry}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeNav={activeNav}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenAIInsights={() => notify('AI Gait Kinematics insight engine is computing...', 'info', 'Insights Processing')}
          onViewPreviousNotifications={() => setActiveNav('notifications')}
        />

        <main className="p-8 max-w-[1500px] w-full mx-auto flex-1 flex flex-col">
          {activeNav === 'overview' && (
            <OverviewView
              user={user}
              onNavigate={setActiveNav}
              onLaunchLiveTelemetry={onLaunchLiveTelemetry}
            />
          )}

          {activeNav === 'notifications' && (
            <PreviousNotificationsView onBackToOverview={() => setActiveNav('overview')} />
          )}

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
                  type="button"
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

          {activeNav === 'exercises' && <ExerciseTargetsView />}
          {activeNav === 'sessions' && <SessionLogsView onLaunchLiveTelemetry={onLaunchLiveTelemetry} />}
          {activeNav === 'appointments' && <AppointmentsView />}
          {activeNav === 'profile' && <ProfileBaselineView user={user} />}
        </main>
      </div>
    </div>
  );
}