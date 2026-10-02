import React, { useState, useMemo } from 'react';

export default function AppointmentsView() {
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Form State para sa Booking
  const [newAppointment, setNewAppointment] = useState({
    therapy_type: 'plantar_contact',
    preferred_date: '',
    preferred_time: '',
    duration: 60,
    clinician_preference: 'Ms. Christine Joy Cabardo, PTRP',
    notes: ''
  });

  // Mock Clinical Appointments
  const [appointments, setAppointments] = useState([
    {
      _id: 'APT-101',
      therapy_type: 'plantar_contact',
      therapy_title: 'Plantar Contact & Heel-Strike Training',
      appointment_date: '2026-10-05T09:30:00', // Monday
      duration: 60,
      therapist_name: 'Ms. Christine Joy Cabardo, PTRP',
      status: 'confirmed',
      notes: 'Focus on FSR insole feedback during initial ground impact.',
      created_at: '2026-10-01T14:20:00'
    },
    {
      _id: 'APT-102',
      therapy_type: 'parallel_bar',
      therapy_title: 'Parallel Bar Weight-Bearing Shift',
      appointment_date: '2026-10-07T14:00:00', // Wednesday
      duration: 45,
      therapist_name: 'Elena Morales, PTRP',
      status: 'scheduled',
      notes: 'Single-limb support balance tolerance test.',
      created_at: '2026-10-02T10:15:00'
    },
    {
      _id: 'APT-103',
      therapy_type: 'knee_deflection',
      therapy_title: 'Sagittal Knee Angular Deflection Trial',
      appointment_date: '2026-10-09T10:00:00', // Friday
      duration: 60,
      therapist_name: null,
      status: 'pending',
      notes: 'Need assessment on knee buckling tendency during terminal swing.',
      created_at: '2026-10-02T16:00:00'
    },
    {
      _id: 'APT-100',
      therapy_type: 'afo_walk',
      therapy_title: 'Dynamic AFO Splint Tolerance Walk',
      appointment_date: '2026-09-28T09:00:00', // Past trial
      duration: 60,
      therapist_name: 'Ms. Christine Joy Cabardo, PTRP',
      status: 'completed',
      notes: '15-meter corridor pacing completed with 92.4% symmetry.',
      created_at: '2026-09-24T11:00:00'
    }
  ]);

  const THERAPY_OPTIONS = [
    { id: 'plantar_contact', label: 'Plantar Contact & Heel-Strike Training', icon: '🦶' },
    { id: 'parallel_bar', label: 'Parallel Bar Weight-Bearing Shift', icon: '⚖️' },
    { id: 'knee_deflection', label: 'Sagittal Knee Joint Orientation Trial', icon: '📐' },
    { id: 'afo_walk', label: 'Dynamic AFO Splint Corridor Walk', icon: '🚶' }
  ];

  // Validation & Booking Submission Logic (CVAPed rules applied)
  const handleBookAppointment = (e) => {
    e.preventDefault();

    if (!newAppointment.preferred_date || !newAppointment.preferred_time) {
      alert('Please specify both preferred date and time.');
      return;
    }

    const selectedDate = new Date(`${newAppointment.preferred_date}T${newAppointment.preferred_time}`);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, 3 = Wednesday, 5 = Friday

    // Validation 1: Clinic Open Days (MWF)
    if (dayOfWeek !== 1 && dayOfWeek !== 3 && dayOfWeek !== 5) {
      alert('Clinical rehabilitation appointments at Taguig PRU are scheduled on Monday, Wednesday, or Friday only.');
      return;
    }

    // Validation 2: Clinic Operating Hours (8:00 AM - 5:00 PM)
    const timeParts = newAppointment.preferred_time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    if (hours < 8 || hours > 17 || (hours === 17 && minutes > 0)) {
      alert('Appointments can only be booked between 8:00 AM and 5:00 PM.');
      return;
    }

    const therapyObj = THERAPY_OPTIONS.find(t => t.id === newAppointment.therapy_type);

    const createdAppointment = {
      _id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      therapy_type: newAppointment.therapy_type,
      therapy_title: therapyObj ? therapyObj.label : 'Physical Therapy Session',
      appointment_date: `${newAppointment.preferred_date}T${newAppointment.preferred_time}:00`,
      duration: newAppointment.duration,
      therapist_name: newAppointment.clinician_preference || null,
      status: 'pending',
      notes: newAppointment.notes || '',
      created_at: new Date().toISOString()
    };

    setAppointments([createdAppointment, ...appointments]);
    setShowBookModal(false);
    setNewAppointment({
      therapy_type: 'plantar_contact',
      preferred_date: '',
      preferred_time: '',
      duration: 60,
      clinician_preference: 'Ms. Christine Joy Cabardo, PTRP',
      notes: ''
    });

    alert('Appointment request submitted. A clinician will review your session schedule.');
  };

  const handleCancelAppointment = (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment request?')) return;

    setAppointments(prev =>
      prev.map(apt => apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt)
    );
    if (selectedAppointment && selectedAppointment._id === appointmentId) {
      setSelectedAppointment(null);
    }
  };

  // Filter List (Upcoming vs Past)
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    let list = appointments;

    if (filter === 'upcoming') {
      list = appointments.filter(apt =>
        new Date(apt.appointment_date) >= now &&
        apt.status !== 'cancelled' &&
        apt.status !== 'completed'
      );
    } else if (filter === 'past') {
      list = appointments.filter(apt =>
        new Date(apt.appointment_date) < now ||
        apt.status === 'cancelled' ||
        apt.status === 'completed'
      );
    }

    // Sort: Cancelled at bottom, newest date first
    return [...list].sort((a, b) => {
      if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
      if (a.status !== 'cancelled' && b.status === 'cancelled') return -1;
      return new Date(b.appointment_date) - new Date(a.appointment_date);
    });
  }, [appointments, filter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Confirmed</span>;
      case 'scheduled':
        return <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Scheduled</span>;
      case 'pending':
        return <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Pending Approval</span>;
      case 'completed':
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">{status}</span>;
    }
  };

  const getTherapyIcon = (type) => {
    const item = THERAPY_OPTIONS.find(t => t.id === type);
    return item ? item.icon : '🦶';
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Clinical Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Book physical therapy consultations, kinematic trials, and orthotic adjustments at Taguig PRU.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shadow-indigo-200 transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <span>📅</span>
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* 2. Policy & Operating Info Card */}
      <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-100 flex items-start gap-3.5 shadow-2xs">
        <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
          ℹ️
        </div>
        <div className="space-y-0.5 text-xs">
          <h4 className="font-bold text-slate-900">Taguig PRU Clinic Guidelines</h4>
          <p className="text-slate-600 leading-relaxed">
            Clinical gait testing occurs every <strong>Monday, Wednesday, and Friday (8:00 AM – 5:00 PM)</strong>. Requests require clinician validation before hardware telemetry trial slots are locked.
          </p>
        </div>
      </div>

      {/* 3. Main Appointments Table Container */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start w-fit text-xs font-bold shadow-2xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl transition ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-xl transition ${
              filter === 'upcoming'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Upcoming ({appointments.filter(a => new Date(a.appointment_date) >= new Date() && a.status !== 'cancelled' && a.status !== 'completed').length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-xl transition ${
              filter === 'past'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Past & Completed
          </button>
        </div>

        {/* Table View */}
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
                    No appointments found under this filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base shrink-0">
                          {getTherapyIcon(apt.therapy_type)}
                        </span>
                        <div>
                          <span className="font-extrabold text-slate-900 block">{apt.therapy_title}</span>
                          <span className="text-[10px] font-mono text-slate-400">{apt._id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className="font-bold text-slate-800 block">
                        {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(apt.appointment_date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-600">
                      {apt.duration} mins
                    </td>

                    <td className="py-4 px-4">
                      {apt.therapist_name ? (
                        <span className="font-semibold text-slate-800">{apt.therapist_name}</span>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-600 italic">Pending Assignment</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {getStatusBadge(apt.status)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition shadow-2xs"
                        >
                          View
                        </button>
                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelAppointment(apt._id)}
                            className="px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-[11px] transition"
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

      {/* 4. MODAL: BOOK NEW APPOINTMENT */}
      {showBookModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setShowBookModal(false)}
        >
          <div
            className="bg-white max-w-md w-full p-7 rounded-[2rem] shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Taguig PRU Rehab Center
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Book Therapy Session</h3>
              </div>
              <button
                onClick={() => setShowBookModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Therapy Focus / Protocol *</label>
                <select
                  value={newAppointment.therapy_type}
                  onChange={(e) => setNewAppointment({ ...newAppointment, therapy_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {THERAPY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.icon} {opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Preferred Date (MWF) *</label>
                  <input
                    type="date"
                    required
                    value={newAppointment.preferred_date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, preferred_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Time (8AM - 5PM) *</label>
                  <input
                    type="time"
                    required
                    value={newAppointment.preferred_time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, preferred_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Preferred Clinician</label>
                <select
                  value={newAppointment.clinician_preference}
                  onChange={(e) => setNewAppointment({ ...newAppointment, clinician_preference: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Ms. Christine Joy Cabardo, PTRP">Ms. Christine Joy Cabardo, PTRP (Chief Biomechanist)</option>
                  <option value="Dr. Noel Nathaniel Napa, MD">Dr. Noel Nathaniel Napa, MD (Physiatrist)</option>
                  <option value="Elena Morales, PTRP">Elena Morales, PTRP (Stroke Mobility Retraining)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Session Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mild pain around left knee joint after unassisted 10m walk..."
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: APPOINTMENT DETAILS */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="bg-white max-w-md w-full p-7 rounded-[2rem] shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                  {selectedAppointment._id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedAppointment.therapy_title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span>{getStatusBadge(selectedAppointment.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date</span>
                <span className="font-bold text-slate-800">
                  {new Date(selectedAppointment.appointment_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time</span>
                <span className="font-bold text-slate-800">
                  {new Date(selectedAppointment.appointment_date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Supervising PT</span>
                <span className="font-bold text-indigo-700">
                  {selectedAppointment.therapist_name || 'Pending assignment'}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-slate-400 block mb-0.5">Patient Clinical Notes:</span>
                  <p className="text-slate-700 italic">"{selectedAppointment.notes}"</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition"
              >
                Close
              </button>
              {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelAppointment(selectedAppointment._id)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}