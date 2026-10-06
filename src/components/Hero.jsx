import Icon from './Icon'
import { asset, interests, intro, profile } from '../data/content'

export default function Hero() {
  const scrollTo = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-role">{profile.qualification}</p>
          <h1 id="hero-title">{profile.name}</h1>
          <p className="hero-headline">{profile.headline}</p>
          <p className="hero-intro">{intro}</p>

          <ul className="chip-row" aria-label="Areas of interest">
            {interests.map((item) => (
              <li key={item} className="chip">{item}</li>
            ))}
          </ul>

          <div className="btn-row">
            <a className="btn btn-primary" href="#projects" onClick={(e) => scrollTo(e, 'projects')}>
              View My Projects
              <Icon name="arrow" size={18} />
            </a>
            <a className="btn btn-secondary" href={asset(profile.cv)} download="ABU_ARSHID_P_CV.pdf">
              <Icon name="download" size={18} />
              Download CV
            </a>
            <a className="btn btn-ghost" href="#contact" onClick={(e) => scrollTo(e, 'contact')}>
              Contact Me
            </a>
          </div>

          <div className="social-row">
            <a className="social-link" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)">
              <Icon name="github" size={20} />
              <span>GitHub</span>
            </a>
            <a className="social-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
              <Icon name="linkedin" size={20} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="portrait">
            <img
              src={asset(profile.photo)}
              alt="Portrait of Abu Arshid P in a black suit and tie"
              width="969"
              height="1300"
              fetchpriority="high"
            />
          </div>
          <p className="portrait-tag">
            <Icon name="pin" size={16} />
            {profile.location}
          </p>
        </div>
      </div>
    </section>
  )
}
