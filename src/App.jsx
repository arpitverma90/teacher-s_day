import { useState } from 'react'

const lessons = [
  { number: '01', title: 'You made room for questions', text: 'The best lessons began when you let curiosity lead the way.', color: 'coral' },
  { number: '02', title: 'You noticed the quiet wins', text: 'You saw progress before we knew how to name it ourselves.', color: 'sage' },
  { number: '03', title: 'You taught us to keep going', text: 'Your patience turned difficult days into steps forward.', color: 'gold' },
]

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLesson, setActiveLesson] = useState(0)
  const lesson = lessons[activeLesson]

  return (
    <main className="page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="card" aria-label="Interactive Teachers' Day card">
        <div className="topline">
          <span className="eyebrow">A note worth keeping</span>
          <span className="year">05 / 09</span>
        </div>

        <div className="hero-copy">
          <p className="kicker">For the ones who make learning feel possible</p>
          <h1>Happy <em>Teachers&apos; Day</em></h1>
          <p className="intro">Some people teach a subject. The rare ones teach us how to see ourselves.</p>
        </div>

        <div className="orbit orbit-left" aria-hidden="true"><span /><span /><span /></div>
        <div className="orbit orbit-right" aria-hidden="true"><span /><span /><span /></div>

        <div className={`letter-stage ${isOpen ? 'is-open' : ''}`}>
          <div className="letter-glow" />
          <div className="letter" aria-live="polite">
            <div className="letter-top">
              <span>Dear teacher,</span>
              <span className="letter-mark">✦</span>
            </div>
            <p>Thank you for making room for our questions, our mistakes, and our becoming.</p>
            <p className="signature">With gratitude, always.</p>
            <span className="letter-heart">♥</span>
          </div>
          <button className="seal" type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
            <span>{isOpen ? 'Close note' : 'Open note'}</span>
            <strong>{isOpen ? '−' : '♥'}</strong>
          </button>
        </div>

        <div className="lesson-heading">
          <div>
            <span className="section-label">The lessons that stay</span>
            <h2>More than a classroom.</h2>
          </div>
          <span className="lesson-count">{lesson.number} / 03</span>
        </div>

        <div className={`lesson lesson-${lesson.color}`} key={lesson.number}>
          <span className="lesson-number">{lesson.number}</span>
          <div>
            <h3>{lesson.title}</h3>
            <p>{lesson.text}</p>
          </div>
          <span className="arrow" aria-hidden="true">↗</span>
        </div>

        <div className="lesson-controls" aria-label="Choose a lesson">
          {lessons.map((item, index) => (
            <button className={index === activeLesson ? 'active' : ''} key={item.number} type="button" onClick={() => setActiveLesson(index)} aria-label={`Show lesson ${item.number}`} aria-pressed={index === activeLesson}>
              <span />
            </button>
          ))}
          <span className="swipe-note">Tap a chapter</span>
        </div>

        <footer className="footer-row">
          <span>Thank you for helping us grow</span>
          <span className="footer-heart">♥</span>
        </footer>
      </section>
    </main>
  )
}
