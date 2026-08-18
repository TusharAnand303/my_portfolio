import Icon from './Icon'
import WaveWords from './WaveWords'
import { useState } from 'react'
import { useReducedMotion } from 'motion/react'

const heroOrbits = [
  { cls: 'hero-orbiter-one', duration: 20, count: 4 },
  { cls: 'hero-orbiter-two', duration: 14, count: 3 },
  { cls: 'hero-orbiter-three', duration: 10, count: 2 },
]

export default function Hero({ onPageRipple }) {
  const reduceMotion = useReducedMotion()
  const [orbitRippleId, setOrbitRippleId] = useState(0)

  const sendPageRipple = (event) => {
    if (reduceMotion) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const clientX = bounds.left + bounds.width / 2
    const clientY = bounds.top + bounds.height / 2

    onPageRipple?.({
      clientX,
      clientY,
      source: 'hero',
    })

    setOrbitRippleId((current) => current + 1)
  }

  return (
    <section className="hero section-shell" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span className="pulse" /><span><WaveWords>Currently building at <strong>National Informatics Centre, Ranchi</strong></WaveWords></span></p>
        <h1>
          <span className="hero-title-line">
            <WaveWords>Full Stack Web</WaveWords>
          </span>
          <span className="hero-title-line">
            <WaveWords><span className="hero-word"><i>Developer</i><span className="heading-orbit-mark" aria-hidden="true"><b /><b /></span></span>{' '}with clear vision.</WaveWords>
          </span>
        </h1>
        <p className="hero-intro"><WaveWords>I'm <strong>Tushar Anand</strong>, a full stack web developer with <strong>5+ years of experience</strong> building reliable websites, APIs, SaaS applications, and high-impact digital platforms.</WaveWords></p>
        <div className="hero-actions">
          <a href="#work" className="button button-primary" data-cursor="VIEW"><span><WaveWords>Explore my work</WaveWords></span><Icon name="arrow" size={17} /></a>
          <a href="mailto:tusharanand303@gmail.com" className="text-link" data-cursor="MAIL"><span><WaveWords>Start a conversation</WaveWords></span><Icon name="arrow" size={16} /></a>
        </div>
      </div>
      <div
        className="hero-art"
        aria-label="Abstract visual representation of connected systems"
      >
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
        <div className="hero-ripple-stage" aria-hidden="true">
          {orbitRippleId > 0 && <span className="hero-orbit-ripple" key={orbitRippleId} onAnimationEnd={() => setOrbitRippleId(0)} />}
        </div>
        <svg className="hero-type-ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <defs>
            <path id="hero-type-path" d="M 100,100 m -84,0 a 84,84 0 1,1 168,0 a 84,84 0 1,1 -168,0" />
          </defs>
          <text>
            <textPath href="#hero-type-path">FULL STACK · WEB DEVELOPER · RANCHI · FULL STACK · WEB DEVELOPER · RANCHI ·</textPath>
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
        <p><WaveWords>RANCHI, JHARKHAND<br />INDIA</WaveWords></p>
        <a href="#about" className="scroll-prompt" data-cursor="SCROLL"><span className="scroll-prompt-line" /><span className="scroll-prompt-copy"><WaveWords>Scroll to discover</WaveWords></span></a>
      </div>
    </section>
  )
}
