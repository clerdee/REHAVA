import React, { useState, useEffect } from 'react';
import NotificationToast from '../NotificationToast';
import { API_ENDPOINTS } from '../../config/api';

const PHONE_REGEX = /^(09|\+639|639)\d{9}$/;

export default function ProfileBaselineView({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error', title: 'Profile Notice' });

  const notify = (message, type = 'error', title = 'Profile Notice') => setToast({ message, type, title });
  const clearToast = () => setToast(prev => ({ ...prev, message: '' }));

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'N/A',
    lastName: user?.lastName || '',
    email: user?.email || 'N/A',
    phoneNumber: user?.phoneNumber || 'N/A',
    relationshipToPatient: 'patient_self',
    patientType: 'myself',
    patientFirstName: 'N/A',
    patientLastName: '',
    patientEmail: 'N/A',
    patientPhoneNumber: 'N/A',
    patientAge: 'N/A',
    patientGender: 'N/A',
    patientWorkStatus: 'Unspecified',
    affectedSide: 'Left',
    strokeStage: 'Subacute',
    mobilityAssistance: 'Cane / Walker',
    assistiveDevice: 'None',
    supervisingPT: 'N/A',
    baselineSymmetryTarget: 0,
    baselineCadenceTarget: 0,
    baselineKneeAngleTarget: 0,
    baselinePlantarPressureTarget: '0 ADC'
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  useEffect(() => {
    const cachedUser = JSON.parse(localStorage.getItem('rehava_user') || '{}');
    const targetEmail = user?.email || cachedUser?.email;
    if (!targetEmail) return;

    fetch(`${API_ENDPOINTS.LOGIN.replace('/auth/login', '')}/auth/profile?email=${targetEmail}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return;
        setProfileData(prev => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          email: data.email || prev.email,
          phoneNumber: data.phoneNumber || prev.phoneNumber,
          relationshipToPatient: data.relationshipToPatient || prev.relationshipToPatient,
          patientType: data.patientType || prev.patientType,
          patientFirstName: data.patientFirstName || data.firstName || prev.patientFirstName,
          patientLastName: data.patientLastName || data.lastName || prev.patientLastName,
          patientEmail: data.patientEmail || data.email || prev.patientEmail,
          patientPhoneNumber: data.patientPhone || data.phoneNumber || prev.patientPhoneNumber,
          patientAge: data.patientAge || 'N/A',
          patientGender: data.patientGender ? data.patientGender.toUpperCase() : 'N/A',
          patientWorkStatus: data.patientWorkStatus ? data.patientWorkStatus.replace('_', ' ').toUpperCase() : 'UNSPECIFIED',
          affectedSide: data.affectedSide ? data.affectedSide.charAt(0).toUpperCase() + data.affectedSide.slice(1) : prev.affectedSide,
          strokeStage: data.strokeStage ? data.strokeStage.charAt(0).toUpperCase() + data.strokeStage.slice(1) : prev.strokeStage,
          mobilityAssistance: data.mobilityAssistance ? data.mobilityAssistance.replace('_', ' ') : prev.mobilityAssistance,
          assistiveDevice: data.assistiveDevice ? data.assistiveDevice.replace('_', ' ') : prev.assistiveDevice,
          baselineSymmetryTarget: data.targetSymmetryPercentage || 0,
          baselineCadenceTarget: data.cadenceTargetBpm || 0
        }));
      })
      .catch(() => {});
  }, [user]);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    clearToast();

    if (editForm.phoneNumber && editForm.phoneNumber !== 'N/A') {
      const cleanPhone = editForm.phoneNumber.replace(/[\s-]/g, '');
      if (!PHONE_REGEX.test(cleanPhone)) {
        return notify('Please enter a valid Philippine mobile phone number.', 'error', 'Invalid Phone');
      }
    }

    setShowConfirmModal(true);
  };

  const handleFinalSave = () => {
    setShowConfirmModal(false);
    setProfileData({ ...editForm });
    setIsEditing(false);
    notify('Profile and baseline configuration updated successfully.', 'success', 'Profile Updated');
  };

  const initial = profileData.firstName !== 'N/A' && profileData.firstName ? profileData.firstName[0].toUpperCase() : 'P';

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      <NotificationToast message={toast.message} type={toast.type} title={toast.title} onClose={clearToast} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Patient Profile & Stroke Baseline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Demographic identity, clinician-calibrated kinematics, and recovery parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditForm({ ...profileData });
            setIsEditing(true);
          }}
          className="bg-slate-900 hover:bg-black text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2 self-start sm:self-auto active:scale-95 cursor-pointer"
        >
          <span>✏️</span>
          <span>Update Baseline</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 rounded-[2rem] p-7 text-white shadow-lg shadow-pink-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black shrink-0 border border-white/20">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                {profileData.affectedSide} Leg Hemiparesis
              </span>
              <span className="text-xs font-mono text-pink-100">
                {profileData.strokeStage} Stage
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-1">
              {profileData.patientFirstName} {profileData.patientLastName}
            </h2>
            <p className="text-xs text-pink-100/90 mt-0.5">
              Supervising PTRP: <strong>{profileData.supervisingPT}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 self-stretch md:self-auto justify-around">
          <div>
            <span className="text-[10px] uppercase font-bold text-pink-200 block">Walking Capability</span>
            <span className="text-sm font-black capitalize">{profileData.mobilityAssistance}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-pink-200 block">Splint / Support</span>
            <span className="text-sm font-black capitalize">{profileData.assistiveDevice}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="px-1 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Target Kinematic Benchmarks
            </h3>
            <p className="text-xs text-slate-400">
              Clinical target values maintained and calibrated exclusively by your attending PTRP.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            PTRP Calibrated Only 🔒
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Target Bilateral Symmetry
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-3xl font-black text-slate-900">
                {profileData.baselineSymmetryTarget > 0 ? `${profileData.baselineSymmetryTarget}%` : '0%'}
              </span>
              <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                {profileData.baselineSymmetryTarget > 0 ? 'Calibrated' : 'N/A'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Adjusted by therapist</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Target Step Cadence
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-3xl font-black text-slate-900">
                {profileData.baselineCadenceTarget > 0 ? profileData.baselineCadenceTarget : '0'}{' '}
                <small className="text-xs font-bold text-slate-400">spm</small>
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {profileData.baselineCadenceTarget > 0 ? 'Target' : 'N/A'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Paced ambulation benchmark</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Sagittal Knee Deflection
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-3xl font-black text-slate-900">
                {profileData.baselineKneeAngleTarget > 0 ? `${profileData.baselineKneeAngleTarget}°` : '0°'}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {profileData.baselineKneeAngleTarget > 0 ? 'Target' : 'N/A'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Joint flexion benchmark</p>
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
            <p className="text-[11px] text-slate-400 mt-2">Ground reaction threshold</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-black text-slate-900">Patient Demographics</h4>
            <span className="text-xs font-mono font-bold text-slate-400 capitalize">{profileData.patientType}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Patient Name</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.patientFirstName} {profileData.patientLastName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Age & Gender</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.patientAge} yrs • {profileData.patientGender}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Occupation Status</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.patientWorkStatus}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Patient Contact</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">{profileData.patientPhoneNumber}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-medium">Patient Email</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.patientEmail}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-black text-slate-900">Primary Account & Access Profile</h4>
            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100 uppercase">
              {profileData.relationshipToPatient.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Account Owner</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.firstName} {profileData.lastName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Primary Phone</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">{profileData.phoneNumber}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-medium">Registered Account Email</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profileData.email}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mt-2 space-y-1">
            <span className="font-bold text-slate-800 block">Clinical Verification Lock:</span>
            <p>
              Hemiparesis side and target symmetry thresholds are clinician-locked to maintain clinical telemetry accuracy.
            </p>
          </div>
        </div>
      </div>

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
                  Patient Baseline Config
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Edit Rehabilitation Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOpenConfirm} noValidate className="space-y-4 pt-1">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-400 block">Account Contact Details</span>
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
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      placeholder="09XXXXXXXXX"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-400 block">Mobility & Clinical Configuration</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Walking Capability</label>
                    <select
                      value={editForm.mobilityAssistance}
                      onChange={(e) => setEditForm({ ...editForm, mobilityAssistance: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500"
                    >
                      <option value="independent">Independent Ambulation</option>
                      <option value="cane_walker">Assisted by Cane / Walker</option>
                      <option value="assisted">Physically Assisted</option>
                      <option value="wheelchair">Wheelchair Bound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Support Splint / Gear</label>
                    <select
                      value={editForm.assistiveDevice}
                      onChange={(e) => setEditForm({ ...editForm, assistiveDevice: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-pink-500"
                    >
                      <option value="none">None / Shoes Only</option>
                      <option value="orthosis_splint">Ankle-Foot Splint / Orthosis</option>
                      <option value="brace">Knee / Leg Brace</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-400">Affected Leg (Hemiparesis)</label>
                    <span className="text-[10px] text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                      Clinician Locked 🔒
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    readOnly
                    value={`${editForm.affectedSide} Leg (Locked by Supervising PTRP)`}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed select-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Side of hemiparesis can only be altered during clinical reassessment.
                  </p>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Review & Save →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white max-w-sm w-full p-6 rounded-[2rem] shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Confirm Changes</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update baseline settings?</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              Modifying walking capability and assistive gear directly impacts real-time sensor calibration thresholds.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleFinalSave}
                className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-200 transition cursor-pointer"
              >
                Confirm & Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}