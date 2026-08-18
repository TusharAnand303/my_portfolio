import WaveWords from './WaveWords'
import { usePortfolioContent } from '../context/PortfolioContentContext'

const extraSkills = ['REST APIs', 'Linux', 'System Design', 'API', 'Tailwind CSS']

export default function About() {
  const { content } = usePortfolioContent()
  const skills = [
    ...content.skills.filter((skill) => skill.enabled !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((skill) => skill.label),
    ...extraSkills,
  ]

  return (
    <section className="about section-shell" id="about">
      <div className="section-heading"><span><WaveWords>01</WaveWords></span><p><WaveWords>About me</WaveWords></p></div>
      <div className="about-grid">
        <div><h2><WaveWords>Thoughtful Web Developer, <i>built for public impact.</i></WaveWords></h2></div>
        <div className="about-content">
          <p><WaveWords>I'm a Full Stack Web Developer who enjoys building dependable systems around complex workflows, structured data, and the people who rely on them every day.</WaveWords></p>
          <p><WaveWords>For the last <strong>5+ years</strong>, I have specialized in Full Stack Web Development. I currently work at the <strong>National Informatics Centre</strong>, contributing to digital services for the <strong>High Court of Jharkhand.</strong></WaveWords></p>
          <div className="skill-list">{skills.map(skill => <span key={skill}><WaveWords>{skill}</WaveWords></span>)}</div>
        </div>
      </div>
    </section>
  )
}
