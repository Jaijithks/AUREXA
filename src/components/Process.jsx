import { useScrollReveal, useScrollRevealMultiple } from '../hooks/useScrollReveal';

const STEPS = [
  {
    num: '01',
    name: 'Discuss',
    desc: 'Understanding your needs & goals through detailed consultation.',
  },
  {
    num: '02',
    name: 'Plan',
    desc: 'Research, sitemap & strategy to define the project roadmap.',
  },
  {
    num: '03',
    name: 'Design',
    desc: 'UI/UX design & prototyping to bring the vision to life.',
  },
  {
    num: '04',
    name: 'Develop',
    desc: 'Bring design to life with clean, performant, semantic code.',
  },
  {
    num: '05',
    name: 'Test & Launch',
    desc: 'Testing, optimization & go-live with ongoing support.',
  },
];

export default function Process() {
  const headerRef = useScrollReveal();
  const stepRef = useScrollRevealMultiple();

  return (
    <section id="process">
      <div className="section-header reveal" ref={headerRef}>
        <div className="section-label">05. Process</div>
        <h2 className="section-title">
          My Working <span className="highlight">Process</span>
        </h2>
        <p className="section-subtitle">
          A simple, clear and proven process to deliver quality results. Every
          project follows these steps.
        </p>
      </div>

      <div className="process-track">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className={`process-step reveal reveal-delay-${(i % 4) + 1}`}
            ref={stepRef}
          >
            <div className="process-num">{step.num}</div>
            <div>
              <h3 className="process-name">{step.name}</h3>
              <p className="process-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
