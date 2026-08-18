import { useEffect, useRef, useState } from 'react'
import profilePhoto from '../tushar_anand.jpeg'
import TechOrbitIcon, { techMeta } from './TechOrbitIcon'
import WaveWords from './WaveWords'

const orbitTracks = [
  {
    className: 'orbit-track-outer',
    skills: [
      ['vscode', '0deg', '0deg', 'planet-xl'],
      ['nodejs', '72deg', '-72deg', 'planet-lg'],
      ['github', '144deg', '-144deg', 'planet-md'],
      ['mongodb', '216deg', '-216deg', 'planet-lg'],
      ['mysql', '288deg', '-288deg', 'planet-md'],
    ],
  },
  {
    className: 'orbit-track-middle',
    skills: [
      ['laravel', '36deg', '-36deg', 'planet-lg'],
      ['express', '108deg', '-108deg', 'planet-md'],
      ['postgresql', '180deg', '-180deg', 'planet-lg'],
      ['php', '252deg', '-252deg', 'planet-md'],
      ['git', '324deg', '-324deg', 'planet-md'],
    ],
  },
  {
    className: 'orbit-track-inner',
    skills: [
      ['react', '45deg', '-45deg', 'planet-lg'],
      ['javascript', '135deg', '-135deg', 'planet-md'],
      ['html', '225deg', '-225deg', 'planet-md'],
      ['css', '315deg', '-315deg', 'planet-md'],
    ],
  },
]

export default function Profile() {
  const [activeSkill, setActiveSkill] = useState('laravel')
  const [orbitPaused, setOrbitPaused] = useState(false)
  const dragging = useRef(false)
  const resumeTimer = useRef(null)
  const selectedTech = techMeta[activeSkill]

  const clearResumeTimer = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
  }

  useEffect(() => () => clearResumeTimer(), [])

  const pauseOrbit = () => {
    clearResumeTimer()
    setOrbitPaused(true)
  }

  const resumeOrbit = () => {
    if (!dragging.current) setOrbitPaused(false)
  }

  const startDrag = (name) => {
    clearResumeTimer()
    dragging.current = true
    setActiveSkill(name)
    setOrbitPaused(true)
  }

  const finishDrag = () => {
    dragging.current = false
    clearResumeTimer()
    resumeTimer.current = window.setTimeout(() => setOrbitPaused(false), 460)
  }

  return (
    <section className="profile section-shell" aria-label="Professional profile">
      <div className={orbitPaused ? 'profile-photo is-paused' : 'profile-photo'} style={{ '--active-tech': selectedTech.accent || selectedTech.color }}>
        <img src={profilePhoto} alt="Tushar Anand" />
        <div className="profile-inner-orbit" aria-hidden="true" />
        {orbitTracks.map((track) => (
          <div className={`profile-orbit-track ${track.className}`} aria-label="Interactive technology orbit" key={track.className}>
            {track.skills.map(([name, angle, counterAngle, size]) => (
              <span className="profile-orbit-item" style={{ '--angle': angle }} key={name}>
                <span className="profile-orbit-anchor" style={{ '--counter-angle': counterAngle }}>
                  <TechOrbitIcon
                    name={name}
                    className={size}
                    active={activeSkill === name}
                    onActivate={setActiveSkill}
                    onDragStart={startDrag}
                    onDragEnd={finishDrag}
                    onPointerEnter={pauseOrbit}
                    onPointerLeave={resumeOrbit}
                  />
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="profile-details">
        <p className="eyebrow"><span className="pulse" /> <WaveWords>Based in Ranchi, Jharkhand</WaveWords></p>
        <p><WaveWords>I build Full Stack Web systems that are secure, maintainable, and prepared for real-world usage - from robust database structure to clear application workflows.</WaveWords></p>
        <div className="profile-skill-readout" aria-live="polite" style={{ '--active-tech': selectedTech.accent || selectedTech.color }}>
          <span><WaveWords>Selected technology</WaveWords></span>
          <strong style={{ '--tech-color': selectedTech.accent || selectedTech.color }}><WaveWords>{selectedTech.label}</WaveWords></strong>
          <small><WaveWords>Click or drag an icon. It springs back.</WaveWords></small>
        </div>
        <dl>
          <div><dt><WaveWords>Current role</WaveWords></dt><dd><WaveWords>Full Stack Web Developer, NIC (National Informatics Centre)</WaveWords></dd></div>
          <div><dt><WaveWords>Department</WaveWords></dt><dd><WaveWords>High Court of Jharkhand</WaveWords></dd></div>
          <div><dt><WaveWords>Location</WaveWords></dt><dd><WaveWords>Dhurwa, Ranchi, Jharkhand - Engineers Hostel, 2nd Floor</WaveWords></dd></div>
        </dl>
      </div>
    </section>
  )
}
