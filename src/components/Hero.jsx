import Icon from './Icon'

const heroOrbits = [
  { cls: 'hero-orbiter-one', duration: 20, count: 4 },
  { cls: 'hero-orbiter-two', duration: 14, count: 3 },
  { cls: 'hero-orbiter-three', duration: 10, count: 2 },
]

export default function Hero() {
  return (
    <section className="hero section-shell" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span className="pulse" /> Currently building at <strong>National Informatics Centre, Ranchi</strong></p>
        <h1>Full Stack Web<br /><i>Developer</i> with clear vision.</h1>
        <p className="hero-intro">I'm <strong>Tushar Anand</strong>, a full stack web developer with <strong>5+ years of experience</strong> building reliable websites, APIs, SaaS applications, and high-impact digital platforms.</p>
        <div className="hero-actions">
          <a href="#work" className="button button-primary">Explore my work <Icon name="arrow" size={17} /></a>
          <a href="mailto:tusharanand303@gmai.com" className="text-link">Start a conversation <Icon name="arrow" size={16} /></a>
        </div>
      </div>
      <div className="hero-art" aria-label="Abstract visual representation of connected systems">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
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
        <div className="center-disc"><span>∞</span></div>
        <div className="art-label label-one">WEB<br />ARCHITECTURE</div>
        <div className="art-label label-two">SASS<br />FOR GOVERNMENT</div>
        <div className="art-marker marker-one" /><div className="art-marker marker-two" />
      </div>
      <div className="hero-footer">
        <p>RANCHI, JHARKHAND<br />INDIA</p>
        <a href="#about" className="scroll-prompt"><span /> Scroll to discover</a>
      </div>
    </section>
  )
}
