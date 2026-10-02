import React from 'react';
import Hero from './Hero';
import About from './About';

export default function LandingPage({ onOpenLogin, onDemoLaunch, onNavigateRegister }) {
  return (
    <div className="w-full flex flex-col bg-slate-50">
      
      {/* 1. Main Hero Showcase */}
      <Hero onOpenLogin={onOpenLogin} onDemoLaunch={onDemoLaunch} />

      {/* 2. Institutional & Clinical Research Partners Banner */}
      <section className="w-full py-10 border-y border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-6">
            In Clinical Collaboration & Institutional Research With
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-700 font-semibold text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-black text-[10px]">
                TUP
              </span>
              <span>Technological University of the Philippines – Taguig</span>
            </div>
            
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
              <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">
                🏥
              </span>
              <span>Taguig Physical Medicine & Rehabilitation Unit</span>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                🏛️
              </span>
              <span>City Government of Taguig</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Lower-Limb Stroke Rehabilitation Pillars */}
      <section id="features" className="w-full py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3.5 py-1 rounded-full border border-pink-100">
            Clinical Features
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Lower-Limb Stroke Rehabilitation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed">
            Combining non-invasive wearable sensors with telemetry processing to track and accelerate mobility recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-pink-200 transition">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 text-xl mb-5">
                🦶
              </div>
              <h3 className="text-base font-bold text-slate-800">Plantar Pressure Distribution</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Real-time ground reaction force analysis through high-sensitivity FSR sensors to monitor stance stability and heel strikes.
              </p>
            </div>
            <ul className="mt-8 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2"><span className="text-pink-600">✓</span> Insole contact calibration</li>
              <li className="flex items-center gap-2"><span className="text-pink-600">✓</span> Stance vs. swing phase tracking</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-pink-200 transition">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 text-xl mb-5">
                📐
              </div>
              <h3 className="text-base font-bold text-slate-800">Joint Kinematics & Deflection</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                MPU-6050 spatial IMU telemetry to observe knee deflection, leg orientation, and angular velocity across gait cycles.
              </p>
            </div>
            <ul className="mt-8 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2"><span className="text-pink-600">✓</span> Pitch and roll tracking</li>
              <li className="flex items-center gap-2"><span className="text-pink-600">✓</span> Spatiotemporal gait regularity</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-pink-200 transition">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 text-xl mb-5">
                📊
              </div>
              <h3 className="text-base font-bold text-slate-800">Automated Clinical Telemetry</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Seamless data stream ingestion directly connecting patient hardware units to clinician assessment dashboards.
              </p>
            </div>
            <ul className="mt-8 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2"><span className="text-pink-600">✓</span> Live stream synchronization</li>
              <li className="flex items-center gap-2"><span className="text-pink-600">✓</span> Objective recovery indicators</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. About & Research/Advisory Team Section */}
      <About />

      {/* 5. Bottom Call-to-Action Banner */}
      <section className="w-full bg-gradient-to-r from-pink-600 to-rose-600 py-16 px-6 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Ready to Begin Post-Stroke Mobility Monitoring?
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 max-w-xl mx-auto leading-relaxed">
            Access live sensor telemetry sessions, record rehabilitation progress, and connect directly with physical therapy clinical workflows.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3.5">
            <button
              onClick={onNavigateRegister}
              className="bg-white text-pink-600 hover:bg-slate-50 font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-lg transition active:scale-95"
            >
              Register Account
            </button>
            <button
              onClick={onDemoLaunch}
              className="border border-white/40 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition active:scale-95"
            >
              Test Live Hardware
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}