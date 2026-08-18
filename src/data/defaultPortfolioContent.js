export const supportedSkills = [
  { id: 'vscode', iconKey: 'vscode', label: 'VS Code', enabled: true, order: 0, size: 'planet-xl' },
  { id: 'nodejs', iconKey: 'nodejs', label: 'Node.js', enabled: true, order: 1, size: 'planet-lg' },
  { id: 'github', iconKey: 'github', label: 'GitHub', enabled: true, order: 2, size: 'planet-md' },
  { id: 'mongodb', iconKey: 'mongodb', label: 'MongoDB', enabled: true, order: 3, size: 'planet-lg' },
  { id: 'mysql', iconKey: 'mysql', label: 'MySQL', enabled: true, order: 4, size: 'planet-md' },
  { id: 'laravel', iconKey: 'laravel', label: 'Laravel', enabled: true, order: 5, size: 'planet-lg' },
  { id: 'express', iconKey: 'express', label: 'Express', enabled: true, order: 6, size: 'planet-md' },
  { id: 'postgresql', iconKey: 'postgresql', label: 'PostgreSQL', enabled: true, order: 7, size: 'planet-lg' },
  { id: 'php', iconKey: 'php', label: 'PHP', enabled: true, order: 8, size: 'planet-md' },
  { id: 'git', iconKey: 'git', label: 'Git', enabled: true, order: 9, size: 'planet-md' },
  { id: 'react', iconKey: 'react', label: 'React', enabled: true, order: 10, size: 'planet-lg' },
  { id: 'javascript', iconKey: 'javascript', label: 'JavaScript', enabled: true, order: 11, size: 'planet-md' },
  { id: 'html', iconKey: 'html', label: 'HTML5', enabled: true, order: 12, size: 'planet-md' },
  { id: 'css', iconKey: 'css', label: 'CSS', enabled: true, order: 13, size: 'planet-md' },
]

const defaultProjects = [
  {
    id: 'jharkhand-high-court',
    enabled: true,
    order: 0,
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
    id: 'online-certified-application',
    enabled: true,
    order: 1,
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
    id: 'hazaribag-jesuits',
    enabled: true,
    order: 2,
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
    id: 'truapi-api-tester',
    enabled: true,
    order: 3,
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

export const defaultPortfolioContent = {
  schemaVersion: 1,
  hero: {
    eyebrowPrefix: 'Currently building at',
    organisation: 'National Informatics Centre, Ranchi',
    headingLineOne: 'Full Stack Web',
    headingAccent: 'Developer',
    headingSuffix: 'with clear vision.',
    description: "I'm Tushar Anand, a full stack web developer with 5+ years of experience building reliable websites, APIs, SaaS applications, and high-impact digital platforms.",
    highlights: [
      { id: 'experience', value: '5+ years', label: 'Building real products' },
      { id: 'govtech', value: 'GovTech', label: 'NIC · High Court' },
      { id: 'delivery', value: 'End to end', label: 'UI · APIs · data' },
    ],
    primaryAction: { label: 'Explore my work', href: '#work' },
    conversationAction: { label: 'Start a conversation', href: 'mailto:tusharanand303@gmail.com' },
    ringText: 'FULL STACK · WEB DEVELOPER · RANCHI · FULL STACK · WEB DEVELOPER · RANCHI ·',
    artLabels: ['WEB ARCHITECTURE', 'SAAS FOR GOVERNMENT'],
    location: ['RANCHI, JHARKHAND', 'INDIA'],
    scrollLabel: 'Scroll to discover',
  },
  profile: {
    imageUrl: '',
    imagePath: '',
    imageAlt: 'Tushar Anand',
    eyebrow: 'Based in Ranchi, Jharkhand',
    summary: 'I build Full Stack Web systems that are secure, maintainable, and prepared for real-world usage - from robust database structure to clear application workflows.',
    snapshotTitle: '30-second profile',
    snapshotCode: 'HR / 01',
    snapshot: [
      { id: 'experience', value: '5+ years', label: 'Full Stack Web Development' },
      { id: 'role', value: 'NIC', label: 'Current role' },
      { id: 'impact', value: 'High Court', label: 'Public digital services' },
    ],
    recruiterAction: {
      label: 'Talk about a role',
      href: 'mailto:tusharanand303@gmail.com?subject=Portfolio%20conversation',
    },
    defaultSkillId: 'laravel',
    skillReadoutLabel: 'Selected technology',
    skillReadoutHint: 'Tap or drag an icon. It springs back.',
    details: {
      role: 'Full Stack Web Developer, NIC (National Informatics Centre)',
      department: 'High Court of Jharkhand',
      location: 'Dhurwa, Ranchi, Jharkhand - Engineers Hostel, 2nd Floor',
    },
  },
  skills: supportedSkills.map((skill) => ({ ...skill })),
  work: {
    sectionNumber: '04',
    sectionLabel: 'Projects and focus',
    headingLineOne: 'Building systems that',
    headingAccent: 'serve with confidence.',
    discussionAction: {
      label: 'Discuss a project',
      href: 'mailto:tusharanand303@gmail.com',
    },
    focusEyebrow: 'Engineering focus',
    focusHeadingLineOne: 'Across the full',
    focusHeadingAccent: 'application stack.',
  },
  projects: defaultProjects,
  capabilities: [
    {
      id: 'data-driven-systems',
      enabled: true,
      order: 0,
      title: 'Reliable data-driven application systems.',
      description: 'Designing and maintaining application layers that connect structured data, business logic, and dependable user journeys.',
    },
    {
      id: 'responsive-platforms',
      enabled: true,
      order: 1,
      title: 'Responsive platforms for everyday access.',
      description: 'Creating maintainable web experiences with clean backend integrations and a focus on performance and clarity.',
    },
    {
      id: 'dependable-delivery',
      enabled: true,
      order: 2,
      title: 'From requirements to dependable delivery.',
      description: 'Bringing together application development experience from public sector, remote, and enterprise technology environments.',
    },
  ],
  resume: {
    label: 'Download resume',
    downloadUrl: '',
    storagePath: '',
    originalName: '',
    size: 0,
    updatedAt: null,
  },
}

const isPlainObject = (value) => (
  value !== null
  && typeof value === 'object'
  && !Array.isArray(value)
  && Object.getPrototypeOf(value) === Object.prototype
)

const cloneValue = (value) => {
  if (Array.isArray(value)) return value.map(cloneValue)
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)]))
  }
  return value
}

const mergeKnownFields = (fallback, incoming) => {
  if (Array.isArray(fallback)) return Array.isArray(incoming) ? cloneValue(incoming) : cloneValue(fallback)

  if (isPlainObject(fallback)) {
    const source = isPlainObject(incoming) ? incoming : {}
    return Object.fromEntries(
      Object.entries(fallback).map(([key, value]) => [key, mergeKnownFields(value, source[key])]),
    )
  }

  if (incoming === undefined || incoming === null) return cloneValue(fallback)
  if (fallback === null) return incoming
  return typeof incoming === typeof fallback ? incoming : cloneValue(fallback)
}

const normalizeStringList = (incoming, fallback = []) => {
  if (!Array.isArray(incoming)) return cloneValue(fallback)
  return incoming.filter((value) => typeof value === 'string')
}

const normalizeExternalUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return ''
  try {
    const parsed = new URL(value)
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : ''
  } catch {
    return ''
  }
}

const normalizeLabelValueList = (incoming, fallback = []) => {
  if (!Array.isArray(incoming)) return cloneValue(fallback)

  return incoming
    .filter(isPlainObject)
    .map((item, index) => {
      const base = fallback.find((candidate) => candidate.id && candidate.id === item.id)
        || fallback[index]
        || { id: `item-${index + 1}`, value: '', label: '' }
      return mergeKnownFields(base, item)
    })
}

const normalizeSkills = (incoming) => {
  if (!Array.isArray(incoming)) return cloneValue(supportedSkills)

  const supportedById = new Map(supportedSkills.map((skill) => [skill.id, skill]))
  const supportedIconKeys = new Set(supportedSkills.map((skill) => skill.iconKey))
  const supportedSizes = new Set(['planet-sm', 'planet-md', 'planet-lg', 'planet-xl'])
  const seen = new Set()
  const normalized = incoming.flatMap((skill) => {
    if (!isPlainObject(skill) || typeof skill.id !== 'string' || seen.has(skill.id)) return []
    const fallback = supportedById.get(skill.id)
    if (!fallback) return []

    seen.add(skill.id)
    const next = mergeKnownFields(fallback, skill)
    next.id = fallback.id
    next.iconKey = supportedIconKeys.has(next.iconKey) ? next.iconKey : fallback.iconKey
    next.size = supportedSizes.has(next.size) ? next.size : fallback.size
    next.order = Number.isFinite(next.order) ? next.order : fallback.order
    return [next]
  })

  return (normalized.length ? normalized : cloneValue(supportedSkills))
    .sort((left, right) => left.order - right.order)
}

const projectTemplate = {
  id: '',
  enabled: true,
  order: 0,
  number: '',
  category: '',
  title: '',
  description: '',
  tags: [],
  accent: 'lime',
  url: '',
  cta: '',
  facts: [],
  preview: {
    eyebrow: '',
    title: '',
    steps: [],
  },
}

const normalizeProjects = (incoming) => {
  if (!Array.isArray(incoming)) return cloneValue(defaultProjects)

  const defaultsById = new Map(defaultProjects.map((project) => [project.id, project]))
  const seen = new Set()

  return incoming
    .filter(isPlainObject)
    .map((project, index) => {
      const requestedId = typeof project.id === 'string' && project.id.trim()
        ? project.id.trim()
        : `project-${index + 1}`
      const id = seen.has(requestedId) ? `${requestedId}-${index + 1}` : requestedId
      seen.add(id)

      const fallback = defaultsById.get(id) || { ...projectTemplate, id, order: index }
      const normalized = mergeKnownFields(fallback, project)
      normalized.id = id
      normalized.tags = normalizeStringList(project.tags, fallback.tags)
      normalized.facts = normalizeLabelValueList(project.facts, fallback.facts)
      normalized.preview.steps = normalizeStringList(project.preview?.steps, fallback.preview.steps)
      normalized.url = normalizeExternalUrl(project.url ?? fallback.url)
      if (!['lime', 'coral', 'blue'].includes(normalized.accent)) normalized.accent = fallback.accent
      return normalized
    })
    .sort((left, right) => left.order - right.order)
}

const normalizeCapabilities = (incoming) => {
  const fallback = defaultPortfolioContent.capabilities
  if (!Array.isArray(incoming)) return cloneValue(fallback)

  const defaultsById = new Map(fallback.map((capability) => [capability.id, capability]))
  return incoming
    .filter(isPlainObject)
    .map((capability, index) => {
      const id = typeof capability.id === 'string' && capability.id.trim()
        ? capability.id.trim()
        : `capability-${index + 1}`
      return mergeKnownFields(
        defaultsById.get(id) || { id, enabled: true, order: index, title: '', description: '' },
        { ...capability, id },
      )
    })
    .sort((left, right) => left.order - right.order)
}

export function normalizePortfolioContent(incoming = {}) {
  const source = isPlainObject(incoming) ? incoming : {}
  const normalized = mergeKnownFields(defaultPortfolioContent, source)

  normalized.hero.highlights = normalizeLabelValueList(source.hero?.highlights, defaultPortfolioContent.hero.highlights)
  normalized.hero.artLabels = normalizeStringList(source.hero?.artLabels, defaultPortfolioContent.hero.artLabels)
  normalized.hero.location = normalizeStringList(source.hero?.location, defaultPortfolioContent.hero.location)
  normalized.profile.snapshot = normalizeLabelValueList(source.profile?.snapshot, defaultPortfolioContent.profile.snapshot)
  if (!normalized.profile.imageUrl.trim()) normalized.profile.imageUrl = defaultPortfolioContent.profile.imageUrl
  normalized.skills = normalizeSkills(source.skills)
  normalized.projects = normalizeProjects(source.projects)
  normalized.capabilities = normalizeCapabilities(source.capabilities)

  return normalized
}

export default defaultPortfolioContent
