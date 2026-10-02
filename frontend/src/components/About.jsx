import React from 'react';

export default function About() {
  const clinicalLeadership = [
    {
      name: "Dr. Noel Nathaniel C. Napa",
      credentials: "MD, FPARM, DPARM",
      role: "Head / Physiatrist",
      affiliation: "Taguig Physical Medicine & Rehabilitation Unit",
      type: "medical",
      photo: "👨‍⚕️"
    },
    {
      name: "Hon. Lani Cayetano",
      credentials: "City Mayor",
      role: "Municipal Patron & Healthcare Advocate",
      affiliation: "City Government of Taguig",
      type: "mayor",
      highlight: true,
      photo: "🏛️"
    },
    {
      name: "Ms. Christine Joy R. Cabardo",
      credentials: "PTRP",
      role: "Chief Physical Therapist",
      affiliation: "Taguig Physical Medicine & Rehabilitation Unit",
      type: "medical",
      photo: "👩‍⚕️"
    }
  ];

  const developers = [
    {
      name: "Hanna Clerdee E. Cruz",
      role: "Lead Systems & Full-Stack Developer",
      focus: "Telemetry Architecture & Backend API",
      avatar: "HC"
    },
    {
      name: "Glenn Henry F. Mallo",
      role: "Hardware & Embedded Systems Engineer",
      focus: "ESP32, MPU-6050 & FSR Sensor Integration",
      avatar: "GM"
    },
    {
      name: "Jason S. Laceda",
      role: "Frontend UI/UX & Data Visualization",
      focus: "Clinical Dashboard & Gait Metrics",
      avatar: "JP"
    },
    {
      name: "Deannuel Drew F. Cortez",
      role: "Research & QA Systems Engineer",
      focus: "Kinematic Signal Validation & Biometrics",
      avatar: "DC"
    }
  ];

  return (
    <div id="about" className="w-full bg-white text-slate-800 scroll-mt-16">
      
      {/* 1. Header & Platform Overview */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
          About REHAVA
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-4">
          Lower-Limb Rehabilitation & Telemetry Platform
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-4 leading-relaxed max-w-2xl mx-auto">
          REHAVA bridges wearable hardware sensing with real-time clinical intelligence, enabling stroke patients and physiotherapists to monitor lower-limb kinematics, plantar forces, and gait recovery patterns objectively.
        </p>
      </section>

      {/* 2. Top Metric Highlights Banner */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50/80 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="p-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Target Condition</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 block">Stroke Hemiparesis</span>
          </div>
          <div className="p-3 border-t sm:border-t-0 sm:border-l border-slate-200/70">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Sensor Sampling</span>
            <span className="text-2xl sm:text-3xl font-black text-pink-600 mt-1 block">5–20 Hz</span>
          </div>
          <div className="p-3 border-t sm:border-t-0 sm:border-l border-slate-200/70">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Kinematic Axes</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 block">Pitch & Roll</span>
          </div>
          <div className="p-3 border-t sm:border-t-0 sm:border-l border-slate-200/70">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Institutional Partner</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 block">Taguig PRU</span>
          </div>
        </div>
      </section>

      {/* 3. Our Story Section (Layout matching the Taskly reference image) */}
      <section className="max-w-6xl mx-auto px-6 mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Two stacked showcase cards */}
          <div className="lg:col-span-3 space-y-6 hidden lg:block">
            <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-3xl border border-pink-100 shadow-sm">
              <span className="text-2xl block mb-2">🦶</span>
              <h4 className="text-sm font-bold text-slate-800">Plantar Contact</h4>
              <p className="text-xs text-slate-500 mt-1">Ground reaction telemetry measuring foot strike timing.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-2xl block mb-2">📈</span>
              <h4 className="text-sm font-bold text-slate-800">Gait Regularity</h4>
              <p className="text-xs text-slate-500 mt-1">Objective evaluation replacing subjective observational scales.</p>
            </div>
          </div>

          {/* Center Column: Narrative */}
          <div className="lg:col-span-6 text-center lg:text-left px-2">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">Our Mission</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2 mb-6">
              Engineering Mobility Recovery Through Data
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Post-stroke hemiparesis significantly impacts walking cadence, balance, and unilateral stance duration. Traditional physical therapy heavily relies on observational gait analysis, which can introduce variability and lack quantified progression tracking.
              </p>
              <p>
                Developed under the Technological University of the Philippines – Taguig in collaboration with clinical mentors from the Taguig Physical Medicine and Rehabilitation Unit, REHAVA transitions mobility assessment into a telemetry-driven discipline.
              </p>
              <p>
                By combining affordable force-sensing resistors with inertial measurement sensors, our platform delivers actionable gait metrics directly to therapists and patients, facilitating targeted rehabilitation protocols.
              </p>
            </div>
          </div>

          {/* Right Column: Two stacked showcase cards */}
          <div className="lg:col-span-3 space-y-6 hidden lg:block">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-2xl block mb-2">⚡</span>
              <h4 className="text-sm font-bold text-slate-800">Edge Processing</h4>
              <p className="text-xs text-slate-500 mt-1">Low-latency sensor readings via ESP32 microcontrollers.</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-3xl border border-pink-100 shadow-sm">
              <span className="text-2xl block mb-2">🏥</span>
              <h4 className="text-sm font-bold text-slate-800">Clinical Focus</h4>
              <p className="text-xs text-slate-500 mt-1">Directly built for community physical therapy centers.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Clinical Advisory & Leadership (3 Cards: Middle one is larger / prominent) */}
      <section className="bg-slate-50/70 border-t border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Advisory & Institutional Backing</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Clinical Leadership & Governance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Guiding medical parameters, clinical efficacy, and institutional testing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {clinicalLeadership.map((leader, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl border transition flex flex-col justify-between items-center text-center ${
                  leader.highlight
                    ? 'p-8 sm:p-10 border-pink-200 shadow-2xl shadow-pink-100/80 md:-translate-y-2 order-first md:order-none ring-2 ring-pink-500/20'
                    : 'p-7 sm:p-8 border-slate-100 shadow-md shadow-slate-100'
                }`}
              >
                {/* Visual Avatar / Icon Badge */}
                <div
                  className={`rounded-2xl flex items-center justify-center mb-5 ${
                    leader.highlight
                      ? 'w-20 h-20 bg-pink-100 text-3xl'
                      : 'w-16 h-16 bg-slate-100 text-2xl'
                  }`}
                >
                  {leader.photo}
                </div>

                {leader.highlight && (
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-3 border border-pink-200">
                    City Governance Partner
                  </span>
                )}

                <h3 className={`font-black text-slate-900 tracking-tight ${leader.highlight ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
                  {leader.name}
                </h3>
                
                <p className="text-xs font-bold text-pink-600 mt-1">
                  {leader.credentials}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 w-full space-y-1">
                  <p className="text-xs font-semibold text-slate-700">{leader.role}</p>
                  <p className="text-[11px] text-slate-400">{leader.affiliation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Engineering Team Section (4 Developers Side by Side) */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Research & Development</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Meet The Development Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Bachelor of Science in Information Technology, TUP – Taguig
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/60 hover:shadow-xl hover:border-pink-200 transition flex flex-col justify-between items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700 font-black text-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {dev.avatar}
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">
                  {dev.name}
                </h3>
                <p className="text-[11px] font-semibold text-pink-600 mt-1">
                  {dev.role}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 w-full">
                <p className="text-[10px] text-slate-400 font-medium leading-normal">
                  {dev.focus}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}