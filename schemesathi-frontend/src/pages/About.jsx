import React from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { Target, Landmark, Lock, FileCheck, ShieldAlert } from 'lucide-react';
=======
>>>>>>> origin/master
import { extraStrings } from '../i18n.extra';

export function About({ lang = 'en', navigate }) {
  const t = extraStrings[lang] || extraStrings.en;

  const infoCards = [
    {
      title: t.aboutCard1Title,
      desc: t.aboutCard1Desc,
<<<<<<< HEAD
      icon: <Target className="w-5 h-5 text-[#166534]" />
=======
      icon: "🎯"
>>>>>>> origin/master
    },
    {
      title: t.aboutCard2Title,
      desc: t.aboutCard2Desc,
<<<<<<< HEAD
      icon: <Landmark className="w-5 h-5 text-[#166534]" />
=======
      icon: "🏛️"
>>>>>>> origin/master
    },
    {
      title: t.aboutCard3Title,
      desc: t.aboutCard3Desc,
<<<<<<< HEAD
      icon: <Lock className="w-5 h-5 text-[#166534]" />
=======
      icon: "🔒"
>>>>>>> origin/master
    },
    {
      title: t.aboutCard4Title,
      desc: t.aboutCard4Desc,
<<<<<<< HEAD
      icon: <FileCheck className="w-5 h-5 text-[#166534]" />
=======
      icon: "📜"
>>>>>>> origin/master
    }
  ];

  return (
<<<<<<< HEAD
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-8"
    >
      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
=======
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-ink dark:text-mist">
>>>>>>> origin/master
          {t.aboutPageTitle}
        </h1>
      </div>

      {/* 4 Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoCards.map((card, idx) => (
<<<<<<< HEAD
          <div key={idx} className="card p-5 space-y-2 shadow-sm bg-white border border-stone-200/90 rounded-xl">
            <h2 className="font-serif text-lg font-bold text-[#1C1B1A] flex items-center gap-2">
              <span aria-hidden="true">{card.icon}</span>
              <span>{card.title}</span>
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
=======
          <div key={idx} className="card p-5 space-y-2 shadow-sm">
            <h2 className="text-lg font-bold text-ink dark:text-mist flex items-center gap-2">
              <span aria-hidden="true">{card.icon}</span>
              <span>{card.title}</span>
            </h2>
            <p className="text-sm text-ink/80 dark:text-mist/80 leading-relaxed font-normal">
>>>>>>> origin/master
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Amber "Stay safe" card */}
      <div
        role="alert"
<<<<<<< HEAD
        className="card p-5 sm:p-6 bg-amber-50 border border-amber-200 text-amber-900 space-y-3 shadow-sm rounded-xl"
      >
        <h2 className="font-serif text-lg font-bold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-700" aria-hidden="true" />
=======
        className="card p-5 sm:p-6 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 space-y-3 shadow-sm"
      >
        <h2 className="text-lg font-extrabold flex items-center gap-2">
          <span aria-hidden="true">🛡️</span>
>>>>>>> origin/master
          <span>{t.staySafeTitle}</span>
        </h2>
        <ul className="space-y-2 text-sm sm:text-base font-medium">
          <li className="flex items-start gap-2.5">
<<<<<<< HEAD
            <span className="text-amber-700 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint1}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint2}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 font-bold" aria-hidden="true">•</span>
=======
            <span className="text-amber-700 dark:text-amber-400 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint1}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 dark:text-amber-400 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint2}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 dark:text-amber-400 font-bold" aria-hidden="true">•</span>
>>>>>>> origin/master
            <span>{t.staySafePoint3}</span>
          </li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => navigate('/')}
<<<<<<< HEAD
          className="btn-primary text-base font-medium px-8 py-3 w-full sm:w-auto"
=======
          className="btn-primary text-base font-bold px-8 py-3 w-full sm:w-auto"
>>>>>>> origin/master
        >
          {t.askAssistant}
        </button>
      </div>
<<<<<<< HEAD
    </motion.div>
=======
    </div>
>>>>>>> origin/master
  );
}

export default About;
