import React, { useState, useMemo } from 'react';

// Comprehensive Database ng Lower-Limb Stroke Exercises (CVAPed + REHAVA Protocols)
const EXERCISES_DATABASE = [
  {
    id: 'ex-001',
    name: 'Single-Leg Stance',
    category: 'balance',
    targetMuscleOrFunction: 'Hip stabilizers, ankle dorsiflexors, foot intrinsic muscles',
    gaitPhase: 'Mid-Stance',
    targetedDeviation: 'Gait Asymmetry',
    description: 'Stand on one leg to train hip and ankle stability during single-support stance phase. Corrects weight-bearing asymmetry common after stroke.',
    instructions: [
      'Stand near a parallel bar or sturdy support for safety.',
      'Shift your weight onto your affected leg and slowly lift the other foot 2–3 inches.',
      'Hold the position keeping hips level; do not hike the pelvis.',
      'Lower foot slowly and repeat.'
    ],
    reps: '3 sets × 30 seconds',
    duration: '6 mins',
    difficulty: 'Beginner',
    relatedProblems: ['Gait Asymmetry', 'Poor Stability']
  },
  {
    id: 'ex-002',
    name: 'Tandem Walking (Heel-to-Toe)',
    category: 'balance',
    targetMuscleOrFunction: 'Ankle stabilizers, hip abductors, dynamic mediolateral balance',
    gaitPhase: 'Full Cycle',
    targetedDeviation: 'Poor Stability',
    description: 'Walk placing heel of one foot directly in front of toes of the other to sharpen dynamic mediolateral balance during ambulation.',
    instructions: [
      'Follow a straight taped line along the floor.',
      'Place your heel directly touching toes of the opposite foot.',
      'Take 10 steady steps forward with gaze looking straight ahead.',
      'Turn around safely and repeat.'
    ],
    reps: '3 sets × 10 steps',
    duration: '5 mins',
    difficulty: 'Beginner',
    relatedProblems: ['Poor Stability', 'Gait Asymmetry']
  },
  {
    id: 'ex-003',
    name: 'Weight-Shifting Drills',
    category: 'balance',
    targetMuscleOrFunction: 'Gluteus medius, hip abductors, lateral ankle stabilizers',
    gaitPhase: 'Loading Response',
    targetedDeviation: 'Gait Asymmetry',
    description: 'Practice rhythmic body weight shifting from side to side to train symmetrical weight loading across hemiparetic limb.',
    instructions: [
      'Stand with feet shoulder-width apart, knees slightly soft.',
      'Slowly transfer weight to your hemiparetic foot until firm FSR heel contact is established.',
      'Hold for 3 seconds then smoothly shift weight to the unaffected side.',
      'Perform 10 controlled repetitions.'
    ],
    reps: '3 sets × 10 shifts',
    duration: '7 mins',
    difficulty: 'Beginner',
    relatedProblems: ['Gait Asymmetry', 'Poor Stability']
  },
  {
    id: 'ex-005',
    name: 'Metronome-Paced Walking',
    category: 'speed',
    targetMuscleOrFunction: 'Cadence regulation, hip flexors, knee extensors',
    gaitPhase: 'Full Cycle',
    targetedDeviation: 'Slow Cadence',
    description: 'Walk synchronized to an auditory rhythm to retrain stepping frequency, temporal regularity, and stride coordination.',
    instructions: [
      'Set rhythm pacing to comfortable baseline (e.g., 80 bpm).',
      'Step in exact time with each audible click.',
      'Maintain upright posture and consistent step length.',
      'Increase tempo by 5 bpm every 2 minutes as tolerated.'
    ],
    reps: 'Continuous walk',
    duration: '10 mins',
    difficulty: 'Beginner',
    relatedProblems: ['Slow Cadence', 'Reduced Speed']
  },
  {
    id: 'ex-010',
    name: 'Obstacle Stepping',
    category: 'gait',
    targetMuscleOrFunction: 'Hip flexors, knee extensors, tibialis anterior',
    gaitPhase: 'Swing Phase',
    targetedDeviation: 'Foot Clearance (Drop)',
    description: 'Step over foam hurdles to force active ankle dorsiflexion and knee clearance, directly eliminating toe drag during swing phase.',
    instructions: [
      'Place low obstacle blocks along walking strip.',
      'Lift leg with exaggerated hip flexion and deliberate toe lift.',
      'Clear the obstacle without dragging toe or swinging leg outward (circumduction).',
      'Plant heel firmly past the obstacle.'
    ],
    reps: '3 sets × 6 obstacles',
    duration: '8 mins',
    difficulty: 'Intermediate',
    relatedProblems: ['Foot Clearance (Drop)', 'Short Stride']
  },
  {
    id: 'ex-011',
    name: 'Heel-Strike Walking',
    category: 'gait',
    targetMuscleOrFunction: 'Tibialis anterior, gastrocnemius, ankle dorsiflexors',
    gaitPhase: 'Loading Response',
    targetedDeviation: 'Foot Clearance (Drop)',
    description: 'Deliberate heel-first ground contact drill to restore natural heel rocker mechanics and extinguish flat-foot shuffle.',
    instructions: [
      'Step forward making unmistakable contact with posterior heel first.',
      'Keep toes pulled up toward shin until heel makes solid contact.',
      'Roll smoothly through midfoot and push off with toes.',
      'Repeat with deliberate rhythm.'
    ],
    reps: '3 sets × 20 steps',
    duration: '7 mins',
    difficulty: 'Beginner',
    relatedProblems: ['Foot Clearance (Drop)', 'Short Stride']
  },
  {
    id: 'ex-021',
    name: 'Ankle Dorsiflexion Resistance Pulls',
    category: 'gait',
    targetMuscleOrFunction: 'Tibialis anterior, extensor digitorum longus',
    gaitPhase: 'Swing Phase',
    targetedDeviation: 'Foot Clearance (Drop)',
    description: 'Isolate and strengthen anterior tibialis muscle to restore voluntary toe-lift and overcome hemiparetic foot drop.',
    instructions: [
      'Sit comfortably with leg straight or seated with band around forefoot.',
      'Pull toes and front foot upward toward your shin against elastic resistance.',
      'Hold the peak contraction for 3 seconds.',
      'Return slowly to resting point.'
    ],
    reps: '3 sets × 12 reps',
    duration: '6 mins',
    difficulty: 'Beginner',
    relatedProblems: ['Foot Clearance (Drop)']
  },
  {
    id: 'ex-023',
    name: 'Terminal Knee Extension (TKE)',
    category: 'strength',
    targetMuscleOrFunction: 'Vastus medialis oblique (VMO), quadriceps',
    gaitPhase: 'Mid-Stance',
    targetedDeviation: 'Poor Stability',
    description: 'Straighten knee against resistance band anchored at knee level to build quadriceps locking stability and prevent knee buckling.',
    instructions: [
      'Loop elastic band behind knee crease with anchor in front.',
      'Begin with knee flexed at roughly 25 degrees.',
      'Straighten knee fully against band, squeezing quadriceps muscle tightly.',
      'Hold for 2 seconds then slowly allow knee to soften.'
    ],
    reps: '3 sets × 15 reps',
    duration: '6 mins',
    difficulty: 'Intermediate',
    relatedProblems: ['Poor Stability', 'Gait Asymmetry']
  }
];

export default function ExerciseTargetsView() {
  const [viewTab, setViewTab] = useState('targets'); // 'targets' | 'schedule' | 'catalog'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Critical Bottleneck Data (Galing sa Prescription.jsx logic)
  const bottleneckData = {
    title: 'Anterior Tibialis Motor Activation (Left Leg)',
    deviation: 'Foot Clearance & Drop',
    impact: 'Constrains forward walking cadence and creates 18% drag penalty during mid-swing phase.',
    prescriptionAdvice: 'Prioritize resistance band pulls and deliberate heel-strike loading prior to unassisted corridor pacing.'
  };

  // Weekly Practice Schedule (Galing sa Prescription.jsx)
  const weeklySchedule = [
    {
      day: 'Monday',
      focus: 'Dorsiflexion & Stance',
      duration: '45 mins',
      exercises: [
        { name: 'Ankle Dorsiflexion Resistance Pulls', dosage: '3 sets × 12 reps', target: 'Foot Clearance' },
        { name: 'Weight-Shifting Drills', dosage: '3 sets × 10 shifts', target: 'Gait Symmetry' }
      ]
    },
    {
      day: 'Tuesday',
      focus: 'Gait Rhythm & Cadence',
      duration: '35 mins',
      exercises: [
        { name: 'Metronome-Paced Walking', dosage: '10 mins continuous', target: 'Slow Cadence' },
        { name: 'Heel-Strike Walking', dosage: '3 sets × 20 steps', target: 'Heel Contact' }
      ]
    },
    {
      day: 'Wednesday',
      focus: 'Joint Stability & Stance',
      duration: '40 mins',
      exercises: [
        { name: 'Single-Leg Stance', dosage: '3 sets × 30 secs', target: 'Balance' },
        { name: 'Terminal Knee Extension (TKE)', dosage: '3 sets × 15 reps', target: 'Knee Locking' }
      ]
    },
    {
      day: 'Thursday',
      focus: 'Obstacle & Foot Clearance',
      duration: '30 mins',
      exercises: [
        { name: 'Obstacle Stepping', dosage: '3 sets × 6 hurdles', target: 'Swing Phase' },
        { name: 'Ankle Dorsiflexion Resistance Pulls', dosage: '3 sets × 12 reps', target: 'Foot Clearance' }
      ]
    },
    {
      day: 'Friday',
      focus: 'Clinical Assessment & Corridors',
      duration: '50 mins',
      exercises: [
        { name: 'Tandem Walking', dosage: '3 sets × 10 steps', target: 'Mediolateral Balance' },
        { name: 'Metronome-Paced Walking', dosage: '15 mins interval', target: 'Cadence' }
      ]
    },
    {
      day: 'Saturday',
      focus: 'Active Rest & Recovery',
      duration: '20 mins',
      exercises: [
        { name: 'Weight-Shifting Drills', dosage: '2 sets × 10 shifts', target: 'Weight Tolerance' }
      ]
    },
    {
      day: 'Sunday',
      focus: 'Rest & Diagnostic Log Review',
      duration: '0 mins',
      exercises: []
    }
  ];

  // Prescribed Targets para sa Kasalukuyang Araw
  const [dailyTargets, setDailyTargets] = useState([
    {
      id: 'target-01',
      exerciseId: 'ex-021',
      exerciseName: 'Ankle Dorsiflexion Resistance Pulls',
      prescribedBy: 'Ms. Christine Joy Cabardo, PTRP',
      problemTargeted: 'Foot Clearance (Drop)',
      dosage: '3 sets × 12 reps',
      setsCompleted: 2,
      totalSets: 3,
      status: 'In Progress',
      priority: 'High',
      weightAllocation: 45
    },
    {
      id: 'target-02',
      exerciseId: 'ex-003',
      exerciseName: 'Weight-Shifting Drills',
      prescribedBy: 'Ms. Christine Joy Cabardo, PTRP',
      problemTargeted: 'Gait Asymmetry',
      dosage: '3 sets × 10 shifts',
      setsCompleted: 3,
      totalSets: 3,
      status: 'Completed',
      priority: 'Medium',
      weightAllocation: 30
    },
    {
      id: 'target-03',
      exerciseId: 'ex-011',
      exerciseName: 'Heel-Strike Walking',
      prescribedBy: 'Dr. Noel Nathaniel Napa, MD',
      problemTargeted: 'Short Stride',
      dosage: '3 sets × 20 steps',
      setsCompleted: 0,
      totalSets: 3,
      status: 'Pending',
      priority: 'High',
      weightAllocation: 25
    }
  ]);

  const totalSetsCount = dailyTargets.reduce((acc, t) => acc + t.totalSets, 0);
  const completedSetsCount = dailyTargets.reduce((acc, t) => acc + t.setsCompleted, 0);
  const progressPercent = Math.round((completedSetsCount / totalSetsCount) * 100);

  const filteredCatalog = useMemo(() => {
    if (selectedCategory === 'all') return EXERCISES_DATABASE;
    return EXERCISES_DATABASE.filter(ex => ex.category === selectedCategory);
  }, [selectedCategory]);

  const openExerciseDetail = (exerciseOrId) => {
    if (typeof exerciseOrId === 'string') {
      const match = EXERCISES_DATABASE.find(e => e.id === exerciseOrId);
      if (match) setSelectedExerciseModal(match);
    } else {
      setSelectedExerciseModal(exerciseOrId);
    }
  };

  const handleIncrementSet = (targetId) => {
    setDailyTargets(prev =>
      prev.map(item => {
        if (item.id === targetId && item.setsCompleted < item.totalSets) {
          const next = item.setsCompleted + 1;
          return {
            ...item,
            setsCompleted: next,
            status: next === item.totalSets ? 'Completed' : 'In Progress'
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & View Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Physical Therapy Exercise Targets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Prescribed lower-limb motor re-education regimens targeting kinematic gait deficits.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto text-xs font-bold shadow-2xs">
          <button
            onClick={() => setViewTab('targets')}
            className={`px-3.5 py-2 rounded-xl transition ${
              viewTab === 'targets'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Today's Regimen ({dailyTargets.length})
          </button>
          <button
            onClick={() => setViewTab('schedule')}
            className={`px-3.5 py-2 rounded-xl transition ${
              viewTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setViewTab('catalog')}
            className={`px-3.5 py-2 rounded-xl transition ${
              viewTab === 'catalog'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Exercise Library
          </button>
        </div>
      </div>

      {/* 2. Critical Bottleneck Card (Hango sa CVAPed Prescription.jsx) */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-amber-200">
            ⚡
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
                Primary Recovery Bottleneck
              </span>
              <span className="text-xs font-mono font-bold text-amber-700">
                {bottleneckData.deviation}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900">{bottleneckData.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {bottleneckData.impact}
            </p>
          </div>
        </div>

        <button
          onClick={() => openExerciseDetail('ex-021')}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition shadow-xs"
        >
          View Target Protocol →
        </button>
      </div>

      {/* 3. TAB A: TODAY'S ACTIVE REGIMEN */}
      {viewTab === 'targets' && (
        <div className="space-y-6">
          {/* Compliance Progress Banner */}
          <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 rounded-[2rem] p-7 text-white shadow-lg shadow-pink-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-pink-100">
                Daily Motor Re-education
              </span>
              <h2 className="text-2xl font-black tracking-tight">Today's Regimen Compliance</h2>
              <p className="text-xs text-pink-100/90 max-w-md">
                You have finished {completedSetsCount} of {totalSetsCount} total sets assigned for your left hemiparesis recovery.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shrink-0">
              <div className="text-4xl font-black">{progressPercent}%</div>
              <div className="text-xs font-semibold leading-tight text-pink-100">
                <span>Targets</span>
                <br />
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* Cards ng Prescribed Targets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {dailyTargets.map((target) => (
              <div
                key={target.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-pink-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      target.priority === 'High'
                        ? 'bg-rose-50 text-rose-600 border border-rose-100'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {target.priority} Priority ({target.weightAllocation}%)
                    </span>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      target.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : target.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {target.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {target.exerciseName}
                  </h3>

                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-pink-600 font-bold flex items-center gap-1.5">
                      <span>🎯 Targets:</span>
                      <span>{target.problemTargeted}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supervisor: <strong className="text-slate-600 font-medium">{target.prescribedBy}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">{target.dosage}</span>
                    <span className="text-slate-900 font-mono">
                      {target.setsCompleted} / {target.totalSets} Sets
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-pink-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(target.setsCompleted / target.totalSets) * 100}%` }}
                    ></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => openExerciseDetail(target.exerciseId)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                    >
                      Instructions
                    </button>
                    <button
                      disabled={target.setsCompleted >= target.totalSets}
                      onClick={() => handleIncrementSet(target.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold text-white transition ${
                        target.setsCompleted >= target.totalSets
                          ? 'bg-slate-300 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-xs active:scale-95'
                      }`}
                    >
                      {target.setsCompleted >= target.totalSets ? 'Done ✓' : '+ Log 1 Set'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB B: WEEKLY SCHEDULE (Hango sa CVAPed Prescription.jsx) */}
      {viewTab === 'schedule' && (
        <div className="space-y-6">
          {/* Day Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weeklySchedule.map((dayPlan, idx) => (
              <button
                key={dayPlan.day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-4 rounded-3xl border text-left transition-all ${
                  selectedDayIndex === idx
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300'
                }`}
              >
                <span className="text-[11px] font-bold block uppercase tracking-wider text-slate-400">
                  {dayPlan.day.slice(0, 3)}
                </span>
                <span className="text-sm font-black block mt-1">{dayPlan.day}</span>
                <span className={`text-[11px] font-mono mt-2 block ${selectedDayIndex === idx ? 'text-pink-300' : 'text-slate-500'}`}>
                  {dayPlan.duration}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Day Agenda Box */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                  Assigned Regimen
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {weeklySchedule[selectedDayIndex].day} Focus: {weeklySchedule[selectedDayIndex].focus}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                Target: {weeklySchedule[selectedDayIndex].duration}
              </span>
            </div>

            {weeklySchedule[selectedDayIndex].exercises.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Scheduled rest day. Focus on hydration, stretch tolerance, and joint mobility.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {weeklySchedule[selectedDayIndex].exercises.map((ex, i) => (
                  <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{ex.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Target Deficit: {ex.target}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      {ex.dosage}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB C: EXERCISE CATALOG */}
      {viewTab === 'catalog' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'gait', label: 'Gait & Foot Clearance' },
              { id: 'balance', label: 'Balance & Symmetry' },
              { id: 'speed', label: 'Cadence & Velocity' },
              { id: 'strength', label: 'Muscle Activation' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCatalog.map(exercise => (
              <div
                key={exercise.id}
                onClick={() => openExerciseDetail(exercise)}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-pink-300 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {exercise.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      exercise.difficulty === 'Beginner'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{exercise.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {exercise.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exercise.relatedProblems.map((problem, i) => (
                      <span key={i} className="text-[10px] font-bold bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md border border-pink-100">
                        {problem}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{exercise.duration}</span>
                  <span className="text-pink-600 font-bold font-sans">Details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MODAL: DETAILED EXERCISE INSTRUCTIONS */}
      {selectedExerciseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setSelectedExerciseModal(null)}
        >
          <div
            className="bg-white max-w-lg w-full p-7 rounded-[2rem] shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Title Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                  {selectedExerciseModal.gaitPhase || 'Rehab Protocol'}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {selectedExerciseModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExerciseModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedExerciseModal.description}
            </p>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Step-by-Step Instructions
              </h4>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedExerciseModal.instructions?.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="font-semibold text-slate-800">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Targeted Biomechanical Function */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-indigo-700 tracking-wider block">
                Targeted Biomechanical Function
              </span>
              <p className="text-slate-700 font-semibold">
                {selectedExerciseModal.targetMuscleOrFunction}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Dosage</span>
                <span className="text-xs font-extrabold text-slate-800">{selectedExerciseModal.reps || 'Standard protocol'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
                <span className="text-xs font-extrabold text-slate-800">{selectedExerciseModal.duration}</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedExerciseModal(null)}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}