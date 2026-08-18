import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import WaveWords from './WaveWords'

const buildModes = [
  {
    id: 'public',
    tab: 'Public service',
    eyebrow: 'Build mode · lots of real people',
    title: 'Make the serious stuff feel simple.',
    copy: 'The rules can stay complex behind the scenes. The screen should still feel calm, clear, and very sure about the next step.',
    stack: ['Laravel', 'PostgreSQL', 'Clear UI'],
    steps: ['Ask only what matters', 'Explain the next move', 'Keep the status obvious'],
    note: 'Best for forms, portals, and services people need to trust.',
    accent: '#d9fb63',
  },
  {
    id: 'product',
    tab: 'Web product',
    eyebrow: 'Build mode · a useful idea',
    title: 'Give the idea a home people want to use.',
    copy: 'We start with the one thing someone came to do, make that part feel great, then grow the product without turning it into a maze.',
    stack: ['React', 'REST API', 'Responsive UX'],
    steps: ['Find the core action', 'Build the shortest path', 'Polish the useful bits'],
    note: 'Good for SaaS ideas, internal tools, and everyday web products.',
    accent: '#ff8a73',
  },
  {
    id: 'tool',
    tab: 'Dev tool',
    eyebrow: 'Build mode · scratch my own itch',
    title: 'Turn a repeated annoyance into one good tool.',
    copy: 'If I do the same awkward thing three times, I start wondering whether it should be a button, a tiny app, or a browser extension.',
    stack: ['JavaScript', 'Browser APIs', 'Fast feedback'],
    steps: ['Spot the annoying loop', 'Cut out the extra clicks', 'Keep the useful detail'],
    note: 'Perfect for extensions, API tools, and small utilities with a sharp job.',
    accent: '#aecbff',
  },
]

export default function Playground() {
  const [activeId, setActiveId] = useState(buildModes[0].id)
  const reduceMotion = useReducedMotion()
  const activeMode = buildModes.find((mode) => mode.id === activeId)

  const moveSpotlight = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    event.currentTarget.style.setProperty('--play-x', x + '%')
    event.currentTarget.style.setProperty('--play-y', y + '%')
  }

  return (
    <section className="playground section-shell" id="playground">
      <div className="section-heading"><span><WaveWords>05</WaveWords></span><p><WaveWords>Try it yourself</WaveWords></p></div>
      <div className="playground-heading">
        <h2><WaveWords>Pick a thing to build.<br /><i>I'll show you how I think.</i></WaveWords></h2>
        <p><WaveWords>This bit is yours. Click around — the answer changes.</WaveWords></p>
      </div>

      <div className="playground-shell">
        <div className="playground-picker" aria-label="Choose a build mode">
          {buildModes.map((mode, index) => (
            <motion.button
              type="button"
              className={mode.id === activeId ? 'is-active' : undefined}
              aria-pressed={mode.id === activeId}
              data-cursor="TRY"
              onClick={() => setActiveId(mode.id)}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              key={mode.id}
            >
              <span><WaveWords>{`0${index + 1}`}</WaveWords></span><data value={mode.id}><WaveWords>{mode.tab}</WaveWords></data>
              {mode.id === activeId && <motion.i layoutId="playground-active" aria-hidden="true" />}
            </motion.button>
          ))}
        </div>

        <div className="playground-live" onPointerMove={moveSpotlight} style={{ '--play-accent': activeMode.accent }} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="playground-stage"
              key={activeMode.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="playground-copy">
                <p className="playground-eyebrow"><span className="playground-dot" /><span className="playground-eyebrow-copy"><WaveWords>{activeMode.eyebrow}</WaveWords></span></p>
                <h3><WaveWords>{activeMode.title}</WaveWords></h3>
                <p><WaveWords>{activeMode.copy}</WaveWords></p>
                <div className="playground-stack">
                  {activeMode.stack.map((item, index) => (
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.1 + index * 0.06 }}
                      key={item}
                    >
                      <WaveWords>{item}</WaveWords>
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="playground-console">
                <div className="console-top">
                  <div><i /><i /><i /></div>
                  <span><WaveWords>tushar.build / {activeMode.id}</WaveWords></span>
                  <b><WaveWords>LIVE</WaveWords></b>
                </div>
                <div className="console-flow">
                  {activeMode.steps.map((step, index) => (
                    <motion.div
                      className="console-step"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: reduceMotion ? 0 : 0.12 + index * 0.1, type: 'spring', stiffness: 260, damping: 22 }}
                      key={step}
                    >
                      <span><WaveWords>{`0${index + 1}`}</WaveWords></span>
                      <strong><WaveWords>{step}</WaveWords></strong>
                      {index < activeMode.steps.length - 1 && <i aria-hidden="true">↓</i>}
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="console-signal"
                  animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                >
                  <span className="console-signal-dot" />
                  <span className="console-signal-copy"><WaveWords>{activeMode.note}</WaveWords></span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
