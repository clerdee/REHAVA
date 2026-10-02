import React, { useState } from 'react';

export default function ProfileBaselineView({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  // Demographic details & separated Stroke Mobility Baseline
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Roberto',
    lastName: user?.lastName || 'Dela Cruz',
    age: 58,
    gender: 'Male',
    contactNumber: '+63 917 842 1904',
    address: 'Western Bicutan, Taguig City',
    strokeDate: '2026-03-15',
    recoveryPhase: 'Subacute (3–6 months)',
    hemiparesisSide: 'Left',
    
    // Separated Clinical Mobility Parameters
    walkingCapability: 'Quad Cane Assisted', // Ambulation Level
    orthoticGear: 'Dynamic Carbon AFO',       // Support Splint / Gear
    
    supervisingPT: 'Ms. Christine Joy Cabardo, PTRP',
    supervisingMD: 'Dr. Noel Nathaniel Napa, MD',

    // Clinical Baseline Targets (Calibrated for Taguig PRU)
    baselineSymmetryTarget: 92.0, // in percentage
    baselineCadenceTarget: 100, // in steps per minute
    baselineKneeAngleTarget: 16.5, // in degrees
    baselinePlantarPressureTarget: '2,200 ADC',

    // Caregiver Information
    hasCaregiver: true,
    caregiverName: 'Maria Dela Cruz',
    caregiverRelationship: 'Spouse / Primary Caregiver',
    caregiverPhone: '+63 918 221 4402'
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  const handleSave = (e) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    setIsEditing(false);
    alert('Rehabilitation baseline and patient profile updated successfully.');
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Patient Profile & Stroke Baseline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Demographic records, lower-limb hemiparesis classification, and target biomechanical thresholds.
          </p>
        </div>

        <button
          onClick={() => {
            setEditForm({ ...profileData });
            setIsEditing(true);
          }}
          className="bg-slate-900 hover:bg-black text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <span>✏️</span>
          <span>Update Baseline</span>
        </button>
      </div>

      {/* 2. Top Hero Card: Clinical Stroke Classification */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 rounded-[2rem] p-7 text-white shadow-lg shadow-pink-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black shrink-0 border border-white/20">
            {profileData.firstName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                {profileData.hemiparesisSide} Hemiparesis
              </span>
              <span className="text-xs font-mono text-pink-100">
                {profileData.recoveryPhase}
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-1">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-xs text-pink-100/90 mt-0.5">
              Supervising PTRP: <strong>{profileData.supervisingPT}</strong>
            </p>
          </div>
        </div>

        {/* Mobility Aid and Splint Overview */}
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 self-stretch md:self-auto justify-around">
          <div>
            <span className="text-[10px] uppercase font-bold text-pink-200 block">Mobility Aid</span>
            <span className="text-sm font-black">{profileData.walkingCapability}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-pink-200 block">Splint / Orthosis</span>
            <span className="text-sm font-black">{profileData.orthoticGear}</span>
          </div>
        </div>
      </div>

      {/* 3. Biomechanical Baseline Targets Grid */}
      <div className="space-y-3">
        <div className="px-1">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Target Kinematic Benchmarks (Taguig PRU Calibration)
          </h3>
          <p className="text-xs text-slate-400">
            Clinical baseline targets configured for real-time sensor deviation tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Target Bilateral Symmetry
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-3xl font-black text-slate-900">{profileData.baselineSymmetryTarget}%</span>
              <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                Minimum
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Left vs Right balance ratio</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Target Step Cadence
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-3xl font-black text-slate-900">
                {profileData.baselineCadenceTarget} <small className="text-xs font-bold text-slate-400">spm</small>
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Community
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Optimal 15m corridor velocity</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Sagittal Knee Deflection
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-3xl font-black text-slate-900">{profileData.baselineKneeAngleTarget}°</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Extension
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Knee locking angle to prevent buckle</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Plantar Contact Force
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-3xl font-black text-slate-900">{profileData.baselinePlantarPressureTarget}</span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                FSR ADC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Heel contact ground reaction threshold</p>
          </div>
        </div>
      </div>

      {/* 4. Details Split Grid (Patient Info vs Caregiver Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Patient Clinical Info */}
        <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-black text-slate-900">Patient Demographics & Medical Case</h4>
            <span className="text-xs font-mono font-bold text-slate-400">PRU-TAGUIG-2026</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Full Name</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.firstName} {profileData.lastName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Age & Gender</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.age} years old • {profileData.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Hemiparesis Side</span>
              <span className="font-bold text-pink-600 text-sm mt-0.5 block">{profileData.hemiparesisSide} Lateral Extremity</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Stroke Onset</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.strokeDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Walking Capability</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.walkingCapability}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Orthotic Gear</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.orthoticGear}</span>
            </div>
          </div>
        </div>

        {/* Primary Caregiver & Emergency Info */}
        <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-black text-slate-900">Primary Caregiver & Support Details</h4>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Verified Contact
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Caregiver Name</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.caregiverName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Relationship</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.caregiverRelationship}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-medium">Emergency Phone</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">{profileData.caregiverPhone}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mt-2 space-y-1">
            <span className="font-bold text-slate-800 block">Rehabilitation Team Access:</span>
            <p>
              Notifications regarding scheduled appointments and telemetry compliance logs are mirrored with this registered caregiver.
            </p>
          </div>
        </div>

      </div>

      {/* 5. MODAL: EDIT PATIENT BASELINE */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-7 rounded-[2rem] shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                  Update Configuration
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Edit Rehabilitation Baseline</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-1">
              
              {/* Demographics */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-400 block">Demographics</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stroke Mobility & Gear (Separated) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-400 block">Mobility & Clinical Setup</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Walking Capability / Aid</label>
                    <select
                      value={editForm.walkingCapability}
                      onChange={(e) => setEditForm({ ...editForm, walkingCapability: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500"
                    >
                      <option value="Independent Ambulation">Independent Ambulation</option>
                      <option value="Single Cane Assisted">Single Cane Assisted</option>
                      <option value="Quad Cane Assisted">Quad Cane Assisted</option>
                      <option value="Standard Walker Assisted">Standard Walker Assisted</option>
                      <option value="Parallel Bar Support">Parallel Bar Support</option>
                      <option value="Therapist Assisted">Therapist Assisted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Support Splint / Orthosis</label>
                    <select
                      value={editForm.orthoticGear}
                      onChange={(e) => setEditForm({ ...editForm, orthoticGear: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500"
                    >
                      <option value="None / Footwear Only">None / Footwear Only</option>
                      <option value="Dynamic Carbon AFO">Dynamic Carbon AFO</option>
                      <option value="Solid Ankle AFO">Solid Ankle AFO</option>
                      <option value="Hinged Ankle AFO">Hinged Ankle AFO</option>
                      <option value="Knee Support Brace">Knee Support Brace</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Affected Side</label>
                    <select
                      value={editForm.hemiparesisSide}
                      onChange={(e) => setEditForm({ ...editForm, hemiparesisSide: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500"
                    >
                      <option value="Left">Left Side (Hemiparesis)</option>
                      <option value="Right">Right Side (Hemiparesis)</option>
                      <option value="Bilateral">Bilateral Mobility Deficit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Target Symmetry (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editForm.baselineSymmetryTarget}
                      onChange={(e) => setEditForm({ ...editForm, baselineSymmetryTarget: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Caregiver */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-400 block">Caregiver Contact</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Caregiver Name</label>
                    <input
                      type="text"
                      value={editForm.caregiverName}
                      onChange={(e) => setEditForm({ ...editForm, caregiverName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Caregiver Phone</label>
                    <input
                      type="text"
                      value={editForm.caregiverPhone}
                      onChange={(e) => setEditForm({ ...editForm, caregiverPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition"
                >
                  Save Baseline Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}