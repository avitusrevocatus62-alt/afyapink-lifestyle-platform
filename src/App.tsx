import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Lang, Tab, UserProfile, Article } from '@/types';
import { ARTICLES } from '@/data/afyapinkData';
import NavigationHeader from '@/components/NavigationHeader';
import OnboardingModal from '@/components/OnboardingModal';
import HomeScreen from '@/components/HomeScreen';
import DiscoveryAndJourneys from '@/components/DiscoveryAndJourneys';
import ProfileAndAdminCMS from '@/components/ProfileAndAdminCMS';
import AfyaPinkAIWizard from '@/components/AfyaPinkAIWizard';
import WellnessEngine from '@/components/WellnessEngine';

const DEFAULT_WELLNESS = {
  waterLogs: {},
  sleepLogs: [],
  moodLogs: [],
  weightLogs: [],
  completedWorkouts: {},
  savedRecipes: [],
  waterStreak: 0,
};

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  lang: 'sw',
  age: '',
  stage: '',
  interests: [],
  goals: [],
  consent: false,
  notifications: false,
  role: 'USER',
  onboarded: false,
  bookmarks: [],
  water: 0,
  mood: '',
  completedSteps: {},
  journeyProgress: {},
  wellness: DEFAULT_WELLNESS,
  dailyWaterTarget: 8,
};

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem('afyapink_profile');
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch { /* empty */ }
  return DEFAULT_PROFILE;
}

function loadArticles(): Article[] {
  try {
    const raw = localStorage.getItem('afyapink_articles');
    if (raw) return JSON.parse(raw);
  } catch { /* empty */ }
  return ARTICLES;
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [articles, setArticles] = useState<Article[]>(loadArticles);
  const [tab, setTab] = useState<Tab>('home');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selfCheckId, setSelfCheckId] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('afyapink_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('afyapink_articles', JSON.stringify(articles));
  }, [articles]);

  const updateProfile = (p: Partial<UserProfile>) => setProfile((prev) => ({ ...prev, ...p }));
  const onLang = (l: Lang) => updateProfile({ lang: l });
  const onRole = (r: UserProfile['role']) => updateProfile({ role: r });
  const resetAll = () => {
    localStorage.removeItem('afyapink_profile');
    localStorage.removeItem('afyapink_articles');
    setProfile(DEFAULT_PROFILE);
    setArticles(ARTICLES);
    setTab('home');
    setWizardOpen(false);
    setSelfCheckId(null);
    setArticleId(null);
  };

  if (!profile.onboarded) {
    return <OnboardingModal lang={profile.lang} onComplete={updateProfile} onLang={onLang} />;
  }

  return (
    <div lang={profile.lang} className="min-h-screen bg-white text-slate-900">
      <NavigationHeader
        lang={profile.lang}
        profile={profile}
        activeTab={tab}
        onTab={setTab}
        onLang={onLang}
        onRole={onRole}
        onWizard={() => setWizardOpen(true)}
      />

      <main>
        {tab === 'home' && (
          <HomeScreen
            lang={profile.lang}
            profile={profile}
            onTab={setTab}
            onWizard={() => setWizardOpen(true)}
            onArticle={(id) => setArticleId(id)}
            onSelfCheck={(id) => setSelfCheckId(id)}
            onProfile={updateProfile}
          />
        )}
        {tab === 'gundua' && (
          <DiscoveryAndJourneys
            lang={profile.lang}
            profile={profile}
            onProfile={updateProfile}
            onArticle={(id) => setArticleId(id)}
            onSelfCheck={(id) => setSelfCheckId(id)}
            view="gundua"
          />
        )}
        {tab === 'safari' && (
          <DiscoveryAndJourneys
            lang={profile.lang}
            profile={profile}
            onProfile={updateProfile}
            onArticle={(id) => setArticleId(id)}
            onSelfCheck={(id) => setSelfCheckId(id)}
            view="safari"
          />
        )}
        {tab === 'wellness' && (
          <WellnessEngine
            lang={profile.lang}
            profile={profile}
            onProfile={updateProfile}
          />
        )}
        {tab === 'mimi' && (
          <ProfileAndAdminCMS
            lang={profile.lang}
            profile={profile}
            onProfile={updateProfile}
            onRole={onRole}
            onDeleteData={resetAll}
            articles={articles}
            onArticles={setArticles}
          />
        )}
        {tab === 'admin' && (
          <ProfileAndAdminCMS
            lang={profile.lang}
            profile={{ ...profile, role: 'ADMIN' }}
            onProfile={updateProfile}
            onRole={onRole}
            onDeleteData={resetAll}
            articles={articles}
            onArticles={setArticles}
          />
        )}
      </main>

      <AnimatePresence>
        {wizardOpen && (
          <AfyaPinkAIWizard lang={profile.lang} onClose={() => setWizardOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selfCheckId && (
          <SelfCheckModal lang={profile.lang} id={selfCheckId} onClose={() => setSelfCheckId(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {articleId && (
          <ArticleReader lang={profile.lang} id={articleId} articles={articles} onClose={() => setArticleId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion } from 'framer-motion';
import { X, Check } from '@phosphor-icons/react';
import { SELFCHECKS, t } from '@/data/afyapinkData';

function SelfCheckModal({ lang, id, onClose }: { lang: Lang; id: string; onClose: () => void }) {
  const check = SELFCHECKS.find((s) => s.id === id);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!check) return null;
  const q = check.questions[step];
  const maxScore = check.questions.reduce((sum, question) => sum + Math.max(...question.options.map((o) => o.score)), 0);

  const answer = (s: number) => {
    const newScore = score + s;
    if (step < check.questions.length - 1) {
      setScore(newScore);
      setStep(step + 1);
    } else {
      setScore(newScore);
      setDone(true);
    }
  };

  const resultKey = maxScore === 0 ? 'low' : score / maxScore > 0.6 ? 'high' : score / maxScore > 0.3 ? 'mid' : 'low';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">{check.title[lang]}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-50">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {!done ? (
          <div>
            <p className="text-[10px] text-slate-400 font-bold mb-2">{step + 1}/{check.questions.length}</p>
            <p className="text-sm font-semibold text-slate-800 mb-4">{q.q[lang]}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answer(opt.score)}
                  className="w-full p-4 rounded-2xl bg-rose-50 border border-rose-100 text-left text-sm font-medium text-slate-800 hover:bg-rose-100 transition-colors"
                >
                  {opt.label[lang]}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Check size={28} color="#10b981" weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{lang === 'sw' ? 'Matokeo' : 'Results'}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{check.results[resultKey][lang]}</p>
            <p className="text-[10px] text-slate-400 italic">{t('disclaimer', lang)}</p>
            <button onClick={onClose} className="mt-5 px-6 py-3 rounded-full bg-[#E11C5A] text-white text-sm font-bold">
              {lang === 'sw' ? 'Funga' : 'Close'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function ArticleReader({ lang, id, articles, onClose }: { lang: Lang; id: string; articles: Article[]; onClose: () => void }) {
  const article = articles.find((a) => a.id === id);
  if (!article) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-600">
          <X size={20} />
        </button>
        <span className="text-[10px] uppercase tracking-wider text-[#E11C5A] font-bold">{article.category}</span>
        <span className="text-[10px] text-slate-400">{article.readTime} {t('minRead', lang)}</span>
      </div>
      <div className="px-5 py-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">{article.title[lang]}</h1>
        <p className="text-xs text-slate-500 mt-2">{article.author}</p>
        <div className="w-12 h-1 bg-[#E11C5A] rounded-full my-5" />
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{article.body[lang]}</p>
        <p className="text-[10px] text-slate-400 italic mt-8 border-t border-slate-100 pt-4">{t('disclaimer', lang)}</p>
      </div>
    </motion.div>
  );
}