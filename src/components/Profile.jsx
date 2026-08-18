import { useEffect, useRef, useState } from 'react'
import profilePhoto from '../tushar_anand.jpeg'
import Icon from './Icon'
import TechOrbitIcon, { techMeta } from './TechOrbitIcon'
import WaveWords from './WaveWords'
import { usePortfolioContent } from '../context/PortfolioContentContext'

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

const distributeSkills = (skills, offset = 0) => skills.map(([name, size], index) => {
  const angle = offset + (360 / skills.length) * index
  return [name, `${angle}deg`, `${-angle}deg`, size]
})

const mobileOrbitTracks = [
  {
    className: 'orbit-track-outer',
    skills: distributeSkills([
      ['vscode', 'planet-xl'],
      ['nodejs', 'planet-lg'],
      ['github', 'planet-md'],
      ['mongodb', 'planet-lg'],
      ['mysql', 'planet-md'],
      ['laravel', 'planet-lg'],
      ['postgresql', 'planet-lg'],
    ]),
  },
  {
    className: 'orbit-track-inner',
    skills: distributeSkills([
      ['express', 'planet-md'],
      ['php', 'planet-md'],
      ['git', 'planet-md'],
      ['react', 'planet-md'],
      ['javascript', 'planet-md'],
      ['html', 'planet-md'],
      ['css', 'planet-md'],
    ], 360 / 14),
  },
]

const orbitClassNames = ['orbit-track-outer', 'orbit-track-middle', 'orbit-track-inner']

const buildOrbitTracks = (skills, mobile) => {
  const trackCount = mobile ? 2 : 3
  const chunkSize = Math.ceil(skills.length / trackCount)
  const offsets = mobile ? [0, 360 / Math.max(skills.length, 2)] : [0, 36, 45]

  return orbitClassNames.slice(0, trackCount).map((className, trackIndex) => {
    const chunk = skills.slice(trackIndex * chunkSize, (trackIndex + 1) * chunkSize)
    const count = Math.max(chunk.length, 1)

    return {
      className: mobile && trackIndex === 1 ? 'orbit-track-inner' : className,
      skills: chunk.map((skill, index) => {
        const angle = offsets[trackIndex] + (360 / count) * index
        const sizeClass = String(skill.size || 'planet-md').startsWith('planet-')
          ? skill.size
          : `planet-${skill.size}`
        return [skill.iconKey, `${angle}deg`, `${-angle}deg`, sizeClass, skill.label]
      }),
    }
  }).filter((track) => track.skills.length)
}

export default function Profile() {
  const { content } = usePortfolioContent()
  const { profile } = content
  const enabledSkills = content.skills
    .filter((skill) => skill.enabled !== false && techMeta[skill.iconKey])
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const [activeSkill, setActiveSkill] = useState(profile.defaultSkillId || 'laravel')
  const [orbitPaused, setOrbitPaused] = useState(false)
  const [draggingTrack, setDraggingTrack] = useState(null)
  const [useMobileOrbits, setUseMobileOrbits] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
  ))
  const dragging = useRef(false)
  const pressed = useRef(false)
  const activePointer = useRef(null)
  const cancelledDrag = useRef(false)
  const resumeTimer = useRef(null)
  const activeSkillEntry = enabledSkills.find((skill) => skill.iconKey === activeSkill) || enabledSkills[0]
  const selectedTech = activeSkillEntry
    ? { ...techMeta[activeSkillEntry.iconKey], label: activeSkillEntry.label }
    : { label: 'Technology', color: '#11130f' }
  const displayedOrbitTracks = buildOrbitTracks(enabledSkills, useMobileOrbits)

  const clearResumeTimer = () => {
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }
  }

  useEffect(() => () => clearResumeTimer(), [])

  useEffect(() => {
    if (activeSkillEntry && activeSkill !== activeSkillEntry.iconKey) setActiveSkill(activeSkillEntry.iconKey)
  }, [activeSkill, activeSkillEntry?.iconKey])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const updateOrbitLayout = (event) => {
      if (event) {
        clearResumeTimer()
        dragging.current = false
        pressed.current = false
        activePointer.current = null
        cancelledDrag.current = false
        setOrbitPaused(false)
        setDraggingTrack(null)
      }

      setUseMobileOrbits(query.matches)
    }

    updateOrbitLayout()
    if (query.addEventListener) query.addEventListener('change', updateOrbitLayout)
    else query.addListener(updateOrbitLayout)

    return () => {
      if (query.removeEventListener) query.removeEventListener('change', updateOrbitLayout)
      else query.removeListener(updateOrbitLayout)
    }
  }, [])

  const pauseOrbit = () => {
    clearResumeTimer()
    setOrbitPaused(true)
  }

  const resumeOrbit = (delay = 0) => {
    clearResumeTimer()
    resumeTimer.current = window.setTimeout(() => {
      if (!dragging.current && !pressed.current) {
        setOrbitPaused(false)
        setDraggingTrack(null)
      }
    }, delay)
  }

  const startPress = (name, event) => {
    if (activePointer.current !== null && activePointer.current !== event.pointerId) return

    activePointer.current = event.pointerId
    cancelledDrag.current = false
    pressed.current = true
    setActiveSkill(name)
    pauseOrbit()
  }

  const endPress = (event) => {
    if (activePointer.current === null || activePointer.current !== event.pointerId) return

    activePointer.current = null
    pressed.current = false
    if (!dragging.current) resumeOrbit(180)
  }

  const startDrag = (name, trackName) => {
    clearResumeTimer()
    dragging.current = true
    setActiveSkill(name)
    setDraggingTrack(trackName)
    setOrbitPaused(true)
  }

  const finishDrag = () => {
    if (cancelledDrag.current) {
      cancelledDrag.current = false
      dragging.current = false
      pressed.current = false
      activePointer.current = null
      resumeOrbit(900)
      return
    }

    dragging.current = false
    pressed.current = false
    activePointer.current = null
    resumeOrbit(900)
  }

  const finishReturn = () => {
    if (!dragging.current && !pressed.current) resumeOrbit()
  }

  const cancelPress = (event) => {
    if (activePointer.current === null || activePointer.current !== event.pointerId) return

    const wasDragging = dragging.current
    cancelledDrag.current = wasDragging
    activePointer.current = null
    pressed.current = false

    if (wasDragging) {
      clearResumeTimer()
      resumeTimer.current = window.setTimeout(() => {
        dragging.current = false
        cancelledDrag.current = false
        setOrbitPaused(false)
        setDraggingTrack(null)
      }, 900)
      return
    }

    dragging.current = false
    setDraggingTrack(null)
    resumeOrbit()
  }

  const handlePointerEnter = (event) => {
    if (event.pointerType === 'mouse') pauseOrbit()
  }

  const handlePointerLeave = (event) => {
    if (event.pointerType === 'mouse') resumeOrbit()
  }

  return (
    <section className="profile section-shell" aria-label="Professional profile">
      <div className={orbitPaused ? 'profile-photo is-paused' : 'profile-photo'} role="group" aria-label="Interactive technology orbit" style={{ '--active-tech': selectedTech.accent || selectedTech.color }}>
        <img src={profile.imageUrl || profilePhoto} alt={profile.imageAlt || 'Tushar Anand'} />
        <div className="profile-inner-orbit" aria-hidden="true" />
        {displayedOrbitTracks.map((track) => (
          <div className={`profile-orbit-track ${track.className}${draggingTrack === track.className ? ' is-dragging' : ''}`} key={track.className}>
            {track.skills.map(([name, angle, counterAngle, size, label]) => (
              <span className="profile-orbit-item" style={{ '--angle': angle }} key={name}>
                <span className="profile-orbit-anchor" style={{ '--counter-angle': counterAngle }}>
                  <TechOrbitIcon
                    name={name}
                    label={label}
                    className={size}
                    active={activeSkill === name}
                    onActivate={setActiveSkill}
                    onDragStart={(skill) => startDrag(skill, track.className)}
                    onDragEnd={finishDrag}
                    onReturnComplete={finishReturn}
                    onPressStart={startPress}
                    onPressEnd={endPress}
                    onPressCancel={cancelPress}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                    onFocus={pauseOrbit}
                    onBlur={() => resumeOrbit()}
                  />
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="profile-details">
        <p className="eyebrow"><span className="pulse" /> <WaveWords>{profile.eyebrow}</WaveWords></p>
        <p><WaveWords>{profile.summary}</WaveWords></p>
        <aside className="recruiter-snapshot" aria-label="30-second professional profile">
          <div className="recruiter-snapshot-top"><span><WaveWords>{profile.snapshotTitle}</WaveWords></span><b aria-hidden="true">{profile.snapshotCode}</b></div>
          <ul>
            {profile.snapshot.map((item) => <li key={item.id || `${item.value}-${item.label}`}><strong><WaveWords>{item.value}</WaveWords></strong><small><WaveWords>{item.label}</WaveWords></small></li>)}
          </ul>
          <a href={profile.recruiterAction.href} data-cursor="MAIL"><span><WaveWords>{profile.recruiterAction.label}</WaveWords></span><Icon name="arrow" size={15} /></a>
        </aside>
        <div className="profile-skill-readout" aria-live="polite" style={{ '--active-tech': selectedTech.accent || selectedTech.color }}>
          <span><WaveWords>{profile.skillReadoutLabel}</WaveWords></span>
          <strong style={{ '--tech-color': selectedTech.accent || selectedTech.color }}><WaveWords>{selectedTech.label}</WaveWords></strong>
          <small><WaveWords>{profile.skillReadoutHint}</WaveWords></small>
        </div>
        <dl>
          <div><dt><WaveWords>Current role</WaveWords></dt><dd><WaveWords>{profile.details.role}</WaveWords></dd></div>
          <div><dt><WaveWords>Department</WaveWords></dt><dd><WaveWords>{profile.details.department}</WaveWords></dd></div>
          <div><dt><WaveWords>Location</WaveWords></dt><dd><WaveWords>{profile.details.location}</WaveWords></dd></div>
        </dl>
      </div>
    </section>
  )
}
