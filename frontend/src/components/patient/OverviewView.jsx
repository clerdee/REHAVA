import React, { useState, useEffect } from 'react';
import NotificationToast from '../NotificationToast';
import { API_ENDPOINTS } from '../../config/api';

export default function OverviewView({ onNavigate, user, onLaunchLiveTelemetry }) {
  const [toast, setToast] = useState({ message: '', type: 'info', title: 'System Notice' });
  const [patientData, setPatientData] = useState(null);

  const notify = (message, type = 'info', title = 'System Notice') => setToast({ message, type, title });
  const clearToast = () => setToast(prev => ({ ...prev, message: '' }));

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem('rehava_user') || '{}');
    const targetEmail = user?.email || cached?.email;
    if (!targetEmail) return;

    const endpoint = API_ENDPOINTS.PROFILE || `${API_ENDPOINTS.LOGIN.replace('/auth/login', '')}/profile`;
    fetch(`${endpoint}?email=${targetEmail}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setPatientData(data);
      })
      .catch(() => {});
  }, [user]);

  const activeUser = patientData || user || JSON.parse(localStorage.getItem('rehava_user') || '{}');
  const displayName = activeUser?.firstName || 'Patient';
  const hemiparesisSide = activeUser?.affectedSide
    ? `${activeUser.affectedSide.charAt(0).toUpperCase() + activeUser.affectedSide.slice(1)} Hemiparesis`
    : 'Lower-Limb Rehabilitation';
  const recoveryStage = activeUser?.strokeStage
    ? `${activeUser.strokeStage.charAt(0).toUpperCase() + activeUser.strokeStage.slice(1)} Phase`
    : 'Assessment Pending';
  const assistiveSupport = activeUser?.assistiveDevice && activeUser.assistiveDevice !== 'none'
    ? activeUser.assistiveDevice.replace('_', ' ')
    : 'Unassisted Gait Trial';

  const metrics = {
    totalSessions: activeUser?.totalSessions || 0,
    symmetryScore: activeUser?.targetSymmetryPercentage || 0,
    plantarForce: activeUser?.fsrThresholds?.heelMinAdc ? `${activeUser.fsrThresholds.heelMinAdc} ADC` : '0 ADC',
    hardwareStatus: 'Standby / Disconnected',
    todayProgress: 0,
    completedSets: 0,
    totalSets: 0
  };

  const recentTrials = activeUser?.recentTrials || [];

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      <NotificationToast message={toast.message} type={toast.type} title={toast.title} onClose={clearToast} />

      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-pink-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/25">
              {hemiparesisSide}
            </span>
            <span className="text-xs font-mono text-pink-100 font-semibold">
              {recoveryStage}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {displayName}!
          </h1>

          <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed">
            Biomechanical baseline monitoring active for {assistiveSupport}. Wearable sensors synchronize continuous lower-limb kinematic measurements.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('appointments')}
            className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-900 text-xs font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span className="text-base">📅</span>
            <span>Book Clinic Session</span>
          </button>

          <button
            type="button"
            onClick={onLaunchLiveTelemetry}
            className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold rounded-2xl border border-white/20 backdrop-blur-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Telemetry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Completed Gait Sessions
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-slate-900">{metrics.totalSessions}</span>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {metrics.totalSessions > 0 ? '+1 Recorded' : '0 this week'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Taguig PRU Physical Therapy</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Bilateral Gait Symmetry
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-slate-900">
              {metrics.symmetryScore > 0 ? `${metrics.symmetryScore}%` : '0%'}
            </span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {metrics.symmetryScore > 0 ? 'Benchmark' : 'N/A'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Stance symmetry baseline target</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Plantar Heel-Strike Force
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-slate-900">{metrics.plantarForce}</span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {metrics.plantarForce !== '0 ADC' ? 'Calibrated' : 'N/A'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">FSR insole ground reaction force</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Wearable Sensor Node
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-xl font-black text-slate-500 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              Offline
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              0% LiPo
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">{metrics.hardwareStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                Daily Motor Plan
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Today's Regimen Targets</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('exercises')}
              className="text-xs font-bold text-pink-600 hover:text-pink-700 transition flex items-center gap-1 cursor-pointer"
            >
              <span>View All Targets</span>
              <span>→</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">Overall Daily Compliance</span>
              <span className="text-slate-900 font-mono">
                {metrics.completedSets} of {metrics.totalSets} Sets ({metrics.todayProgress}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.todayProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-pink-600 uppercase">Foot Clearance</span>
                <span className="text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">0 Sets</span>
              </div>
              <h4 className="text-xs font-black text-slate-900">Ankle Dorsiflexion Pulls</h4>
              <p className="text-[11px] text-slate-400">Targeting anterior tibialis tone</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-indigo-600 uppercase">Bilateral Balance</span>
                <span className="text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">Pending</span>
              </div>
              <h4 className="text-xs font-black text-slate-900">Weight-Shifting Drills</h4>
              <p className="text-[11px] text-slate-400">Awaiting clinical baseline start</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[2rem] p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
              ✦
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300 block">
              Gait Biomechanics Insight
            </span>
            <h3 className="text-base font-black leading-snug">
              Kinematic Deviation Calibration
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Live telemetry monitoring will analyze heel contact force and knee sagittal angular deflection to generate automated physical therapy recommendations.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-[11px] text-indigo-200 italic">
              Connect your ESP32-S3 sensor module to begin gait recording.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Recent Rehabilitation Sessions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Summary of past kinematic recordings and clinician audits.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('sessions')}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 transition cursor-pointer"
          >
            View Full Logs →
          </button>
        </div>

        {recentTrials.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xl font-bold">
              📊
            </div>
            <p className="text-xs font-bold text-slate-700">No Recorded Sessions Yet</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Launch live telemetry or complete your initial corridor walk test to start accumulating telemetry records.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTrials.map((trial) => (
              <div key={trial.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-3 rounded-2xl transition">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold">
                    🦶
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{trial.focus || 'Gait Session'}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{trial.date || 'N/A'} • Supervisor: {trial.clinician || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-slate-800 block">{trial.symmetry || 0}%</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {trial.status || 'Recorded'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('sessions')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}