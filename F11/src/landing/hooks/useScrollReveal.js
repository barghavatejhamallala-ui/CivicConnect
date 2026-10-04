import { useEffect } from 'react';

// NOTE: we set the revealed state via inline style rather than a CSS class.
// React fully owns the `className` attribute on these elements (it recomputes
// it on every render), so a class added here with classList.add() gets wiped
// the moment the component re-renders for an unrelated reason (e.g. clicking
// a role card re-renders the whole list). React never touches `style` unless
// we pass a style prop in JSX, so setting it imperatively here is safe and
// survives re-renders.
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal-on-scroll');
    if (!els.length) return undefined;

    const reveal = (el) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
