import { useEffect, useRef, useState } from 'react'

const tributes = [
  ['</>', 'Debugging with us'],
  ['⌁', 'Curiosity in every line'],
  ['✦', 'Turning bugs into lessons'],
  ['♡', 'Patience through every loop'],
  ['▤', 'Algorithms that stayed'],
  ['✳', 'Believing in our code'],
]

const starterNotes = [
  ['Explained it three times without once making me feel slow.', 'Arpit Verma'],
  ['Made every error feel like a clue instead of a failure.', 'Riya Rawat'],
  ["Happy Teachers' Day! Thank you for patiently explaining things, turning every mistake into a learning opportunity, and teaching us that the best progress starts with better questions. Your guidance truly inspires us to learn and grow.", 'Archana Kamble'],
]

const removeTemporaryNote = (savedNotes) => savedNotes.filter(([text, author]) => {
  const noteText = String(text).trim().toLowerCase()
  const noteAuthor = String(author).trim().toLowerCase()
  return !(noteText === 'thank you' && noteAuthor.startsWith('arpit'))
})

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
  const [studentName, setStudentName] = useState('')
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = window.localStorage.getItem('teachers-day-notes')
      return savedNotes ? removeTemporaryNote(JSON.parse(savedNotes)) : starterNotes
    } catch {
      return starterNotes
    }
  })
  const [submitStatus, setSubmitStatus] = useState('')
  const [messageMode, setMessageMode] = useState('student')
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState(null)
  const [recordStatus, setRecordStatus] = useState('')
  const [videoMode, setVideoMode] = useState('student')
  const [wallView, setWallView] = useState('notes')
  const [pinnedVideos, setPinnedVideos] = useState([])
  const mediaRecorderRef = useRef(null)
  const cameraStreamRef = useRef(null)
  const videoPreviewRef = useRef(null)
  const recordedUrlRef = useRef('')

  useEffect(() => {
    window.localStorage.setItem('teachers-day-notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop())
    if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current)
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
      const chunks = []
      cameraStreamRef.current = stream
      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current)
        recordedUrlRef.current = url
        setRecordedVideo({ blob, url })
        setRecordStatus('Your video is ready to share.')
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null
          videoPreviewRef.current.src = url
          videoPreviewRef.current.controls = true
        }
        stream.getTracks().forEach((track) => track.stop())
      }
      if (videoPreviewRef.current) videoPreviewRef.current.srcObject = stream
      if (videoPreviewRef.current) {
        videoPreviewRef.current.src = ''
        videoPreviewRef.current.controls = false
      }
      recorder.start()
      setIsRecording(true)
      setRecordStatus('Recording... say something wonderful!')
    } catch {
      setRecordStatus('Camera and microphone permission is needed to record.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop()
    if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null
    setIsRecording(false)
  }

  const shareVideo = async () => {
    if (!recordedVideo) return
    const file = new File([recordedVideo.blob], 'teachers-day-message.webm', { type: 'video/webm' })
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share({ title: 'Teachers\' Day video message', text: `${videoMode === 'student' ? 'Student to teacher' : 'Teacher to student'} video message`, files: [file] })
        setRecordStatus('Video shared successfully.')
        return
      } catch (error) {
        if (error.name === 'AbortError') return
      }
    }
    const link = document.createElement('a')
    link.href = recordedVideo.url
    link.download = file.name
    link.click()
    const subject = encodeURIComponent(`${videoMode === 'student' ? 'Student to teacher' : 'Teacher to student'} video message`)
    window.location.href = `mailto:vermaarp2361@gmail.com,archanak28@gmail.com?subject=${subject}&body=Please%20attach%20the%20downloaded%20Teachers%27%20Day%20video%20message%20to%20this%20email.`
    setRecordStatus('Video downloaded. Attach it to the email draft.')
  }

  const deleteVideo = () => {

      const pinVideo = () => {
        if (!recordedVideo || videoMode !== 'student') return
        setPinnedVideos((current) => [...current, { url: URL.createObjectURL(recordedVideo.blob), label: 'Student video message' }])
        setWallView('videos')
        setRecordStatus('Video pinned to the Videos wall.')
      }
    if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current)
    recordedUrlRef.current = ''
    setRecordedVideo(null)
    setRecordStatus('Video deleted. You can record again.')
    if (videoPreviewRef.current) {
      videoPreviewRef.current.pause()
      videoPreviewRef.current.removeAttribute('src')
      videoPreviewRef.current.load()
      videoPreviewRef.current.controls = false
    }
  }

  const modeCopy = messageMode === 'student'
    ? { label: 'Student → Teacher', placeholder: 'Thank your teacher for a lesson that stayed with you...' }
    : { label: 'Teacher → Student', placeholder: 'Leave an encouraging message for your student...' }

  const openBoard = (event) => {
    event.preventDefault()
    setTeacherName((name) => name.trim() || 'Shiraj Sir')
    setBurst(true)
    window.setTimeout(() => setIsOpen(true), 520)
    window.setTimeout(() => setBurst(false), 4600)
  }

  const addWish = async (event) => {
    event.preventDefault()
    const cleanWish = wish.trim()
    if (!cleanWish) return
    const cleanStudentName = studentName.trim() || 'A grateful student'
    const shouldPin = messageMode === 'student'
    if (shouldPin) {
      setNotes((current) => [...current, [cleanWish, cleanStudentName, modeCopy.label]])
    }
    setSubmitStatus('Sending...')
    try {
      const response = await fetch('https://formsubmit.co/ajax/vermaarp2361@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `${modeCopy.label} message for ${teacherName}`,
          _cc: 'archanak28@gmail.com',
          _replyto: 'archanak28@gmail.com',
          direction: modeCopy.label,
          student: cleanStudentName,
          teacher: teacherName,
          message: cleanWish,
          _template: 'table',
        }),
      })
      if (!response.ok) throw new Error('Message could not be sent')
      setWish('')
      setSubmitStatus(messageMode === 'student' ? 'Pinned and sent to both email addresses!' : 'Sent privately to both email addresses!')
      setBurst(true)
      window.setTimeout(() => setBurst(false), 4600)
    } catch {
      setSubmitStatus(shouldPin ? 'Pinned on this board. Email could not be sent.' : 'Could not send. Please try again.')
    }
  }

  const deleteNote = (noteIndex) => {
    setNotes((current) => current.filter((_, index) => index !== noteIndex))
  }

  return (
    <main className="app-shell">
      <ChalkDust />
      <Petals burst={burst} />
      <div className="data-background" aria-hidden="true">
        <div className="data-label label-one">SQL / INSIGHTS</div>
        <div className="data-label label-two">ETL PIPELINE</div>
        <div className="data-label label-three">DATA STORY</div>
        <div className="data-chart chart-bars"><i /><i /><i /><i /><i /></div>
        <div className="data-chart chart-line"><span /><span /><span /><span /><span /></div>
        <div className="data-nodes"><i /><i /><i /><i /><i /></div>
      </div>
      {!isOpen ? (
        <section className="gate" aria-label="Open your Teachers' Day board">
          <div className="board-frame">
            <span className="eyebrow-mark">5th September</span>
            <h1 className="chalk-title"><span>Happy</span><strong>Teacher&apos;s Day</strong></h1>
            <div className="chalk-squiggle" aria-hidden="true">〰〰〰</div>
            <p className="gate-copy">A board made especially for teachers<br />by the students whose future you helped build.</p>
            <form className="gate-form" onSubmit={openBoard}>
              <button type="submit" className="open-btn">Open my teacher board <span>→</span></button>
            </form>
            <p className="gate-fine">A small thank-you from the students whose future you helped build.</p>
            <div className="chalk-tray" aria-hidden="true" />
          </div>
        </section>
      ) : (
        <section className="dashboard" aria-label="Personalized Teachers' Day board">
          <button className="switch-name" type="button" onClick={() => setIsOpen(false)}>✎ Change teacher name</button>
          <header className="dash-top">
            <span className="dash-eyebrow">a little board, a lot of gratitude</span>
            <h1>Happy Teacher&apos;s Day,<br /><span>{teacherName}</span> ✦</h1>
            <p>Your students made this board for you: behind every confident programmer is a teacher who made the first error feel safe to make, understand, and fix.</p>
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
          <section className="video-message hidden-for-now" aria-labelledby="video-title">
            <div>
              <span className="section-kicker">A message in motion</span>
              <h2 id="video-title">Record a video for the board</h2>
              <p>{videoMode === 'student' ? 'Students can say thank you, share a memory, or celebrate a teacher.' : 'Teachers can send encouragement, guidance, or a message to a student.'}</p>
            </div>
            <video ref={videoPreviewRef} className={isRecording ? 'recording' : ''} autoPlay muted playsInline />
            <div className="video-mode" role="group" aria-label="Choose who is sending the video">
              <button type="button" className={videoMode === 'student' ? 'active' : ''} onClick={() => setVideoMode('student')}>Student → Teacher</button>
              <button type="button" className={videoMode === 'teacher' ? 'active' : ''} onClick={() => setVideoMode('teacher')}>Teacher → Student</button>
            </div>
            <div className="video-controls">
              {!isRecording && <button type="button" onClick={startRecording}>{recordedVideo ? 'Record again' : 'Start recording'}</button>}
              {isRecording && <button type="button" className="stop-recording" onClick={stopRecording}>Stop recording</button>}
              {recordedVideo && !isRecording && <><button type="button" className="share-video" onClick={shareVideo}>Share video</button><button type="button" className="delete-video" onClick={deleteVideo}>Delete video</button></>}
            </div>
            <small>{recordStatus || 'Your browser will ask for camera and microphone permission.'}</small>
          </section>
          <h2 className="wall-title">The thank-you wall</h2>
          <p className="wall-caption">A shared space for the people who teach, learn, and grow together.</p>
          <div className="wall-tabs" role="tablist" aria-label="Thank-you wall content">
            <button type="button" className={wallView === 'notes' ? 'active' : ''} onClick={() => setWallView('notes')}>Pinned notes ({notes.length})</button>
          </div>
          {wallView === 'notes' ? <div className="wall">{notes.map(([text, author], index) => <article className="sticky" key={`${text}-${index}`}><span>{text}</span><small className="note-author"><strong>{author}</strong></small><button className="delete-note" type="button" onClick={() => deleteNote(index)} aria-label={`Delete note by ${author}`}>Delete</button></article>)}</div> : <div className="video-wall">{pinnedVideos.length ? pinnedVideos.map((video, index) => <article className="pinned-video" key={`${video.url}-${index}`}><video src={video.url} controls playsInline /><small>{video.label}</small></article>) : <p className="empty-wall">No videos pinned yet. Record one and choose Pin video.</p>}</div>}
                        {recordedVideo && !isRecording && <><button type="button" className="share-video" onClick={shareVideo}>Share video</button>{videoMode === 'student' && <button type="button" className="pin-video" onClick={pinVideo}>Pin video</button>}<button type="button" className="delete-video" onClick={deleteVideo}>Delete video</button></>}
          <div className="message-mode" role="group" aria-label="Choose message direction">
            <button type="button" className={messageMode === 'student' ? 'active' : ''} onClick={() => setMessageMode('student')}>Student → Teacher</button>
            <button type="button" className={messageMode === 'teacher' ? 'active' : ''} onClick={() => setMessageMode('teacher')}>Teacher → Student</button>
          </div>
          <p className="message-mode-label">{modeCopy.label}</p>
          <form className={`add-wish ${messageMode === 'teacher' ? 'teacher-mode' : 'student-mode'}`} onSubmit={addWish}>
            {messageMode === 'student' && <input className="student-name-input" value={studentName} onChange={(event) => { setStudentName(event.target.value); setSubmitStatus('') }} placeholder="Student name" aria-label="Student name" />}
            <input value={wish} onChange={(event) => { setWish(event.target.value); setSubmitStatus('') }} placeholder={modeCopy.placeholder} aria-label="Thank-you message" />
            <button type="submit" disabled={submitStatus === 'Sending...'}>{submitStatus === 'Sending...' ? 'Sending...' : messageMode === 'teacher' ? 'Send email' : 'Pin & email'}</button>
          </form>
          {submitStatus && <p className={`submit-status ${submitStatus.startsWith('Sent') ? 'success' : 'error'}`}>{submitStatus}</p>}
          <footer className="board-footer"><span>◉</span><p>With gratitude, from all of us.</p><small>// keep learning. keep building. keep helping others.</small></footer>
        </section>
      )}
    </main>
  )
}
