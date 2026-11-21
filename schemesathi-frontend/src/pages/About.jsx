import React from 'react';
import { motion } from 'framer-motion';
import { Target, Landmark, Lock, FileCheck, ShieldAlert } from 'lucide-react';
import { extraStrings } from '../i18n.extra';

export function About({ lang = 'en', navigate }) {
  const t = extraStrings[lang] || extraStrings.en;

  const infoCards = [
    {
      title: t.aboutCard1Title,
      desc: t.aboutCard1Desc,
      icon: <Target className="w-5 h-5 text-[#166534]" />
    },
    {
      title: t.aboutCard2Title,
      desc: t.aboutCard2Desc,
      icon: <Landmark className="w-5 h-5 text-[#166534]" />
    },
    {
      title: t.aboutCard3Title,
      desc: t.aboutCard3Desc,
      icon: <Lock className="w-5 h-5 text-[#166534]" />
    },
    {
      title: t.aboutCard4Title,
      desc: t.aboutCard4Desc,
      icon: <FileCheck className="w-5 h-5 text-[#166534]" />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-8"
    >
      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
          {t.aboutPageTitle}
        </h1>
      </div>

      {/* 4 Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoCards.map((card, idx) => (
          <div key={idx} className="card p-5 space-y-2 shadow-sm bg-white border border-stone-200/90 rounded-xl">
            <h2 className="font-serif text-lg font-bold text-[#1C1B1A] flex items-center gap-2">
              <span aria-hidden="true">{card.icon}</span>
              <span>{card.title}</span>
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Amber "Stay safe" card */}
      <div
        role="alert"
        className="card p-5 sm:p-6 bg-amber-50 border border-amber-200 text-amber-900 space-y-3 shadow-sm rounded-xl"
      >
        <h2 className="font-serif text-lg font-bold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-700" aria-hidden="true" />
          <span>{t.staySafeTitle}</span>
        </h2>
        <ul className="space-y-2 text-sm sm:text-base font-medium">
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint1}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint2}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint3}</span>
          </li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-primary text-base font-medium px-8 py-3 w-full sm:w-auto"
        >
          {t.askAssistant}
        </button>
      </div>
    </motion.div>
  );
}

export default About;
