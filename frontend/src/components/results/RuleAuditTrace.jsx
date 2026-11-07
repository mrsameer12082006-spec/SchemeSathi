import React from 'react';
import { Microscope, ChevronDown, Check, X, HelpCircle, ExternalLink } from 'lucide-react';

export default function RuleAuditTrace({ scheme, language }) {
  return (
    <details className="bg-[#F2F2F4] border border-[#E4E4E7] rounded-lg p-3.5 text-xs font-mono text-zinc-700">
      <summary className="cursor-pointer font-semibold flex items-center justify-between list-none">
        <span className="flex items-center gap-2">
          <Microscope className="w-3.5 h-3.5 text-zinc-700" />
          <span className="font-sans font-medium text-zinc-900">
            {language === 'hi'
              ? 'तकनीकी नियम सत्यापन प्रमाण (Deterministic Rule Audit Trace)'
              : 'Deterministic Rule Audit Trace'}
          </span>
        </span>
        <span className="text-zinc-500 text-xs font-mono flex items-center gap-1 hover:text-[#141417]">
          <span>{language === 'hi' ? 'विवरण' : 'Trace'}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </span>
      </summary>

      <div className="mt-3 pt-3 border-t border-zinc-200 space-y-2 text-[11px]">
        <div className="flex flex-wrap justify-between text-zinc-500 font-mono">
          <span>Scheme ID: {scheme.schemeId}</span>
          <span>Engine: Local Deterministic Rule Engine</span>
        </div>

        <div className="bg-white p-3 rounded-md border border-zinc-200/80 space-y-1.5 overflow-x-auto shadow-2xs font-mono">
          {scheme.passed.map(p => (
            <div key={p.ruleId} className="text-emerald-800 flex items-start gap-1.5">
              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
              <span><code>[PASS] {p.ruleId} ({p.field}) &rarr; {p.description}</code></span>
            </div>
          ))}

          {scheme.failed.map(f => (
            <div key={f.ruleId} className="text-red-700 flex items-start gap-1.5">
              <X className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
              <span><code>[FAIL] {f.ruleId} ({f.field}): actual={String(f.actual)} != expected={String(f.expected)}</code></span>
            </div>
          ))}

          {scheme.missing.map(m => (
            <div key={m.ruleId} className="text-amber-800 flex items-start gap-1.5">
              <HelpCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
              <span><code>[MISSING] {m.ruleId} ({m.field}) &rarr; {m.description}</code></span>
            </div>
          ))}
        </div>

        <div className="text-zinc-500 flex flex-wrap justify-between pt-1">
          <span className="flex items-center gap-1">
            <span>Grounding:</span>
            <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="text-[#141417] underline font-medium flex items-center gap-0.5 hover:text-zinc-600">
              <span>{scheme.officialUrl}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </span>
          <span>Verified: {scheme.lastVerified}</span>
        </div>
      </div>
    </details>
  );
}
