import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PaperPlaneRight, Sparkle } from '@phosphor-icons/react';
import type { Lang } from '@/types';
import { t, WIZARD_PROMPTS, PLEDGE } from '@/data/afyapinkData';

interface Msg {
  role: 'user' | 'assistant';
  text: string;
}

interface Props {
  lang: Lang;
  onClose: () => void;
}

export default function AfyaPinkAIWizard({ lang, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', text: lang === 'sw' ? 'Habari! Mimi ni msaada wako wa AFYAPINK. Uliza chochote kuhusu lishe, mzunguko, mwendo, usingizi, au hisia zako. Nitakupa vidokezo vya maisha bora, si dawa.' : 'Hi! I am your AFYAPINK wellness guide. Ask me anything about nutrition, cycles, movement, sleep, or mood. I will share lifestyle tips, not medicine.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getResponse = (q: string): string => {
    const lower = q.toLowerCase();
    const match = WIZARD_PROMPTS.find((p) => {
      const key = p.q[lang].toLowerCase();
      return lower.includes(key.split(' ')[0]) || lower.includes(key.split(' ')[1] || '');
    });
    if (match) return match.a[lang];
    if (lower.includes('maji') || lower.includes('water')) {
      return lang === 'sw'
        ? 'Lengo la lita 2-2.5 kwa siku. Anza asubuhi na glasi mbili. Ongeza nundu kwa mmeng’enyo. Kabla ya kila chakula, kunywa glasi moja.'
        : 'Aim for 2-2.5 liters daily. Start morning with two glasses. Add lemon for digestion. Drink one glass before each meal.';
    }
    if (lower.includes('hedhi') || lower.includes('period') || lower.includes('cycle')) {
      return lang === 'sw'
        ? 'Kumbuka: mzunguko wa kawaida ni siku 21-35. Joto kwenye kiuno, chai ya tangawizi, na mwendo mwepesi husaidia maumivu. Andika siku zako ili kuelewa mwenendo.'
        : 'Remember: a normal cycle is 21-35 days. Heat on the belly, ginger tea, and gentle movement ease pain. Log your days to understand patterns.';
    }
    if (lower.includes('lala') || lower.includes('sleep') || lower.includes('usingizi')) {
      return lang === 'sw'
        ? 'Zima simu dakika 30 kabla ya kulala. Pumua kwa mpangilio 4-7-8. Andika wasiwasi kwenye kumbukumbu. Chumbani iwe baridi na giza.'
        : 'Turn off screens 30 min before bed. Try 4-7-8 breathing. Write worries in a journal. Keep the room cool and dark.';
    }
    if (lower.includes('choka') || lower.includes('stress') || lower.includes('wasiwasi') || lower.includes('anxious')) {
      return lang === 'sw'
        ? 'Unasikilizwa. Pumzika bila hatia. Fanya nefasi kina mara 5. Ongea na mtu wa kuamini. Ikiwa inaendelea wiki 2+, tafuta mshauri wa kitaaluma.'
        : 'You are heard. Rest without guilt. Take 5 deep breaths. Talk to someone you trust. If it lasts 2+ weeks, seek a counselor.';
    }
    return lang === 'sw'
      ? 'Asante kwa swali! Jaribu kuelezea zaidi, au chagua mojawapo ya mada hizi: lishe, mzunguko, usingizi, maji, au hisia. Kumbuka: mimi si daktari, lakini naweza kukupa mawazo ya maisha bora.'
      : 'Thanks for asking! Try to be more specific, or pick one of these topics: nutrition, cycle, sleep, water, or mood. Remember: I am not a doctor, but I can share lifestyle ideas.';
  };

  const send = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: getResponse(msg) }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      <div className="flex items-center gap-3 px-5 h-14 border-b border-slate-100 shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#E11C5A] flex items-center justify-center">
          <Sparkle size={16} weight="fill" color="#fff" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">{t('wizard', lang)}</h2>
          <p className="text-[10px] text-emerald-500 font-medium">{lang === 'sw' ? 'Mtandaoni' : 'Online'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#E11C5A] text-white rounded-br-md'
                  : 'bg-slate-50 text-slate-800 rounded-bl-md border border-slate-100'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2 h-2 rounded-full bg-slate-400" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 rounded-full bg-slate-400" />
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 rounded-full bg-slate-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-5 py-3 border-t border-slate-100 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {WIZARD_PROMPTS.slice(0, 4).map((p, i) => (
            <button
              key={i}
              onClick={() => send(p.q[lang])}
              className="px-3 py-1.5 rounded-full bg-rose-50 text-[#E11C5A] text-[10px] font-bold whitespace-nowrap shrink-0"
            >
              {p.q[lang]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={t('askAnything', lang)}
            className="flex-1 px-4 py-3 rounded-full bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:border-[#E11C5A] text-slate-900"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-[#E11C5A] text-white' : 'bg-slate-100 text-slate-400'}`}
          >
            <PaperPlaneRight size={18} weight="fill" />
          </button>
        </div>
        <p className="text-[9px] text-slate-400 text-center mt-2">{PLEDGE[lang]} | {t('disclaimer', lang)}</p>
      </div>
    </motion.div>
  );
}
