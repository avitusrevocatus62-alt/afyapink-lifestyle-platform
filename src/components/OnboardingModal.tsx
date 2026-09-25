import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft, Check } from '@phosphor-icons/react';
import type { Lang, UserProfile } from '@/types';
import { BRAND, TAGLINE, PLEDGE, LOGO_URL, t, STAGES, AGE_BRACKETS, INTERESTS, GOALS } from '@/data/afyapinkData';

interface Props {
  lang: Lang;
  onComplete: (p: Partial<UserProfile>) => void;
  onLang: (l: Lang) => void;
}

export default function OnboardingModal({ lang, onComplete, onLang }: Props) {
  const [splash, setSplash] = useState(true);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<UserProfile>>({
    name: '', age: '', stage: '', interests: [], goals: [], consent: false, notifications: false,
  });

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleInterest = (id: string) => {
    const cur = data.interests || [];
    setData({ ...data, interests: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  };
  const toggleGoal = (id: string) => {
    const cur = data.goals || [];
    setData({ ...data, goals: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  };

  if (splash) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          className="w-28 h-28 rounded-3xl bg-white ring-1 ring-rose-100 shadow-xl shadow-rose-200/50 flex items-center justify-center overflow-hidden"
        >
          <img src={LOGO_URL} alt={`${BRAND} logo`} className="h-full w-full object-contain p-2" />
        </motion.div>
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-3xl font-bold tracking-tight text-slate-900"
        >
          {BRAND}
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-center text-base text-[#E11C5A] font-semibold"
        >
          {TAGLINE[lang]}
        </motion.p>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-[#E11C5A] text-xs font-bold"
        >
          <ShieldCheck size={14} weight="fill" />
          {t('trustBadge', lang)}
        </motion.div>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-slate-600 max-w-xs leading-relaxed"
        >
          {t('hopeLine', lang)}
        </motion.p>
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setSplash(false)}
          className="mt-10 px-8 py-3.5 rounded-full bg-[#E11C5A] text-white font-semibold flex items-center gap-2 active:scale-95 transition-transform shadow-lg shadow-rose-300/40"
        >
          {t('startJourney', lang)} <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    );
  }

  const canNext =
    (step === 0 && data.lang) ||
    (step === 1 && data.name && data.age) ||
    (step === 2 && data.stage) ||
    (step === 3 && (data.interests || []).length > 0) ||
    (step === 4 && (data.goals || []).length > 0) ||
    step === 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => (step > 0 ? setStep(step - 1) : setSplash(true))} className="p-2 -ml-2 text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => onComplete({ onboarded: true })} className="text-xs text-slate-400 font-medium">
            {t('skip', lang)}
          </button>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="h-full bg-[#E11C5A] rounded-full"
          />
        </div>
        <p className="mt-2 text-[10px] text-slate-400 font-semibold tracking-wider">
          {step + 1} / {totalSteps}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('chooseLang', lang)}</h2>
                <p className="text-slate-500 mb-6">Pick your preferred language</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['sw', 'en'] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setData({ ...data, lang: l }); onLang(l); }}
                      className={`p-6 rounded-3xl border-2 transition-all ${data.lang === l ? 'border-[#E11C5A] bg-rose-50' : 'border-slate-100 bg-white'}`}
                    >
                      <div className="text-3xl mb-2">{l === 'sw' ? '🇹🇿' : '🇬🇧'}</div>
                      <div className="font-bold text-slate-900">{l === 'sw' ? 'Kiswahili' : 'English'}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('aboutYou', lang)}</h2>
                <p className="text-slate-500 mb-6">{PLEDGE[lang]}</p>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Jina / Name</label>
                <input
                  value={data.name || ''}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Amina"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#E11C5A] focus:outline-none mb-5 text-slate-900"
                />
                <label className="block text-sm font-semibold text-slate-700 mb-2">{lang === 'sw' ? 'Umri' : 'Age Group'}</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_BRACKETS.map((a) => (
                    <button
                      key={a[lang]}
                      onClick={() => setData({ ...data, age: a[lang] })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${data.age === a[lang] ? 'bg-[#E11C5A] text-white' : 'bg-rose-50 text-slate-700'}`}
                    >
                      {a[lang]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('yourStage', lang)}</h2>
                <p className="text-slate-500 mb-6">{lang === 'sw' ? 'Chagua awamu ya maisha' : 'Choose your life stage'}</p>
                <div className="space-y-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setData({ ...data, stage: s.id })}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${data.stage === s.id ? 'border-[#E11C5A] bg-rose-50' : 'border-slate-100'}`}
                    >
                      <div className="font-semibold text-slate-900">{s.label[lang]}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.desc[lang]}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('yourInterests', lang)}</h2>
                <p className="text-slate-500 mb-6">{lang === 'sw' ? 'Chagua zaidi ya moja' : 'Select one or more'}</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => {
                    const active = (data.interests || []).includes(i.id);
                    return (
                      <motion.button
                        key={i.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleInterest(i.id)}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${active ? 'bg-[#E11C5A] text-white shadow-md shadow-rose-300/40' : 'bg-rose-50 text-slate-700'}`}
                      >
                        {active && <Check size={14} className="inline mr-1" />}
                        {i.label[lang]}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('yourGoals', lang)}</h2>
                <p className="text-slate-500 mb-6">{lang === 'sw' ? 'Lengo lako kuu sasa' : 'Your main goal now'}</p>
                <div className="space-y-2">
                  {GOALS.map((g) => {
                    const active = (data.goals || []).includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.id)}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${active ? 'border-[#E11C5A] bg-rose-50' : 'border-slate-100'}`}
                      >
                        <span className="font-medium text-slate-800">{g.label[lang]}</span>
                        {active && <Check size={18} color="#E11C5A" weight="bold" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('yourPrivacy', lang)}</h2>
                <p className="text-slate-500 mb-6">{t('privacyNote', lang)}</p>
                <div className="bg-rose-50 rounded-3xl p-5 mb-4">
                  <div className="text-xs uppercase tracking-wider text-[#E11C5A] font-bold mb-1">{PLEDGE[lang]}</div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {lang === 'sw'
                      ? 'Taarifa zako zinaakiwa kwenye kifaa chako. Hakuna mtu mwingine anaweza kuzisoma.'
                      : 'Your data stays on your device. No one else can read it.'}
                  </p>
                </div>
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 mb-3">
                  <input
                    type="checkbox"
                    checked={!!data.notifications}
                    onChange={(e) => setData({ ...data, notifications: e.target.checked })}
                    className="w-5 h-5 accent-[#E11C5A]"
                  />
                  <span className="text-sm text-slate-800">{t('allowNotif', lang)}</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100">
                  <input
                    type="checkbox"
                    checked={!!data.consent}
                    onChange={(e) => setData({ ...data, consent: e.target.checked })}
                    className="w-5 h-5 accent-[#E11C5A]"
                  />
                  <span className="text-sm text-slate-800">{t('agreePledge', lang)}</span>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          disabled={!canNext}
          onClick={() => {
            if (step === totalSteps - 1) {
              onComplete({ ...data, onboarded: true });
            } else {
              setStep(step + 1);
            }
          }}
          className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${canNext ? 'bg-[#E11C5A] text-white shadow-lg shadow-rose-300/40 active:scale-[0.98]' : 'bg-slate-100 text-slate-400'}`}
        >
          {step === totalSteps - 1 ? t('finish', lang) : t('next', lang)} <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}