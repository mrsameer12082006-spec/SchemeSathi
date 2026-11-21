import React from 'react';
import { extraStrings } from '../i18n.extra';

export function HowItWorks({ lang = 'en', navigate }) {
  const t = extraStrings[lang] || extraStrings.en;

  const steps = [
    {
      title: t.howPageStep1Title,
      desc: t.howPageStep1Desc
    },
    {
      title: t.howPageStep2Title,
      desc: t.howPageStep2Desc
    },
    {
      title: t.howPageStep3Title,
      desc: t.howPageStep3Desc
    },
    {
      title: t.howPageStep4Title,
      desc: t.howPageStep4Desc
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-ink dark:text-mist">
          {t.howPageTitle}
        </h1>
      </div>

      {/* 4 Stacked Cards */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="card p-5 sm:p-6 space-y-1.5 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-ink dark:text-mist">
              {step.title}
            </h2>
            <p className="text-base text-ink/80 dark:text-mist/80 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Plain design rule note */}
      <div className="p-4 rounded-xl bg-paper/70 dark:bg-nightcard/60 border border-line dark:border-nightline text-sm text-ink/80 dark:text-mist/80 text-center leading-relaxed">
        <p>{t.howPageNote}</p>
      </div>

      {/* Primary Action Button */}
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

export default HowItWorks;
