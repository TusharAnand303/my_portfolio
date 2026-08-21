import Icon from './Icon'
import WaveWords from './WaveWords'
import { usePortfolioContent } from '../context/PortfolioContentContext'

export default function Certificates() {
  const { content } = usePortfolioContent()
  const certificates = content.certificates || {}
  const items = (certificates.items || [])
    .filter((item) => item.enabled !== false && (item.title || '').trim())
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))

  if (!items.length) return null

  return (
    <section className="certificates section-shell" id="certificates">
      <div className="section-heading">
        <span><WaveWords>{certificates.sectionNumber}</WaveWords></span>
        <p><WaveWords>{certificates.sectionLabel}</WaveWords></p>
      </div>
      <div className="certificates-heading">
        <h2><WaveWords>{certificates.headingLineOne}<br /><i>{certificates.headingAccent}</i></WaveWords></h2>
        <p><WaveWords>{certificates.description}</WaveWords></p>
      </div>
      <ul className="certificate-grid">
        {items.map((item, index) => (
          <li className="certificate-card" key={item.id}>
            <div className="certificate-card-top">
              <span className="certificate-index"><WaveWords>{String(index + 1).padStart(2, '0')}</WaveWords></span>
              {item.issued && <span className="certificate-issued"><WaveWords>{item.issued}</WaveWords></span>}
            </div>
            <h3><WaveWords>{item.title}</WaveWords></h3>
            {item.issuer && <p className="certificate-issuer"><WaveWords>{item.issuer}</WaveWords></p>}
            {item.url && (
              <a
                className="certificate-link"
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="OPEN"
              >
                <span><WaveWords>{item.cta || 'View credential'}</WaveWords></span>
                <Icon name="external" size={15} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
