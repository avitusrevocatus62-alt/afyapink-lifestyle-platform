import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, X, BookmarkSimple, Check, Star, MapPin, Shield, Clock } from '@phosphor-icons/react';
import type { Lang, UserProfile, Tab } from '@/types';
import { t, ARTICLES, SELFCHECKS, JOURNEYS, PROFESSIONALS, CATEGORIES, PLEDGE } from '@/data/afyapinkData';

interface Props {
  lang: Lang;
  profile: UserProfile;
  onProfile: (p: Partial<UserProfile>) => void;
  onArticle: (id: string) => void;
  onSelfCheck: (id: string) => void;
  view: 'gundua' | 'safari';
}

export default function DiscoveryAndJourneys({ lang, profile, onProfile, onArticle, onSelfCheck, view }: Props) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('all');

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      if (a.status !== 'published') return false;
      if (cat !== 'all' && a.category !== cat) return false;
      if (query && !a.title[lang].toLowerCase().includes(query.toLowerCase()) && !a.excerpt[lang].toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, cat, lang]);

  const toggleBookmark = (id: string) => {
    const cur = profile.bookmarks || [];
    onProfile({ bookmarks: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  };

  if (view === 'safari') {
    return <SafariView lang={lang} profile={profile} onProfile={onProfile} onSelfCheck={onSelfCheck} />;
  }

  return (
    <div className="px-5 pt-20 pb-24 space-y-5">
      <div className="relative">
        <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search', lang)}
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:border-[#E11C5A] text-slate-900"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
        <button
          onClick={() => setCat('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === 'all' ? 'bg-[#E11C5A] text-white' : 'bg-rose-50 text-slate-700'}`}
        >
          {t('all', lang)}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === c.id ? 'bg-[#E11C5A] text-white' : 'bg-rose-50 text-slate-700'}`}
          >
            {c.label[lang]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">{lang === 'sw' ? 'Hakuna matokeo' : 'No results found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-3xl bg-white border border-slate-100 overflow-hidden"
            >
              <button onClick={() => onArticle(a.id)} className="w-full p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#E11C5A] text-[10px] font-bold uppercase">{a.category}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {a.readTime} {t('minRead', lang)}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{a.title[lang]}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.excerpt[lang]}</p>
              </button>
              <div className="px-4 pb-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{a.author}</span>
                <button
                  onClick={() => toggleBookmark(a.id)}
                  className={`p-2 rounded-full ${profile.bookmarks?.includes(a.id) ? 'text-[#E11C5A]' : 'text-slate-300 hover:text-slate-500'}`}
                >
                  <BookmarkSimple size={18} weight={profile.bookmarks?.includes(a.id) ? 'fill' : 'regular'} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function SafariView({ lang, profile, onProfile, onSelfCheck }: { lang: Lang; profile: UserProfile; onProfile: (p: Partial<UserProfile>) => void; onSelfCheck: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<'programs' | 'checklist' | 'history' | 'saved' | 'experts'>('programs');

  const tabs = [
    { id: 'programs' as const, label: t('programs', lang) },
    { id: 'checklist' as const, label: lang === 'sw' ? 'Hatua' : 'Milestones' },
    { id: 'history' as const, label: t('history', lang) },
    { id: 'saved' as const, label: t('bookmarks', lang) },
    { id: 'experts' as const, label: t('experts', lang) },
  ];

  const savedArticles = ARTICLES.filter((a) => profile.bookmarks?.includes(a.id));

  const toggleMilestone = (journeyId: string, week: number) => {
    const cur = profile.completedSteps[journeyId] || [];
    const key = `w${week}`;
    const next = cur.includes(key) ? cur.filter((x) => x !== key) : [...cur, key];
    const progress = next.length;
    onProfile({ completedSteps: { ...profile.completedSteps, [journeyId]: next }, journeyProgress: { ...profile.journeyProgress, [journeyId]: progress } });
  };

  const wellness = profile.wellness;
  const totalWorkouts = Object.values(wellness?.completedWorkouts || {}).reduce((a, b) => a + b, 0);
  const avgSleep = wellness?.sleepLogs?.length ? (wellness.sleepLogs.reduce((a, s) => a + s.hours, 0) / wellness.sleepLogs.length).toFixed(1) : '—';

  return (
    <div className="px-5 pt-20 pb-24 space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">{t('journey', lang)}</h1>

      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4">
        <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-2">{t('wellness', lang)}</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-lg font-bold text-slate-900">{totalWorkouts}</p><p className="text-[9px] text-slate-500">{lang === 'sw' ? 'dakika mwendo' : 'min moved'}</p></div>
          <div><p className="text-lg font-bold text-slate-900">{avgSleep}</p><p className="text-[9px] text-slate-500">{lang === 'sw' ? 'saa wastani' : 'avg hrs sleep'}</p></div>
          <div><p className="text-lg font-bold text-slate-900">{wellness?.waterStreak || 0}</p><p className="text-[9px] text-slate-500">{t('streak', lang)}</p></div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#E11C5A] text-white' : 'bg-rose-50 text-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'programs' && (
            <div className="space-y-4">
              {JOURNEYS.map((j) => {
                const progress = profile.journeyProgress[j.id] || 0;
                return (
                  <div key={j.id} className="rounded-3xl bg-white border border-slate-100 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: j.color }} />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{j.title[lang]}</h3>
                        <p className="text-xs text-slate-500">{j.description[lang]}</p>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(progress / j.weeks) * 100}%`, backgroundColor: j.color }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">{progress}/{j.weeks} {lang === 'sw' ? 'wiki' : 'weeks'}</p>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              {JOURNEYS.map((j) => (
                <div key={j.id} className="rounded-3xl bg-white border border-slate-100 p-5">
                  <h3 className="font-bold text-slate-900 text-sm mb-3">{j.title[lang]}</h3>
                  <div className="space-y-2">
                    {j.milestones.map((m, idx) => {
                      const done = (profile.completedSteps[j.id] || []).includes(`w${idx + 1}`);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleMilestone(j.id, idx + 1)}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${done ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50'}`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? 'bg-emerald-500' : 'border-2 border-slate-300'}`}>
                            {done && <Check size={12} color="#fff" weight="bold" />}
                          </div>
                          <span className={`text-xs font-medium ${done ? 'text-emerald-700' : 'text-slate-700'}`}>{m[lang]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {SELFCHECKS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelfCheck(s.id)}
                  className="w-full p-4 rounded-3xl bg-white border border-slate-100 text-left"
                >
                  <h3 className="font-bold text-slate-900 text-sm">{s.title[lang]}</h3>
                  <p className="text-xs text-slate-500 mt-1">{s.description[lang]}</p>
                  <p className="text-[10px] text-[#E11C5A] font-bold mt-2">{lang === 'sw' ? 'Anza tathmini →' : 'Start check →'}</p>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-3">
              {savedArticles.length === 0 ? (
                <div className="text-center py-12">
                  <BookmarkSimple size={32} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">{lang === 'sw' ? 'Hujahifadhi makala bado' : 'No saved articles yet'}</p>
                </div>
              ) : (
                savedArticles.map((a) => (
                  <div key={a.id} className="p-4 rounded-3xl bg-white border border-slate-100">
                    <span className="text-[10px] uppercase text-[#E11C5A] font-bold">{a.category}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{a.title[lang]}</h3>
                    <p className="text-xs text-slate-500 mt-1">{a.excerpt[lang]}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'experts' && (
            <div className="space-y-3">
              {PROFESSIONALS.map((p) => (
                <div key={p.id} className="p-4 rounded-3xl bg-white border border-slate-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-[#E11C5A] font-bold text-lg shrink-0">
                    {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{p.name}</h3>
                      {p.verified && <Shield size={14} color="#10b981" weight="fill" />}
                    </div>
                    <p className="text-xs text-slate-500">{p.specialty[lang]}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <MapPin size={10} /> {p.location[lang]}
                      </span>
                      <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                        <Star size={10} weight="fill" /> {p.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-slate-400 text-center italic pt-2">{PLEDGE[lang]}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}