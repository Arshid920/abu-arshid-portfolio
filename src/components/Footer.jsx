import Icon from './Icon'
import { profile } from '../data/content'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-name">{profile.name}</p>
          <p className="muted">{profile.qualification}</p>
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
          <a className="social-link" href={`mailto:${profile.email}`} aria-label="Send an email">
            <Icon name="mail" size={20} />
            <span>Email</span>
          </a>
        </div>
      </div>
      <p className="container copyright">© 2026 {profile.name}. All rights reserved.</p>
    </footer>
  )
}
