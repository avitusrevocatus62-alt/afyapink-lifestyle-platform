import { useState } from 'react';
import { motion } from 'framer-motion';
import { Drop, Sun, Moon, Flower, Brain, Heart, Sparkle, BookOpen, Compass, Check, Plus } from '@phosphor-icons/react';
import type { Lang, UserProfile, Tab } from '@/types';
import { t, STAGES, ARTICLES, SELFCHECKS, JOURNEYS, AFFIRMATIONS } from '@/data/afyapinkData';

interface Props {
  lang: Lang;
  profile: UserProfile;
  onTab: (t: Tab) => void;
  onWizard: () => void;
  onArticle: (id: string) => void;
  onSelfCheck: (id: string) => void;
  onProfile: (p: Partial<UserProfile>) => void;
}



export default function HomeScreen({ lang, profile, onTab, onWizard, onArticle, onSelfCheck, onProfile }: Props) {
  const [moodPicker, setMoodPicker] = useState(false);
  const moods = [
    { id: 'happy', emoji: '😊', label: { sw: 'Furaha', en: 'Happy' } },
    { id: 'calm', emoji: '😌', label: { sw: 'Amani', en: 'Calm' } },
    { id: 'tired', emoji: '😴', label: { sw: 'Chowo', en: 'Tired' } },
    { id: 'sad', emoji: '😢', label: { sw: 'Huzuni', en: 'Sad' } },
    { id: 'anxious', emoji: '😰', label: { sw: 'Wasiwasi', en: 'Anxious' } },
  ];

  const dailyAffirmation = AFFIRMATIONS[lang][new Date().getDate() % AFFIRMATIONS[lang].length];
  const stageLabel = STAGES.find((s) => s.id === profile.stage)?.label[lang] || '';

  const nextStep = (() => {
    if (!profile.water) return { title: t('water', lang), desc: lang === 'sw' ? 'Anza siku yako na glasi ya kwanza' : 'Start with your first glass', action: 'water' };
    if (!profile.mood) return { title: t('mood', lang), desc: lang === 'sw' ? 'Jitoe ripoti ya hisia yako leo' : 'Log how you feel today', action: 'mood' };
    const activeJourney = JOURNEYS.find((j) => (profile.journeyProgress[j.id] || 0) < j.weeks);
    if (activeJourney) return { title: activeJourney.title[lang], desc: lang === 'sw' ? 'Endelea na hatua inayofuata' : 'Continue your next milestone', action: 'journey' };
    return { title: t('knowYourself', lang), desc: lang === 'sw' ? 'Jaribu tathmini mpya' : 'Try a new self-check', action: 'selfcheck' };
  })();

  const quickActions = [
    { id: 'eat', label: t('eatWell', lang), Icon: BookOpen, color: '#10b981', tab: 'wellness' as Tab },
    { id: 'water', label: t('water', lang), Icon: Drop, color: '#0ea5e9', action: 'water' },
    { id: 'move', label: t('moveBody', lang), Icon: Sun, color: '#f59e0b', tab: 'wellness' as Tab },
    { id: 'rest', label: t('rest', lang), Icon: Moon, color: '#8b5cf6', tab: 'wellness' as Tab },
    { id: 'mood', label: t('mood', lang), Icon: Brain, color: '#ec4899', action: 'mood' },
    { id: 'body', label: t('yourBody', lang), Icon: Flower, color: '#E11C5A', tab: 'safari' as Tab },
  ];

  const published = ARTICLES.filter((a) => a.status === 'published').slice(0, 4);
  const activeJourney = JOURNEYS.find((j) => (profile.journeyProgress[j.id] || 0) > 0 && (profile.journeyProgress[j.id] || 0) < j.weeks);

  const addWater = () => onProfile({ water: Math.min((profile.water || 0) + 1, 10) });
  const setMood = (m: string) => { onProfile({ mood: m }); setMoodPicker(false); };

  return (
    <div className="px-5 pt-20 pb-24 space-y-8">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-widest text-[#E11C5A] font-bold mb-1"
        >
          {stageLabel}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl font-bold text-slate-900 tracking-tight"
        >
          {t('hello', lang)}, {profile.name || 'Amina'} <span className="inline-block">❤️</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-slate-600 leading-relaxed italic"
        >
          "{dailyAffirmation}"
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl bg-gradient-to-br from-[#E11C5A] to-[#ff5c8a] p-5 text-white shadow-xl shadow-rose-300/30"
      >
        <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">{t('nextStep', lang)}</p>
        <h3 className="mt-1 text-lg font-bold">{nextStep.title}</h3>
        <p className="text-sm opacity-90 mt-1">{nextStep.desc}</p>
        <button
          onClick={() => {
            if (nextStep.action === 'water') addWater();
            else if (nextStep.action === 'mood') setMoodPicker(true);
            else if (nextStep.action === 'journey') onTab('safari');
            else onSelfCheck(SELFCHECKS[0].id);
          }}
          className="mt-4 px-4 py-2 rounded-full bg-white text-[#E11C5A] text-sm font-bold flex items-center gap-2"
        >
          {t('start', lang)} <Sparkle size={14} weight="fill" />
        </button>
      </motion.div>

      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">{t('quickActions', lang)}</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((a, i) => (
            <motion.button
              key={a.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (a.action === 'water') addWater();
                else if (a.action === 'mood') setMoodPicker(true);
                else if (a.tab) onTab(a.tab);
              }}
              className="aspect-square rounded-3xl bg-white border border-slate-100 flex flex-col items-center justify-center gap-2 shadow-sm"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: a.color + '18' }}>
                <a.Icon size={22} color={a.color} weight="fill" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">{a.label}</span>
              {a.id === 'water' && profile.water > 0 && (
                <span className="text-[10px] text-[#0ea5e9] font-bold">{profile.water}/10</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">{t('knowYourself', lang)}</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSelfCheck(SELFCHECKS[0].id)}
            className="p-4 rounded-3xl bg-rose-50 border border-rose-100 text-left"
          >
            <Flower size={24} color="#E11C5A" weight="fill" />
            <p className="mt-2 text-sm font-bold text-slate-900">{lang === 'sw' ? 'Tathmini za Haraka' : 'Quick Self-Checks'}</p>
            <p className="text-[11px] text-slate-600 mt-1">{SELFCHECKS.length} {lang === 'sw' ? 'tathmini' : 'checks'}</p>
          </button>
          <button
            onClick={onWizard}
            className="p-4 rounded-3xl bg-gradient-to-br from-[#1F2937] to-[#374151] text-left text-white"
          >
            <Sparkle size={24} color="#fff" weight="fill" />
            <p className="mt-2 text-sm font-bold">{lang === 'sw' ? 'Msaada wa AI' : 'AI Wizard'}</p>
            <p className="text-[11px] opacity-80 mt-1">{lang === 'sw' ? 'Soma swali lolote' : 'Ask anything'}</p>
          </button>
          <button
            onClick={() => onTab('gundua')}
            className="p-4 rounded-3xl bg-white border border-slate-100 text-left"
          >
            <BookOpen size={24} color="#8b5cf6" weight="fill" />
            <p className="mt-2 text-sm font-bold text-slate-900">{lang === 'sw' ? 'Elimu ya Afya' : 'Health Education'}</p>
            <p className="text-[11px] text-slate-600 mt-1">{ARTICLES.length} {lang === 'sw' ? 'makala' : 'articles'}</p>
          </button>
          <button
            onClick={() => onTab('safari')}
            className="p-4 rounded-3xl bg-white border border-slate-100 text-left"
          >
            <Compass size={24} color="#10b981" weight="fill" />
            <p className="mt-2 text-sm font-bold text-slate-900">{lang === 'sw' ? 'Safari za Afya' : 'Wellness Journeys'}</p>
            <p className="text-[11px] text-slate-600 mt-1">{JOURNEYS.length} {lang === 'sw' ? 'programu' : 'programs'}</p>
          </button>
        </div>
      </div>

      {activeJourney && (
        <div className="rounded-3xl bg-white border border-slate-100 p-5">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">{t('continueWhere', lang)}</p>
          <h3 className="font-bold text-slate-900">{activeJourney.title[lang]}</h3>
          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((profile.journeyProgress[activeJourney.id] || 0) / activeJourney.weeks) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full"
              style={{ backgroundColor: activeJourney.color }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {profile.journeyProgress[activeJourney.id] || 0}/{activeJourney.weeks} {lang === 'sw' ? 'wiki' : 'weeks'}
          </p>
          <button onClick={() => onTab('safari')} className="mt-3 text-sm text-[#E11C5A] font-bold">
            {lang === 'sw' ? 'Endelea →' : 'Continue →'}
          </button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('discoverMore', lang)}</h2>
          <button onClick={() => onTab('gundua')} className="text-xs text-[#E11C5A] font-bold">
            {lang === 'sw' ? 'Zote →' : 'All →'}
          </button>
        </div>
        <div className="space-y-3">
          {published.map((a, i) => (
            <motion.button
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onArticle(a.id)}
              className="w-full p-4 rounded-3xl bg-white border border-slate-100 text-left flex items-start gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <Heart size={20} color="#E11C5A" weight="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-[#E11C5A] font-bold">{a.category}</p>
                <h3 className="text-sm font-bold text-slate-900 truncate">{a.title[lang]}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{a.excerpt[lang]}</p>
                <p className="text-[10px] text-slate-400 mt-1">{a.readTime} {t('minRead', lang)}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {moodPicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setMoodPicker(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end"
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-t-3xl p-6 pb-10"
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">{lang === 'sw' ? 'Unahisi vipi?' : 'How do you feel?'}</h3>
            <p className="text-sm text-slate-500 mb-5">{lang === 'sw' ? 'Chagua hisia moja' : 'Pick one mood'}</p>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 text-2xl ${profile.mood === m.id ? 'bg-rose-50 ring-2 ring-[#E11C5A]' : 'bg-slate-50'}`}
                >
                  <span>{m.emoji}</span>
                  <span className="text-[9px] font-semibold text-slate-700">{m.label[lang]}</span>
                </button>
              ))}
            </div>
            {profile.mood && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600">
                <Check size={16} weight="bold" /> {t('saved', lang)}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {profile.water > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={addWater}
          className="fixed bottom-24 right-5 w-12 h-12 rounded-full bg-[#0ea5e9] text-white shadow-lg shadow-sky-300/50 flex items-center justify-center z-30"
        >
          <Plus size={20} weight="bold" />
        </motion.button>
      )}
    </div>
  );
}