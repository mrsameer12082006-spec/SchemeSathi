import React from 'react';

/**
 * Reusable Chips component for tags, profile attributes, and quick replies.
 */
export function Chips({
  items = [],
  onSelect,
  activeItem,
  variant = 'selectable', // 'selectable' | 'filter' | 'display' | 'trust'
  ariaLabel = 'Options',
  className = ''
}) {
  if (!items || items.length === 0) return null;

  return (
    <div
      role={variant === 'filter' ? 'radiogroup' : 'group'}
      aria-label={ariaLabel}
      className={`flex flex-wrap items-center gap-2 ${className}`}
    >
      {items.map((item, idx) => {
        const isObject = typeof item === 'object' && item !== null;
        const key = isObject ? (item.id || item.value || item.label || idx) : `${item}-${idx}`;
        const label = isObject ? item.label : item;
        const isActive = isObject ? (item.active || activeItem === item.value) : activeItem === item;
        const icon = isObject ? item.icon : null;

        if (variant === 'display') {
          return (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-white border border-stone-200 text-[#1C1B1A] shadow-none select-none"
            >
              {icon && <span aria-hidden="true">{icon}</span>}
              <span>{label}</span>
            </span>
          );
        }

        if (variant === 'trust') {
          return (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white border border-stone-200 text-[#1C1B1A] shadow-sm select-none"
            >
              <span className="text-[#166534] font-bold" aria-hidden="true">✓</span>
              <span>{label}</span>
            </span>
          );
        }

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect && onSelect(isObject ? (item.value ?? item.label) : item)}
            aria-pressed={variant === 'filter' ? isActive : undefined}
            className={`chip text-xs sm:text-sm transition-all min-h-[38px] ${
              isActive
                ? 'bg-[#166534] text-white font-medium border-transparent shadow-sm'
                : 'hover:bg-stone-100 hover:border-stone-300 active:scale-95 text-[#1C1B1A]'
            }`}
          >
            {icon && <span aria-hidden="true">{icon}</span>}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Chips;
