import React, { useState, useEffect, useRef } from 'react';

/**
 * High-performance pure React CountUp component
 * Formats numbers into Indian numbering system (e.g. 5,00,000, 6,000)
 * Uses requestAnimationFrame with easeOutExpo curve for buttery 60fps counter
 */
export default function CountUp({
  end = 0,
  duration = 800,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  formatIndian = true
}) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = null;

    // Snappy Apple/Linear easeOutExpo curve
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentVal = easedProgress * end;

      setCount(currentVal);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration]);

  const formatNumber = (num) => {
    const fixed = num.toFixed(decimals);
    if (!formatIndian) {
      return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Indian numbering format: e.g. 5,00,000 or 6,000
    const parts = fixed.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    if (integerPart.length > 3) {
      const lastThree = integerPart.substring(integerPart.length - 3);
      const otherNumbers = integerPart.substring(0, integerPart.length - 3);
      integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }

    return integerPart + decimalPart;
  };

  return (
    <span className={`inline-block tabular-nums ${className}`}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}
