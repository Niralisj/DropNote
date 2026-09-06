import { useEffect, useState } from 'react'

const initialReminders = [{ id: 1, text: 'Push my PR', time: '23:30' }]
const storageKey = 'notedrop-reminders'

function loadReminders() {
  try {
    const savedReminders = localStorage.getItem(storageKey)
    return savedReminders ? JSON.parse(savedReminders) : initialReminders
  } catch {
    return initialReminders
  }
}

function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes)
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date)
}

function timeInFiveMinutes() {
  const date = new Date(Date.now() + 5 * 60 * 1000)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export default function App() {
  const [reminders, setReminders] = useState(loadReminders)
  const [text, setText] = useState('')
  const [time, setTime] = useState('')
  const [activeReminder, setActiveReminder] = useState(null)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reminders))
  }, [reminders])

  useEffect(() => {
    function checkForDueReminder() {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const today = now.toDateString()
      const dueReminder = reminders.find(
        (reminder) => reminder.time === currentTime && reminder.firedOn !== today,
      )

      if (!dueReminder) return

      setActiveReminder(dueReminder)
      setReminders((current) => current.map((reminder) => (
        reminder.id === dueReminder.id ? { ...reminder, firedOn: today } : reminder
      )))
    }

    checkForDueReminder()
    const clock = window.setInterval(checkForDueReminder, 1_000)
    return () => window.clearInterval(clock)
  }, [reminders])

  function addReminder(event) {
    event.preventDefault()
    const trimmedText = text.trim()
    if (!trimmedText || !time) return

    setReminders((current) => [
      ...current,
      { id: crypto.randomUUID(), text: trimmedText, time },
    ])
    setText('')
    setTime('')
  }

  function completeReminder() {
    setReminders((current) => current.filter((reminder) => reminder.id !== activeReminder.id))
    setActiveReminder(null)
  }

  function snoozeReminder() {
    setReminders((current) => current.map((reminder) => (
      reminder.id === activeReminder.id
        ? { ...reminder, time: timeInFiveMinutes(), firedOn: null }
        : reminder
    )))
    setActiveReminder(null)
  }

  return (
    <main className="app-shell">
      <section className="notedrop" aria-labelledby="app-title">
        <header>
          <p className="brand" id="app-title">NoteDrop</p>
          <p className="subtitle">A little note for later.</p>
        </header>
        <form className="reminder-form" onSubmit={addReminder}>
          <label htmlFor="reminder-text">What do you need to do?</label>
          <textarea id="reminder-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="e.g. Send the design draft" rows="3" />
          <div className="time-row">
            <label htmlFor="reminder-time">Remind me at</label>
            <input id="reminder-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          </div>
          <button type="submit">+ Add reminder</button>
        </form>
        <section className="upcoming" aria-labelledby="upcoming-title">
          <h2 id="upcoming-title">Upcoming</h2>
          <ul>{reminders.map((reminder) => (
            <li key={reminder.id}>
              <span className="note-icon" aria-hidden="true" />
              <div><p>{reminder.text}</p><time>Today at {formatTime(reminder.time)}</time></div>
            </li>
          ))}</ul>
        </section>
      </section>
      {activeReminder && (
        <section className="delivery" aria-live="assertive" aria-label="Reminder delivery">
          <article className="sticky-note">
            <span className="pin" aria-hidden="true">●</span>
            <p className="note-label">Reminder for now</p>
            <h3>{activeReminder.text}</h3>
            <p className="note-time">{formatTime(activeReminder.time)}</p>
            <div className="note-actions">
              <button type="button" className="done" onClick={completeReminder}>Done</button>
              <button type="button" className="snooze" onClick={snoozeReminder}>Snooze 5 min</button>
            </div>
          </article>
        </section>
      )}
    </main>
  )
}
