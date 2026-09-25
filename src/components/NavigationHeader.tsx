import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Compass, Heart, User, Sparkle, Bell, CaretDown, Heartbeat } from '@phosphor-icons/react';
import type { Lang, Role, Tab, UserProfile } from '@/types';
import { BRAND, PLEDGE, LOGO_URL, t } from '@/data/afyapinkData';

const ROLES: Role[] = ['USER', 'PROFESSIONAL', 'CONTENT_REVIEWER', 'ADMIN'];
const ROLE_LABEL: Record<Role, { sw: string; en: string }> = {
  USER: { sw: 'Mtumiaji', en: 'User' },
  PROFESSIONAL: { sw: 'Mtaalamu', en: 'Pro' },
  CONTENT_REVIEWER: { sw: 'Mkaguzi', en: 'Reviewer' },
  ADMIN: { sw: 'Admin', en: 'Admin' },
};

interface Props {
  lang: Lang;
  profile: UserProfile;
  activeTab: Tab;
  onTab: (t: Tab) => void;
  onLang: (l: Lang) => void;
  onRole: (r: Role) => void;
  onWizard: () => void;
}

export default function NavigationHeader({ lang, profile, activeTab, onTab, onLang, onRole, onWizard }: Props) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const notifications = [
    { sw: 'Usisahau kunywa maji leo', en: "Don't forget to drink water today" },
    { sw: 'Safari yako ya wiki inaendelea', en: 'Your weekly journey is progressing' },
    { sw: 'Makala mpya: Lishe ya mzunguko', en: 'New article: Cycle nutrition' },
  ];

  const navItems: { id: Tab; label: string; Icon: any }[] = [
    { id: 'home', label: t('home', lang), Icon: House },
    { id: 'gundua', label: t('discover', lang), Icon: Compass },
    { id: 'safari', label: t('journey', lang), Icon: Heart },
    { id: 'wellness', label: t('wellness', lang), Icon: Heartbeat },
    { id: 'mimi', label: t('profile', lang), Icon: User },
  ];

  if (profile.role === 'ADMIN' || profile.role === 'CONTENT_REVIEWER') {
    navItems.push({ id: 'admin', label: t('admin', lang), Icon: Sparkle });
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white ring-1 ring-rose-100 shadow-sm flex items-center justify-center overflow-hidden">
              <img src={LOGO_URL} alt={`${BRAND} logo`} className="h-full w-full object-contain p-0.5" />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-slate-900">{BRAND}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setRoleOpen(!roleOpen)}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 text-[#E11C5A] text-xs font-semibold"
              >
                {ROLE_LABEL[profile.role][lang]}
                <CaretDown size={12} />
              </button>
              <AnimatePresence>
                {roleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => { onRole(r); setRoleOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-rose-50 ${profile.role === r ? 'text-[#E11C5A] font-semibold' : 'text-slate-700'}`}
                      >
                        {ROLE_LABEL[r][lang]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => onLang(lang === 'sw' ? 'en' : 'sw')}
              className="px-2.5 py-1 rounded-full border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-[#E11C5A] hover:text-[#E11C5A] transition-colors"
            >
              {lang === 'sw' ? 'SW' : 'EN'}
            </button>

            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-8 h-8 rounded-full hover:bg-rose-50 flex items-center justify-center relative"
              >
                <Bell size={18} className="text-slate-700" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E11C5A]" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">{t('home', lang)}</p>
                    {notifications.map((n, i) => (
                      <div key={i} className="p-2 rounded-xl hover:bg-rose-50 text-sm text-slate-700">
                        {n[lang]}
                      </div>
                    ))}
                    <p className="text-[10px] text-slate-400 mt-2 text-center italic">{PLEDGE[lang]}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-200 to-[#E11C5A] flex items-center justify-center text-white text-xs font-bold">
              {profile.name ? profile.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-2 h-16 flex items-center justify-around relative">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTab(item.id)}
                className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[52px]"
              >
                <motion.div animate={{ y: active ? -2 : 0, scale: active ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <item.Icon size={22} weight={active ? 'fill' : 'regular'} color={active ? '#E11C5A' : '#64748b'} />
                </motion.div>
                <span className={`text-[10px] font-medium ${active ? 'text-[#E11C5A]' : 'text-slate-500'}`}>{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[#E11C5A]"
                  />
                )}
              </button>
            );
          })}

          <button
            onClick={onWizard}
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#E11C5A] shadow-lg shadow-rose-300/50 flex items-center justify-center active:scale-95 transition-transform"
          >
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <Sparkle size={24} weight="fill" color="#fff" />
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
}