const roles = [
  { period: 'CURRENT - WORKING', role: 'Full Stack Web Developer', company: 'National Informatics Centre (NIC) - High Court Department', note: 'Contributing to High Court of Jharkhand digital projects, including the public website and Online Certified Application platform.' },
  { period: 'PREVIOUS - REMOTE', role: 'Web Developer ( Lead )', company: 'Nasya IT', note: 'Worked remotely on web development assignments, collaborating on feature delivery and application support.' },
  { period: 'PREVIOUS - KOLKATA', role: 'Software Engineer Trainee', company: 'Cognizant Technology Solutions', note: 'Contributed to enterprise software delivery within a collaborative technology and services environment.' },
]

export default function Experience() {
  return (
    <section className="experience section-shell" id="experience">
      <div className="section-heading"><span>03</span><p>Experience</p></div>
      <div className="experience-top"><h2>Five years+ of<br /><i>meaningful momentum.</i></h2><p>I care about quality at every layer - from a precise data model to a dependable, intuitive public service.</p></div>
      <div className="experience-list">
        {roles.map((item, index) => <article className="role" key={item.period}><span className="role-number">0{index + 1}</span><p className="period">{item.period}</p><div><h3>{item.role}</h3><p className="company">{item.company}</p></div><p className="role-note">{item.note}</p></article>)}
      </div>
    </section>
  )
}
