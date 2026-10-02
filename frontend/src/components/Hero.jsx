import React from 'react';

export default function Hero({ onOpenLogin, onDemoLaunch }) {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 py-12 lg:py-16">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-14">
        
        {/* Left Column: Heading, Subtext, and CTA */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-semibold mb-5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
            Wearable Stroke Mobility Telemetry
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18]">
            Your Precision Partner for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">
              Lower-Limb Stroke Rehabilitation
            </span>
          </h1>

          <p className="mt-5 text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg">
            Track kinematic joint deflection, analyze stance pressure distributions, and monitor automated mobility indicators with wearable sensor telemetry.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              onClick={onOpenLogin}
              className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg shadow-pink-200 transition flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={onDemoLaunch}
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-sm transition"
            >
              View Live Demo
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Phone Showcase */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative pt-4 pb-6">
          
          {/* Left Mini Widget Card */}
          <div className="absolute -left-2 lg:left-4 top-10 bg-white p-3.5 rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 w-36 text-left hidden sm:block z-10">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
              <span>CADENCE</span>
              <span className="text-pink-600">● Live</span>
            </div>
            <p className="text-xl font-black text-slate-800">
              104 <span className="text-[10px] font-normal text-slate-400">spm</span>
            </p>
            <div className="flex gap-1 items-end h-6 mt-2">
              {[40, 75, 45, 90, 65, 80, 55].map((h, i) => (
                <div key={i} className="flex-1 bg-pink-100 rounded-t-sm" style={{ height: `${h}%` }}>
                  <div className="bg-pink-500 rounded-t-sm w-full" style={{ height: `${h * 0.7}%` }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Mobile Preview */}
          <div className="bg-white border-4 border-slate-900 rounded-[2.2rem] p-4 shadow-2xl w-60 sm:w-64 h-[24rem] flex flex-col justify-between relative z-0">
            <div className="w-16 h-3 bg-slate-900 rounded-full mx-auto mb-1"></div>
            
            <div className="text-left px-2">
              <p className="text-[10px] text-slate-400 font-semibold">Therapy Active</p>
              <h3 className="text-base font-bold text-slate-800">Hemiparesis Patient</h3>
              
              {/* Symmetrical Arc Widget */}
              <div className="my-3 bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-bold mb-0.5">GAIT REGULARITY</div>
                <div className="text-2xl font-black text-pink-600">92.4%</div>
                <p className="text-[9px] text-emerald-600 font-medium mt-0.5">Consistent Stance</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[9px]">STABILITY</span>
                  <span className="font-bold text-slate-700 text-xs">88/100</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[9px]">SPEED</span>
                  <span className="font-bold text-slate-700 text-xs">1.12 m/s</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-600 text-white rounded-xl py-2 text-[11px] font-semibold text-center shadow-sm">
              Hardware Connected
            </div>
          </div>

          {/* Right Mini Widget Card */}
          <div className="absolute -right-2 lg:right-6 bottom-10 bg-white p-3.5 rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 w-40 text-left hidden sm:block z-10">
            <div className="text-[10px] text-slate-400 font-bold mb-1">KNEE EXTENSION</div>
            <div className="text-xl font-black text-slate-800">14.2°</div>
            <p className="text-[9px] text-slate-400 mt-0.5">Deflection normal</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-pink-500 h-full rounded-full w-3/4"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}