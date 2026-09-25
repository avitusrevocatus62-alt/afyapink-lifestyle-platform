import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilSimple, Shield, Lock, Tag, ChartBar, ArrowRight, Check, Eye } from '@phosphor-icons/react';
import type { Lang, UserProfile, Role, Article, ArticleStatus } from '@/types';
import { t, STAGES, INTERESTS, GOALS, KPIS, ARTICLES, STATUS_LABELS, STATUS_ORDER, PLEDGE, BRAND } from '@/data/afyapinkData';

interface Props {
  lang: Lang;
  profile: UserProfile;
  onProfile: (p: Partial<UserProfile>) => void;
  onRole: (r: Role) => void;
  onDeleteData: () => void;
  articles: Article[];
  onArticles: (a: Article[]) => void;
}

export default function ProfileAndAdminCMS({ lang, profile, onProfile, onRole, onDeleteData, articles, onArticles }: Props) {
  if (profile.role === 'ADMIN' || profile.role === 'CONTENT_REVIEWER') {
    return <AdminView lang={lang} articles={articles} onArticles={onArticles} />;
  }
  return <ProfileView lang={lang} profile={profile} onProfile={onProfile} onRole={onRole} onDeleteData={onDeleteData} />;
}

function ProfileView({ lang, profile, onProfile, onRole, onDeleteData }: { lang: Lang; profile: UserProfile; onProfile: (p: Partial<UserProfile>) => void; onRole: (r: Role) => void; onDeleteData: () => void }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState(profile.name);

  const stageLabel = STAGES.find((s) => s.id === profile.stage)?.label[lang] || '—';
  const interestLabels = (profile.interests || []).map((id) => INTERESTS.find((i) => i.id === id)?.label[lang]).filter(Boolean);
  const goalLabels = (profile.goals || []).map((id) => GOALS.find((g) => g.id === id)?.label[lang]).filter(Boolean);

  return (
    <div className="px-5 pt-20 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('profile', lang)}</h1>
        <button onClick={() => setEditing(!editing)} className="p-2 rounded-full bg-rose-50 text-[#E11C5A]">
          <PencilSimple size={18} />
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100 p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-[#E11C5A] flex items-center justify-center text-white text-2xl font-bold">
            {profile.name ? profile.name[0].toUpperCase() : 'A'}
          </div>
          <div>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => { onProfile({ name }); setEditing(false); }}
                className="text-lg font-bold text-slate-900 border-b border-[#E11C5A] outline-none"
              />
            ) : (
              <h2 className="text-lg font-bold text-slate-900">{profile.name || 'Amina'}</h2>
            )}
            <p className="text-xs text-slate-500">{profile.age} | {stageLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {interestLabels.map((l, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-rose-50 text-[#E11C5A] text-[10px] font-bold">{l}</span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {goalLabels.map((l, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-[10px] font-bold">{l}</span>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">{t('roleSwitch', lang)}</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['USER', 'PROFESSIONAL', 'CONTENT_REVIEWER', 'ADMIN'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => onRole(r)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all ${profile.role === r ? 'bg-[#E11C5A] text-white' : 'bg-slate-50 text-slate-700'}`}
            >
              {r === 'USER' ? (lang === 'sw' ? 'Mtumiaji' : 'User') : r === 'PROFESSIONAL' ? (lang === 'sw' ? 'Mtaalamu' : 'Pro') : r === 'CONTENT_REVIEWER' ? (lang === 'sw' ? 'Mkaguzi' : 'Reviewer') : 'Admin'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ChartBar size={16} color="#10b981" /> {t('wellness', lang)}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 text-center">
            <p className="text-xl font-bold text-emerald-700">{Object.values(profile.wellness?.completedWorkouts || {}).reduce((a: number, b: number) => a + b, 0)}</p>
            <p className="text-[10px] text-slate-500">{lang === 'sw' ? 'dakika mwendo' : 'min workout'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 text-center">
            <p className="text-xl font-bold text-sky-700">{profile.wellness?.waterStreak || 0}</p>
            <p className="text-[10px] text-slate-500">{t('streak', lang)} ({t('hydration', lang)})</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 text-center">
            <p className="text-xl font-bold text-purple-700">{profile.wellness?.moodLogs?.length || 0}</p>
            <p className="text-[10px] text-slate-500">{t('logMood', lang)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-center">
            <p className="text-xl font-bold text-amber-700">{profile.wellness?.savedRecipes?.length || 0}</p>
            <p className="text-[10px] text-slate-500">{t('recipes', lang)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Lock size={16} color="#E11C5A" /> {t('dataControls', lang)}
        </h3>
        <p className="text-xs text-slate-500 mb-4">{PLEDGE[lang]}</p>
        <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 mb-2">
          <input
            type="checkbox"
            checked={!!profile.notifications}
            onChange={(e) => onProfile({ notifications: e.target.checked })}
            className="w-4 h-4 accent-[#E11C5A]"
          />
          <span className="text-xs text-slate-700 font-medium">{t('allowNotif', lang)}</span>
        </label>
        <button
          onClick={() => {
            if (confirmDelete) {
              onDeleteData();
            } else {
              setConfirmDelete(true);
              setTimeout(() => setConfirmDelete(false), 4000);
            }
          }}
          className={`w-full p-3 rounded-2xl text-xs font-bold mt-2 transition-all ${confirmDelete ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}
        >
          {confirmDelete
            ? lang === 'sw'
              ? 'Bonyeza tena kuthibitisha kufuta ✓'
              : 'Tap again to confirm deletion ✓'
            : t('deleteData', lang)}
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Tag size={16} color="#8b5cf6" /> {t('store', lang)}
        </h3>
        <div className="space-y-2">
          {[
            { name: lang === 'sw' ? 'Kiti cha Mara Hara' : 'Herbal Tea Blend', price: 'TZS 15,000' },
            { name: lang === 'sw' ? 'Mavazi ya Mwendo' : 'Movement Wear Set', price: 'TZS 45,000' },
            { name: lang === 'sw' ? 'Kitabu cha Mzunguko' : 'Cycle Journal', price: 'TZS 12,000' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
              <span className="text-xs font-medium text-slate-700">{item.name}</span>
              <span className="text-xs font-bold text-[#E11C5A]">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminView({ lang, articles, onArticles }: { lang: Lang; articles: Article[]; onArticles: (a: Article[]) => void }) {
  const [filter, setFilter] = useState<ArticleStatus | 'all'>('all');

  const filtered = filter === 'all' ? articles : articles.filter((a) => a.status === filter);

  const changeStatus = (id: string, newStatus: ArticleStatus) => {
    onArticles(articles.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  return (
    <div className="px-5 pt-20 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('admin', lang)}</h1>
        <span className="px-3 py-1 rounded-full bg-[#1F2937] text-white text-[10px] font-bold">{BRAND} CMS</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {KPIS.map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-3xl bg-white border border-slate-100 p-4"
          >
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{k.label[lang]}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{k.value}</p>
            <p className="text-xs text-emerald-600 font-bold mt-0.5">{k.delta}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ChartBar size={16} color="#E11C5A" /> {t('contentPipeline', lang)}
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap ${filter === 'all' ? 'bg-[#E11C5A] text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            {t('all', lang)}
          </button>
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap ${filter === s ? 'bg-[#E11C5A] text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {STATUS_LABELS[s][lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className="rounded-3xl bg-white border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase text-slate-400 font-bold">{a.category}</p>
                <h3 className="font-bold text-slate-900 text-sm truncate">{a.title[lang]}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{a.author} | {a.readTime} {t('minRead', lang)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} className="text-slate-400" />
                <span className="text-[10px] text-slate-400">2.4k</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(a.id, s)}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all ${a.status === s ? 'bg-[#E11C5A] text-white' : 'bg-slate-50 text-slate-500 hover:bg-rose-50'}`}
                >
                  {STATUS_LABELS[s][lang]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}