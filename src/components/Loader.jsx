import { useEffect, useState } from 'react';

export default function Loader() {
  const [revealed, setRevealed] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const revealTimer = setTimeout(() => {
      setRevealed(true);
      document.body.style.overflow = '';
    }, 2600);

    const hideTimer = setTimeout(() => {
      setHidden(true);
    }, 4200);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (hidden) return null;

  return (
    <div id="loader" className={revealed ? 'reveal' : ''}>
      <div className="loader-content">
        <div className="loader-logo">
          <div className="loader-logo-icon">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 24L16 6L22 24M12.5 19H19.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="loader-word">AUREXA</span>
        </div>
        <p className="loader-tagline">Web Design &amp; Development</p>
        <div className="loader-bar"></div>
      </div>
      <div className="loader-frame"></div>
      <div className="shutter-top"></div>
      <div className="shutter-bottom"></div>
    </div>
  );
}
