import Section from './Section'
import { experience } from '../data/content'

export default function Experience() {
  return (
    <Section id="experience" title="Internship experience" tone="alt">
      <ol className="timeline">
        {experience.map((job) => (
          <li key={job.role} className="timeline-item">
            <div className="timeline-meta">
              <span className="timeline-period">{job.period}</span>
            </div>
            <div className="timeline-body">
              <h3>{job.role}</h3>
              <p className="muted">{job.company}</p>
              <ul className="bullet-list">
                {job.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
