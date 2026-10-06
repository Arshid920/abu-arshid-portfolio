import Section from './Section'
import Icon from './Icon'
import { skills } from '../data/content'

export default function Skills() {
  return (
    <Section id="skills" title="Technical skills" intro="The languages, frameworks and tools I have worked with.">
      <div className="skills-grid">
        {skills.map((group) => (
          <article key={group.title} className="skill-card">
            <div className="skill-head">
              <span className="skill-icon"><Icon name={group.icon} size={20} /></span>
              <h3>{group.title}</h3>
            </div>
            <ul className="chip-row">
              {group.items.map((item) => (
                <li key={item} className="chip chip-solid">{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}
