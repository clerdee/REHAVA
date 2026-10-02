import React from 'react';

export default function OverviewView({ onNavigate, user, onLaunchLiveTelemetry }) {
  // Stroke Gait Telemetry Metrics
  const metrics = {
    totalSessions: 12,
    symmetryScore: 92.4,
    plantarForce: '2,410 ADC',
    hardwareStatus: 'Connected (COM4)',
    todayProgress: 66,
    completedSets: 5,
    totalSets: 8
  };

  const recentTrials = [
    {
      id: 'SES-01',
      date: 'Today, 9:30 AM',
      focus: 'Plantar Contact & Heel-Strike Training',
      symmetry: 92.4,
      clinician: 'Ms. Christine Joy Cabardo, PTRP',
      status: 'Optimal'
    },
    {
      id: 'SES-02',
      date: 'Sep 29, 2:00 PM',
      focus: 'Parallel Bar Weight-Shifting Drill',
      symmetry: 89.1,
      clinician: 'Ms. Christine Joy Cabardo, PTRP',
      status: 'Retraining'
    }
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      
      {/* 1. Clinical Hero Banner with Quick Appointment Booking Action */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-pink-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/25">
              Left Hemiparesis Recovery
            </span>
            <span className="text-xs font-mono text-pink-100 font-semibold">
              Subacute Phase (Month 4)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.firstName || 'Roberto'}!
          </h1>

          <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed">
            Your bilateral symmetry continues to stabilize with Dynamic Carbon AFO support. Your ESP32 wearable sensor system is calibrated and ready for your next gait trial.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('appointments')}
            className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-900 text-xs font-extrabold rounded-2xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="text-base">📅</span>
            <span>Book Clinic Session</span>
          </button>

          <button
            onClick={onLaunchLiveTelemetry}
            className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold rounded-2xl border border-white/20 backdrop-blur-md transition flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Telemetry</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Vital Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Completed Gait Sessions
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-slate-900">{metrics.totalSessions}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              ↗ +2 this week
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Taguig PRU Physical Therapy</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Bilateral Gait Symmetry
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-slate-900">{metrics.symmetryScore}%</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Target: &gt;90%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">Optimal stance weight distribution</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Plantar Heel-Strike Force
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-slate-900">{metrics.plantarForce}</span>
            <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
              Firm Contact
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">FSR insole ground reaction force</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Wearable Sensor Node
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-xl font-black text-emerald-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              94% LiPo
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">{metrics.hardwareStatus}</span>
        </div>
      </div>

      {/* 3. Middle Split: Today's Exercise Regimen + AI Insight Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Target Compliance */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                Daily Motor Plan
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Today's Regimen Targets</h3>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('exercises')}
              className="text-xs font-bold text-pink-600 hover:text-pink-700 transition flex items-center gap-1"
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
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">2/3 Sets</span>
              </div>
              <h4 className="text-xs font-black text-slate-900">Ankle Dorsiflexion Pulls</h4>
              <p className="text-[11px] text-slate-400">Targeting anterior tibialis tone</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-indigo-600 uppercase">Bilateral Balance</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Done ✓</span>
              </div>
              <h4 className="text-xs font-black text-slate-900">Weight-Shifting Drills</h4>
              <p className="text-[11px] text-slate-400">3 sets × 10 shifts completed</p>
            </div>
          </div>
        </div>

        {/* AI Biomechanical Insight Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[2rem] p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
              ✦
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300 block">
              Gait Biomechanics Insight
            </span>
            <h3 className="text-base font-black leading-snug">
              Plantar Heel-Strike Firmness improved by +14%
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Weight distribution across your left heel during parallel bar trials has achieved symmetric ground impact. Knee hyperextension during mid-stance is visibly reduced.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-[11px] text-indigo-200 italic">
              "Ready to advance to unassisted 15-meter corridor walking under supervision of Ms. Cabardo."
            </p>
          </div>
        </div>

      </div>

      {/* 4. Recent Audited Sessions Snapshot */}
      <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Recent Rehabilitation Sessions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Summary of past kinematic recordings and clinician audits.</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('sessions')}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 transition"
          >
            View Full Logs →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTrials.map((trial) => (
            <div key={trial.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-3 rounded-2xl transition">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold">
                  🦶
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{trial.focus}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{trial.date} • Supervisor: {trial.clinician}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-slate-800 block">{trial.symmetry}%</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {trial.status}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('sessions')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition"
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}