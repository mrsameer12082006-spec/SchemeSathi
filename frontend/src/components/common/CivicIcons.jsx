import React from 'react';

// Bespoke Civic & Editorial Vector Icons (Replacing boilerplate emojis & generic Lucide icons)
// Designed with 1.75px–2px uniform stroke weight, crisp geometry, and high-contrast rendering.

export function CivicCrestIcon({ className = 'w-5 h-5', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2L4 6v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V6l-8-4z" />
      <path d="M12 7v8" />
      <path d="M8 11h8" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

export function AgricultureIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22V8" />
      <path d="M12 14c-2.5-2-5-1.5-6 1 2.5 1 5 .5 6-1z" />
      <path d="M12 11c2.5-2 5-1.5 6 1-2.5 1-5 .5-6-1z" />
      <path d="M12 8c-2.5-2-4.5-1.5-5 1 2 .5 4 .5 5-1z" />
      <path d="M12 5c2.5-2 4.5-1.5 5 1-2 .5-4 .5-5-1z" />
      <path d="M12 2c0 2-1 3-2 3.5 1.5.5 2-1 2-3.5z" />
    </svg>
  );
}

export function HousingIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" />
      <path d="M10 21v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
      <path d="M18 6.5V4h-2" />
    </svg>
  );
}

export function HealthShieldIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2L4 5.5v6.2c0 5 3.4 9.6 8 10.8 4.6-1.2 8-5.8 8-10.8V5.5L12 2z" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function BankTransferIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h2" />
      <path d="M13 15h4" />
    </svg>
  );
}

export function TimerIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M10 2h4" />
      <path d="M12 2v3" />
    </svg>
  );
}

export function VerifiedRosetteIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path fillRule="evenodd" d="M8.6 2.25A2.25 2.25 0 006.35 4.5v.35a2.25 2.25 0 01-1.6 2.15l-.33.11a2.25 2.25 0 00-1.4 2.83l.11.33a2.25 2.25 0 01-.55 2.62l-.25.25a2.25 2.25 0 000 3.18l.25.25a2.25 2.25 0 01.55 2.62l-.11.33a2.25 2.25 0 001.4 2.83l.33.11a2.25 2.25 0 011.6 2.15v.35a2.25 2.25 0 002.25 2.25h.35a2.25 2.25 0 012.15 1.6l.11.33a2.25 2.25 0 002.83 1.4l.33-.11a2.25 2.25 0 012.62.55l.25.25a2.25 2.25 0 003.18 0l.25-.25a2.25 2.25 0 012.62-.55l.33.11a2.25 2.25 0 002.83-1.4l.11-.33a2.25 2.25 0 012.15-1.6h.35a2.25 2.25 0 002.25-2.25v-.35a2.25 2.25 0 011.6-2.15l.33-.11a2.25 2.25 0 001.4-2.83l-.11-.33a2.25 2.25 0 01.55-2.62l.25-.25a2.25 2.25 0 000-3.18l-.25-.25a2.25 2.25 0 01-.55-2.62l.11-.33a2.25 2.25 0 00-1.4-2.83l-.33-.11a2.25 2.25 0 01-1.6-2.15v-.35a2.25 2.25 0 00-2.25-2.25h-.35a2.25 2.25 0 01-2.15-1.6l-.11-.33a2.25 2.25 0 00-2.83-1.4l-.33.11a2.25 2.25 0 01-2.62-.55l-.25-.25a2.25 2.25 0 00-3.18 0l-.25.25a2.25 2.25 0 01-2.62.55l-.33-.11a2.25 2.25 0 00-2.83 1.4l-.11.33a2.25 2.25 0 01-2.15 1.6H8.6zm4.8 6.55a.75.75 0 00-1.06-1.06l-3.5 3.5a.75.75 0 000 1.06l1.75 1.75a.75.75 0 001.06-1.06L10.56 12l2.84-3.2z" clipRule="evenodd" />
    </svg>
  );
}

export function DocumentSlipIcon({ className = 'w-4 h-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
      <circle cx="16.5" cy="16.5" r="1.5" />
    </svg>
  );
}

export function BoldArrowRight({ className = 'w-4 h-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
