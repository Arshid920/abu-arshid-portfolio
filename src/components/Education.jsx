import Section from './Section'
import Icon from './Icon'
import { education } from '../data/content'

export default function Education() {
  return (
    <Section id="education" title="Education">
      <div className="edu-grid">
        {education.map((e) => (
          <article key={e.degree} className="edu-card">
            <span className="skill-icon"><Icon name="cap" size={22} /></span>
            <div>
              <h3>{e.degree}</h3>
              <p>{e.school}</p>
              <p className="muted">{e.period}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
