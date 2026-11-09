import React from 'react';
import { extraStrings } from '../i18n.extra';

export function About({ lang = 'en', navigate }) {
  const t = extraStrings[lang] || extraStrings.en;

  const infoCards = [
    {
      title: t.aboutCard1Title,
      desc: t.aboutCard1Desc,
      icon: "🎯"
    },
    {
      title: t.aboutCard2Title,
      desc: t.aboutCard2Desc,
      icon: "🏛️"
    },
    {
      title: t.aboutCard3Title,
      desc: t.aboutCard3Desc,
      icon: "🔒"
    },
    {
      title: t.aboutCard4Title,
      desc: t.aboutCard4Desc,
      icon: "📜"
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-ink dark:text-mist">
          {t.aboutPageTitle}
        </h1>
      </div>

      {/* 4 Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoCards.map((card, idx) => (
          <div key={idx} className="card p-5 space-y-2 shadow-sm">
            <h2 className="text-lg font-bold text-ink dark:text-mist flex items-center gap-2">
              <span aria-hidden="true">{card.icon}</span>
              <span>{card.title}</span>
            </h2>
            <p className="text-sm text-ink/80 dark:text-mist/80 leading-relaxed font-normal">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Amber "Stay safe" card */}
      <div
        role="alert"
        className="card p-5 sm:p-6 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 space-y-3 shadow-sm"
      >
        <h2 className="text-lg font-extrabold flex items-center gap-2">
          <span aria-hidden="true">🛡️</span>
          <span>{t.staySafeTitle}</span>
        </h2>
        <ul className="space-y-2 text-sm sm:text-base font-medium">
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 dark:text-amber-400 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint1}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 dark:text-amber-400 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint2}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-700 dark:text-amber-400 font-bold" aria-hidden="true">•</span>
            <span>{t.staySafePoint3}</span>
          </li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-primary text-base font-bold px-8 py-3 w-full sm:w-auto"
        >
          {t.askAssistant}
        </button>
      </div>
    </div>
  );
}

export default About;
