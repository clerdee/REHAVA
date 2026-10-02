import React, { useState } from 'react';
import logo from '../assets/logo.png';

export default function TherapistDashboard({ onLogout, onLaunchLiveStream }) {
  // Navigation controlled by the Bottom Floating Dock
  const [activeDockTab, setActiveDockTab] = useState('telemetry'); // 'telemetry' | 'cohort' | 'prescriptions' | 'appointments'

  // Live Telemetry & Recording States
  const [isRecording, setIsRecording] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState('PT-101');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Stroke Patient Cohort
  const [patients, setPatients] = useState([
    {
      id: 'PT-101',
      name: 'Roberto Dela Cruz',
      age: 58,
      condition: 'Left Hemiparesis (Subacute)',
      symmetry: 92.4,
      targetClearance: '15.0°',
      currentExtension: '14.2°',
      heelContactTime: '4.8s',
      cadence: 104,
      status: 'Active Trial',
      hardwareNode: 'NODE-ESP-01 (COM4)',
      battery: '94%',
      lastAlert: 'Mild toe clearance deficit flagged during swing phase.'
    },
    {
      id: 'PT-102',
      name: 'Amado Reyes',
      age: 63,
      condition: 'Right Hemiparesis (Foot Drop)',
      symmetry: 78.5,
      targetClearance: '12.0°',
      currentExtension: '9.8°',
      heelContactTime: '3.6s',
      cadence: 86,
      status: 'Rest Interval',
      hardwareNode: 'NODE-ESP-02 (COM5)',
      battery: '88%',
      lastAlert: 'Asymmetric bilateral ground force detected.'
    },
    {
      id: 'PT-103',
      name: 'Danilo Cortez',
      age: 54,
      condition: 'Bilateral Stroke Impairment',
      symmetry: 84.1,
      targetClearance: '14.0°',
      currentExtension: '13.6°',
      heelContactTime: '4.2s',
      cadence: 92,
      status: 'Queued',
      hardwareNode: 'NODE-ESP-01 (COM4)',
      battery: '94%',
      lastAlert: 'Target knee extension reached in last session.'
    }
  ]);

  // Clinical Prescriptions
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX-01',
      patientId: 'PT-101',
      title: 'Ankle Dorsiflexion Resistance Pull',
      target: 'Left Anterior Tibialis Range',
      dosage: '3 sets × 12 reps',
      difficulty: 'Intermediate'
    },
    {
      id: 'RX-02',
      patientId: 'PT-101',
      title: 'Parallel Bar Bilateral Weight Shift',
      target: 'Stance Stability & Center of Mass',
      dosage: '4 sets × 30 seconds',
      difficulty: 'Beginner'
    },
    {
      id: 'RX-03',
      patientId: 'PT-102',
      title: 'Heel-Strike Ground Contact Retraining',
      target: 'FSR Load Equalization',
      dosage: '15 meters corridor × 4 laps',
      difficulty: 'Advanced'
    }
  ]);

  // Appointments Roster
  const [appointments, setAppointments] = useState([
    {
      id: 'APT-01',
      patientName: 'Roberto Dela Cruz',
      type: 'Parallel Bar Kinematic Evaluation',
      time: 'Today, 09:30 AM',
      duration: '60 min',
      status: 'In Progress'
    },
    {
      id: 'APT-02',
      patientName: 'Amado Reyes',
      type: 'Dynamic AFO Splint Calibration',
      time: 'Tomorrow, 02:00 PM',
      duration: '45 min',
      status: 'Confirmed'
    }
  ]);

  // New Prescription State
  const [newRx, setNewRx] = useState({
    title: '',
    target: '',
    dosage: '3 sets × 10 reps',
    difficulty: 'Beginner'
  });

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleAddPrescription = (e) => {
    e.preventDefault();
    setPrescriptions([
      {
        id: `RX-0${prescriptions.length + 1}`,
        patientId: activePatient.id,
        ...newRx
      },
      ...prescriptions
    ]);
    setShowPrescriptionModal(false);
    setNewRx({ title: '', target: '', dosage: '3 sets × 10 reps', difficulty: 'Beginner' });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col font-sans antialiased relative pb-32">
      
      {/* 1. TOP CLINICAL STATUS HEADER */}
      <header className="w-full bg-white/95 border-b border-slate-200/80 px-6 sm:px-10 h-18 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center shadow-md shadow-pink-200">
            <img src={logo} alt="REHAVA Logo" className="h-5 w-auto object-contain brightness-0 invert" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                REHA<span className="text-pink-600">VA</span>
              </span>
              <span className="text-[10px] font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Clinician Workspace
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Taguig PRU • Physical Therapy & Telemetry Workstation</span>
          </div>
        </div>

        {/* Hardware Status & Clinician Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {activePatient.hardwareNode}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-bold">{activePatient.battery} Battery</span>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs flex items-center justify-center">
              PT
            </div>
            <div className="hidden md:flex flex-col text-left text-xs leading-tight">
              <span className="font-bold text-slate-800">Ms. Cabardo, PTRP</span>
              <span className="text-[10px] text-slate-400">Chief Physical Therapist</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-xs font-bold text-slate-500 hover:text-rose-600 px-2.5 py-1 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. FULL-WIDTH IMMERSION CANVAS */}
      <main className="max-w-[1550px] w-full mx-auto p-6 sm:p-10 space-y-8 flex-1">
        
        {/* Dynamic Patient Sub-Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {activePatient.name}
              </h1>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700">
                {activePatient.condition}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Patient ID: <strong className="font-mono text-slate-600">{activePatient.id}</strong> • Age: {activePatient.age}
            </p>
          </div>

          {/* Quick Subject Switcher */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">Switch Patient:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                setAlertDismissed(false);
              }}
              className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-pink-500 shadow-xs"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.condition.split(' ')[0]})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-Time Clinical Notice */}
        {!alertDismissed && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl flex items-center justify-between text-xs text-rose-800 shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <span className="text-base">⚠️</span>
              <span><strong>Telemetry Notice:</strong> {activePatient.lastAlert}</span>
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 px-3 py-1 bg-white border border-rose-200 rounded-xl transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ================= VIEW 1: LIVE GAIT TELEMETRY (DEFAULT) ================= */}
        {activeDockTab === 'telemetry' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Top 4 Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Gait Symmetry</span>
                <div className="text-4xl font-black text-pink-600 mt-1 tracking-tight">
                  {activePatient.symmetry}%
                </div>
                <span className="text-xs text-emerald-600 font-semibold mt-1 block">Bilateral Balance Stable</span>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Sagittal Knee Extension</span>
                <div className="text-4xl font-black text-indigo-600 mt-1 tracking-tight">
                  {activePatient.currentExtension}
                </div>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Target Goal: {activePatient.targetClearance}</span>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Single Stance Phase</span>
                <div className="text-4xl font-black text-emerald-600 mt-1 tracking-tight">
                  {activePatient.heelContactTime}
                </div>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Mean Contact Duration</span>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Step Cadence</span>
                <div className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                  {activePatient.cadence} <span className="text-sm font-normal text-slate-400">spm</span>
                </div>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Corridor Walking Speed</span>
              </div>
            </div>

            {/* Split Telemetry View: Live Oscilloscope Wave + Bilateral Plantar Foot Strike */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left 8 Cols: Real-Time Plantar Pressure Waveform */}
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Live Ground Reaction Force Stream (FSR Insole)</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Continuous digital sample stream ingested from ESP32</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● 5 Hz Frame Stream
                  </span>
                </div>

                {/* Oscilloscope Visualizer Box */}
                <div className="h-64 w-full bg-slate-950 rounded-2xl border border-slate-900 flex flex-col justify-between p-4 relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
                    <span>Y: 0 – 4095 ADC (Plantar Voltage)</span>
                    <span>X: Time Delta (200ms Buffer)</span>
                  </div>

                  {/* Dynamic Bars Representing Waveform */}
                  <div className="w-full flex items-end justify-between h-40 gap-1.5 z-10 px-2">
                    {[45, 68, 85, 50, 92, 78, 62, 94, 88, 70, 84, 52, 96, 75, 82, 60, 89, 94, 55, 78, 91, 65, 88, 72].map((val, idx) => (
                      <div key={idx} className="flex-1 bg-pink-950/40 rounded-t-sm" style={{ height: `${val}%` }}>
                        <div
                          className="bg-gradient-to-t from-pink-600 to-rose-400 h-full rounded-t-sm transition-all duration-300"
                          style={{ opacity: idx >= 20 ? 1 : 0.7 }}
                        ></div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-pink-400 z-10">
                    <span>Peak Contact: 2,410 ADC (Normal Stance)</span>
                    <span className="text-emerald-400 font-bold">0% Frame Loss</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Hardware Link: <strong className="text-slate-700">{activePatient.hardwareNode}</strong></span>
                  <button
                    onClick={onLaunchLiveStream}
                    className="text-pink-600 hover:text-pink-700 font-bold transition flex items-center gap-1"
                  >
                    Open Full Calibration Suite →
                  </button>
                </div>
              </div>

              {/* Right 4 Cols: Bilateral Balance & Stance Phase Insole Gauge */}
              <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Bilateral Load Balance</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Left vs. Right stance load distribution</p>
                </div>

                {/* Foot Insole Graphic Representation */}
                <div className="my-auto flex justify-center items-center gap-8 py-4">
                  {/* Left Leg (Affected) */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-36 rounded-full border-2 border-pink-500 bg-pink-50 p-2 flex flex-col justify-between items-center shadow-md shadow-pink-100">
                      <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping"></span>
                      <span className="text-[10px] font-mono font-bold text-pink-700">FSR Toe</span>
                      <span className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center text-[9px] font-black text-white shadow-xs">
                        L
                      </span>
                      <span className="text-[10px] font-mono font-bold text-pink-700">Heel</span>
                    </div>
                    <span className="text-xs font-bold text-pink-600">48% Load</span>
                  </div>

                  {/* Right Leg (Reference) */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-36 rounded-full border-2 border-slate-200 bg-slate-50 p-2 flex flex-col justify-between items-center">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      <span className="text-[10px] font-mono text-slate-500">Ref</span>
                      <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-black text-slate-700">
                        R
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Ref</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">52% Load</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  Bilateral variance is within the <strong>±5% target tolerance</strong> for independent corridor ambulation.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= VIEW 2: COHORT ROSTER ================= */}
        {activeDockTab === 'cohort' && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-black text-slate-900">Stroke Rehabilitation Patient Cohort</h2>
              <p className="text-xs text-slate-400 mt-0.5">Assigned physical therapy subjects at Taguig PRU.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {patients.map(p => (
                <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 px-3 rounded-2xl transition">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{p.condition} • {p.hardwareNode}</p>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-mono">
                    <span className="text-pink-600 font-bold">{p.symmetry}% Symmetry</span>
                    <span className="text-indigo-600 font-semibold">{p.currentExtension} Ext</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-sans">
                      {p.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        setActiveDockTab('telemetry');
                      }}
                      className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold font-sans shadow-xs transition"
                    >
                      Select Patient
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 3: PRESCRIPTIONS ================= */}
        {activeDockTab === 'prescriptions' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Clinical Exercise Prescriptions</h2>
                <p className="text-xs text-slate-400 mt-0.5">Lower-limb rehabilitation tasks assigned to {activePatient.name}.</p>
              </div>
              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-200 transition"
              >
                + New Prescription
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {prescriptions.map(rx => (
                <div key={rx.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-pink-300 transition">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-100">
                      {rx.difficulty}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 mt-2.5">{rx.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{rx.target}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600">
                    <span>{rx.dosage}</span>
                    <span className="text-emerald-600 font-bold font-sans">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 4: APPOINTMENTS ================= */}
        {activeDockTab === 'appointments' && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-black text-slate-900">Upcoming Physical Therapy Schedule</h2>
              <p className="text-xs text-slate-400 mt-0.5">Clinical trials and hardware monitoring sessions.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.map(apt => (
                <div key={apt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 px-3 rounded-2xl transition">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{apt.type}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Patient: <strong className="text-slate-800">{apt.patientName}</strong> • {apt.duration}</p>
                    <span className="text-[11px] font-mono text-slate-400 mt-1 block">📅 {apt.time}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold self-start sm:self-center">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ================= 3. LIGHT THEME FLOATING COMMAND DOCK (macOS Capsule Style) ================= */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200 rounded-full px-5 py-3 shadow-2xl backdrop-blur-xl flex items-center gap-3 z-40">
        
        {/* Live Recording Pulsing Indicator */}
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
            isRecording ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-500'
          }`}
          title="Toggle Telemetry Stream Capture"
        >
          <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`}></span>
          <span className="hidden sm:inline">{isRecording ? 'Stream Live' : 'Paused'}</span>
        </button>

        <div className="h-4 w-px bg-slate-200"></div>

        {/* Dock Navigation Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveDockTab('telemetry')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeDockTab === 'telemetry'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>⚡</span>
            <span>Telemetry</span>
          </button>

          <button
            onClick={() => setActiveDockTab('cohort')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeDockTab === 'cohort'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>👥</span>
            <span>Cohort</span>
          </button>

          <button
            onClick={() => setActiveDockTab('prescriptions')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeDockTab === 'prescriptions'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>📋</span>
            <span>Prescriptions</span>
          </button>

          <button
            onClick={() => setActiveDockTab('appointments')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeDockTab === 'appointments'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>📅</span>
            <span>Schedule</span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200"></div>

        {/* Quick Launch Direct Telemetry Stream */}
        <button
          onClick={onLaunchLiveStream}
          className="text-xs font-bold text-pink-600 hover:text-pink-700 px-2.5 transition"
        >
          Full Graph →
        </button>
      </div>

      {/* MODAL: ADD PRESCRIPTION */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900">Create Lower-Limb Prescription</h3>
            <p className="text-xs text-slate-400 mt-0.5">Assign a tailored mobility protocol for {activePatient.name}.</p>

            <form onSubmit={handleAddPrescription} className="space-y-3.5 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Exercise Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seated Heel-to-Toe Rocking"
                  value={newRx.title}
                  onChange={(e) => setNewRx({ ...newRx, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Biomechanical Goal *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Left Knee Extension Range"
                  value={newRx.target}
                  onChange={(e) => setNewRx({ ...newRx, target: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Dosage / Sets</label>
                  <input
                    type="text"
                    value={newRx.dosage}
                    onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Difficulty</label>
                  <select
                    value={newRx.difficulty}
                    onChange={(e) => setNewRx({ ...newRx, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-pink-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-200 transition"
                >
                  Confirm Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}