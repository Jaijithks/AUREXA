import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom cursor hook — handles the dot + ring cursor with smooth follow.
 * Returns refs for dot and ring elements.
 */
export function useCustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const animationId = useRef(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dot.style.left = `${e.clientX - 4}px`;
      dot.style.top = `${e.clientY - 4}px`;
    };

    const animateRing = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;
      ringEl.style.left = `${ring.current.x - 18}px`;
      ringEl.style.top = `${ring.current.y - 18}px`;
      animationId.current = requestAnimationFrame(animateRing);
    };

    // Hover effects on interactive elements
    const addHoverListeners = () => {
      const elements = document.querySelectorAll(
        'a, button, .filter-btn, .portfolio-item, .service-card, .process-step'
      );
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    const handleMouseEnter = () => ringEl.classList.add('hover');
    const handleMouseLeave = () => ringEl.classList.remove('hover');

    document.addEventListener('mousemove', onMouseMove);
    animationId.current = requestAnimationFrame(animateRing);

    // Delay listener attachment to ensure DOM is ready
    const timerId = setTimeout(addHoverListeners, 500);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId.current);
      clearTimeout(timerId);

      const elements = document.querySelectorAll(
        'a, button, .filter-btn, .portfolio-item, .service-card, .process-step'
      );
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return { dotRef, ringRef };
}
