import WaveWords from './WaveWords'
import { usePortfolioContent } from '../context/PortfolioContentContext'

export default function Education() {
  const { content } = usePortfolioContent()
  const education = content.education || {}
  const qualifications = (education.qualifications || [])
    .filter((qualification) => qualification.enabled !== false && (qualification.degree || '').trim())
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))

  if (!qualifications.length) return null

  return (
    <section className="education section-shell" id="education">
      <div className="section-heading">
        <span><WaveWords>{education.sectionNumber}</WaveWords></span>
        <p><WaveWords>{education.sectionLabel}</WaveWords></p>
      </div>
      <div className="education-heading">
        <h2><WaveWords>{education.headingLineOne}<br /><i>{education.headingAccent}</i></WaveWords></h2>
        <p><WaveWords>{education.description}</WaveWords></p>
      </div>
      <ol className="edu-timeline">
        {qualifications.map((qualification, index) => (
          <li className="edu-entry" key={qualification.id}>
            <div className="edu-entry-rail" aria-hidden="true">
              <span className="edu-entry-dot" />
            </div>
            <div className="edu-entry-body">
              <p className="edu-entry-period">
                <span className="edu-entry-index"><WaveWords>{String(index + 1).padStart(2, '0')}</WaveWords></span>
                <WaveWords>{qualification.period}</WaveWords>
              </p>
              <h3>
                <WaveWords>{qualification.degree}</WaveWords>
                {qualification.short && <span className="edu-entry-badge"><WaveWords>{qualification.short}</WaveWords></span>}
              </h3>
              <p className="edu-entry-college">
                <WaveWords>{qualification.college}</WaveWords>
                {qualification.location && <i><WaveWords>{qualification.location}</WaveWords></i>}
              </p>
              {qualification.focus && <p className="edu-entry-focus"><WaveWords>{qualification.focus}</WaveWords></p>}
            </div>
            {qualification.marks && (
              <p className="edu-entry-score">
                <span><WaveWords>{'% Scored'}</WaveWords></span>
                <strong><WaveWords>{qualification.marks}</WaveWords></strong>
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
