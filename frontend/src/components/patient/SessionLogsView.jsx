import React, { useState, useMemo } from 'react';

export default function SessionLogsView({ onLaunchLiveTelemetry }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFocus, setFilterFocus] = useState('all');
  const [selectedSessionModal, setSelectedSessionModal] = useState(null);

  // Pinagsamang data structure mula sa HealthLogs.jsx at GaitProblems.jsx
  const sessionHistory = [
    {
      id: 'SES-01',
      date: 'Today, Oct 2, 2026',
      time: '9:30 AM',
      focus: 'Plantar Contact & Heel-Strike Training',
      category: 'heel_strike',
      clinician: 'Ms. Christine Joy Cabardo, PTRP',
      symmetryScore: 92.4,
      cadence: 104,
      peakPressure: '2,410 ADC',
      velocity: '1.08 m/s',
      strideLength: '1.14 m',
      stepCount: 52,
      kneeFlexion: '14.8°',
      duration: '45 mins',
      status: 'Completed',
      riskLevel: 'MILD',
      deviceUsed: 'Dynamic Carbon AFO + Insole FSR Node (COM4)',
      clinicalSummary: 'Significant improvement in initial heel-strike contact on hemiparetic left leg. Minimal foot drop noted during terminal swing phase.',
      detectedProblems: [
        {
          problem: 'Short Stride',
          severity: 'mild',
          patientValue: '1.14 m',
          normalRange: '1.20 - 1.50 m',
          description: 'Slightly reduced terminal stance extension on left hemiparetic leg.'
        },
        {
          problem: 'Foot Clearance (Drop)',
          severity: 'mild',
          patientValue: '14.8° deflection',
          normalRange: '> 18.0° deflection',
          description: 'Mild drag observed during high-cadence walking intervals.'
        }
      ]
    },
    {
      id: 'SES-02',
      date: 'Sep 29, 2026',
      time: '2:00 PM',
      focus: 'Parallel Bar Weight-Shifting Drill',
      category: 'weight_shift',
      clinician: 'Ms. Christine Joy Cabardo, PTRP',
      symmetryScore: 89.1,
      cadence: 96,
      peakPressure: '2,180 ADC',
      velocity: '0.94 m/s',
      strideLength: '1.02 m',
      stepCount: 46,
      kneeFlexion: '12.2°',
      duration: '40 mins',
      status: 'Completed',
      riskLevel: 'MODERATE',
      deviceUsed: 'Parallel Bars + Insole FSR Node',
      clinicalSummary: 'Patient maintained single-limb weight bearing for 4.2 seconds on hemiparetic left leg without lateral pelvic collapse.',
      detectedProblems: [
        {
          problem: 'Gait Asymmetry',
          severity: 'moderate',
          patientValue: '89.1%',
          normalRange: '> 92.0%',
          description: 'Unbalanced stance phase duration favouring unaffected right limb.'
        }
      ]
    },
    {
      id: 'SES-03',
      date: 'Sep 25, 2026',
      time: '10:15 AM',
      focus: 'Corridor Cadence & Speed Interval',
      category: 'cadence',
      clinician: 'Elena Morales, PTRP',
      symmetryScore: 86.8,
      cadence: 92,
      peakPressure: '1,990 ADC',
      velocity: '0.88 m/s',
      strideLength: '0.98 m',
      stepCount: 40,
      kneeFlexion: '10.5°',
      duration: '35 mins',
      status: 'Completed',
      riskLevel: 'MODERATE',
      deviceUsed: 'Quad Cane + Insole FSR Node',
      clinicalSummary: 'Tolerated 15-meter corridor trial across 4 laps. Fatigue caused slight toe scuffing on the final lap.',
      detectedProblems: [
        {
          problem: 'Slow Cadence',
          severity: 'moderate',
          patientValue: '92 spm',
          normalRange: '100 - 120 spm',
          description: 'Cadence degrades by 12% after 20 continuous meters.'
        }
      ]
    }
  ];

  const filteredLogs = useMemo(() => {
    return sessionHistory.filter((session) => {
      const matchesSearch =
        session.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.clinician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFocus =
        filterFocus === 'all' || session.category === filterFocus;

      return matchesSearch && matchesFocus;
    });
  }, [searchTerm, filterFocus]);

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Therapy Session History & Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audited walking assessments, detected deviations, and kinematic benchmarks.
          </p>
        </div>

        <button
          onClick={onLaunchLiveTelemetry}
          className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shadow-pink-200 transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Open Live Telemetry</span>
        </button>
      </div>

      {/* 4 Overview Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Trials</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{sessionHistory.length}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Audited</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Symmetry</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">89.4%</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">↗ +7.9% vs base</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mean Walking Cadence</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">97.3 <span className="text-xs font-bold text-slate-400">spm</span></span>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">Taguig PRU Norm</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Plantar Heel Firmness</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">2,410 <span className="text-xs font-bold text-slate-400">ADC</span></span>
            <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">Firm Contact</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Table Container */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by protocol, clinician, or session ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
            {[
              { id: 'all', label: 'All Protocols' },
              { id: 'heel_strike', label: 'Heel-Strike' },
              { id: 'weight_shift', label: 'Weight-Shift' },
              { id: 'cadence', label: 'Cadence' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterFocus(f.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                  filterFocus === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 rounded-l-2xl">Session ID & Date</th>
                <th className="py-3.5 px-4">Therapy Focus</th>
                <th className="py-3.5 px-4">Bilateral Symmetry</th>
                <th className="py-3.5 px-4">Cadence / Speed</th>
                <th className="py-3.5 px-4">Clinical Findings</th>
                <th className="py-3.5 px-4">Clinician</th>
                <th className="py-3.5 px-4 rounded-r-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{log.id}</span>
                    <span className="text-[11px] text-slate-400">{log.date} • {log.time}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-extrabold text-slate-900 block">{log.focus}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.duration} trial</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-black text-sm ${log.symmetryScore >= 90 ? 'text-emerald-600' : 'text-pink-600'}`}>
                        {log.symmetryScore}%
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        log.symmetryScore >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-pink-50 text-pink-700 border border-pink-100'
                      }`}>
                        {log.symmetryScore >= 90 ? 'Optimal' : 'Retraining'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600">
                    <div>{log.cadence} spm</div>
                    <div className="text-[10px] text-slate-400">{log.velocity}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {log.detectedProblems.map((p, idx) => (
                        <span key={idx} className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                          p.severity === 'moderate'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {p.problem}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-600">{log.clinician}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedSessionModal(log)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition"
                    >
                      Audit Report →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Report Modal (Inspired by GaitProblems.jsx) */}
      {selectedSessionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setSelectedSessionModal(null)}
        >
          <div
            className="bg-white max-w-xl w-full p-7 rounded-[2rem] shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                  {selectedSessionModal.id} • Clinical Audit Report
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{selectedSessionModal.focus}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedSessionModal.date} at {selectedSessionModal.time} ({selectedSessionModal.duration})
                </p>
              </div>
              <button
                onClick={() => setSelectedSessionModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* 4 Core Vital Measurements */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Symmetry</span>
                <span className="text-base font-black text-pink-600 block mt-0.5">{selectedSessionModal.symmetryScore}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Plantar FSR</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{selectedSessionModal.peakPressure}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Step Count</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{selectedSessionModal.stepCount} steps</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Knee Pitch</span>
                <span className="text-base font-black text-indigo-600 block mt-0.5">{selectedSessionModal.kneeFlexion}</span>
              </div>
            </div>

            {/* Clinical Findings Comparison (Patient Value vs Normal Reference) */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Detected Deviations & Reference Ranges</h4>
              <div className="space-y-2">
                {selectedSessionModal.detectedProblems.map((prob, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900">{prob.problem}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                        {prob.severity}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-[11px] pt-1">
                      <div>Patient Measured: <strong className="text-slate-800">{prob.patientValue}</strong></div>
                      <div>Normal Range: <span className="font-mono text-emerald-600 font-bold">{prob.normalRange}</span></div>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-0.5">{prob.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinician Notes */}
            <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-pink-700 tracking-wider block">
                Therapist Assessment ({selectedSessionModal.clinician})
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">"{selectedSessionModal.clinicalSummary}"</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedSessionModal(null)}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}