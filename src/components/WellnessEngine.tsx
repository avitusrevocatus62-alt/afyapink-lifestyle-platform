import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, Leaf, Wind, Smiley, Scales, Flame, MoonStars, Drop, Check, Heartbeat, Rewind, Pulse } from '@phosphor-icons/react';
import type { Lang, UserProfile, Recipe, Workout } from '@/types';
import { t, RECIPES, WORKOUTS, BREATHING_SESSIONS, SLEEP_TIPS, AFFIRMATIONS } from '@/data/afyapinkData';

type WellnessTab = 'kula' | 'move' | 'sleep' | 'hydration' | 'mind' | 'weight';

interface Props {
  lang: Lang;
  profile: UserProfile;
  onProfile: (p: Partial<UserProfile>) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function WellnessEngine({ lang, profile, onProfile }: Props) {
  const [tab, setTab] = useState<WellnessTab>('kula');
  const tabs: { id: WellnessTab; label: string; icon: React.ReactNode }[] = [
    { id: 'kula', label: t('kula', lang), icon: <Leaf size={16} /> },
    { id: 'move', label: t('move', lang), icon: <Heartbeat size={16} /> },
    { id: 'sleep', label: t('sleep', lang), icon: <MoonStars size={16} /> },
    { id: 'hydration', label: t('hydration', lang), icon: <Drop size={16} /> },
    { id: 'mind', label: t('mind', lang), icon: <Wind size={16} /> },
    { id: 'weight', label: t('weight', lang), icon: <Scales size={16} /> },
  ];

  return (
    <div className="px-5 pt-20 pb-24 space-y-5">
      <div className="flex items-center gap-2">
        <Pulse size={24} className="text-emerald-600" />
        <h1 className="text-2xl font-bold text-slate-900">{t('wellness', lang)}</h1>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
        {tabs.map((tb) => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === tb.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-600'}`}>
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tab === 'kula' && <KulaView lang={lang} profile={profile} onProfile={onProfile} />}
          {tab === 'move' && <MoveView lang={lang} profile={profile} onProfile={onProfile} />}
          {tab === 'sleep' && <SleepView lang={lang} profile={profile} onProfile={onProfile} />}
          {tab === 'hydration' && <HydrationView lang={lang} profile={profile} onProfile={onProfile} />}
          {tab === 'mind' && <MindView lang={lang} profile={profile} onProfile={onProfile} />}
          {tab === 'weight' && <WeightView lang={lang} profile={profile} onProfile={onProfile} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── KULA (Nutrition) ─── */
function KulaView({ lang, profile, onProfile }: Props) {
  const [selected, setSelected] = useState<Recipe | null>(null);
  const saved = profile.wellness?.savedRecipes || [];

  const toggleSave = (id: string) => {
    const cur = profile.wellness?.savedRecipes || [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    onProfile({ wellness: { ...profile.wellness, savedRecipes: next } });
  };

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="text-xs font-bold text-emerald-600">&larr; {t('recipes', lang)}</button>
        <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">{selected.title[lang]}</h2>
          <p className="text-sm text-slate-500">{selected.desc[lang]}</p>
          <div className="flex gap-3 text-[10px] text-slate-400 font-semibold">
            <span>{selected.time} min</span><span>{selected.servings} {lang === 'sw' ? 'wagonjwa' : 'servings'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{t('cycleSync', lang)}: {selected.cyclePhase}</span>
          </div>
          <div><h4 className="text-xs font-bold text-slate-700 mb-2">{lang === 'sw' ? 'Viungo' : 'Ingredients'}</h4>
            <ul className="space-y-1">{selected.ingredients.map((ing, i) => <li key={i} className="text-xs text-slate-600 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{ing[lang]}</li>)}</ul>
          </div>
          <div><h4 className="text-xs font-bold text-slate-700 mb-2">{lang === 'sw' ? 'Hatua' : 'Steps'}</h4>
            <ol className="space-y-2">{selected.steps.map((s, i) => <li key={i} className="text-xs text-slate-600 flex gap-2"><span className="font-bold text-emerald-600">{i + 1}.</span>{s[lang]}</li>)}</ol>
          </div>
          <button onClick={() => toggleSave(selected.id)} className={`w-full py-3 rounded-2xl text-xs font-bold ${saved.includes(selected.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white'}`}>
            {saved.includes(selected.id) ? (lang === 'sw' ? 'Imehifadhiwa ✓' : 'Saved ✓') : t('recipes', lang) + ' →'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {RECIPES.map((r, i) => (
        <motion.button key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          onClick={() => setSelected(r)} className="w-full text-left p-4 rounded-3xl bg-white border border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase">{r.cyclePhase}</span>
            <span className="text-[10px] text-slate-400">{r.time} min</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{r.title[lang]}</h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{r.desc[lang]}</p>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── MOVE (Workouts) ─── */
function MoveView({ lang, profile, onProfile }: Props) {
  const [active, setActive] = useState<Workout | null>(null);
  const [exIdx, setExIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startWorkout = (w: Workout) => {
    setActive(w); setExIdx(0); setSeconds(0); setRunning(true); setDone(false);
  };

  useEffect(() => {
    if (running && active) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, active]);

  const nextExercise = () => {
    if (!active) return;
    if (exIdx < active.exercises.length - 1) { setExIdx((i) => i + 1); setSeconds(0); }
    else { finishWorkout(); }
  };

  const finishWorkout = () => {
    setRunning(false); setDone(true);
    const cur = profile.wellness?.completedWorkouts || {};
    const todayStr = today();
    onProfile({ wellness: { ...profile.wellness, completedWorkouts: { ...cur, [todayStr]: (cur[todayStr] || 0) + (active?.duration || 0) } } });
  };

  if (done) return (
    <div className="text-center py-12 space-y-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
        <Check size={36} className="text-emerald-600" />
      </motion.div>
      <p className="font-bold text-slate-900">{t('workoutDone', lang)}</p>
      <button onClick={() => { setActive(null); setDone(false); }} className="px-6 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold">{lang === 'sw' ? 'Rudi' : 'Back'}</button>
    </div>
  );

  if (active) {
    const ex = active.exercises[exIdx];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setActive(null); setRunning(false); }} className="text-xs font-bold text-slate-400 flex items-center gap-1"><Rewind size={14} /> {lang === 'sw' ? 'Acha' : 'Stop'}</button>
          <span className="text-xs font-mono text-slate-600">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>
        </div>
        <div className="rounded-3xl bg-white border border-slate-100 p-6 text-center space-y-4">
          <p className="text-[10px] uppercase font-bold text-emerald-600">{t('exercise', lang)} {exIdx + 1}/{active.exercises.length}</p>
          <h3 className="text-lg font-bold text-slate-900">{ex.name[lang]}</h3>
          <p className="text-sm text-slate-500">{ex.reps}</p>
          <div className="flex gap-2 justify-center mt-4">
            <button onClick={() => setRunning(!running)} className="p-3 rounded-full bg-emerald-600 text-white">
              {running ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={nextExercise} className="px-5 py-3 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">{t('nextExercise', lang)} →</button>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((exIdx + 1) / active.exercises.length) * 100}%` }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {WORKOUTS.map((w, i) => (
        <motion.div key={w.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          className="rounded-3xl bg-white border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${w.intensity === 'low' ? 'bg-blue-50 text-blue-600' : w.intensity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{w.intensity}</span>
                <span className="text-[10px] text-slate-400">{w.duration} min</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{w.title[lang]}</h3>
              <p className="text-xs text-slate-500">{w.desc[lang]}</p>
            </div>
            <button onClick={() => startWorkout(w)} className="shrink-0 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Play size={16} weight="fill" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── SLEEP ─── */
function SleepView({ lang, profile, onProfile }: Props) {
  const [hours, setHours] = useState(7);
  const [quality, setQuality] = useState(3);
  const logs = profile.wellness?.sleepLogs || [];

  const logSleep = () => {
    const entry = { date: today(), hours, quality };
    const next = [entry, ...logs.filter((l) => l.date !== today())].slice(0, 30);
    onProfile({ wellness: { ...profile.wellness, sleepLogs: next } });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">{t('logSleep', lang)}</h3>
        <div>
          <label className="text-xs text-slate-500">{hours} {t('hours', lang) === 'hours' ? 'hrs' : 'saa'}</label>
          <input type="range" min={4} max={12} step={0.5} value={hours} onChange={(e) => setHours(+e.target.value)} className="w-full accent-emerald-600" />
        </div>
        <div>
          <label className="text-xs text-slate-500">{t('quality', lang)}: {quality}/5</label>
          <div className="flex gap-1 mt-1">{[1, 2, 3, 4, 5].map((q) => (
            <button key={q} onClick={() => setQuality(q)} className={`w-8 h-8 rounded-full text-xs font-bold ${q <= quality ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{q}</button>
          ))}</div>
        </div>
        <button onClick={logSleep} className="w-full py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold">{t('logSleep', lang)}</button>
      </div>
      <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{lang === 'sw' ? 'Vidokezo vya Usingizi' : 'Sleep Tips'}</h3>
        {SLEEP_TIPS.map((tip, i) => (
          <div key={i} className="flex items-start gap-2"><MoonStars size={14} className="text-emerald-500 mt-0.5 shrink-0" /><p className="text-xs text-slate-600">{tip[lang]}</p></div>
        ))}
      </div>
      {logs.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-2">
          <h3 className="text-sm font-bold text-slate-900">{lang === 'sw' ? 'Kumbukumbu' : 'History'}</h3>
          {logs.slice(0, 7).map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-500">{l.date}</span>
              <span className="text-xs font-bold text-slate-700">{l.hours}h • {l.quality}/5</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── HYDRATION ─── */
function HydrationView({ lang, profile, onProfile }: Props) {
  const target = profile.dailyWaterTarget || 8;
  const todayStr = today();
  const current = profile.wellness?.waterLogs?.[todayStr] || 0;

  const addWater = (glasses: number) => {
    const next = Math.min(current + glasses, target + 4);
    onProfile({
      water: next,
      wellness: { ...profile.wellness, waterLogs: { ...profile.wellness?.waterLogs, [todayStr]: next }, waterStreak: next >= target ? (profile.wellness?.waterStreak || 0) + 1 : profile.wellness?.waterStreak || 0 },
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 border border-sky-100 p-6 text-center space-y-3">
        <Drop size={40} className="text-sky-500 mx-auto" />
        <p className="text-3xl font-bold text-slate-900">{current}<span className="text-sm text-slate-400 font-normal">/{target}</span></p>
        <p className="text-xs text-slate-500">{t('todayGoal', lang)}</p>
        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
          <motion.div className="h-full bg-sky-400 rounded-full" animate={{ width: `${Math.min((current / target) * 100, 100)}%` }} transition={{ duration: 0.4 }} />
        </div>
        {profile.wellness?.waterStreak ? (
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-600"><Flame size={14} weight="fill" /> {profile.wellness.waterStreak} {t('streak', lang)}</div>
        ) : null}
      </div>
      <div className="flex gap-3 justify-center">
        {[1, 2, 3].map((g) => (
          <button key={g} onClick={() => addWater(g)} className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white border border-slate-100 active:scale-95 transition-all">
            <Drop size={20} className="text-sky-500" />
            <span className="text-xs font-bold text-slate-700">+{g}</span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 text-center">{t('glasses', lang)} • {target * 0.25} {t('liters', lang) === 'liters' ? 'L' : 'lita'} {lang === 'sw' ? 'kwa siku' : 'per day'}</p>
    </div>
  );
}

/* ─── MIND ─── */
function MindView({ lang, profile, onProfile }: Props) {
  const [breathing, setBreathing] = useState<string | null>(null);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startBreathing = (id: string) => {
    setBreathing(id); setPhase('inhale');
    let tick = 0;
    intervalRef.current = setInterval(() => {
      tick++;
      if (tick % 12 === 0) setPhase((p) => p === 'inhale' ? 'hold' : p === 'hold' ? 'exhale' : 'inhale');
    }, 1000);
  };

  const stopBreathing = () => {
    setBreathing(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const moods = [
    { id: 'great', emoji: '😊', label: lang === 'sw' ? 'Sana' : 'Great' },
    { id: 'good', emoji: '🙂', label: lang === 'sw' ? 'Nzuri' : 'Good' },
    { id: 'okay', emoji: '😐', label: lang === 'sw' ? 'Kawaida' : 'Okay' },
    { id: 'low', emoji: '😔', label: lang === 'sw' ? 'Chini' : 'Low' },
    { id: 'bad', emoji: '😢', label: lang === 'sw' ? 'Mbaya' : 'Bad' },
  ];

  const logMood = () => {
    if (!mood) return;
    const entry = { date: today(), mood, note };
    const cur = profile.wellness?.moodLogs || [];
    onProfile({ mood, wellness: { ...profile.wellness, moodLogs: [entry, ...cur.filter((m) => m.date !== today())].slice(0, 30) } });
    setMood(''); setNote('');
  };

  const affirmation = AFFIRMATIONS[lang][new Date().getDate() % AFFIRMATIONS[lang].length];

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-rose-50 border border-purple-100 p-5 text-center">
        <p className="text-xs text-purple-500 font-bold uppercase mb-1">{lang === 'sw' ? "Kauli Mpya" : "Today's Affirmation"}</p>
        <p className="text-sm font-semibold text-slate-800 italic">"{affirmation}"</p>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{t('logMood', lang)}</h3>
        <div className="flex gap-2 justify-center">
          {moods.map((m) => (
            <button key={m.id} onClick={() => setMood(m.id)} className={`flex flex-col items-center p-2 rounded-xl transition-all ${mood === m.id ? 'bg-rose-50 ring-2 ring-[#E11C5A]' : 'hover:bg-slate-50'}`}>
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[9px] font-bold text-slate-500 mt-1">{m.label}</span>
            </button>
          ))}
        </div>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={lang === 'sw' ? 'Andika kuhusu siku yako...' : 'Write about your day...'} className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs resize-none h-16 focus:outline-none focus:border-[#E11C5A]" />
        <button onClick={logMood} disabled={!mood} className="w-full py-2.5 rounded-2xl bg-[#E11C5A] text-white text-xs font-bold disabled:opacity-40">{t('logMood', lang)}</button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{t('breathing', lang)}</h3>
        {BREATHING_SESSIONS.map((b) => (
          <div key={b.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
            <div><p className="text-xs font-bold text-slate-700">{b.label[lang]}</p><p className="text-[10px] text-slate-400">{b.desc[lang]}</p></div>
            {breathing === b.id ? (
              <div className="flex items-center gap-2">
                <motion.div animate={{ scale: phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 0.8 }} transition={{ duration: 4, repeat: Infinity }} className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                  <Wind size={14} className="text-purple-600" />
                </motion.div>
                <button onClick={stopBreathing} className="text-[10px] font-bold text-red-500">{lang === 'sw' ? 'Acha' : 'Stop'}</button>
              </div>
            ) : (
              <button onClick={() => startBreathing(b.id)} className="px-3 py-1.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">{t('startWorkout', lang)}</button>
            )}
          </div>
        ))}
        {breathing && (
          <div className="text-center py-3">
            <motion.p key={phase} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-lg font-bold text-purple-600">{t(phase, lang)}</motion.p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── WEIGHT ─── */
function WeightView({ lang, profile, onProfile }: Props) {
  const [w, setW] = useState('');
  const [waist, setWaist] = useState('');
  const logs = profile.wellness?.weightLogs || [];

  const addLog = () => {
    if (!w) return;
    const entry = { date: today(), weight: +w, waist: +waist || 0 };
    onProfile({ wellness: { ...profile.wellness, weightLogs: [entry, ...logs].slice(0, 30) } });
    setW(''); setWaist('');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{t('logWeight', lang)}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] text-slate-400 font-bold">{lang === 'sw' ? 'Uzito (kg)' : 'Weight (kg)'}</label>
            <input type="number" value={w} onChange={(e) => setW(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:border-emerald-500" placeholder="65" /></div>
          <div><label className="text-[10px] text-slate-400 font-bold">{lang === 'sw' ? 'Kiuno (cm)' : 'Waist (cm)'}</label>
            <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:border-emerald-500" placeholder="72" /></div>
        </div>
        <button onClick={addLog} disabled={!w} className="w-full py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-40">{t('logWeight', lang)}</button>
      </div>
      {logs.length > 0 ? (
        <div className="rounded-3xl bg-white border border-slate-100 p-5 space-y-2">
          <h3 className="text-sm font-bold text-slate-900">{lang === 'sw' ? 'Historia' : 'History'}</h3>
          {logs.slice(0, 10).map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-500">{l.date}</span>
              <span className="text-xs font-bold text-slate-700">{l.weight} kg {l.waist ? `• ${l.waist} cm` : ''}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xs text-slate-400 py-8">{t('noLogs', lang)}</p>
      )}
      <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-4">
        <p className="text-xs text-emerald-700 font-medium">{lang === 'sw' ? 'Kumbuka: Uzito wako wa asili ni ule ambao mwili wako unapendelea. Epuka lishe ya kuchangamka.' : 'Remember: Your natural weight is the one your body prefers. Avoid crash diets.'}</p>
      </div>
    </div>
  );
}