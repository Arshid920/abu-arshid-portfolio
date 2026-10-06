import Section from './Section'
import { about } from '../data/content'

export default function About() {
  return (
    <Section id="about" title="About me" tone="alt">
      <div className="about-grid">
        <div className="about-text">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="about-side">
          <ul className="stat-list">
            {about.highlights.map((h) => (
              <li key={h.label}>
                <strong>{h.value}</strong>
                <span>{h.label}</span>
              </li>
            ))}
          </ul>
          <div className="lang-box">
            <h3>Languages</h3>
            <ul>
              {about.languages.map((l) => (
                <li key={l.name}>
                  <span>{l.name}</span>
                  <span className="muted">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  )
}
