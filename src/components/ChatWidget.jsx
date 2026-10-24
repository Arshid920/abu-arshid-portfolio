
import { useEffect, useRef, useState } from 'react'
import './ChatWidget.css'

function getPortfolioReply(message) {
  const text = message.toLowerCase().trim()

  // Greetings
  if (/^(hi|hlo|hello|hey|hai|hello there)[!. ]*$/.test(text)) {
    return "Hello! 👋 Welcome to Arshid's portfolio. What would you like to know?"
  }

  // Simple conversations
  if (/^(ok|okay|alright|got it)[!. ]*$/.test(text)) {
    return "Okay! 😊 You can ask me about Arshid's skills, projects, education, or experience."
  }

  if (/^(thanks|thank you|thx)[!. ]*$/.test(text)) {
    return "You're welcome! 😊 Is there anything else you'd like to know?"
  }

  if (/^(bye|goodbye|see you)[!. ]*$/.test(text)) {
    return "Goodbye! 👋 Thanks for visiting Arshid's portfolio."
  }

  // Assistant name and identity
  if (
    /what('?s| is) your name|who are you|what do i call you|your name/.test(text)
  ) {
    return "I'm Arshid's portfolio assistant! 🤖 You can ask me about his education, skills, internships, and projects."
  }

  if (/how are you/.test(text)) {
    return "I'm doing great! 😊 Thanks for asking. What would you like to know about Arshid?"
  }

  // About Arshid
  if (
    /who is arshid|about arshid|tell me about yourself|introduce yourself/.test(text)
  ) {
    return "Abu Arshid P is an MCA graduate specializing in AI and Machine Learning. He has React.js internship experience and has developed software and AI projects."
  }

  // Education
  if (/education|degree|university|qualification|\bmca\b|\bbca\b/.test(text)) {
    return "Arshid completed his MCA specializing in AI and Machine Learning at Jain Deemed-to-be University in 2026. He completed his BCA at the University of Calicut in 2024."
  }

  // MedSched-specific questions — keep before general project rules
  if (/medsched|medicine scheduling|medicine scheduler/.test(text)) {
    return "MedSched is a medicine scheduling application built using React, TypeScript, Vite, and Tailwind CSS. GitHub: https://github.com/Arshid920/medshed-medicine-scheduler"
  }

  // AI safety and passenger monitoring project
  if (
    /boat|passenger monitoring|safety monitoring|ai monitoring|yolov8|computer vision/.test(text)
  ) {
    return "Arshid's Vision-Enabled AI-Based Safety and Passenger Monitoring System uses Python, YOLOv8, OpenCV, and machine learning to monitor passenger safety. GitHub: https://github.com/Arshid920/vision-enabled-ai-safety-passenger-monitoring"
  }

  // General project questions
  if (/project|github|portfolio/.test(text)) {
    return "Arshid has worked on an AI-based passenger safety monitoring system and MedSched, a medicine scheduling application. Explore his projects on GitHub: https://github.com/Arshid920"
  }

  // Skills
  if (/skill|technology|tech stack|programming language/.test(text)) {
    return "Arshid's skills include Python, JavaScript, React.js, SQL, REST APIs, AI/ML, OpenCV, and YOLOv8. He also knows Windows and Linux fundamentals."
  }

  // Experience and internships
  if (/experience|internship|worked|previous job/.test(text)) {
    return "Arshid completed a React.js internship at ERE Business Solutions, working on reusable components and REST API integration. He also completed a Python Technology internship at Acura Software Solutions."
  }

  // Python
  if (/python/.test(text)) {
    return "Arshid has Python knowledge and has used Python in AI/ML and computer vision projects. He also completed a Python Technology internship."
  }

  // React and frontend
  if (/react|frontend/.test(text)) {
    return "Arshid has React.js internship experience at ERE Business Solutions, including reusable components and REST API integration."
  }

  // Certifications
  if (/certification|certificate|course/.test(text)) {
    return "Arshid has completed learning programs related to Generative AI, AI fundamentals, responsible AI, and prompt engineering."
  }

  // Career interests
  if (/job|career|hire|role|looking for/.test(text)) {
    return "Arshid is interested in entry-level IT support, application support, software development, React.js, Python, and AI/ML roles."
  }

  // Location
  if (/location|where are you based|where do you live/.test(text)) {
    return "Arshid is currently based in Dubai, UAE."
  }

  // Contact
  if (/contact|email|linkedin|reach him/.test(text)) {
    return "Email: abuarshidppp@gmail.com\nLinkedIn: https://linkedin.com/in/abu-arshid\nPortfolio: https://abu-arshid-portfolio-uo2g.vercel.app/"
  }

  // CV
  if (/resume|cv/.test(text)) {
    return "You can contact Arshid at abuarshidppp@gmail.com to request his latest CV."
  }

  // Help
  if (/help|what can you ask|what can you do/.test(text)) {
    return "Try asking me: What is your name? What is your education? What is MedSched? Tell me about your AI project. What are your skills? How can I contact you?"
  }

  // Unknown questions
  return "I'm Arshid's portfolio assistant. 😊 I don't have a specific answer for that question yet. Try asking about Arshid's education, skills, internships, or projects."
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! 👋 I'm Arshid's portfolio assistant. Ask me about his skills, projects, education, or experience.",
    },
  ])

  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen, isTyping])

  function handleSubmit(event) {
    event.preventDefault()

    const text = question.trim()
    if (!text || isTyping) return

    setMessages((current) => [
      ...current,
      { role: 'user', content: text },
    ])

    setQuestion('')
    setIsTyping(true)

    window.setTimeout(() => {
      const reply = getPortfolioReply(text)

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: reply },
      ])

      setIsTyping(false)
    }, 400)
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
              <div className="talk-message talk-assistant">
                Typing...
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
              placeholder="Type your message..."
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={!question.trim() || isTyping}
            >
              Send
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
