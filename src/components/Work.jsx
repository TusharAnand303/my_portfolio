import Icon from './Icon'
import WaveWords from './WaveWords'
import { motion, useReducedMotion } from 'motion/react'
import { usePortfolioContent } from '../context/PortfolioContentContext'

const projects = [
  {
    number: '01',
    category: 'Government portal - Laravel / PostgreSQL',
    title: 'High Court of Jharkhand Website.',
    description: 'Contributing to the digital presence of the High Court of Jharkhand through reliable web engineering and backend-focused development.',
    tags: ['Laravel', 'PostgreSQL', 'PHP'],
    accent: 'lime',
    url: 'https://jharkhandhighcourt.nic.in/',
    cta: 'Visit official website',
    facts: [
      { label: 'Contribution', value: 'Technical team lead' },
      { label: 'Focus', value: 'Public information access' },
      { label: 'Delivery', value: 'Official live website' },
    ],
    preview: {
      eyebrow: 'Official service',
      title: 'Reliable access to official court information.',
      steps: ['Find information', 'Review details', 'Access the service'],
    },
  },
  {
    number: '02',
    category: 'Citizen service - High Court project',
    title: 'Online Certified Application.',
    description: 'Working on an online application service designed to support clear, accessible, and dependable certificate-related workflows.',
    tags: ['Laravel', 'REST APIs', 'Workflows'],
    accent: 'coral',
    url: 'https://jharkhandhighcourt.nic.in/occ/public/home.php',
    cta: 'Open certified-copy service',
    facts: [
      { label: 'Contribution', value: 'Application workflow team' },
      { label: 'Focus', value: 'Clear citizen service journey' },
      { label: 'Delivery', value: 'High Court online service' },
    ],
    preview: {
      eyebrow: 'Online service',
      title: 'A clear route through a formal request.',
      steps: ['Choose the copy', 'Provide details', 'Follow the request'],
    },
  },
  {
    number: '03',
    category: 'Organisation website - Live project',
    title: 'Hazaribag Jesuits Website.',
    description: 'Developed the public-facing website for Hazaribag Jesuits, creating a clear and accessible online presence for the organisation.',
    tags: ['Web Development', 'Responsive UI', 'Live Website'],
    accent: 'blue',
    url: 'https://hazaribagjesuits.org/',
    cta: 'Visit live website',
    facts: [
      { label: 'Contribution', value: 'Website development' },
      { label: 'Focus', value: 'Responsive content experience' },
      { label: 'Delivery', value: 'Live organisation website' },
    ],
    preview: {
      eyebrow: 'Organisation website',
      title: 'A responsive public presence for the organisation.',
      steps: ['Understand the organisation', 'Explore its work', 'Find key information'],
    },
  },
  {
    number: '04',
    category: 'Chrome extension - Developer tool',
    title: 'TruAPI - API Tester.',
    description: 'A Chrome extension I built to make API testing quick, reliable, and accessible directly in the browser.',
    tags: ['Chrome Extension', 'API Testing', 'Developer Tool'],
    accent: 'lime',
    url: 'https://chromewebstore.google.com/detail/truapi-api-tester/mdojkabelcmomcjapnlbhmioeneeeomb',
    cta: 'Install TruAPI',
    facts: [
      { label: 'Contribution', value: 'Creator and developer' },
      { label: 'Focus', value: 'Browser-based API testing' },
      { label: 'Delivery', value: 'Chrome Web Store' },
    ],
    preview: {
      eyebrow: 'Developer utility',
      title: 'Focused API testing inside the browser.',
      steps: ['Build the request', 'Test the endpoint', 'Inspect the response'],
    },
  },
]

const capabilities = [
  { title: 'Reliable data-driven application systems.', description: 'Designing and maintaining application layers that connect structured data, business logic, and dependable user journeys.' },
  { title: 'Responsive platforms for everyday access.', description: 'Creating maintainable web experiences with clean backend integrations and a focus on performance and clarity.' },
  { title: 'From requirements to dependable delivery.', description: 'Bringing together application development experience from public sector, remote, and enterprise technology environments.' },
]

function ProjectProof({ project }) {
  return (
    <div className="project-proof">
      <p className="proof-kicker"><WaveWords>{project.preview.eyebrow}</WaveWords></p>
      <h4><WaveWords>{project.preview.title}</WaveWords></h4>
      <ol className="proof-steps">
        {project.preview.steps.map((step, index) => <li key={step}><span className="proof-step-number"><WaveWords>{`0${index + 1}`}</WaveWords></span><span className="proof-step-copy"><WaveWords>{step}</WaveWords></span></li>)}
      </ol>
      <dl className="project-facts">
        {project.facts.map((fact) => <div key={fact.label}><dt><WaveWords>{fact.label}</WaveWords></dt><dd><WaveWords>{fact.value}</WaveWords></dd></div>)}
      </dl>
    </div>
  )
}

function ProjectCard({ project, index }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      className={'project project-' + project.accent}
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : index * 0.035, ease: [0.22, 1, 0.36, 1] } }}
      whileHover={reduceMotion ? undefined : { y: -4, transition: { type: 'spring', stiffness: 430, damping: 32, mass: 0.35 } }}
      viewport={{ once: true, amount: 0.18 }}
      data-cursor="VIEW"
    >
      <div className="project-info">
        <p className="project-meta"><span className="project-number"><WaveWords>{project.number}</WaveWords></span><span className="project-category"><WaveWords>{project.category}</WaveWords></span></p>
        <h3><WaveWords>{project.title}</WaveWords></h3>
        <p className="project-description"><WaveWords>{project.description}</WaveWords></p>
        <div className="project-footer">
          <div className="project-tags" aria-label={'Technologies used for ' + project.title}>{project.tags.map((tag) => <span key={tag}><WaveWords>{tag}</WaveWords></span>)}</div>
          {project.url && (
            <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN" aria-label={project.cta + ': ' + project.title}><span><WaveWords>{project.cta}</WaveWords></span><Icon name="external" size={14} /></a>
          )}
        </div>
      </div>
      <ProjectProof project={project} />
    </motion.article>
  )
}

export default function Work() {
  const reduceMotion = useReducedMotion()
  const { content } = usePortfolioContent()
  const { work } = content
  const projects = content.projects
    .filter((project) => project.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((project, index) => ({ ...project, number: String(index + 1).padStart(2, '0') }))
  const workCapabilities = (content.capabilities || capabilities)
    .filter((capability) => capability.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <section className="work section-shell" id="work">
      <div className="section-heading"><span><WaveWords>{work.sectionNumber}</WaveWords></span><p><WaveWords>{work.sectionLabel}</WaveWords></p></div>
      <div className="work-heading">
        <div>
          <h2><WaveWords>{work.headingLineOne}<br /><i>{work.headingAccent}</i></WaveWords></h2>
        </div>
        <a href={work.discussionAction.href} className="text-link"><span><WaveWords>{work.discussionAction.label}</WaveWords></span><Icon name="arrow" size={16} /></a>
      </div>
      <div className="project-list">
        {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.id || project.number} />)}
      </div>
      <div className="capabilities">
        <div className="capabilities-heading"><p className="eyebrow"><span className="pulse" /><span><WaveWords>{work.focusEyebrow}</WaveWords></span></p><h3><WaveWords>{work.focusHeadingLineOne}<br /><i>{work.focusHeadingAccent}</i></WaveWords></h3></div>
        <div className="capability-grid">
          {workCapabilities.map((capability, index) => <motion.article className="capability-card" whileHover={reduceMotion ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} key={capability.id || capability.title}><span><WaveWords>{`0${index + 1}`}</WaveWords></span><h4><WaveWords>{capability.title}</WaveWords></h4><p><WaveWords>{capability.description}</WaveWords></p></motion.article>)}
        </div>
      </div>
    </section>
  )
}
