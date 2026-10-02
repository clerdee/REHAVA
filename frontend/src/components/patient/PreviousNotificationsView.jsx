import React, { useState } from 'react';

export default function PreviousNotificationsView({ onBackToOverview }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'exercise' | 'appointment' | 'hardware'

  const [notificationHistory, setNotificationHistory] = useState([
    {
      id: 1,
      type: 'exercise',
      title: 'Daily Exercise Target',
      message: 'Huwag kalimutan ang iyong Ankle Dorsiflexion pulls (3 sets × 12 reps) ngayong hapon.',
      date: 'Today, 2:30 PM',
      status: 'Active'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Session Confirmed',
      message: 'Kinumpirma ni Ms. Christine Joy Cabardo, PTRP ang iyong Parallel Bar assessment bukas ng 9:30 AM.',
      date: 'Today, 11:00 AM',
      status: 'Confirmed'
    },
    {
      id: 3,
      type: 'hardware',
      title: 'Hardware Link Ready',
      message: 'Naka-pair ang ESP32 Insole Node (COM4). 94% ang LiPo battery level.',
      date: 'Yesterday, 4:15 PM',
      status: 'Resolved'
    },
    {
      id: 4,
      type: 'exercise',
      title: 'Symmetry Target Milestone Reached',
      message: 'Binabati ka! Naabot mo ang 92.4% bilateral gait symmetry score sa nakaraang walking trial.',
      date: 'Sep 29, 2026',
      status: 'Completed'
    },
    {
      id: 5,
      type: 'hardware',
      title: 'Calibration Warning Cleared',
      message: 'Matagumpay na na-calibrate ang MPU-6050 sagittal zero-angle reference.',
      date: 'Sep 27, 2026',
      status: 'Resolved'
    },
    {
      id: 6,
      type: 'appointment',
      title: 'Session Completed',
      message: 'Natapos ang 60-minute Dynamic AFO Splint Tolerance Walk kasama si Elena Morales, PTRP.',
      date: 'Sep 25, 2026',
      status: 'Completed'
    }
  ]);

  const filteredHistory = notificationHistory.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header na may Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToOverview}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 transition flex items-center gap-1.5 mb-2"
          >
            ← Back to Overview
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Notification History & Clinical Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Kumpletong talaan ng mga paalala, appointment updates, at telemetry hardware logs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto text-xs font-bold">
          {['all', 'exercise', 'appointment', 'hardware'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3.5 py-1.5 rounded-xl capitalize transition ${
                filterType === tab
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'all' ? 'All Alerts' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-[2rem] border border-slate-200/80 p-6 shadow-xs divide-y divide-slate-100">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 px-4 rounded-2xl transition"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 text-lg mt-0.5">
                {item.type === 'exercise' && '🎯'}
                {item.type === 'appointment' && '📅'}
                {item.type === 'hardware' && '⚡'}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                  {item.message}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400 self-start sm:self-center shrink-0">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}