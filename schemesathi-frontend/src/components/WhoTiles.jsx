import React from 'react';
import { coreStrings } from '../i18n';

export function WhoTiles({ lang, onSelect }) {
  const strings = coreStrings[lang] || coreStrings.en;
  const labels = strings.who;
  const sentences = strings.whoSentences;

  const tiles = [
    {
      id: 'farmer',
      label: labels[0],
      sentence: sentences[0],
      icon: (
        <svg className="w-8 h-8 text-ink dark:text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21a9 9 0 0 1-9-9c0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9 0 1.66-.45 3.22-1.24 4.56M12 3v18M12 12c-3.5 0-6 2-6 5" />
        </svg>
      )
    },
    {
      id: 'student',
      label: labels[1],
      sentence: sentences[1],
      icon: (
        <svg className="w-8 h-8 text-ink dark:text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 'woman',
      label: labels[2],
      sentence: sentences[2],
      icon: (
        <svg className="w-8 h-8 text-ink dark:text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'senior',
      label: labels[3],
      sentence: sentences[3],
      icon: (
        <svg className="w-8 h-8 text-ink dark:text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      id: 'worker',
      label: labels[4],
      sentence: sentences[4],
      icon: (
        <svg className="w-8 h-8 text-ink dark:text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      id: 'business',
      label: labels[5],
      sentence: sentences[5],
      icon: (
        <svg className="w-8 h-8 text-ink dark:text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h18v4H3V3zm2 4v13a1 1 0 001 1h12a1 1 0 001-1V7M9 11v6m6-6v6" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 w-full">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          type="button"
          onClick={() => onSelect(tile)}
          className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border border-line bg-white dark:bg-nightcard dark:border-nightline hover:border-saffron hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer group text-center min-h-[110px]"
          aria-label={tile.label}
        >
          <div className="mb-2.5 transition-transform group-hover:scale-110">
            {tile.icon}
          </div>
          <span className="text-sm font-semibold text-ink dark:text-mist">
            {tile.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default WhoTiles;
