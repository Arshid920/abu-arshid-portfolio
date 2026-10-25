
import { useEffect, useRef, useState } from 'react'
import './ChatWidget.css'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! 👋 I'm Arshid's portfolio assistant. Ask me about his skills, projects, education, internships, or experience.",
    },
  ])

  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen, isTyping])

  async function handleSubmit(event) {
    event.preventDefault()

    const text = question.trim()

    if (!text || isTyping) return

    setMessages((current) => [
      ...current,
      { role: 'user', content: text },
    ])

    setQuestion('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'The assistant could not answer right now.'
        )
      }

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            typeof data.reply === 'string' && data.reply.trim()
              ? data.reply
              : "Sorry, I couldn't find an answer in the portfolio documents.",
        },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            error.message ||
            'Sorry, something went wrong. Please try again.',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="talk-widget">
      {isOpen && (
        <section
          className="talk-panel"
          aria-label="Talk to Arshid chat"
          aria-labelledby="talk-title"
        >
          <header className="talk-header">
            <div>
              <h2 id="talk-title">Talk to Arshid</h2>
              <p>Portfolio assistant</p>
            </div>

            <button
              className="talk-close"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="talk-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`talk-message talk-${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.content}
              </div>
            ))}

            {isTyping && (
              <div
                className="talk-message talk-assistant"
                role="status"
              >
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="talk-form" onSubmit={handleSubmit}>
            <label className="talk-sr-only" htmlFor="talk-question">
              Your question
            </label>

            <input
              id="talk-question"
              ref={inputRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about Arshid..."
              autoComplete="off"
              disabled={isTyping}
            />

            <button
              type="submit"
              disabled={!question.trim() || isTyping}
            >
              {isTyping ? 'Sending...' : 'Send'}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="talk-launcher"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Talk to Arshid' : 'Talk to Arshid'}
      >
        {isOpen ? 'Close chat' : '✦ Talk to Arshid'}
      </button>
    </div>
  )
}
