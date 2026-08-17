const skills = ['Laravel', 'PHP', 'PostgreSQL', 'REST APIs', 'JavaScript', 'React', 'MySQL', 'Git', 'Linux', 'System Design', 'API', 'CSS - Tailwind Css & many more.']

export default function About() {
  return (
    <section className="about section-shell" id="about">
      <div className="section-heading"><span>01</span><p>About me</p></div>
      <div className="about-grid">
        <div><h2>Thoughtful Web Developer, <i>built for public impact.</i></h2></div>
        <div className="about-content">
          <p>I'm a Full Stack Web Developer who enjoys building dependable systems around complex workflows, structured data, and the people who rely on them every day.</p>
          <p>For the last <strong>5+ years</strong>, I have specialized in Full Stack Web Development. I currently working at <strong>National Informatics Centre</strong>, on <strong>High Court of Jharkhand,</strong> contributing to digital services for the High Court of Jharkhand.</p>
          <div className="skill-list">{skills.map(skill => <span key={skill}>{skill}</span>)}</div>
        </div>
      </div>
    </section>
  )
}
