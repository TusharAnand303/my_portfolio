import WaveWords from './WaveWords'

const qualifications = [
  { period: '2020 - 2022', degree: 'Master of Computer Applications', short: 'MCA' },
  { period: '2017 - 2020', degree: 'Bachelor of Computer Applications', short: 'BCA' },
]

export default function Education() {
  return (
    <section className="education section-shell" id="education">
      <div className="section-heading"><span><WaveWords>02</WaveWords></span><p><WaveWords>Education</WaveWords></p></div>
      <div className="education-heading">
        <h2><WaveWords>Academic foundations for<br /><i>practical technology.</i></WaveWords></h2>
        <p><WaveWords>Formal computer applications education, strengthened by hands-on software engineering experience.</WaveWords></p>
      </div>
      <div className="qualification-list">
        {qualifications.map((qualification, index) => (
          <article className="qualification" key={qualification.short}>
            <span className="qualification-number"><WaveWords>{`0${index + 1}`}</WaveWords></span>
            <p className="qualification-period"><WaveWords>{qualification.period}</WaveWords></p>
            <h3><WaveWords>{qualification.degree}</WaveWords></h3>
            <span className="qualification-short"><WaveWords>{qualification.short}</WaveWords></span>
          </article>
        ))}
      </div>
    </section>
  )
}
