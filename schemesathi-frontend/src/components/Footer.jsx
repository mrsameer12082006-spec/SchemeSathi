import React from 'react';
import { extraStrings } from '../i18n.extra';

export function Footer({ lang }) {
  const t = extraStrings[lang] || extraStrings.en;

  return (
<<<<<<< HEAD
    <footer className="w-full mt-auto border-t border-stone-200 py-8 px-4 text-center text-sm text-stone-500 transition-colors">
=======
    <footer className="w-full mt-auto border-t border-line dark:border-nightline py-8 px-4 text-center text-sm text-ink/70 dark:text-mist/70 transition-colors">
>>>>>>> origin/master
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-2">
        <p>{t.footerText}</p>
      </div>
    </footer>
  );
}

export default Footer;
