import Section from './Section'
import Icon from './Icon'
import { asset, profile } from '../data/content'

export default function Resume() {
  return (
    <Section id="resume" title="Resume" intro="My CV as a one-page PDF." tone="alt">
      <div className="resume-grid">
        <a
          className="resume-preview"
          href={asset(profile.cv)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the CV PDF in a new tab"
        >
          <img src={asset(profile.cvPreview)} alt="Preview of the one-page CV of Abu Arshid P" loading="lazy" />
        </a>
        <div className="resume-actions">
          <p>
            The CV covers my summary, technical skills, internships, projects, education,
            certifications and languages.
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={asset(profile.cv)} download="ABU_ARSHID_P_CV.pdf">
              <Icon name="download" size={18} />
              Download CV
            </a>
            <a className="btn btn-secondary" href={asset(profile.cv)} target="_blank" rel="noopener noreferrer">
              <Icon name="eye" size={18} />
              View CV
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
}
