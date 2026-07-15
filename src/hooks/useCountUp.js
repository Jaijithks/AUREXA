import { useEffect, useRef, useState } from 'react';

/**
 * Animated counter hook — counts from 0 to target when element is in view.
 */
export function useCountUp(target, suffix = '', prefix = '', duration = 1500) {
  const [display, setDisplay] = useState(prefix + '0' + suffix);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.unobserve(entry.target);
            animateCount();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [target, suffix, prefix, duration]);

  const animateCount = () => {
    if (target === 0) {
      setDisplay(prefix + suffix);
      return;
    }

    const steps = 40;
    const increment = target / steps;
    const stepTime = duration / steps;
    let current = 0;
    let step = 0;

    const counter = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        current = target;
        clearInterval(counter);
      }
      setDisplay(prefix + Math.floor(current) + suffix);
    }, stepTime);
  };

  return { ref, display };
}
