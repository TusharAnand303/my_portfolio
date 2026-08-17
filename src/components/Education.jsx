const qualifications = [
  { period: '2020 - 2022', degree: 'Master of Computer Applications', short: 'MCA' },
  { period: '2017 - 2020', degree: 'Bachelor of Computer Applications', short: 'BCA' },
]

export default function Education() {
  return (
    <section className="education section-shell" id="education">
      <div className="section-heading"><span>02</span><p>Education</p></div>
      <div className="education-heading">
        <h2>Academic foundations for<br /><i>practical technology.</i></h2>
        <p>Formal computer applications education, strengthened by hands-on software engineering experience.</p>
      </div>
      <div className="qualification-list">
        {qualifications.map((qualification, index) => (
          <article className="qualification" key={qualification.short}>
            <span className="qualification-number">0{index + 1}</span>
            <p className="qualification-period">{qualification.period}</p>
            <h3>{qualification.degree}</h3>
            <span className="qualification-short">{qualification.short}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
