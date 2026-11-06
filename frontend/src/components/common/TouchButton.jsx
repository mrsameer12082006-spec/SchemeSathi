import React from 'react';

export default function TouchButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button'
}) {
  const baseStyles = "min-h-[48px] px-6 py-3 rounded-2xl font-bold text-base spring-press flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden";

  const variants = {
    primary: "bg-[#004B87] hover:bg-[#002D54] text-white shadow-cta hover:shadow-cta-hover focus:ring-4 focus:ring-blue-100",
    secondary: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-2xs focus:ring-4 focus:ring-slate-100",
    amberAction: "bg-amber-800 hover:bg-amber-900 text-white shadow-xs focus:ring-4 focus:ring-amber-100",
    subtle: "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-2 focus:ring-slate-300",
    danger: "bg-red-700 hover:bg-red-800 text-white shadow-xs focus:ring-4 focus:ring-red-100"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
