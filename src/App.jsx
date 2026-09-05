import { useState } from 'react'

const tributes = [
  ['◷', 'Patience'],
  ['⌁', 'Curiosity'],
  ['✦', 'Encouragement'],
  ['♡', 'Care'],
  ['▤', 'Stories that stuck'],
  ['✳', 'Believing in us'],
]

const starterNotes = [
  ['Explained it three times without once making me feel slow.', 'a student, years later'],
  ['Remembered my name on day one and never got it wrong again.', 'class of some year'],
  ['Made the back bench feel like the front row.', 'someone who sat there'],
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

  const openBoard = (event) => {
    event.preventDefault()
    setTeacherName((name) => name.trim() || 'Teacher')
    setBurst(true)
    window.setTimeout(() => setIsOpen(true), 520)
    window.setTimeout(() => setBurst(false), 4600)
  }

  const addWish = (event) => {
    event.preventDefault()
    const cleanWish = wish.trim()
    if (!cleanWish) return
    setNotes((current) => [...current, [cleanWish, 'you, just now']])
    setWish('')
    setBurst(true)
    window.setTimeout(() => setBurst(false), 4600)
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
            <p className="gate-copy">Type in a teacher&apos;s name, and the whole board<br />lights up just for them.</p>
            <form className="gate-form" onSubmit={openBoard}>
              <label htmlFor="teacherName">Who are we celebrating today?</label>
              <input id="teacherName" value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="e.g. Arpit Sir" autoComplete="off" autoFocus />
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
            <p>Every subject you taught was really just one lesson in disguise: that someone believed in us before we believed in ourselves.</p>
          </header>

          <div className="notes-grid">
            <article className="chalk-note"><div className="tape" /><h2>Why today</h2><p>India marks Teacher&apos;s Day on 5th September, the birthday of Dr. Sarvepalli Radhakrishnan, who asked that his birthday be spent honouring every teacher instead of him.</p></article>
            <article className="chalk-note"><div className="tape" /><h2>Today&apos;s chalk-thought</h2><p>A good teacher doesn&apos;t hand you the answer. They hand you the confidence to go find it, and stick around in case you get lost.</p></article>
          </div>

          <div className="tribute-grid">{tributes.map(([icon, label]) => <div className="tribute" key={label}><span>{icon}</span><strong>{label}</strong></div>)}</div>
          <h2 className="wall-title">The thank-you wall</h2>
          <div className="wall">{notes.map(([text, author], index) => <article className="sticky" key={`${text}-${index}`}><span>{text}</span><small>— {author}</small></article>)}</div>
          <form className="add-wish" onSubmit={addWish}><input value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Add your own thank-you note..." /><button type="submit">Pin it</button></form>
          <footer className="board-footer"><span>◉</span><p>With gratitude, from all of us.</p></footer>
        </section>
      )}
    </main>
  )
}
