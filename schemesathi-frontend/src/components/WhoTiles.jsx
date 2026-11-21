import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, GraduationCap, UserCheck, HeartHandshake, Briefcase, Store } from 'lucide-react';
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
      icon: <Sprout className="w-6 h-6 text-[#166534]" />
    },
    {
      id: 'student',
      label: labels[1],
      sentence: sentences[1],
      icon: <GraduationCap className="w-6 h-6 text-[#166534]" />
    },
    {
      id: 'woman',
      label: labels[2],
      sentence: sentences[2],
      icon: <UserCheck className="w-6 h-6 text-[#166534]" />
    },
    {
      id: 'senior',
      label: labels[3],
      sentence: sentences[3],
      icon: <HeartHandshake className="w-6 h-6 text-[#166534]" />
    },
    {
      id: 'worker',
      label: labels[4],
      sentence: sentences[4],
      icon: <Briefcase className="w-6 h-6 text-[#166534]" />
    },
    {
      id: 'business',
      label: labels[5],
      sentence: sentences[5],
      icon: <Store className="w-6 h-6 text-[#166534]" />
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 w-full">
      {tiles.map((tile) => (
        <motion.button
          key={tile.id}
          type="button"
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(tile)}
          className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-stone-200 bg-white hover:border-[#166534]/50 hover:shadow-sm transition-all cursor-pointer group text-center min-h-[110px]"
          aria-label={tile.label}
        >
          <div className="mb-2.5 p-2 rounded-lg bg-[#166534]/5 transition-transform group-hover:scale-105">
            {tile.icon}
          </div>
          <span className="text-sm font-medium text-[#1C1B1A]">
            {tile.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default WhoTiles;
