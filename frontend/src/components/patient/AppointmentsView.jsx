import React, { useState, useMemo, useEffect } from 'react';
import NotificationToast from '../NotificationToast';
import { API_ENDPOINTS } from '../../config/api';

const THERAPY_OPTIONS = [
  { id: 'plantar_contact', label: 'Plantar Contact & Heel-Strike Training', icon: '🦶' },
  { id: 'parallel_bar', label: 'Parallel Bar Weight-Bearing Shift', icon: '⚖️' },
  { id: 'knee_deflection', label: 'Sagittal Knee Joint Orientation Trial', icon: '📐' },
  { id: 'afo_walk', label: 'Dynamic AFO Splint Corridor Walk', icon: '🚶' }
];

const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export default function AppointmentsView({ user }) {
  const [filter, setFilter] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [activeSidePanel, setActiveSidePanel] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', title: 'Notice' });

  const notify = (message, type = 'info', title = 'Notice') => setToast({ message, type, title });
  const clearToast = () => setToast(prev => ({ ...prev, message: '' }));

  const [form, setForm] = useState({
    therapy_type: 'plantar_contact',
    preferred_date: '',
    preferred_time: '',
    duration: 60,
    clinician_preference: 'auto_assign',
    notes: ''
  });

  const activeEmail = useMemo(() => {
    if (user?.email) return user.email;
    const cached = JSON.parse(localStorage.getItem('rehava_user') || '{}');
    return cached.email || '';
  }, [user]);

  const fetchAppointments = () => {
    if (!activeEmail) return;
    fetch(`${API_ENDPOINTS.APPOINTMENTS}?email=${encodeURIComponent(activeEmail)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => notify('Cannot connect to database for appointment records.', 'error', 'Network Error'));
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeEmail]);

  const calendarDays = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ empty: true, key: `pad-${i}` });
    }

    for (let d = 1; d <= totalDays; d++) {
      const cur = new Date(year, month, d);
      const dayOfWeek = cur.getDay();
      const isPast = cur < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const dayNum = String(cur.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${dayNum}`;

      days.push({
        day: d,
        dateStr,
        isClosed: isWeekend || isPast,
        key: dateStr
      });
    }
    return days;
  }, []);

  const handleValidateForm = (e) => {
    e.preventDefault();
    clearToast();
    if (!form.preferred_date) return notify('Please select a preferred clinic date.', 'error', 'Missing Date');
    if (!form.preferred_time) return notify('Please select a preferred session time.', 'error', 'Missing Time');
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    clearToast();
    setIsSubmitting(true);

    const therapyObj = THERAPY_OPTIONS.find(t => t.id === form.therapy_type);

    try {
      const res = await fetch(API_ENDPOINTS.BOOK_APPOINTMENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: activeEmail,
          therapy_type: form.therapy_type,
          therapy_title: therapyObj ? therapyObj.label : 'Physical Therapy Session',
          preferred_date: form.preferred_date,
          preferred_time: form.preferred_time,
          duration: form.duration,
          clinician_preference: form.clinician_preference,
          notes: form.notes
        })
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Database rejected appointment booking.');

      setAppointments(prev => [data.appointment, ...prev]);
      setShowBookModal(false);
      setActiveSidePanel(null);
      setForm({
        therapy_type: 'plantar_contact',
        preferred_date: '',
        preferred_time: '',
        duration: 60,
        clinician_preference: 'auto_assign',
        notes: ''
      });
      notify('Appointment request submitted and stored in MongoDB.', 'success', 'Session Booked');
    } catch (err) {
      notify(err.message, 'error', 'Booking Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const promptCancelAppointment = (apt) => {
    setAppointmentToCancel(apt);
    setShowCancelConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return;
    clearToast();
    setIsSubmitting(true);

    try {
      const cancelUrl = API_ENDPOINTS.CANCEL_APPOINTMENT
        ? (typeof API_ENDPOINTS.CANCEL_APPOINTMENT === 'function'
            ? API_ENDPOINTS.CANCEL_APPOINTMENT(appointmentToCancel._id)
            : `${API_ENDPOINTS.CANCEL_APPOINTMENT}/${appointmentToCancel._id}`)
        : `${API_ENDPOINTS.APPOINTMENTS}/cancel/${appointmentToCancel._id}`;

      const res = await fetch(cancelUrl, { method: 'PUT' });
      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error(data?.error || 'Failed to cancel appointment.');

      setAppointments(prev =>
        prev.map(apt => apt._id === appointmentToCancel._id ? { ...apt, status: 'cancelled' } : apt)
      );

      if (selectedAppointment && selectedAppointment._id === appointmentToCancel._id) {
        setSelectedAppointment(prev => ({ ...prev, status: 'cancelled' }));
      }

      setShowCancelConfirmModal(false);
      setAppointmentToCancel(null);
      notify('Appointment request has been cancelled.', 'success', 'Cancelled');
    } catch (err) {
      notify(err.message, 'error', 'Cancellation Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterCounts = useMemo(() => {
    const now = new Date();
    return {
      all: appointments.length,
      upcoming: appointments.filter(a => new Date(a.appointment_date) >= now && a.status !== 'cancelled' && a.status !== 'completed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      if (filter === 'upcoming') {
        return aptDate >= now && apt.status !== 'cancelled' && apt.status !== 'completed';
      }
      if (filter === 'completed') {
        return apt.status === 'completed';
      }
      if (filter === 'cancelled') {
        return apt.status === 'cancelled';
      }
      return true;
    });
  }, [appointments, filter]);

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      completed: 'bg-slate-100 text-slate-700 border-slate-200',
      cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
    }[status] || 'bg-slate-100 text-slate-600 border-slate-200';
    return <span className={`border px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${styles}`}>{status}</span>;
  };

  const selectedTherapyObj = THERAPY_OPTIONS.find(t => t.id === form.therapy_type);

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      <NotificationToast message={toast.message} type={toast.type} title={toast.title} onClose={clearToast} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Clinical Appointments</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Book physical therapy consultations, kinematic trials, and orthotic adjustments at Taguig PRU.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setShowBookModal(true); setActiveSidePanel(null); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>📅</span>
          <span>Book New Appointment</span>
        </button>
      </div>

      <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-100 flex items-start gap-3.5 shadow-2xs">
        <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-sm">ℹ️</span>
        <div className="space-y-0.5 text-xs text-slate-600">
          <h4 className="font-bold text-slate-900">Taguig PRU Clinic Guidelines</h4>
          <p>
            Operating Hours: <strong>Monday to Friday (8:00 AM – 5:00 PM)</strong>. Clinic is <strong>closed on Saturdays and Sundays</strong>. Clinical validation is required before telemetry slots are confirmed.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-fit text-xs font-bold">
          {[
            { id: 'all', label: 'All' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === tab.id
                  ? 'bg-slate-100 text-slate-800'
                  : 'bg-slate-200/70 text-slate-500'
              }`}>
                {filterCounts[tab.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 rounded-l-2xl">Therapy Focus</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Clinician</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 rounded-r-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-base font-bold text-slate-700">
                      {filter === 'cancelled' && 'No Cancelled Appointments'}
                      {filter === 'completed' && 'No Completed Sessions Yet'}
                      {filter === 'upcoming' && 'No Upcoming Appointments'}
                      {filter === 'all' && 'No Appointments Recorded'}
                    </p>
                    <p className="text-[11px] mt-1">
                      {filter === 'cancelled' && 'All your scheduled sessions are active or completed.'}
                      {filter === 'completed' && 'Completed therapy logs will automatically appear here.'}
                      {filter === 'upcoming' && 'Click Book New Appointment to request a clinic session.'}
                      {filter === 'all' && 'Book your first physical therapy consultation using the button above.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {THERAPY_OPTIONS.find(t => t.id === apt.therapy_type)?.icon} {apt.therapy_title}
                    </td>
                    <td className="py-4 px-4 font-mono">{apt.appointment_date.replace('T', ' ')}</td>
                    <td className="py-4 px-4 font-mono">{apt.duration} mins</td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {apt.therapist_name || <span className="text-amber-600 italic">Pending Assignment</span>}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(apt.status)}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAppointment(apt)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] cursor-pointer"
                        >
                          Inspect
                        </button>
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => promptCancelAppointment(apt)}
                            className="px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-[11px] transition cursor-pointer"
                            title="Cancel Request"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" onClick={() => { setShowBookModal(false); setActiveSidePanel(null); }}>
          <div className="relative flex items-center justify-center" onClick={e => e.stopPropagation()}>

            {activeSidePanel === 'date' && (
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white w-80 p-5 rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 z-20">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Select Clinic Date</h4>
                  <button type="button" onClick={() => setActiveSidePanel(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer">✕</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 my-2">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(item => (
                    item.empty ? <div key={item.key} className="h-8" /> : (
                      <button
                        key={item.key}
                        type="button"
                        disabled={item.isClosed}
                        onClick={() => {
                          setForm(p => ({ ...p, preferred_date: item.dateStr }));
                          setActiveSidePanel(null);
                        }}
                        className={`h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                          item.isClosed
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : form.preferred_date === item.dateStr
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer'
                        }`}
                      >
                        {item.day}
                      </button>
                    )
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3 text-center">Weekends and past dates are closed.</p>
              </div>
            )}

            <div className="bg-white max-w-md w-full p-7 rounded-[2rem] shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150 z-10 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">Taguig PRU Center</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Book Therapy Session</h3>
                </div>
                <button type="button" onClick={() => { setShowBookModal(false); setActiveSidePanel(null); }} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 font-bold cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleValidateForm} noValidate className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Therapy Focus *</label>
                  <select
                    value={form.therapy_type}
                    onChange={e => setForm({ ...form, therapy_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {THERAPY_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.icon} {opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Clinic Date *</label>
                    <button
                      type="button"
                      onClick={() => setActiveSidePanel(activeSidePanel === 'date' ? null : 'date')}
                      className={`w-full text-left px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold cursor-pointer transition ${activeSidePanel === 'date' ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-400'}`}
                    >
                      {form.preferred_date || 'Select Date →'}
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Session Time *</label>
                    <button
                      type="button"
                      onClick={() => setActiveSidePanel(activeSidePanel === 'time' ? null : 'time')}
                      className={`w-full text-left px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold cursor-pointer transition ${activeSidePanel === 'time' ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-400'}`}
                    >
                      {form.preferred_time || 'Select Time →'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Preferred Clinician</label>
                  <select
                    value={form.clinician_preference}
                    onChange={e => setForm({ ...form, clinician_preference: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="auto_assign">Any Available Clinician (System Allocated)</option>
                    <option value="Ms. Christine Joy Cabardo, PTRP">Ms. Christine Joy Cabardo, PTRP (Chief Biomechanist)</option>
                    <option value="Dr. Noel Nathaniel Napa, MD">Dr. Noel Nathaniel Napa, MD (Physiatrist)</option>
                    <option value="Elena Morales, PTRP">Elena Morales, PTRP (Stroke Mobility)</option>
                  </select>
                  <p className="text-[10px] text-amber-600 font-medium mt-1">
                    Note: Requested clinician is subject to clinic availability. Status remains pending until approved.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Clinical Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Mild pain around left knee joint after 10m walk..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => { setShowBookModal(false); setActiveSidePanel(null); }} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer">Proceed to Confirm →</button>
                </div>
              </form>
            </div>

            {activeSidePanel === 'time' && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white w-72 p-5 rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 z-20">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Scrollable Clinic Hours</h4>
                  <button type="button" onClick={() => setActiveSidePanel(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer">✕</button>
                </div>
                <div className="space-y-1.5 overflow-y-auto max-h-72 my-2 pr-1">
                  {TIME_SLOTS.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setForm(p => ({ ...p, preferred_time: time }));
                        setActiveSidePanel(null);
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                        form.preferred_time === time
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer'
                      }`}
                    >
                      <span>{time}</span>
                      <span className="text-[10px] font-normal">{form.preferred_time === time ? 'Selected ✓' : 'Available'}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 text-center">30-minute consultation slots.</p>
              </div>
            )}

          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs" onClick={() => !isSubmitting && setShowConfirmModal(false)}>
          <div className="bg-white max-w-sm w-full p-6 rounded-[2rem] shadow-2xl border border-slate-100 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Confirm Booking Request</h3>
                <p className="text-xs text-slate-400 mt-0.5">Please review your appointment details.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2 text-slate-700">
              <div className="pb-2 border-b border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Therapy Focus</span>
                <span className="font-extrabold text-slate-900 text-xs mt-0.5 flex items-center gap-1.5">
                  <span>{selectedTherapyObj?.icon}</span>
                  <span>{selectedTherapyObj?.label}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date</span>
                <span className="font-bold text-slate-900">{form.preferred_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time</span>
                <span className="font-bold text-slate-900">{form.preferred_time} ({form.duration} mins)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clinician</span>
                <span className="font-semibold text-indigo-700">
                  {form.clinician_preference === 'auto_assign' ? 'System Allocated (Pending)' : form.clinician_preference}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Clinical Notes</span>
                <p className="mt-0.5 italic text-slate-600">
                  {form.notes.trim() ? `"${form.notes.trim()}"` : 'None provided'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Your appointment will be saved and set to <strong>Pending Approval</strong> until verified by Taguig PRU staff.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer hover:bg-slate-50 transition disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-indigo-100 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirmModal && appointmentToCancel && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs" onClick={() => !isSubmitting && setShowCancelConfirmModal(false)}>
          <div className="bg-white max-w-sm w-full p-6 rounded-[2rem] shadow-2xl border border-slate-100 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <span className="text-lg">⚠️</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Cancel Appointment?</h3>
                <p className="text-xs text-slate-400 mt-0.5">This action will release your scheduled time slot.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-700">
              <p><strong>Session:</strong> {appointmentToCancel.therapy_title}</p>
              <p><strong>Scheduled:</strong> {appointmentToCancel.appointment_date.replace('T', ' ')}</p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => { setShowCancelConfirmModal(false); setAppointmentToCancel(null); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer hover:bg-slate-50 transition disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-md shadow-rose-200 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white max-w-sm w-full p-6 rounded-[2rem] shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{selectedAppointment._id}</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">{selectedAppointment.therapy_title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedAppointment(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 font-bold text-xs cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time</span>
                <span className="font-bold text-slate-900">{selectedAppointment.appointment_date.replace('T', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="font-mono text-slate-900">{selectedAppointment.duration} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clinician</span>
                <span className="font-semibold text-indigo-700">{selectedAppointment.therapist_name || 'Pending assignment'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span>{getStatusBadge(selectedAppointment.status)}</span>
              </div>
              {selectedAppointment.notes && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 block mb-0.5">Notes:</span>
                  <p className="italic text-slate-600">"{selectedAppointment.notes}"</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setSelectedAppointment(null)} className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer">
                Close
              </button>
              {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => promptCancelAppointment(selectedAppointment)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl cursor-pointer transition"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}