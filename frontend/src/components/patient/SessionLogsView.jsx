import React, { useState, useMemo, useEffect } from 'react';
import NotificationToast from '../NotificationToast';
import { API_ENDPOINTS } from '../../config/api';

export default function SessionLogsView({ onLaunchLiveTelemetry, user }) {
  const [sessionHistory, setSessionHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFocus, setFilterFocus] = useState('all');
  const [selectedSessionModal, setSelectedSessionModal] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info', title: 'Session Logs' });

  const notify = (message, type = 'info', title = 'Session Logs') => setToast({ message, type, title });
  const clearToast = () => setToast(prev => ({ ...prev, message: '' }));

  const activeEmail = useMemo(() => {
    if (user?.email) return user.email;
    const cached = JSON.parse(localStorage.getItem('rehava_user') || '{}');
    return cached.email || '';
  }, [user]);

  useEffect(() => {
    if (!activeEmail) return;

    const baseLogsUrl = (API_ENDPOINTS?.SESSION_LOGS || `${API_ENDPOINTS?.LOGIN?.replace('/auth/login', '')}/sessions`) || '';
    if (!baseLogsUrl) return;

    fetch(`${baseLogsUrl}?email=${encodeURIComponent(activeEmail)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setSessionHistory(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [activeEmail]);

  const summaryMetrics = useMemo(() => {
    if (sessionHistory.length === 0) {
      return {
        completedTrials: 0,
        averageSymmetry: '0%',
        meanCadence: '0 spm',
        plantarHeelFirmness: '0 ADC'
      };
    }

    const totalSym = sessionHistory.reduce((acc, curr) => acc + (Number(curr.symmetryScore) || 0), 0);
    const totalCad = sessionHistory.reduce((acc, curr) => acc + (Number(curr.cadence) || 0), 0);
    const maxFsr = Math.max(...sessionHistory.map(s => Number(String(s.peakPressure || 0).replace(/[^0-9]/g, '')) || 0));

    return {
      completedTrials: sessionHistory.length,
      averageSymmetry: `${(totalSym / sessionHistory.length).toFixed(1)}%`,
      meanCadence: `${(totalCad / sessionHistory.length).toFixed(1)} spm`,
      plantarHeelFirmness: maxFsr > 0 ? `${maxFsr.toLocaleString()} ADC` : '0 ADC'
    };
  }, [sessionHistory]);

  const filteredLogs = useMemo(() => {
    return sessionHistory.filter((session) => {
      const focusText = session.focus || '';
      const clinicianText = session.clinician || '';
      const idText = session.id || session._id || '';

      const matchesSearch =
        focusText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinicianText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idText.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFocus =
        filterFocus === 'all' || session.category === filterFocus;

      return matchesSearch && matchesFocus;
    });
  }, [sessionHistory, searchTerm, filterFocus]);

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      <NotificationToast message={toast.message} type={toast.type} title={toast.title} onClose={clearToast} />

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
          type="button"
          onClick={onLaunchLiveTelemetry}
          className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shadow-pink-200 transition flex items-center gap-2 self-start sm:self-auto active:scale-95 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Open Live Telemetry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Trials</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{summaryMetrics.completedTrials}</span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {summaryMetrics.completedTrials > 0 ? 'Audited' : 'N/A'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Symmetry</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{summaryMetrics.averageSymmetry}</span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {summaryMetrics.completedTrials > 0 ? 'Recorded' : 'N/A'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mean Walking Cadence</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{summaryMetrics.meanCadence}</span>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              {summaryMetrics.completedTrials > 0 ? 'Taguig PRU Norm' : 'N/A'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Plantar Heel Firmness</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-black text-slate-900">{summaryMetrics.plantarHeelFirmness}</span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {summaryMetrics.completedTrials > 0 ? 'Firm Contact' : 'N/A'}
            </span>
          </div>
        </div>
      </div>

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
                type="button"
                onClick={() => setFilterFocus(f.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
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
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-base font-bold text-slate-700">No Audited Sessions Found</p>
                    <p className="text-[11px] mt-1">Connect your telemetry node to initiate and log gait trials.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const logId = log.id || log._id || 'SES-00';
                  const symVal = Number(log.symmetryScore) || 0;
                  return (
                    <tr key={logId} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{logId}</span>
                        <span className="text-[11px] text-slate-400">{log.date || 'N/A'} • {log.time || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-900 block">{log.focus || 'Physical Therapy Trial'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.duration || 'N/A'} trial</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-black text-sm ${symVal >= 90 ? 'text-emerald-600' : 'text-pink-600'}`}>
                            {symVal > 0 ? `${symVal}%` : '0%'}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            symVal >= 90
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-pink-50 text-pink-700 border border-pink-100'
                          }`}>
                            {symVal >= 90 ? 'Optimal' : symVal > 0 ? 'Retraining' : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-600">
                        <div>{log.cadence ? `${log.cadence} spm` : '0 spm'}</div>
                        <div className="text-[10px] text-slate-400">{log.velocity || '0 m/s'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {log.detectedProblems && log.detectedProblems.length > 0 ? (
                            log.detectedProblems.map((p, idx) => (
                              <span key={idx} className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                p.severity === 'moderate'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {p.problem}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None recorded</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-600">{log.clinician || 'Unassigned PTRP'}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedSessionModal(log)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition cursor-pointer"
                        >
                          Audit Report →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSessionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setSelectedSessionModal(null)}
        >
          <div
            className="bg-white max-w-xl w-full p-7 rounded-[2rem] shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                  {selectedSessionModal.id || selectedSessionModal._id || 'SES-00'} • Clinical Audit Report
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{selectedSessionModal.focus || 'Physical Therapy Trial'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedSessionModal.date || 'N/A'} at {selectedSessionModal.time || 'N/A'} ({selectedSessionModal.duration || 'N/A'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSessionModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Symmetry</span>
                <span className="text-base font-black text-pink-600 block mt-0.5">{selectedSessionModal.symmetryScore || 0}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Plantar FSR</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{selectedSessionModal.peakPressure || '0 ADC'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Step Count</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">{selectedSessionModal.stepCount || 0} steps</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Knee Pitch</span>
                <span className="text-base font-black text-indigo-600 block mt-0.5">{selectedSessionModal.kneeFlexion || '0.0°'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Detected Deviations & Reference Ranges</h4>
              <div className="space-y-2">
                {selectedSessionModal.detectedProblems && selectedSessionModal.detectedProblems.length > 0 ? (
                  selectedSessionModal.detectedProblems.map((prob, idx) => (
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
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    No gait deviations or anomalies detected during this trial.
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-pink-700 tracking-wider block">
                Therapist Assessment ({selectedSessionModal.clinician || 'Attending PTRP'})
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                "{selectedSessionModal.clinicalSummary || 'Session concluded normally with no adverse patient complaints.'}"
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedSessionModal(null)}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
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