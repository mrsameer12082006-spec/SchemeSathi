import React from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
=======
>>>>>>> origin/master
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
<<<<<<< HEAD
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8"
    >
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
=======
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-ink dark:text-mist">
>>>>>>> origin/master
          {t.howPageTitle}
        </h1>
      </div>

      {/* 4 Stacked Cards */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
<<<<<<< HEAD
          <div key={idx} className="card p-5 sm:p-6 space-y-1.5 shadow-sm bg-white border border-stone-200/90 rounded-xl">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1C1B1A]">
              {step.title}
            </h2>
            <p className="text-base text-stone-600 leading-relaxed font-normal">
=======
          <div key={idx} className="card p-5 sm:p-6 space-y-1.5 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-ink dark:text-mist">
              {step.title}
            </h2>
            <p className="text-base text-ink/80 dark:text-mist/80 leading-relaxed">
>>>>>>> origin/master
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Plain design rule note */}
<<<<<<< HEAD
      <div className="p-4 rounded-xl bg-[#F9F8F6] border border-stone-200 text-sm text-stone-600 text-center leading-relaxed">
=======
      <div className="p-4 rounded-xl bg-paper/70 dark:bg-nightcard/60 border border-line dark:border-nightline text-sm text-ink/80 dark:text-mist/80 text-center leading-relaxed">
>>>>>>> origin/master
        <p>{t.howPageNote}</p>
      </div>

      {/* Primary Action Button */}
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

export default HowItWorks;
