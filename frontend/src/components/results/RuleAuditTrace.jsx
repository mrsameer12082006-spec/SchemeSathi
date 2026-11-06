import React from 'react';
import { Microscope, ChevronDown, Check, X, HelpCircle, ExternalLink } from 'lucide-react';

export default function RuleAuditTrace({ scheme, language }) {
  return (
    <details className="bg-slate-100/90 border border-slate-300 rounded-2xl p-4 text-xs font-mono text-slate-800">
      <summary className="cursor-pointer font-bold flex items-center justify-between list-none">
        <span className="flex items-center gap-2">
          <Microscope className="w-4 h-4 text-[#004B87]" />
          <span>
            {language === 'hi'
              ? 'तकनीकी नियम सत्यापन प्रमाण (Deterministic Rule Audit Trace)'
              : 'Deterministic Rule Evaluation Audit Trace'}
          </span>
        </span>
        <span className="text-[#004B87] text-xs font-bold flex items-center gap-1">
          <span>विस्तार</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </span>
      </summary>

      <div className="mt-3 pt-3 border-t border-slate-300 space-y-2 text-[11px]">
        <div className="flex flex-wrap justify-between text-slate-500 font-bold">
          <span>Scheme ID: {scheme.schemeId}</span>
          <span>Engine: Local Deterministic Rule Engine</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 overflow-x-auto shadow-inner">
          {scheme.passed.map(p => (
            <div key={p.ruleId} className="text-green-800 flex items-start gap-1.5 font-semibold">
              <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
              <span><code>[PASS] {p.ruleId} ({p.field}) &rarr; {p.description}</code></span>
            </div>
          ))}

          {scheme.failed.map(f => (
            <div key={f.ruleId} className="text-red-700 flex items-start gap-1.5 font-semibold">
              <X className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span><code>[FAIL] {f.ruleId} ({f.field}): actual={String(f.actual)} != expected={String(f.expected)}</code></span>
            </div>
          ))}

          {scheme.missing.map(m => (
            <div key={m.ruleId} className="text-amber-800 flex items-start gap-1.5 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span><code>[MISSING] {m.ruleId} ({m.field}) &rarr; {m.description}</code></span>
            </div>
          ))}
        </div>

        <div className="text-slate-600 flex flex-wrap justify-between pt-1">
          <span className="flex items-center gap-1">
            <span>Grounding:</span>
            <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="text-[#004B87] underline font-bold flex items-center gap-0.5">
              <span>{scheme.officialUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </span>
          <span>Verified: {scheme.lastVerified}</span>
        </div>
      </div>
    </details>
  );
}
