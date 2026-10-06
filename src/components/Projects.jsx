import { useState } from 'react'
import Section from './Section'
import Icon from './Icon'
import Lightbox from './Lightbox'
import { projects } from '../data/content'

function TechChips({ items }) {
  return (
    <ul className="chip-row" aria-label="Technologies used">
      {items.map((t) => (
        <li key={t} className="chip chip-solid">{t}</li>
      ))}
    </ul>
  )
}

function Features({ items }) {
  return (
    <ul className="check-list">
      {items.map((f) => (
        <li key={f}>
          <Icon name="check" size={16} />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Projects() {
  const { featured, others } = projects
  const [current, setCurrent] = useState(0)
  const [viewer, setViewer] = useState(null)
  const shot = featured.images[current]

  return (
    <Section id="projects" title="Projects" intro="Two projects from my CV. Select a screenshot to view it larger.">
      <article className="project-featured">
        <div className="project-gallery">
          <button
            className="shot-main"
            onClick={() => setViewer(current)}
            aria-label={`View larger: ${shot.caption}`}
          >
            <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" />
            <span className="shot-zoom"><Icon name="expand" size={18} /> View larger</span>
          </button>
          <p className="shot-caption">{shot.caption}</p>
          <ul className="shot-thumbs" aria-label="Project screenshots">
            {featured.images.map((img, i) => (
              <li key={img.src}>
                <button
                  className={i === current ? 'is-current' : ''}
                  onClick={() => setCurrent(i)}
                  aria-label={`Show ${img.caption}`}
                  aria-pressed={i === current}
                >
                  <img src={img.src} alt="" loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="project-info">
          <span className="badge">Featured project</span>
          <h3>{featured.name}</h3>
          <p>{featured.summary}</p>
          <h4>What it does</h4>
          <p>{featured.purpose}</p>
          <h4>Key features</h4>
          <Features items={featured.features} />
          <h4>Technologies</h4>
          <TechChips items={featured.tech} />
        </div>
      </article>

      <div className="project-others">
        {others.map((p) => (
          <article key={p.name} className="project-card">
            <h3>{p.name}</h3>
            <p>{p.summary}</p>
            <h4>Key features</h4>
            <Features items={p.features} />
            <h4>Technologies</h4>
            <TechChips items={p.tech} />
          </article>
        ))}
      </div>

      {viewer !== null && (
        <Lightbox
          items={featured.images}
          index={viewer}
          onClose={() => setViewer(null)}
          onChange={(i) => {
            setViewer(i)
            setCurrent(i)
          }}
        />
      )}
    </Section>
  )
}
