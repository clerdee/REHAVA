import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PatientDashboard from './components/PatientDashboard';
import TherapistDashboard from './components/TherapistDashboard';
import DashboardView from './components/DashboardView';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

function App() {
  // 'landing' | 'login' | 'register' | 'patient' | 'therapist' | 'dashboard' | 'admin'
  const [currentPage, setCurrentPage] = useState('patient');
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (role, userData = null) => {
    setUserRole(role);
    setCurrentUser(userData || { firstName: 'Roberto', lastName: 'Dela Cruz', role });

    const normalizedRole = (role || '').toLowerCase();

    if (normalizedRole.includes('admin')) {
      setCurrentPage('admin');
    } else if (normalizedRole.includes('patient') || normalizedRole.includes('caregiver')) {
      setCurrentPage('patient');
    } else if (normalizedRole.includes('therapist') || normalizedRole.includes('clinician')) {
      setCurrentPage('therapist');
    } else {
      // Default fallback para sa direct live hardware session
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  // Itago ang general Navbar & Footer sa mga standalone portals
  const hideStandardNav = 
    currentPage === 'login' || 
    currentPage === 'register' || 
    currentPage === 'admin' || 
    currentPage === 'patient' ||
    currentPage === 'therapist';

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      
      {/* Lalabas lamang ang default Navbar sa Landing at direct Hardware view */}
      {!hideStandardNav && (
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onOpenLogin={() => setCurrentPage('login')}
          userRole={userRole}
        />
      )}

      {/* Dynamic Views Switcher */}
      <main className="flex-1 flex flex-col">
        
        {/* 1. Public Landing Page */}
        {currentPage === 'landing' && (
          <LandingPage
            onOpenLogin={() => setCurrentPage('login')}
            onDemoLaunch={() => handleLoginSuccess('Physical Therapist')}
            onNavigateRegister={() => setCurrentPage('register')}
          />
        )}

        {/* 2. Login Page */}
        {currentPage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateRegister={() => setCurrentPage('register')}
            onBackToLanding={() => setCurrentPage('landing')}
          />
        )}

        {/* 3. Register Page */}
        {currentPage === 'register' && (
          <RegisterPage
            onNavigateLogin={() => setCurrentPage('login')}
            onRegisterSuccess={handleLoginSuccess}
            onBackToLanding={() => setCurrentPage('landing')}
          />
        )}

        {/* 4. Patient Portal */}
        {currentPage === 'patient' && (
          <PatientDashboard
            user={currentUser}
            onLogout={handleLogout}
            onLaunchLiveTelemetry={() => setCurrentPage('dashboard')}
          />
        )}

        {/* 5. Therapist / Clinician Dashboard */}
        {currentPage === 'therapist' && (
          <TherapistDashboard
            onLogout={handleLogout}
            onLaunchLiveStream={() => setCurrentPage('dashboard')}
          />
        )}

        {/* 6. Raw Hardware Telemetry View (ESP32 Stream via COM4) */}
        {currentPage === 'dashboard' && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 pt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  const normalized = (userRole || '').toLowerCase();
                  if (normalized.includes('patient')) setCurrentPage('patient');
                  else if (normalized.includes('therapist') || normalized.includes('clinician')) setCurrentPage('therapist');
                  else if (normalized.includes('admin')) setCurrentPage('admin');
                  else setCurrentPage('landing');
                }}
                className="text-xs font-bold text-slate-500 hover:text-pink-600 transition flex items-center gap-1"
              >
                ← Back to Dashboard
              </button>
            </div>
            <DashboardView />
          </div>
        )}

        {/* 7. Administrative Dashboard */}
        {currentPage === 'admin' && (
          <AdminDashboard onLogout={handleLogout} />
        )}

      </main>

      {!hideStandardNav && <Footer />}
    </div>
  );
}

export default App;