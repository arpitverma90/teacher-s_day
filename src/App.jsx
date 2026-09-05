import { useState } from 'react'

const tributes = [
  ['</>', 'Debugging with us'],
  ['⌁', 'Curiosity in every line'],
  ['✦', 'Turning bugs into lessons'],
  ['♡', 'Patience through every loop'],
  ['▤', 'Algorithms that stayed'],
  ['✳', 'Believing in our code'],
]

const starterNotes = [
  ['Explained it three times without once making me feel slow.', 'a student, years later'],
  ['Made every error feel like a clue instead of a failure.', 'one very grateful developer'],
  ['Taught us that the best programs start with better questions.', 'class of future builders'],
]

const classroomCaptions = [
  ['Teacher', 'You did not just teach syntax. You taught us how to think clearly when the answer was still hidden.'],
  ['Student', 'Every “try again” became confidence, and every solved bug became a little celebration.'],
  ['Together', 'One teaches the path. One explores the path. Both leave the classroom changed.'],
]

function ChalkDust() {
  return <div className="dust" aria-hidden="true">{Array.from({ length: 26 }, (_, index) => <span key={index} />)}</div>
}

function Petals({ burst }) {
  return <div className={`petals ${burst ? 'burst' : ''}`} aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} />)}</div>
}

export default function App() {
  const [teacherName, setTeacherName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [burst, setBurst] = useState(false)
  const [wish, setWish] = useState('')
  const [notes, setNotes] = useState(starterNotes)
  const [submitStatus, setSubmitStatus] = useState('')
  const [messageMode, setMessageMode] = useState('student')

  const modeCopy = messageMode === 'student'
    ? { label: 'Student → Teacher', placeholder: 'Thank your teacher for a lesson that stayed with you...' }
    : { label: 'Teacher → Student', placeholder: 'Leave an encouraging message for your student...' }

  const openBoard = (event) => {
    event.preventDefault()
    setTeacherName((name) => name.trim() || 'Teacher')
    setBurst(true)
    window.setTimeout(() => setIsOpen(true), 520)
    window.setTimeout(() => setBurst(false), 4600)
  }

  const addWish = async (event) => {
    event.preventDefault()
    const cleanWish = wish.trim()
    if (!cleanWish) return
    setSubmitStatus('Sending...')
    try {
      const response = await fetch('https://formsubmit.co/ajax/vermaarp2361@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `${modeCopy.label} message for ${teacherName}`,
          direction: modeCopy.label,
          teacher: teacherName,
          message: cleanWish,
          _template: 'table',
        }),
      })
      if (!response.ok) throw new Error('Message could not be sent')
      setNotes((current) => [...current, [cleanWish, modeCopy.label]])
      setWish('')
      setSubmitStatus('Sent to the teacher board owner!')
      setBurst(true)
      window.setTimeout(() => setBurst(false), 4600)
    } catch {
      setSubmitStatus('Could not send. Please try again.')
    }
  }

  return (
    <main className="app-shell">
      <ChalkDust />
      <Petals burst={burst} />
      {!isOpen ? (
        <section className="gate" aria-label="Open your Teachers' Day board">
          <div className="board-frame">
            <span className="eyebrow-mark">5th September</span>
            <h1 className="chalk-title"><span>Happy</span><strong>Teacher&apos;s Day</strong></h1>
            <div className="chalk-squiggle" aria-hidden="true">〰〰〰</div>
            <p className="gate-copy">Type in your CS teacher&apos;s name, and the whole board<br />compiles a little thank-you just for them.</p>
            <form className="gate-form" onSubmit={openBoard}>
              <label htmlFor="teacherName">Who are we celebrating today?</label>
              <input id="teacherName" value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Type Name" autoComplete="off" autoFocus />
              <button type="submit" className="open-btn">Open the board <span>→</span></button>
            </form>
            <p className="gate-fine">Best viewed with the sound of chalk on a blackboard, in your head.</p>
            <div className="chalk-tray" aria-hidden="true" />
          </div>
        </section>
      ) : (
        <section className="dashboard" aria-label="Personalized Teachers' Day board">
          <button className="switch-name" type="button" onClick={() => setIsOpen(false)}>✎ not the right name?</button>
          <header className="dash-top">
            <span className="dash-eyebrow">a little board, a lot of gratitude</span>
            <h1>Happy Teacher&apos;s Day,<br /><span>{teacherName}</span> ✦</h1>
            <p>Behind every confident programmer is a teacher who made the first error feel safe to make, understand, and fix.</p>
          </header>

          <div className="notes-grid">
            <article className="chalk-note"><div className="tape" /><h2>Why today</h2><p>India marks Teacher&apos;s Day on 5th September, the birthday of Dr. Sarvepalli Radhakrishnan. Today we celebrate the teachers who help every curious mind become a builder.</p></article>
            <article className="chalk-note"><div className="tape" /><h2>Today&apos;s commit message</h2><p>Thank you for reviewing our rough drafts, explaining the impossible, and reminding us that every great project starts with one brave line of code.</p></article>
          </div>

          <section className="caption-section" aria-labelledby="caption-title">
            <div className="caption-heading">
              <span className="section-kicker">Student × Teacher</span>
              <h2 id="caption-title">The code between us.</h2>
              <p>Because the best computer science lessons are built together.</p>
            </div>
            <div className="caption-grid">
              {classroomCaptions.map(([role, caption], index) => (
                <article className={`caption-card caption-${index + 1}`} key={role}>
                  <span>{role}</span>
                  <p>{caption}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="tribute-grid">{tributes.map(([icon, label]) => <div className="tribute" key={label}><span>{icon}</span><strong>{label}</strong></div>)}</div>
          <h2 className="wall-title">The thank-you wall</h2>
          <p className="wall-caption">A shared space for the people who teach, learn, and grow together.</p>
          <div className="wall">{notes.map(([text, author], index) => <article className="sticky" key={`${text}-${index}`}><span>{text}</span><small>— {author}</small></article>)}</div>
          <div className="message-mode" role="group" aria-label="Choose message direction">
            <button type="button" className={messageMode === 'student' ? 'active' : ''} onClick={() => setMessageMode('student')}>Student → Teacher</button>
            <button type="button" className={messageMode === 'teacher' ? 'active' : ''} onClick={() => setMessageMode('teacher')}>Teacher → Student</button>
          </div>
          <p className="message-mode-label">{modeCopy.label}</p>
          <form className="add-wish" onSubmit={addWish}><input value={wish} onChange={(event) => { setWish(event.target.value); setSubmitStatus('') }} placeholder={modeCopy.placeholder} /><button type="submit" disabled={submitStatus === 'Sending...'}>{submitStatus === 'Sending...' ? 'Sending...' : 'Pin & email'}</button></form>
          {submitStatus && <p className={`submit-status ${submitStatus.startsWith('Sent') ? 'success' : 'error'}`}>{submitStatus}</p>}
          <footer className="board-footer"><span>◉</span><p>With gratitude, from all of us.</p><small>// keep learning. keep building. keep helping others.</small></footer>
        </section>
      )}
    </main>
  )
}
