import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import TermsOfServiceModal from './TermsOfServiceModal';
import { API_ENDPOINTS } from '../config/api';
import logo from '../assets/logo.png';

export default function RegisterPage({ onNavigateLogin, onRegisterSuccess, onBackToLanding }) {
  const [currentTab, setCurrentTab] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    relationshipToPatient: 'patient_self', password: '', confirmPassword: '',
    patientType: 'myself', patientFirstName: '', patientLastName: '',
    patientEmail: '', patientPhoneNumber: '', patientAge: '',
    patientGender: '', patientWorkStatus: 'unspecified',
    affectedSide: 'left', strokeStage: 'subacute',
    mobilityAssistance: 'cane_walker', assistiveDevice: 'none',
  });

  const handleChange = (e) => {
    setErrorMsg('');
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRelationshipChange = (e) => {
    const rel = e.target.value;
    const isSelf = rel === 'patient_self';
    setFormData(prev => ({
      ...prev, relationshipToPatient: rel, patientType: isSelf ? 'myself' : 'dependent',
      patientFirstName: isSelf ? prev.firstName : '', patientLastName: isSelf ? prev.lastName : '',
      patientEmail: isSelf ? prev.email : '', patientPhoneNumber: isSelf ? prev.phoneNumber : '',
    }));
  };

  const handlePatientTypeChange = (type) => {
    const isSelf = type === 'myself';
    setFormData(prev => ({
      ...prev, patientType: type,
      relationshipToPatient: isSelf ? 'patient_self' : (prev.relationshipToPatient === 'patient_self' ? 'family_member' : prev.relationshipToPatient),
      patientFirstName: isSelf ? prev.firstName : '', patientLastName: isSelf ? prev.lastName : '',
      patientEmail: isSelf ? prev.email : '', patientPhoneNumber: isSelf ? prev.phoneNumber : '',
    }));
  };

  const handleProceedToStep2 = () => {
    if (formData.patientType === 'myself') {
      setFormData(prev => ({
        ...prev, patientFirstName: prev.firstName, patientLastName: prev.lastName,
        patientEmail: prev.email, patientPhoneNumber: prev.phoneNumber,
      }));
    }
    setCurrentTab(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!agreedToTerms) return setErrorMsg('Please read and accept the Terms of Service.');
    if (formData.password !== formData.confirmPassword) return setErrorMsg('Passwords do not match.');
    if (formData.password.length < 6) return setErrorMsg('Password must be at least 6 characters.');

    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      onRegisterSuccess(data.role === 'patient' ? 'Stroke Rehabilitation Patient' : 'Caregiver Support');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eyeIcon = (open) => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
      ) : (
        <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
      )}
    </svg>
  );

  const renderField = (label, name, type = 'text', readOnly = false, opts = null, extra = {}) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label} {readOnly && <span className="text-[10px] text-slate-400 font-normal">(Auto-filled)</span>}
      </label>
      {opts ? (
        <select name={name} value={formData[name]} onChange={name === 'relationshipToPatient' ? handleRelationshipChange : handleChange} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500">
          {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          required={!readOnly}
          readOnly={readOnly}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none transition ${readOnly ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-slate-50 text-slate-800 border-slate-200 focus:border-pink-500'}`}
          {...extra}
        />
      )}
    </div>
  );

  return (
    <AuthLayout>
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-[580px]">
        {/* Left Col: Step Navigation */}
        <div className="w-full md:w-5/12 p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 bg-gradient-to-b from-white via-pink-50/20 to-pink-50/40">
          <div>
            <button type="button" onClick={onBackToLanding} className="text-xs font-semibold text-slate-400 hover:text-pink-600 transition flex items-center gap-1.5 mb-5">← Back to Home</button>
            <div className="flex items-center gap-3 mb-2">
              <img src={logo} alt="REHAVA Logo" className="h-11 w-auto object-contain" />
              <div>
                <h1 className="text-2xl font-black text-slate-900 leading-none">REHA<span className="text-pink-600">VA</span></h1>
                <span className="text-[11px] font-bold text-pink-500 uppercase tracking-widest">Stroke Rehabilitation</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">Lower-limb physical therapy portal designed for stroke recovery, gait re-education, and real-time biomechanical telemetry.</p>
          </div>

          <div className="my-6 space-y-2.5">
            {[
              { num: 1, title: 'Account Credentials', desc: 'Primary user contact & login' },
              { num: 2, title: 'Patient Demographics', desc: 'Clinical identity & details' },
              { num: 3, title: 'Stroke Therapy Profile', desc: 'Lower-limb hemiparesis baseline' }
            ].map(step => (
              <button key={step.num} type="button" onClick={() => step.num === 2 ? handleProceedToStep2() : setCurrentTab(step.num)} className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center gap-3.5 ${currentTab === step.num ? 'bg-white border-pink-300 shadow-md shadow-pink-100 text-pink-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${currentTab === step.num ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{step.num}</span>
                <div><p className="text-xs font-bold text-slate-800">{step.title}</p><p className="text-[11px] text-slate-400">{step.desc}</p></div>
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Already have an account? <button type="button" onClick={onNavigateLogin} className="font-bold text-pink-600 hover:text-pink-700 underline">Sign in here</button>
          </div>
        </div>

        {/* Right Col: Form Steps */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 flex flex-col justify-center overflow-y-auto">
          {errorMsg && <div className="mb-3.5 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">⚠️ {errorMsg}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* STEP 1 */}
            {currentTab === 1 && (
              <div className="space-y-3.5">
                <div className="border-b border-slate-100 pb-2.5">
                  <h3 className="text-lg font-extrabold text-slate-800">Step 1: Account Credentials</h3>
                  <p className="text-xs text-slate-400">Enter your primary contact credentials and relationship to the patient.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField('First Name *', 'firstName', 'text', false, null, { placeholder: 'First Name' })}
                  {renderField('Last Name *', 'lastName', 'text', false, null, { placeholder: 'Last Name' })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField('Email Address *', 'email', 'email', false, null, { placeholder: 'name@example.com' })}
                  {renderField('Phone Number *', 'phoneNumber', 'tel', false, null, { placeholder: '+63 912 345 6789' })}
                </div>
                {renderField('Relationship to Patient *', 'relationshipToPatient', 'text', false, [
                  { v: 'patient_self', l: 'Patient / Self (I am registering for myself)' },
                  { v: 'family_member', l: 'Family Member (Spouse / Child / Parent / Sibling)' },
                  { v: 'caregiver', l: 'Primary Caregiver / Relative Support' },
                  { v: 'guardian', l: 'Legal Guardian / Representative' },
                  { v: 'other', l: 'Other' },
                ])}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Password *</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{eyeIcon(showPassword)}</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password *</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required minLength={6} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{eyeIcon(showConfirmPassword)}</button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-3">
                  <button type="button" onClick={handleProceedToStep2} className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-md transition">Next: Patient Demographics →</button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentTab === 2 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2.5">
                  <h3 className="text-lg font-extrabold text-slate-800">Step 2: Patient Demographics</h3>
                  <p className="text-xs text-slate-400">Specify who will undergo physical therapy monitoring.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Who is this account for? *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ type: 'myself', label: 'Myself (I am the Patient)' }, { type: 'dependent', label: 'Family Member / Dependent' }].map(t => (
                      <label key={t.type} className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition ${formData.patientType === t.type ? 'border-pink-500 bg-pink-50/40 text-pink-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                        <input type="radio" name="patientType" value={t.type} checked={formData.patientType === t.type} onChange={() => handlePatientTypeChange(t.type)} className="accent-pink-600" />
                        <span className="text-xs font-bold">{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField('Patient First Name *', 'patientFirstName', 'text', formData.patientType === 'myself')}
                  {renderField('Patient Last Name *', 'patientLastName', 'text', formData.patientType === 'myself')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField('Patient Email Address *', 'patientEmail', 'email', formData.patientType === 'myself')}
                  {renderField('Patient Phone Number *', 'patientPhoneNumber', 'tel', formData.patientType === 'myself')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderField('Patient Age *', 'patientAge', 'number', false, null, { min: '1', max: '120', placeholder: 'e.g. 58' })}
                  {renderField('Patient Gender *', 'patientGender', 'text', false, [{ v: '', l: 'Select Gender' }, { v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }, { v: 'other', l: 'Other' }, { v: 'prefer-not-to-say', l: 'Prefer not to say' }])}
                  {renderField('Occupation Status', 'patientWorkStatus', 'text', false, [{ v: 'unspecified', l: 'Unspecified' }, { v: 'employed', l: 'Employed' }, { v: 'retired', l: 'Retired' }, { v: 'unable_to_work', l: 'Unable to Work' }])}
                </div>
                <div className="flex justify-between pt-3">
                  <button type="button" onClick={() => setCurrentTab(1)} className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold px-5 py-2.5 rounded-xl transition">← Back</button>
                  <button type="button" onClick={() => setCurrentTab(3)} className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-md transition">Next: Therapy Profile →</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentTab === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2.5">
                  <h3 className="text-lg font-extrabold text-slate-800">Step 3: Lower-Limb Stroke Therapy Profile</h3>
                  <p className="text-xs text-slate-400">Baseline parameters for sensor positioning and gait calibration.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField('Affected Leg (Hemiparesis) *', 'affectedSide', 'text', false, [{ v: 'left', l: 'Left Leg (Left Hemiparesis)' }, { v: 'right', l: 'Right Leg (Right Hemiparesis)' }, { v: 'bilateral', l: 'Bilateral (Both Legs Affected)' }])}
                  {renderField('Stroke Recovery Stage *', 'strokeStage', 'text', false, [{ v: 'acute', l: 'Early / Acute Stage (< 3 months)' }, { v: 'subacute', l: 'Subacute Rehabilitation (3 – 6 months)' }, { v: 'chronic', l: 'Chronic Recovery (> 6 months)' }])}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField('Current Walking Capability *', 'mobilityAssistance', 'text', false, [{ v: 'independent', l: 'Independent Ambulation' }, { v: 'cane_walker', l: 'Assisted by Cane / Quad Cane / Walker' }, { v: 'assisted', l: 'Physically Assisted by Caregiver / Therapist' }, { v: 'wheelchair', l: 'Wheelchair Bound (Parallel Bar Practice)' }])}
                  {renderField('Support / Splint Gear *', 'assistiveDevice', 'text', false, [{ v: 'none', l: 'No External Splint / Barefoot / Shoes Only' }, { v: 'orthosis_splint', l: 'Using Ankle-Foot Splint / Orthosis' }, { v: 'brace', l: 'Using Knee / Leg Support Brace' }])}
                </div>
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="accent-pink-600 rounded mt-0.5 w-4 h-4 shrink-0" />
                    <span className="text-xs text-slate-500 leading-relaxed">
                      I have read and agree to the <button type="button" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-pink-600 font-bold underline hover:text-pink-700">Terms of Service</button> and consent to continuous kinematic telemetry processing for lower-limb stroke physical therapy.
                    </span>
                  </label>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <button type="button" onClick={() => setCurrentTab(2)} className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold px-5 py-2.5 rounded-xl transition">← Back</button>
                  <button type="submit" disabled={!agreedToTerms || loading} className={`text-xs font-bold px-7 py-2.5 rounded-xl transition shadow-lg ${agreedToTerms && !loading ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-200 cursor-pointer active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60'}`}>
                    {loading ? 'Submitting Registration...' : 'Complete Registration ✓'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <TermsOfServiceModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} onAccept={() => setAgreedToTerms(true)} />
    </AuthLayout>
  );
}