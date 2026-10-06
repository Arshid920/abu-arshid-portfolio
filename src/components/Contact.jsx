import { useState } from 'react'
import Section from './Section'
import Icon from './Icon'
import { profile } from '../data/content'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  // The site is static, so the form opens the visitor's email app with the message filled in.
  const submit = (e) => {
    e.preventDefault()
    const subject = `Portfolio enquiry from ${form.name}`
    const body = `${form.message}\n\nFrom: ${form.name}\nReply to: ${form.email}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Section id="contact" title="Contact me" intro="Open to software development and AI/ML opportunities in the UAE.">
      <div className="contact-grid">
        <ul className="contact-list">
          <li>
            <Icon name="mail" />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <Icon name="phone" />
            <a href={`tel:${profile.phoneHref}`}>{profile.phone}</a>
          </li>
          <li>
            <Icon name="pin" />
            <span>{profile.location}</span>
          </li>
          <li>
            <Icon name="linkedin" />
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </li>
          <li>
            <Icon name="github" />
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </li>
        </ul>

        <form className="contact-form" onSubmit={submit}>
          <label>
            Your name
            <input name="name" type="text" required autoComplete="name" value={form.name} onChange={update} />
          </label>
          <label>
            Your email
            <input name="email" type="email" required autoComplete="email" value={form.email} onChange={update} />
          </label>
          <label>
            Message
            <textarea name="message" rows="5" required value={form.message} onChange={update} />
          </label>
          <button className="btn btn-primary" type="submit">
            <Icon name="send" size={18} />
            Send email
          </button>
          <p className="form-note">This opens your email app with the message ready to send.</p>
        </form>
      </div>
    </Section>
  )
}
