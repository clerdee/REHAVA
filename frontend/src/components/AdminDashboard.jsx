import React, { useState } from 'react';
import logo from '../assets/logo.png';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'hardware'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'patient' | 'therapist' | 'admin'
  const [conditionFilter, setConditionFilter] = useState('all'); // 'all' | 'Left Hemiparesis' | 'Right Hemiparesis' | 'Bilateral'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Active' | 'Inactive'
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  // Interactive Modal & Action States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [statusToggleConfirm, setStatusToggleConfirm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'patient',
    condition: 'Left Hemiparesis',
    status: 'Active'
  });

  // Clinical Registry State
  const [users, setUsers] = useState([
    {
      id: 'USR-801',
      firstName: 'Roberto',
      lastName: 'Dela Cruz',
      email: 'roberto.dc@gmail.com',
      role: 'patient',
      condition: 'Left Hemiparesis',
      assignedTherapist: 'Ms. Cabardo, PTRP',
      status: 'Active',
      lastSession: '2026-09-18 10:45 AM',
      created_at: '2026-02-14'
    },
    {
      id: 'USR-802',
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@rehab.ph',
      role: 'therapist',
      condition: 'PRC-PTR #0048192',
      assignedTherapist: 'Clinical Supervisor',
      status: 'Active',
      lastSession: 'Live Stream Active',
      created_at: '2026-01-20'
    },
    {
      id: 'USR-803',
      firstName: 'Nestor',
      lastName: 'Valdez',
      email: 'admin.valdez@rehava.health',
      role: 'admin',
      condition: 'System Architect',
      assignedTherapist: 'Root Administrator',
      status: 'Active',
      lastSession: '2026-09-20 02:15 AM',
      created_at: '2025-11-05'
    },
    {
      id: 'USR-804',
      firstName: 'Amado',
      lastName: 'Reyes',
      email: 'amado.reyes@yahoo.com',
      role: 'patient',
      condition: 'Right Hemiparesis',
      assignedTherapist: 'Dr. Napa, MD',
      status: 'Inactive',
      lastSession: '2026-09-12 03:20 PM',
      created_at: '2026-03-01'
    },
    {
      id: 'USR-805',
      firstName: 'Christine Joy',
      lastName: 'Cabardo',
      email: 'cabardo.cj@taguig.gov.ph',
      role: 'therapist',
      condition: 'Chief Physical Therapist',
      assignedTherapist: 'Department Head',
      status: 'Active',
      lastSession: 'Live Stream Active',
      created_at: '2025-12-10'
    },
    {
      id: 'USR-806',
      firstName: 'Danilo',
      lastName: 'Cortez',
      email: 'danilo.cortez@gmail.com',
      role: 'patient',
      condition: 'Bilateral Stroke Impairment',
      assignedTherapist: 'Ms. Cabardo, PTRP',
      status: 'Active',
      lastSession: '2026-09-19 11:30 AM',
      created_at: '2026-04-11'
    },
    {
      id: 'USR-807',
      firstName: 'Elena',
      lastName: 'Morales',
      email: 'elena.morales@tup.edu.ph',
      role: 'therapist',
      condition: 'Clinical Fellow',
      assignedTherapist: 'Dr. Napa, MD',
      status: 'Active',
      lastSession: '2026-09-19 04:00 PM',
      created_at: '2026-05-18'
    }
  ]);

  // Telemetry Hardware Nodes Registry
  const [hardwareNodes] = useState([
    { id: 'NODE-ESP-01', targetLeg: 'Left (FSR + MPU6050)', port: 'COM4', baud: '115200', battery: '94%', state: 'ONLINE', signal: '-58 dBm' },
    { id: 'NODE-ESP-02', targetLeg: 'Right Reference Insole', port: 'COM5', baud: '115200', battery: '88%', state: 'STANDBY', signal: '-64 dBm' },
    { id: 'NODE-ESP-03', targetLeg: 'Knee Goniometer IMU', port: 'Wireless BLE', baud: 'Virtual', battery: '76%', state: 'PAIRED', signal: '-52 dBm' }
  ]);

  // Multi-Category Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.condition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = roleFilter === 'all' || u.role === roleFilter;

    const matchCondition =
      conditionFilter === 'all' ||
      u.condition.toLowerCase().includes(conditionFilter.toLowerCase());

    const matchStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchSearch && matchRole && matchCondition && matchStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / perPage) || 1;
  const displayedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Statistics
  const totalUsers = users.length;
  const totalPatients = users.filter(u => u.role === 'patient').length;
  const totalTherapists = users.filter(u => u.role === 'therapist').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  const patientPct = Math.round((totalPatients / totalUsers) * 100) || 0;
  const therapistPct = Math.round((totalTherapists / totalUsers) * 100) || 0;
  const adminPct = Math.round((totalAdmins / totalUsers) * 100) || 0;

  // Handlers
  const handleAddUser = (e) => {
    e.preventDefault();
    const created = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      ...newUser,
      assignedTherapist: 'Unassigned',
      lastSession: 'Pending First Session',
      created_at: new Date().toISOString().split('T')[0]
    };
    setUsers([created, ...users]);
    setShowAddModal(false);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      role: 'patient',
      condition: 'Left Hemiparesis',
      status: 'Active'
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    if (selectedUserDetail?.id === editingUser.id) {
      setSelectedUserDetail(editingUser);
    }
    setEditingUser(null);
  };

  const handleToggleStatus = () => {
    if (!statusToggleConfirm) return;
    const nextStatus = statusToggleConfirm.currentStatus === 'Active' ? 'Inactive' : 'Active';
    setUsers(prev => prev.map(u => u.id === statusToggleConfirm.id ? { ...u, status: nextStatus } : u));
    if (selectedUserDetail?.id === statusToggleConfirm.id) {
      setSelectedUserDetail(prev => ({ ...prev, status: nextStatus }));
    }
    setStatusToggleConfirm(null);
  };

  const handleDeleteUser = () => {
    if (!deleteConfirm) return;
    setUsers(prev => prev.filter(u => u.id !== deleteConfirm.id));
    if (selectedUserDetail?.id === deleteConfirm.id) setSelectedUserDetail(null);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Top Clinical Header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="REHAVA Logo" className="h-8 w-auto object-contain" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  REHA<span className="text-pink-600">VA</span>
                </span>
                <span className="text-[10px] font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Workspace
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Taguig PRU Clinical Node • Stroke Kinematics</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              FastAPI Engine Online
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

            <button
              onClick={onLogout}
              className="text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3.5 py-1.5 rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Professional Canvas */}
      <div className="max-w-7xl mx-auto px-6 py-6 w-full flex-1 flex flex-col gap-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>User Management</span>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'hardware'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span>Wearable Hardware</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-pink-200 transition flex items-center gap-2"
          >
            <span>+ Add Clinical User</span>
          </button>
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Stat Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Registry</span>
                  <span className="text-3xl font-black text-slate-900 mt-1 block">{totalUsers}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">Active Institutional DB</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl">👥</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stroke Patients</span>
                  <span className="text-3xl font-black text-pink-600 mt-1 block">{totalPatients}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{patientPct}% of registered cohort</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl">🦶</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Physical Therapists</span>
                  <span className="text-3xl font-black text-indigo-600 mt-1 block">{totalTherapists}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{therapistPct}% clinical assignment</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">🩺</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ESP32 Nodes Online</span>
                  <span className="text-3xl font-black text-emerald-600 mt-1 block">3 / 3</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">100% Signal Integrity</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">⚡</div>
              </div>
            </div>

            {/* Split Visual Analytics Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Panel: Clinical Demographic & Role Distribution */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Clinical Allocation Distribution</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Continuous patient-to-therapist coverage</p>
                </div>

                <div className="my-6 space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                        Stroke Rehabilitation Patients
                      </span>
                      <span className="font-mono text-slate-500">{totalPatients} Patients ({patientPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-pink-500 h-full rounded-full transition-all duration-300" style={{ width: `${patientPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                        Physical Therapists & Physiatrists
                      </span>
                      <span className="font-mono text-slate-500">{totalTherapists} Clinicians ({therapistPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${therapistPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                        Administrative Governance
                      </span>
                      <span className="font-mono text-slate-500">{totalAdmins} Administrators ({adminPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-slate-500 h-full rounded-full transition-all duration-300" style={{ width: `${adminPct}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Sampling rate: 5 Hz (ESP32 Serial stream)</span>
                  <span className="font-bold text-pink-600">Optimal Buffer</span>
                </div>
              </div>

              {/* Right Panel: Live Activity Logs */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Telemetry Activity</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time session events & hardware audit logs</p>
                </div>

                <div className="space-y-3.5 my-5">
                  <div className="p-3 bg-pink-50/50 border border-pink-100 rounded-2xl flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Roberto Dela Cruz (USR-801)</p>
                      <p className="text-[11px] text-slate-500">Gait telemetry logged: FSR pressure peaked at 2410 ADC.</p>
                      <span className="text-[10px] text-slate-400 font-mono">10 mins ago</span>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Ms. Christine Joy Cabardo, PTRP</p>
                      <p className="text-[11px] text-slate-500">Live session stream active on COM4 (Left Leg IMU).</p>
                      <span className="text-[10px] text-slate-400 font-mono">Live now</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Taguig PRU Mesh</p>
                      <p className="text-[11px] text-slate-500">Serial connection validated without frame drops.</p>
                      <span className="text-[10px] text-slate-400 font-mono">1 hour ago</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 text-right">
                  Auto-syncing with Local FastAPI Server (Port 5000)
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="w-full lg:w-80 relative">
                <input
                  type="text"
                  placeholder="Search by name, email, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end text-xs">
                
                {/* Role Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Role:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="patient">Stroke Patients</option>
                    <option value="therapist">Physical Therapists</option>
                    <option value="admin">Administrators</option>
                  </select>
                </div>

                {/* Condition Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Diagnosis:</span>
                  <select
                    value={conditionFilter}
                    onChange={(e) => {
                      setConditionFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">All Diagnoses</option>
                    <option value="Left Hemiparesis">Left Hemiparesis</option>
                    <option value="Right Hemiparesis">Right Hemiparesis</option>
                    <option value="Bilateral">Bilateral Impairment</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Page Size */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-400">Show:</span>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-pink-500"
                  >
                    <option value={8}>8 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={30}>30 per page</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Split Screen Layout: Table + Side Details Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Users Table */}
              <div className={`bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-200 ${
                selectedUserDetail ? 'lg:col-span-8' : 'lg:col-span-12'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-6">User / Patient</th>
                        <th className="py-3 px-6">Role</th>
                        <th className="py-3 px-6">Diagnosis / Details</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Last Session</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {displayedUsers.length > 0 ? (
                        displayedUsers.map((u) => (
                          <tr
                            key={u.id}
                            onClick={() => setSelectedUserDetail(u)}
                            className={`hover:bg-slate-50 cursor-pointer transition ${
                              selectedUserDetail?.id === u.id ? 'bg-pink-50/40' : ''
                            }`}
                          >
                            <td className="py-3.5 px-6">
                              <p className="font-bold text-slate-900">{u.firstName} {u.lastName}</p>
                              <p className="font-mono text-[11px] text-slate-400">{u.email}</p>
                            </td>

                            <td className="py-3.5 px-6">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'patient'
                                  ? 'bg-pink-50 text-pink-700 border border-pink-100'
                                  : u.role === 'therapist'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {u.role}
                              </span>
                            </td>

                            <td className="py-3.5 px-6 font-medium text-slate-600">
                              {u.condition}
                            </td>

                            <td className="py-3.5 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                u.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                {u.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-6 text-slate-500 text-[11px] font-mono">
                              {u.lastSession}
                            </td>

                            <td className="py-3.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Edit Button */}
                                <button
                                  onClick={() => setEditingUser({ ...u })}
                                  className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-[11px] font-semibold transition"
                                >
                                  Edit
                                </button>

                                {/* Deactivate/Activate Toggle Button */}
                                <button
                                  onClick={() => setStatusToggleConfirm({ id: u.id, name: `${u.firstName} ${u.lastName}`, currentStatus: u.status })}
                                  className={`px-2.5 py-1 border rounded-lg text-[11px] font-semibold transition ${
                                    u.status === 'Active'
                                      ? 'border-amber-200 hover:bg-amber-50 text-amber-700'
                                      : 'border-emerald-200 hover:bg-emerald-50 text-emerald-700'
                                  }`}
                                >
                                  {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>

                                {/* Delete Button */}
                                <button
                                  onClick={() => setDeleteConfirm({ id: u.id, name: `${u.firstName} ${u.lastName}` })}
                                  className="px-2.5 py-1 border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-lg text-[11px] font-semibold transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No records matching the filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination Bar */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
                  <span>
                    Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredUsers.length} total filtered records)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-1.5 border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 font-semibold transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage >= totalPages}
                      className="px-3.5 py-1.5 border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 font-semibold transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Detail Card (Opens upon row click) */}
              {selectedUserDetail && (
                <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-pink-200 shadow-xl shadow-pink-100/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Clinical Dossier</span>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">{selectedUserDetail.firstName} {selectedUserDetail.lastName}</h4>
                      </div>
                      <button
                        onClick={() => setSelectedUserDetail(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="mt-5 space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Account ID & Email</span>
                        <span className="font-mono text-slate-700">{selectedUserDetail.id} • {selectedUserDetail.email}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Role & Diagnosis</span>
                        <span className="font-bold text-slate-800">{selectedUserDetail.role.toUpperCase()} — {selectedUserDetail.condition}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          selectedUserDetail.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          ● {selectedUserDetail.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Therapist</span>
                        <span className="font-semibold text-slate-700">{selectedUserDetail.assignedTherapist}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Date</span>
                        <span className="font-mono text-slate-600">{selectedUserDetail.created_at}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => setEditingUser({ ...selectedUserDetail })}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
                    >
                      Edit Dossier
                    </button>
                    <button
                      onClick={() => alert(`Launching telemetry viewer for ${selectedUserDetail.firstName}`)}
                      className="flex-1 bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-pink-200 transition"
                    >
                      View Telemetry
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 3: WEARABLE HARDWARE NODES */}
        {activeTab === 'hardware' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">ESP32 Wearable Telemetry Nodes</h3>
              <p className="text-xs text-slate-400 mt-0.5">Physical device status, serial baud rates, and live telemetry channels</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {hardwareNodes.map((node) => (
                  <div key={node.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono font-bold text-xs text-slate-800">{node.id}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ● {node.state}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{node.targetLeg}</h4>
                      <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-mono">
                        <p>Interface: <strong className="text-slate-700">{node.port}</strong></p>
                        <p>Baud: <strong className="text-slate-700">{node.baud}</strong></p>
                        <p>Signal: <strong className="text-slate-700">{node.signal}</strong></p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Battery</span>
                      <span className="font-bold text-emerald-600">{node.battery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD CLINICAL USER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900">Register Clinical Account</h3>
            <p className="text-xs text-slate-400 mt-0.5">Add a new stroke patient or clinician to the active registry.</p>

            <form onSubmit={handleAddUser} className="space-y-3.5 mt-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-semibold"
                  >
                    <option value="patient">patient</option>
                    <option value="therapist">therapist</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Diagnosis</label>
                  <select
                    value={newUser.condition}
                    onChange={(e) => setNewUser({ ...newUser, condition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-semibold"
                  >
                    <option value="Left Hemiparesis">Left Hemiparesis</option>
                    <option value="Right Hemiparesis">Right Hemiparesis</option>
                    <option value="Bilateral Stroke Impairment">Bilateral Impairment</option>
                    <option value="Licensed Physical Therapist">Licensed Therapist</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-200"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER DOSSIER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900">Edit Clinical User Dossier</h3>
            <p className="text-xs text-slate-400 mt-0.5">Modify profile attributes for <strong>{editingUser.firstName} {editingUser.lastName}</strong>.</p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 mt-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-semibold"
                  >
                    <option value="patient">patient</option>
                    <option value="therapist">therapist</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Diagnosis / Details</label>
                  <input
                    type="text"
                    required
                    value={editingUser.condition}
                    onChange={(e) => setEditingUser({ ...editingUser, condition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DEACTIVATE / ACTIVATE TOGGLE CONFIRMATION */}
      {statusToggleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900">
              {statusToggleConfirm.currentStatus === 'Active' ? 'Deactivate User Account?' : 'Activate User Account?'}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to {statusToggleConfirm.currentStatus === 'Active' ? 'suspend telemetry ingestion for' : 're-enable access for'}{' '}
              <strong>{statusToggleConfirm.name}</strong>?
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setStatusToggleConfirm(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold shadow-md transition ${
                  statusToggleConfirm.currentStatus === 'Active'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200'
                }`}
              >
                Confirm {statusToggleConfirm.currentStatus === 'Active' ? 'Deactivation' : 'Activation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900">Permanently Delete Record?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to permanently remove <strong>{deleteConfirm.name}</strong> from the clinical registry? Telemetry sessions linked to this ID will be severed.
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}