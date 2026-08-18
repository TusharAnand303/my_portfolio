import Icon from './Icon'
import WaveWords from './WaveWords'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { usePortfolioContent } from '../context/PortfolioContentContext'

const heroOrbits = [
  { cls: 'hero-orbiter-one', duration: 20, count: 4 },
  { cls: 'hero-orbiter-two', duration: 14, count: 3 },
  { cls: 'hero-orbiter-three', duration: 10, count: 2 },
]

function KineticDeveloper({ reduceMotion, word }) {
  const wordRef = useRef(null)
  const isInView = useInView(wordRef, { margin: '140px 0px' })
  const shouldAnimate = !reduceMotion && isInView
  const letters = [...word]

  return (
    <span ref={wordRef} className="kinetic-word page-wave-word" data-wave-word aria-label={word}>
      {letters.map((letter, index) => (
        <motion.span
          className="kinetic-letter"
          aria-hidden="true"
          initial={false}
          animate={shouldAnimate ? {
            color: ['#11130f', '#19b3b3', '#11130f'],
          } : {
            color: '#11130f',
          }}
          transition={shouldAnimate ? {
            duration: 2.35,
            repeat: Infinity,
            repeatDelay: 0.1,
            delay: index * 0.075,
            ease: [0.22, 1, 0.36, 1],
          } : { duration: 0.16 }}
          key={`${letter}-${index}`}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero({ onPageRipple }) {
  const reduceMotion = useReducedMotion()
  const [orbitRippleId, setOrbitRippleId] = useState(0)
  const { content } = usePortfolioContent()
  const { hero, resume } = content

  const sendPageRipple = (event) => {
    if (reduceMotion) return

    const bounds = event.currentTarget.getBoundingClientRect()
    
    // Only show ripple if the button is visible in the viewport
    if (bounds.top > window.innerHeight || bounds.bottom < 0) return

    const clientX = bounds.left + bounds.width / 2
    const clientY = bounds.top + bounds.height / 2

    onPageRipple?.({
      clientX,
      clientY,
      source: 'hero',
    })

    setOrbitRippleId((current) => current + 1)
  }

  useEffect(() => {
    if (orbitRippleId === 0) return

    const cancelRippleOnScroll = () => {
      setOrbitRippleId(0)
    }

    window.addEventListener('scroll', cancelRippleOnScroll, { passive: true })
    return () => window.removeEventListener('scroll', cancelRippleOnScroll)
  }, [orbitRippleId])

  return (
    <section className="hero section-shell" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span className="pulse" /><span><WaveWords>{hero.eyebrowPrefix} <strong>{hero.organisation}</strong></WaveWords></span></p>
        <h1>
          <span className="hero-title-line">
            <WaveWords>{hero.headingLineOne}</WaveWords>
          </span>
          <span className="hero-title-line">
            <WaveWords><span className="hero-word"><i><KineticDeveloper reduceMotion={reduceMotion} word={hero.headingAccent} /></i><span className="heading-orbit-mark" aria-hidden="true"><b /><b /></span></span>{' '}{hero.headingSuffix}</WaveWords>
          </span>
        </h1>
        <p className="hero-intro"><WaveWords>{hero.description}</WaveWords></p>
        <div className="hero-actions">
          <a href={hero.primaryAction.href} className="button button-primary" data-cursor="VIEW"><span><WaveWords>{hero.primaryAction.label}</WaveWords></span><Icon name="arrow" size={17} /></a>
          {resume.downloadUrl && (
            <a href={resume.downloadUrl} className="button button-resume" download={resume.originalName || 'Tushar-Anand-Resume.pdf'} data-cursor="CV">
              <span><WaveWords>{resume.label}</WaveWords></span><Icon name="download" size={16} />
            </a>
          )}
          <a href={hero.conversationAction.href} className="text-link" data-cursor="MAIL"><span><WaveWords>{hero.conversationAction.label}</WaveWords></span><Icon name="arrow" size={16} /></a>
        </div>
        <ul className="hero-proof" aria-label="Professional highlights">
          {hero.highlights.map((highlight) => (
            <li key={highlight.id || `${highlight.value}-${highlight.label}`}><strong><WaveWords>{highlight.value}</WaveWords></strong><span className="hero-proof-label"><WaveWords>{highlight.label}</WaveWords></span></li>
          ))}
        </ul>
      </div>
      <div
        className={`hero-art${orbitRippleId > 0 ? ' is-signaling' : ''}`}
        aria-label="Abstract visual representation of connected systems"
      >
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
        <svg className="hero-signal-network" viewBox="0 0 200 200" aria-hidden="true" focusable="false" key={`signal-${orbitRippleId}`}>
          <path className="hero-signal-path signal-path-one" pathLength="1" d="M100 100 C82 74 61 40 42 19" />
          <path className="hero-signal-path signal-path-two" pathLength="1" d="M100 100 C128 75 154 48 177 30" />
          <path className="hero-signal-path signal-path-three" pathLength="1" d="M100 100 C130 120 154 146 181 164" />
          <circle className="hero-signal-node signal-node-one" cx="42" cy="19" r="3" />
          <circle className="hero-signal-node signal-node-two" cx="177" cy="30" r="3" />
          <circle className="hero-signal-node signal-node-three" cx="181" cy="164" r="3" />
        </svg>
        <div className="hero-ripple-stage" aria-hidden="true">
          {orbitRippleId > 0 && <span className="hero-orbit-ripple" key={orbitRippleId} onAnimationEnd={() => setOrbitRippleId(0)} />}
        </div>
        <svg className="hero-type-ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <defs>
            <path id="hero-type-path" d="M 100,100 m -84,0 a 84,84 0 1,1 168,0 a 84,84 0 1,1 -168,0" />
          </defs>
          <text>
            <textPath href="#hero-type-path">{hero.ringText}</textPath>
          </text>
        </svg>
        {heroOrbits.map((orbit) =>
          Array.from({ length: orbit.count }, (_, i) => (
            <div
              key={`${orbit.cls}-${i}`}
              className={`hero-orbiter ${orbit.cls}`}
              style={{ animationDelay: `${-(orbit.duration / orbit.count) * i}s` }}
            >
              <span />
            </div>
          ))
        )}
        <button
          type="button"
          id="hero-wave-trigger"
          className="center-disc"
          aria-label={reduceMotion ? 'Infinity symbol' : 'Press the center to send a wave through the page'}
          title={reduceMotion ? undefined : 'Press to ripple the page'}
          data-cursor={reduceMotion ? undefined : 'PULSE'}
          disabled={reduceMotion}
          onClick={reduceMotion ? undefined : sendPageRipple}
        >
          <span className="center-disc-symbol">&infin;</span>
          <small className="center-disc-cue" aria-hidden="true">PRESS</small>
        </button>
        <div className="art-label label-one"><WaveWords>WEB<br />ARCHITECTURE</WaveWords></div>
        <div className="art-label label-two"><WaveWords>SAAS<br />FOR GOVERNMENT</WaveWords></div>
      </div>
      <div className="hero-footer">
        <p><WaveWords>{hero.location.map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</WaveWords></p>
        <a href="#about" className="scroll-prompt" data-cursor="SCROLL"><span className="scroll-prompt-line" /><span className="scroll-prompt-copy"><WaveWords>{hero.scrollLabel}</WaveWords></span></a>
      </div>
    </section>
  )
}
