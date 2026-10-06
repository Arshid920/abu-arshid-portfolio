import useReveal from '../hooks/useReveal'

// Shared wrapper: consistent spacing, heading and a gentle one-time fade-in.
export default function Section({ id, title, intro, tone = 'base', children }) {
  const [ref, shown] = useReveal()
  return (
    <section id={id} className={`section section-${tone}`} aria-labelledby={`${id}-title`}>
      <div ref={ref} className={`container reveal ${shown ? 'is-shown' : ''}`}>
        <header className="section-head">
          <h2 id={`${id}-title`}>{title}</h2>
          {intro && <p className="section-intro">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
