import WaveWords from './WaveWords'

const roles = [
  { period: 'CURRENT - WORKING', role: 'Full Stack Web Developer', company: 'National Informatics Centre (NIC) - High Court Department', note: 'Contributing to High Court of Jharkhand digital projects, including the public website and Online Certified Application platform.' },
  { period: 'PREVIOUS - REMOTE', role: 'Web Developer (Lead)', company: 'Nasya IT', note: 'Worked remotely on web development assignments, collaborating on feature delivery and application support.' },
  { period: 'PREVIOUS - KOLKATA', role: 'Software Engineer Trainee', company: 'Cognizant Technology Solutions', note: 'Contributed to enterprise software delivery within a collaborative technology and services environment.' },
]

export default function Experience() {
  return (
    <section className="experience section-shell" id="experience">
      <div className="section-heading"><span><WaveWords>04</WaveWords></span><p><WaveWords>Experience</WaveWords></p></div>
      <div className="experience-top"><h2><WaveWords>Five years+ of<br /><i>meaningful momentum.</i></WaveWords></h2><p><WaveWords>I care about quality at every layer - from a precise data model to a dependable, intuitive public service.</WaveWords></p></div>
      <div className="experience-list">
        {roles.map((item, index) => <article className="role" key={item.period}><span className="role-number"><WaveWords>{`0${index + 1}`}</WaveWords></span><p className="period"><WaveWords>{item.period}</WaveWords></p><div><h3><WaveWords>{item.role}</WaveWords></h3><p className="company"><WaveWords>{item.company}</WaveWords></p></div><p className="role-note"><WaveWords>{item.note}</WaveWords></p></article>)}
      </div>
    </section>
  )
}
