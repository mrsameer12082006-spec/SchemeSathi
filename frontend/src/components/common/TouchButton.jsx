import React from 'react';

export default function TouchButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button'
}) {
  const baseStyles = "min-h-[44px] px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base spring-press flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden";

  const variants = {
    primary: "bg-[#141417] hover:bg-[#27272D] text-white shadow-xs focus:ring-2 focus:ring-zinc-400",
    secondary: "bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 hover:border-zinc-300 shadow-2xs focus:ring-2 focus:ring-zinc-200",
    amberAction: "bg-amber-800 hover:bg-amber-900 text-white shadow-xs focus:ring-2 focus:ring-amber-200",
    subtle: "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 focus:ring-2 focus:ring-zinc-300",
    danger: "bg-red-700 hover:bg-red-800 text-white shadow-xs focus:ring-2 focus:ring-red-200"
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
