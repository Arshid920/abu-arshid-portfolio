import { useState } from 'react'
import Section from './Section'
import Icon from './Icon'
import Lightbox from './Lightbox'
import { certifications } from '../data/content'

export default function Certifications() {
  const [open, setOpen] = useState(false)
  const withImage = certifications.filter((c) => c.image)
  const items = withImage.map((c) => ({
    src: c.image,
    alt: c.alt,
    caption: `${c.name}, ${c.issuer}`,
  }))

  return (
    <Section id="certifications" title="Certifications" tone="alt">
      <div className="cert-grid">
        {certifications.map((c) => (
          <article key={c.name} className={`cert-card ${c.image ? 'has-image' : ''}`}>
            {c.image && (
              <button className="cert-image" onClick={() => setOpen(true)} aria-label={`View larger: ${c.name} certificate`}>
                <img src={c.image} alt={c.alt} loading="lazy" />
                <span className="shot-zoom"><Icon name="expand" size={18} /> View certificate</span>
              </button>
            )}
            <div className="cert-body">
              <span className="skill-icon"><Icon name="award" size={20} /></span>
              <h3>{c.name}</h3>
              {c.issuer && <p className="muted">{c.issuer}</p>}
              {c.date && <p className="cert-date">{c.date}</p>}
            </div>
          </article>
        ))}
      </div>
      {open && <Lightbox items={items} index={0} onClose={() => setOpen(false)} onChange={() => {}} />}
    </Section>
  )
}
