import React from 'react';

export default function TermsOfServiceModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full p-7 rounded-[2rem] shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col justify-between animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
              REHAVA Clinical Protocol
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Terms of Service & Telemetry Consent
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Stroke Rehabilitation Telemetry & Sensor Data Governance
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="my-4 overflow-y-auto pr-2 space-y-4 text-xs text-slate-600 leading-relaxed max-h-[50vh]">
          <div className="p-3.5 bg-pink-50/50 rounded-2xl border border-pink-100/80 text-[11px] text-pink-900">
            <strong>Notice:</strong> By registering with REHAVA, you agree to biometric and biomechanical data acquisition for stroke physical therapy under clinician supervision.
          </div>

          <div>
            <h3 className="font-extrabold text-slate-800 text-xs mb-1">1. Scope of Physical Therapy Monitoring</h3>
            <p>
              The REHAVA system uses wearable IMU sensors (MPU-6050) and plantar pressure sensing arrays (FSRs) to monitor sagittal joint deflection, cadence, and bilateral symmetry. These metrics support clinical rehabilitation and are reviewed by licensed Physical Therapists (PTRP) and Physiatrists (MD).
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-800 text-xs mb-1">2. Hardware Operation & Safe Ambulation</h3>
            <p>
              Patients must follow safety guidelines during walking sessions. If using assistive devices (e.g., Quad Cane, Walker, or Dynamic AFO), always practice on level ground or parallel bars as recommended by your supervising clinician. Stop walking immediately if fatigue, loss of balance, or pain occurs.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-800 text-xs mb-1">3. Privacy and Health Data Handling</h3>
            <p>
              Telemetry streams, session logs, and personal health metrics collected via this portal are protected under clinical data protection standards. Your registered primary caregiver or family representative will have synchronized access to appointment schedules and compliance milestones.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-800 text-xs mb-1">4. Emergency & Medical Disclaimer</h3>
            <p>
              REHAVA is a gait monitoring and motor re-education platform, not an emergency alert service. In the event of a medical emergency, fall, or acute distress, contact emergency healthcare providers immediately.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-200 transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}