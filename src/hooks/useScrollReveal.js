import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for Intersection Observer-based scroll reveal animations.
 * Adds 'visible' class when element enters viewport.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return ref;
}

/**
 * Hook that returns a callback ref for multiple elements (e.g., in a list).
 */
export function useScrollRevealMultiple(options = {}) {
  const observerRef = useRef(null);
  const elementsRef = useRef(new Set());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -50px 0px',
      }
    );

    // Observe any elements already registered
    elementsRef.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  const callbackRef = useCallback((node) => {
    if (node) {
      elementsRef.current.add(node);
      observerRef.current?.observe(node);
    }
  }, []);

  return callbackRef;
}
