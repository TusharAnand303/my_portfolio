import profilePhoto from '../tushar_anand.jpeg'
import TechOrbitIcon from './TechOrbitIcon'

const orbitTracks = [
  {
    className: 'orbit-track-outer',
    skills: [
      ['vscode', '0deg', '0deg', 'planet-xl'],
      ['laravel', '90deg', '-90deg', 'planet-md'],
      ['github', '180deg', '-180deg', 'planet-sm'],
      ['mysql', '270deg', '-270deg', 'planet-md'],
    ],
  },
  {
    className: 'orbit-track-middle',
    skills: [
      ['react', '45deg', '-45deg', 'planet-lg'],
      ['postgresql', '135deg', '-135deg', 'planet-md'],
      ['javascript', '225deg', '-225deg', 'planet-sm'],
      ['php', '315deg', '-315deg', 'planet-sm'],
    ],
  },
  {
    className: 'orbit-track-inner',
    skills: [
      ['html', '0deg', '0deg', 'planet-md'],
      ['css', '120deg', '-120deg', 'planet-sm'],
      ['git', '240deg', '-240deg', 'planet-sm'],
    ],
  },
]

export default function Profile() {
  return (
    <section className="profile section-shell" aria-label="Professional profile">
      <div className="profile-photo">
        <img src={profilePhoto} alt="Tushar Anand" />
        <div className="profile-inner-orbit" aria-hidden="true" />
        {orbitTracks.map((track) => <div className={`profile-orbit-track ${track.className}`} aria-hidden="true" key={track.className}>{track.skills.map(([name, angle, counterAngle, size]) => <span className="profile-orbit-item" style={{ '--angle': angle, '--counter-angle': counterAngle }} key={name}><TechOrbitIcon name={name} className={size} /></span>)}</div>)}
      </div>
      <div className="profile-details">
        <p className="eyebrow"><span className="pulse" /> Based in Ranchi, Jharkhand</p>
        <p>I build Full Stack Web systems that are secure, maintainable, and prepared for real-world usage - from robust database structure to clear application workflows.</p>
        <dl>
          <div><dt>Current role</dt><dd>Full Stack Web Developer, NIC(National Informatics Center)</dd></div>
          <div><dt>Department</dt><dd>High Court Of Jharkhand</dd></div>
          <div><dt>Location</dt><dd>Dhurwa Ranchi JH - Engineers Hostel 2nd Floor.</dd></div>
        </dl>
      </div>
    </section>
  )
}
