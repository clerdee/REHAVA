import React, { useState, useEffect } from 'react';

export default function DashboardView() {
  const [telemetry, setTelemetry] = useState({
    left_foot_pressure: 0,
    left_knee_angle_x: 0.0,
    left_knee_angle_y: 0.0,
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/gait-data');
        if (res.ok) {
          const data = await res.json();
          // Kunin ang pinakabagong reading mula sa array o object
          const latest = Array.isArray(data) ? data[data.length - 1] : data;
          if (latest) {
            setTelemetry({
              left_foot_pressure: latest.left_foot_pressure ?? 0,
              left_knee_angle_x: latest.left_knee_angle_x ?? 0.0,
              left_knee_angle_y: latest.left_knee_angle_y ?? 0.0,
            });
            setIsConnected(true);
          }
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 200); // Bibilisan natin sa 200ms para ramdam ang real-time response

    return () => clearInterval(interval);
  }, []);

  // Normalization para sa progress bar ng FSR (ADC ng ESP32 ay 0 hanggang 4095)
  const pressurePercentage = Math.min(100, Math.round((telemetry.left_foot_pressure / 4095) * 100));

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Session & Hardware Status Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Live Hardware Telemetry</h2>
          <p className="text-xs text-slate-500">Single Leg Setup (1x MPU-6050 + 1x FSR-402 via ESP32)</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full text-xs shadow-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          <span className="text-slate-700 font-mono font-medium">
            {isConnected ? 'ESP32 Streaming Active' : 'Disconnected / Waiting...'}
          </span>
        </div>
      </div>

      {/* Real-time Hardware Readings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Plantar Pressure Node (FSR 402) */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-xl shadow-pink-100/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Foot Contact Sensor</span>
              <span className="text-[11px] bg-pink-50 text-pink-700 font-semibold px-2.5 py-1 rounded-full border border-pink-100">FSR 402</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Real-time Heel / Plantar Ground Pressure</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-800 tracking-tight">
                {telemetry.left_foot_pressure}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 4095 ADC</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Contact Intensity</span>
              <span>{pressurePercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-150"
                style={{ width: `${pressurePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Kinematic Angle Node (MPU 6050) */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Joint Deflection Node</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full border border-slate-200">MPU-6050</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Rotational Gyro Angular Velocity</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block mb-1">X-AXIS (PITCH)</span>
                <div className="text-3xl font-black text-slate-800">
                  {telemetry.left_knee_angle_x}<span className="text-lg font-bold text-slate-400 ml-1">°/s</span>
                </div>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block mb-1">Y-AXIS (ROLL)</span>
                <div className="text-3xl font-black text-slate-800">
                  {telemetry.left_knee_angle_y}<span className="text-lg font-bold text-slate-400 ml-1">°/s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Sample Rate: 5 Hz</span>
            <span className="text-pink-600 font-medium">Kinematics Active</span>
          </div>
        </div>

      </div>
    </main>
  );
}