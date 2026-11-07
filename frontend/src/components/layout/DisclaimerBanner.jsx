import React from 'react';

export default function DisclaimerBanner() {
  return (
    <aside aria-label="Official trust note" className="bg-[#F2F2F4] border-b border-[#E4E4E7] text-zinc-600 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
          <span>Public service platform grounded in verified central ministry guidelines · 100% Free</span>
        </span>
        <span className="text-zinc-400 font-mono text-[11px] hidden sm:inline">
          Official eligibility guidance · Direct central rules
        </span>
      </div>
    </aside>
  );
}
