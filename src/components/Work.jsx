import Icon from './Icon'

const work = [
  { number: '01', type: 'GOVERNMENT PORTAL - LARAVEL / POSTGRESQL', title: 'High Court of Jharkhand Website.', description: 'Contributing to the digital presence of the High Court of Jharkhand through reliable web engineering and backend-focused development.', tags: ['Laravel', 'PostgreSQL', 'PHP'], accent: 'lime', visual: 'dashboard' },
  { number: '02', type: 'CITIZEN SERVICE - HIGH COURT PROJECT', title: 'Online Certified Application.', description: 'Working on an online application service designed to support clear, accessible, and dependable certificate-related workflows.', tags: ['Laravel', 'REST APIs', 'Workflows'], accent: 'coral', visual: 'metrics' },
  { number: '03', type: 'ORGANISATION WEBSITE - LIVE PROJECT', title: 'Hazaribag Jesuits Website.', description: 'Developed the public-facing website for Hazaribag Jesuits, creating a clear and accessible online presence for the organisation.', tags: ['Web Development', 'Responsive UI', 'Live Website'], accent: 'blue', visual: 'chart', url: 'https://hazaribagjesuits.org/' },
  { number: '04', type: 'CHROME EXTENSION - DEVELOPER TOOL', title: 'TruAPI - API Tester.', description: 'A Chrome extension I built to make API testing quick, reliable, and accessible directly in the browser.', tags: ['Chrome Extension', 'API Testing', 'Developer Tool'], accent: 'lime', visual: 'metrics', url: 'https://chromewebstore.google.com/detail/truapi-api-tester/mdojkabelcmomcjapnlbhmioeneeeomb', cta: 'Install TruAPI' },
  { number: '05', type: 'ENGINEERING FOCUS - SECURE BACKENDS', title: 'Reliable data-driven application systems.', description: 'Designing and maintaining application layers that connect structured data, business logic, and dependable user journeys.', tags: ['PostgreSQL', 'Data Modeling', 'Security'], accent: 'lime', visual: 'dashboard' },
  { number: '06', type: 'ENGINEERING FOCUS - WEB PLATFORMS', title: 'Responsive platforms for everyday access.', description: 'Creating maintainable web experiences with clean backend integrations and a focus on performance and clarity.', tags: ['Laravel', 'JavaScript', 'Responsive UI'], accent: 'coral', visual: 'metrics' },
  { number: '07', type: 'ENGINEERING FOCUS - APPLICATION DELIVERY', title: 'From requirements to dependable delivery.', description: 'Bringing together application development experience from public sector, remote, and enterprise technology environments.', tags: ['PHP', 'Git', 'System Design'], accent: 'blue', visual: 'chart' },
]

function ProjectVisual({ type }) {
  if (type === 'dashboard') return <div className="project-visual ui-dashboard"><div className="ui-sidebar"><b /> <b /> <b /> <b /></div><div className="ui-main"><div className="ui-topline"><i /><i /></div><div className="ui-cards"><span /><span /><span /></div><div className="ui-table"><b /><b /><b /><b /></div></div></div>
  if (type === 'metrics') return <div className="project-visual ui-metrics"><div className="metric-ring"><span>98<small>%</small></span></div><div className="metric-lines"><b /><b /><b /><b /><b /><b /></div><div className="metric-bottom"><i /><i /><i /></div></div>
  return <div className="project-visual ui-chart"><div className="chart-grid"><i /><i /><i /><i /></div><svg viewBox="0 0 360 160" preserveAspectRatio="none"><path d="M0,138 C40,115 52,125 79,104 S123,110 150,77 S205,95 225,65 S277,76 300,39 S334,49 360,15" /></svg><div className="chart-labels"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div></div>
}

export default function Work() {
  return (
    <section className="work section-shell" id="work">
      <div className="section-heading"><span>04</span><p>Projects and focus</p></div>
      <div className="work-heading"><h2>Building systems that<br /><i>serve with confidence.</i></h2><a href="mailto:tusharanand303@gmai.com" className="text-link">Discuss a project <Icon name="arrow" size={16} /></a></div>
      <div className="project-list">
        {work.map(project => <article className={`project project-${project.accent}`} key={project.number}><div className="project-info"><p className="project-meta"><span>{project.number}</span>{project.type}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="project-footer"><div>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className={project.cta ? 'project-install' : undefined} href={project.url || '#contact'} target={project.url ? '_blank' : undefined} rel={project.url ? 'noreferrer' : undefined} aria-label={project.url ? `Visit ${project.title}` : `Talk about ${project.title}`}>{project.cta && <span>{project.cta}</span>}<Icon name={project.url ? 'external' : 'arrow'} size={project.cta ? 15 : 20} /></a></div></div><ProjectVisual type={project.visual} /></article>)}
      </div>
    </section>
  )
}
