import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { auth, db } from '../../firebase.js'
import {
  defaultPortfolioContent,
  normalizePortfolioContent,
  supportedSkills,
} from '../data/defaultPortfolioContent.js'
import './admin.css'

const tabs = [
  { id: 'hero', label: 'Hero' },
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'files', label: 'Files' },
]

const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const deleteCloudinaryUpload = async (deleteToken) => {
  if (!deleteToken) return false
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/delete_by_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: deleteToken }),
  })
  if (!response.ok) throw new Error('Cloudinary could not delete this asset.')
  return true
}

const clone = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

const toPlainContent = (value) => {
  const normalized = normalizePortfolioContent(value || defaultPortfolioContent)
  const plain = JSON.parse(JSON.stringify(normalized))
  delete plain.updatedAt
  delete plain.publishedAt
  return plain
}

const formatClockTime = (value) => {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

const createId = (prefix) => (
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
)

const renumberProjects = (projects) => projects.map((project, index) => ({
  ...project,
  number: String(index + 1).padStart(2, '0'),
  order: index,
}))

const createProject = () => ({
  id: createId('project'),
  number: '01',
  order: 0,
  enabled: true,
  category: '',
  title: '',
  description: '',
  tags: [],
  accent: 'lime',
  url: '',
  cta: 'Visit project',
  facts: [
    { label: 'Contribution', value: '' },
    { label: 'Focus', value: '' },
    { label: 'Delivery', value: '' },
  ],
  preview: {
    eyebrow: 'Project preview',
    title: '',
    steps: ['', '', ''],
  },
})

const describeAuthError = (error) => {
  if (error?.code === 'auth/too-many-requests') return 'Too many attempts. Please wait a moment and try again.'
  if (error?.code === 'auth/network-request-failed') return 'You appear to be offline. Check your connection and try again.'
  return 'That email or password did not work.'
}

function AdminField({ label, hint, as = 'input', className = '', children, ...props }) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const Component = as

  return (
    <label className={`admin-field ${className}`.trim()} htmlFor={id}>
      <span>{label}</span>
      {as === 'select' ? (
        <select id={id} aria-describedby={hintId} {...props}>{children}</select>
      ) : (
        <Component id={id} aria-describedby={hintId} {...props} />
      )}
      {hint && <small id={hintId}>{hint}</small>}
    </label>
  )
}

function ToggleField({ label, description, checked, onChange }) {
  const id = useId()

  return (
    <label className="admin-toggle" htmlFor={id}>
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  )
}

function ConfirmDialog({ config, onDismiss }) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!config || !dialog) return undefined

    if (!dialog.open) dialog.showModal()
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 0)

    return () => {
      window.clearTimeout(focusTimer)
      if (dialog.open) dialog.close()
    }
  }, [config])

  if (!config) return null

  const confirm = async () => {
    setBusy(true)
    try {
      await config.onConfirm?.()
      onDismiss()
    } catch {
      // The action owns its user-facing error state. Keeping the dialog open
      // lets the administrator retry without losing context.
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="admin-dialog"
      aria-labelledby="admin-dialog-title"
      aria-describedby="admin-dialog-copy"
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onDismiss()
      }}
    >
      <p className="admin-kicker">Confirm action</p>
      <h2 id="admin-dialog-title">{config.title}</h2>
      <p id="admin-dialog-copy">{config.description}</p>
      <div className="admin-dialog-actions">
        <button ref={cancelRef} type="button" className="admin-secondary" onClick={onDismiss} disabled={busy}>Cancel</button>
        <button type="button" className={config.danger ? 'admin-danger' : 'admin-primary'} onClick={confirm} disabled={busy}>
          {busy ? 'Working…' : config.confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

function AdminLogin({ error, onSubmit }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    try {
      await onSubmit(email.trim(), password)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin-root admin-login-shell">
      <section className="admin-login" aria-labelledby="admin-login-title">
        <p className="admin-private-mark"><span>TA</span> Private studio</p>
        <p className="admin-kicker">Portfolio control room</p>
        <h1 id="admin-login-title">Welcome back.</h1>
        <p className="admin-login-copy">Sign in to update the portfolio from this device.</p>
        <form onSubmit={submit}>
          <AdminField
            label="Email address"
            type="email"
            inputMode="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <AdminField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button className="admin-primary admin-login-button" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in securely'}
          </button>
        </form>
        <small className="admin-login-note">There is no public sign-up for this area.</small>
      </section>
    </main>
  )
}

function LoadingScreen({ label = 'Opening your studio…' }) {
  return (
    <main className="admin-root admin-loading" aria-live="polite">
      <span className="admin-loader" aria-hidden="true" />
      <p>{label}</p>
    </main>
  )
}

function ContentLoadError({ message, onRetry, onLogout }) {
  return (
    <main className="admin-root admin-login-shell">
      <section className="admin-login admin-load-error" aria-labelledby="admin-load-error-title">
        <p className="admin-private-mark"><span>TA</span> Private studio</p>
        <p className="admin-kicker">Portfolio content</p>
        <h1 id="admin-load-error-title">Nothing was changed.</h1>
        <p className="admin-login-copy">{message}</p>
        <div className="admin-login-actions">
          <button type="button" className="admin-primary" onClick={onRetry}>Try again</button>
          <button type="button" className="admin-secondary" onClick={onLogout}>Log out</button>
        </div>
      </section>
    </main>
  )
}

function SectionCard({ eyebrow, title, description, children }) {
  return (
    <section className="admin-card">
      <header className="admin-card-heading">
        <p className="admin-kicker">{eyebrow}</p>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </header>
      {children}
    </section>
  )
}

function HeroEditor({ value, onChange }) {
  const hero = value || {}
  const highlights = Array.isArray(hero.highlights) ? hero.highlights : []
  const update = (key, nextValue) => onChange({ ...hero, [key]: nextValue })
  const updateHighlight = (index, key, nextValue) => {
    const next = highlights.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [key]: nextValue } : item
    ))
    update('highlights', next)
  }

  return (
    <SectionCard
      eyebrow="01 / Hero"
      title="First-screen message"
      description="Keep it direct. These are the first words a recruiter sees."
    >
      <div className="admin-form-grid">
        <AdminField label="Status line" value={hero.eyebrowPrefix || ''} onChange={(event) => update('eyebrowPrefix', event.target.value)} maxLength={120} />
        <AdminField label="Status emphasis" value={hero.organisation || ''} onChange={(event) => update('organisation', event.target.value)} maxLength={80} />
        <AdminField label="Heading — line one" value={hero.headingLineOne || ''} onChange={(event) => update('headingLineOne', event.target.value)} required maxLength={80} />
        <AdminField label="Animated word" value={hero.headingAccent || ''} onChange={(event) => update('headingAccent', event.target.value)} required maxLength={40} hint="This word keeps the kinetic hero animation." />
        <AdminField label="Heading ending" value={hero.headingSuffix || ''} onChange={(event) => update('headingSuffix', event.target.value)} maxLength={80} />
        <AdminField className="admin-field-wide" label="Introduction" as="textarea" rows="5" value={hero.description || ''} onChange={(event) => update('description', event.target.value)} required maxLength={520} />
      </div>

      <div className="admin-subsection-heading">
        <div><p className="admin-kicker">Recruiter proof</p><h3>Three quick signals</h3></div>
      </div>
      <div className="admin-repeat-grid">
        {highlights.map((highlight, index) => (
          <div className="admin-repeat-card" key={highlight.id || index}>
            <span className="admin-order-number">{String(index + 1).padStart(2, '0')}</span>
            <AdminField label="Value" value={highlight.value || ''} onChange={(event) => updateHighlight(index, 'value', event.target.value)} maxLength={40} />
            <AdminField label="Label" value={highlight.label || ''} onChange={(event) => updateHighlight(index, 'label', event.target.value)} maxLength={80} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function AssetUploader({ kind, current, onUploaded, onRequestRemove }) {
  const inputId = useId()
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const taskRef = useRef(null)
  const isImage = kind === 'image'
  const maxBytes = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024
  const accept = isImage ? 'image/jpeg,image/png,image/webp' : 'application/pdf,.pdf'

  useEffect(() => () => taskRef.current?.abort(), [])

  const chooseFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const validType = isImage
      ? ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      : file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

    if (!validType) {
      setError(isImage ? 'Choose a JPG, PNG or WebP image.' : 'Choose a PDF file.')
      return
    }
    if (file.size > maxBytes) {
      setError(`Keep this file under ${isImage ? '5 MB' : '10 MB'}.`)
      return
    }

    setError('')
    setProgress(0)
    setUploading(true)

    const normalizedName = file.name
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    const imageExtension = file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg'
    const sourceBase = normalizedName.replace(/\.[^.]+$/, '').slice(0, 72)
    const safeName = `${sourceBase || (isImage ? 'profile-image' : 'resume')}${isImage ? imageExtension : '.pdf'}`

    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
      setUploading(false)
      setError('Cloudinary is not configured. Add the cloud name and unsigned upload preset to your .env file.')
      return
    }

    const folder = isImage ? 'portfolio/profile' : 'portfolio/resume'
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', cloudinaryUploadPreset)
    formData.append('folder', folder)
    formData.append('public_id', `${Date.now()}-${safeName.replace(/\.[^.]+$/, '')}${isImage ? '' : '.pdf'}`)

    const request = new XMLHttpRequest()
    taskRef.current = request
    request.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/${isImage ? 'image' : 'raw'}/upload`)
    request.upload.addEventListener('progress', (progressEvent) => {
      if (progressEvent.lengthComputable) {
        setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
      }
    })
    request.addEventListener('error', () => {
      setUploading(false)
      setError('Upload failed. Check your connection and Cloudinary settings, then try again.')
    })
    request.addEventListener('abort', () => {
      setUploading(false)
      setError('Upload cancelled.')
    })
    request.addEventListener('load', () => {
      if (request.status < 200 || request.status >= 300) {
        setUploading(false)
        setError('Upload failed. Check that the Cloudinary upload preset is unsigned and allows PDF raw uploads.')
        return
      }

      try {
        const result = JSON.parse(request.responseText)
        onUploaded({
          downloadUrl: result.secure_url,
          storagePath: result.public_id,
          deleteToken: result.delete_token || '',
          originalName: file.name,
          size: file.size,
          contentType: isImage ? file.type : 'application/pdf',
          updatedAt: new Date().toISOString(),
        })
        setProgress(100)
      } catch {
        setError('The file uploaded, but Cloudinary returned an invalid response. Please try again.')
      } finally {
        setUploading(false)
        taskRef.current = null
      }
    })
    request.send(formData)
  }

  return (
    <div className="admin-uploader">
      {isImage && current?.url && (
        <div className="admin-image-preview"><img src={current.url} alt="Current profile preview" /></div>
      )}
      {!isImage && current?.url && (
        <a className="admin-file-preview" href={current.url} target="_blank" rel="noreferrer">
          <span aria-hidden="true">PDF</span>
          <strong>{current.name || 'Current resume'}</strong>
          <small>Open current file</small>
        </a>
      )}
      <label className="admin-upload-control" htmlFor={inputId}>
        <span>{uploading ? `Uploading ${progress}%` : current?.url ? `Replace ${isImage ? 'image' : 'resume'}` : `Upload ${isImage ? 'image' : 'resume'}`}</span>
        <input id={inputId} type="file" accept={accept} onChange={chooseFile} disabled={uploading} />
      </label>
      {uploading && (
        <div className="admin-upload-progress" role="progressbar" aria-label={`${isImage ? 'Image' : 'Resume'} upload progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
          <i style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="admin-upload-note">{isImage ? 'JPG, PNG or WebP · maximum 5 MB' : 'PDF only · maximum 10 MB'}</p>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {current?.url && <button className="admin-text-danger" type="button" onClick={onRequestRemove}>Remove from draft</button>}
    </div>
  )
}

function ProfileEditor({ value, onChange, requestConfirm, notify }) {
  const profile = value || {}
  const imageHistory = Array.isArray(profile.imageHistory) ? profile.imageHistory : []
  const details = profile.details || {}
  const snapshot = Array.isArray(profile.snapshot) ? profile.snapshot : []
  const update = (key, nextValue) => onChange({ ...profile, [key]: nextValue })
  const updateDetails = (key, nextValue) => update('details', { ...details, [key]: nextValue })
  const updateSnapshot = (index, key, nextValue) => {
    update('snapshot', snapshot.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [key]: nextValue } : item
    )))
  }

  const uploaded = (asset) => {
    const nextImage = {
      url: asset.downloadUrl,
      path: asset.storagePath,
      deleteToken: asset.deleteToken,
      name: asset.originalName,
      uploadedAt: asset.updatedAt,
    }
    const history = [nextImage, ...imageHistory.filter((image) => image.url !== nextImage.url)]
    onChange({
      ...profile,
      imageUrl: asset.downloadUrl,
      imagePath: asset.storagePath,
      imageName: asset.originalName,
      imageHistory: history,
    })
    notify('Image uploaded. Save the draft when you are ready.')
  }

  const requestRemove = () => requestConfirm({
    title: 'Remove the profile image?',
    description: 'This removes the image from your draft. The live portfolio will not change until you publish.',
    confirmLabel: 'Remove from draft',
    danger: true,
    onConfirm: () => onChange({ ...profile, imageUrl: '', imagePath: '', imageName: '' }),
  })

  const selectImage = (image) => onChange({
    ...profile,
    imageUrl: image.url,
    imagePath: image.path,
    imageName: image.name,
  })

  const requestDeleteImage = (image) => requestConfirm({
    title: 'Delete this Cloudinary image?',
    description: image.deleteToken
      ? 'This will delete the image from Cloudinary and remove it from your studio history.'
      : 'This older upload has no active delete token. Remove it from the studio history, then delete the file manually in Cloudinary.',
    confirmLabel: 'Delete image',
    danger: true,
    onConfirm: async () => {
      if (image.deleteToken) {
        try {
          await deleteCloudinaryUpload(image.deleteToken)
        } catch (error) {
          notify(error.message || 'Cloudinary could not delete this image.', 'error')
          throw error
        }
      }
      removeImage(image)
    },
  })

  const removeImage = (image) => {
    const nextHistory = imageHistory.filter((item) => item.url !== image.url)
    const isCurrent = profile.imageUrl === image.url
    const replacement = isCurrent ? nextHistory[0] : null
    onChange({
      ...profile,
      imageUrl: replacement?.url || (isCurrent ? '' : profile.imageUrl),
      imagePath: replacement?.path || (isCurrent ? '' : profile.imagePath),
      imageName: replacement?.name || (isCurrent ? '' : profile.imageName),
      imageHistory: nextHistory,
    })
  }

  return (
    <>
      <SectionCard eyebrow="02 / Profile" title="Photo and profile" description="Keep your role, location and recruiter summary current.">
        <div className="admin-profile-layout">
          <AssetUploader
            kind="image"
            current={{ url: profile.imageUrl, name: profile.imageName }}
            onUploaded={uploaded}
            onRequestRemove={requestRemove}
          />
          {imageHistory.length > 0 && (
            <div className="admin-image-history" aria-label="Previously uploaded profile images">
              <div className="admin-image-history-heading">
                <strong>Previous images</strong>
                <small>Select one to make it the profile picture.</small>
              </div>
              <div className="admin-image-history-grid">
                {imageHistory.map((image) => (
                  <div className={`admin-image-history-item${profile.imageUrl === image.url ? ' is-current' : ''}`} key={image.url}>
                    <button type="button" className="admin-image-history-select" onClick={() => selectImage(image)} aria-label={`Use ${image.name || 'this image'} as profile picture`}>
                      <img src={image.url} alt={image.name || 'Previously uploaded profile image'} />
                    </button>
                    <button type="button" className="admin-image-history-delete" onClick={() => requestDeleteImage(image)} aria-label={`Delete ${image.name || 'this image'} from Cloudinary`}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="admin-form-grid">
            <AdminField label="Image description" value={profile.imageAlt || ''} onChange={(event) => update('imageAlt', event.target.value)} required maxLength={120} hint="Describe the portrait for screen-reader users." />
            <AdminField label="Location line" value={profile.eyebrow || ''} onChange={(event) => update('eyebrow', event.target.value)} maxLength={120} />
            <AdminField className="admin-field-wide" label="Profile summary" as="textarea" rows="5" value={profile.summary || ''} onChange={(event) => update('summary', event.target.value)} maxLength={600} />
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Profile details" title="Current role">
        <div className="admin-form-grid">
          <AdminField label="Role" value={details.role || ''} onChange={(event) => updateDetails('role', event.target.value)} maxLength={160} />
          <AdminField label="Department" value={details.department || ''} onChange={(event) => updateDetails('department', event.target.value)} maxLength={160} />
          <AdminField className="admin-field-wide" label="Office / location" as="textarea" rows="3" value={details.location || ''} onChange={(event) => updateDetails('location', event.target.value)} maxLength={260} />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Recruiter snapshot" title="30-second profile">
        <div className="admin-repeat-grid">
          {snapshot.map((item, index) => (
            <div className="admin-repeat-card" key={item.id || index}>
              <span className="admin-order-number">{String(index + 1).padStart(2, '0')}</span>
              <AdminField label="Value" value={item.value || ''} onChange={(event) => updateSnapshot(index, 'value', event.target.value)} maxLength={40} />
              <AdminField label="Label" value={item.label || ''} onChange={(event) => updateSnapshot(index, 'label', event.target.value)} maxLength={80} />
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}

const getSupportedSkillOptions = () => (Array.isArray(supportedSkills) ? supportedSkills : []).map((skill) => {
  if (typeof skill === 'string') return { id: skill, iconKey: skill, label: skill }
  const id = skill.id || skill.iconKey || skill.name
  return { ...skill, id, iconKey: skill.iconKey || id, label: skill.label || skill.name || id }
}).filter((skill) => skill.id)

function SkillsEditor({ value, onChange }) {
  const options = useMemo(getSupportedSkillOptions, [])
  const current = Array.isArray(value) ? value : []
  const rows = useMemo(() => {
    const merged = current.map((skill, index) => ({ ...skill, order: index }))
    options.forEach((option) => {
      if (!merged.some((skill) => (skill.id || skill.iconKey) === option.id)) {
        merged.push({ ...option, enabled: false, order: merged.length })
      }
    })
    return merged
  }, [current, options])

  const commit = (nextRows) => onChange(nextRows.map((skill, index) => ({ ...skill, order: index })))
  const update = (index, patch) => commit(rows.map((skill, itemIndex) => itemIndex === index ? { ...skill, ...patch } : skill))
  const move = (index, amount) => {
    const target = index + amount
    if (target < 0 || target >= rows.length) return
    const next = [...rows]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    commit(next)
  }

  return (
    <SectionCard
      eyebrow="03 / Skills"
      title="Technology orbit"
      description={`${rows.filter((skill) => skill.enabled !== false).length} technologies are currently visible.`}
    >
      <div className="admin-sort-list">
        {rows.map((skill, index) => {
          const skillId = skill.id || skill.iconKey
          return (
            <article className={skill.enabled === false ? 'admin-sort-card is-disabled' : 'admin-sort-card'} key={skillId}>
              <div className="admin-sort-card-top">
                <span className="admin-skill-mark">{(skill.label || skillId).slice(0, 2).toUpperCase()}</span>
                <div><strong>{skill.label || skillId}</strong><small>{skill.iconKey || skillId}</small></div>
                <label className="admin-mini-toggle">
                  <span className="sr-only">Show {skill.label || skillId}</span>
                  <input type="checkbox" checked={skill.enabled !== false} onChange={(event) => update(index, { enabled: event.target.checked })} />
                  <i aria-hidden="true" />
                </label>
              </div>
              <AdminField label="Display label" value={skill.label || ''} onChange={(event) => update(index, { label: event.target.value })} maxLength={40} />
              <div className="admin-sort-actions" aria-label={`Reorder ${skill.label || skillId}`}>
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${skill.label || skillId} up`}>↑ Move up</button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === rows.length - 1} aria-label={`Move ${skill.label || skillId} down`}>↓ Move down</button>
              </div>
            </article>
          )
        })}
      </div>
    </SectionCard>
  )
}

function ProjectForm({ project, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => clone(project))
  const [error, setError] = useState('')

  useEffect(() => setDraft(clone(project)), [project])

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  const updatePreview = (key, value) => setDraft((current) => ({
    ...current,
    preview: { ...(current.preview || {}), [key]: value },
  }))
  const updateFact = (index, key, value) => update('facts', (draft.facts || []).map((fact, itemIndex) => (
    itemIndex === index ? { ...fact, [key]: value } : fact
  )))
  const removeFact = (index) => update('facts', (draft.facts || []).filter((_, itemIndex) => itemIndex !== index))
  const updateStep = (index, value) => updatePreview('steps', (draft.preview?.steps || []).map((step, itemIndex) => itemIndex === index ? value : step))
  const removeStep = (index) => updatePreview('steps', (draft.preview?.steps || []).filter((_, itemIndex) => itemIndex !== index))

  const submit = (event) => {
    event.preventDefault()
    if (!draft.title?.trim()) {
      setError('Give this project a title before saving it.')
      return
    }
    setError('')
    onSave({ ...draft, title: draft.title.trim() })
  }

  return (
    <section className="admin-project-editor" aria-labelledby="project-editor-title">
      <header className="admin-project-editor-header">
        <button type="button" className="admin-back-button" onClick={onCancel}>← Back</button>
        <div><p className="admin-kicker">Project editor</p><h2 id="project-editor-title">{project.title || 'New project'}</h2></div>
      </header>
      <form onSubmit={submit}>
        <SectionCard eyebrow="Essentials" title="Project story">
          <ToggleField label="Show on the portfolio" description="Disabled projects stay saved but remain hidden." checked={draft.enabled !== false} onChange={(value) => update('enabled', value)} />
          <div className="admin-form-grid admin-form-grid-spaced">
            <AdminField label="Title" value={draft.title || ''} onChange={(event) => update('title', event.target.value)} required maxLength={100} />
            <AdminField label="Category / stack" value={draft.category || ''} onChange={(event) => update('category', event.target.value)} maxLength={140} />
            <AdminField className="admin-field-wide" label="Description" as="textarea" rows="5" value={draft.description || ''} onChange={(event) => update('description', event.target.value)} maxLength={700} />
            <AdminField label="Tags" value={(draft.tags || []).join(', ')} onChange={(event) => update('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} hint="Separate technologies with commas." />
            <AdminField label="Accent colour" as="select" value={draft.accent || 'lime'} onChange={(event) => update('accent', event.target.value)}>
              <option value="lime">Lime</option>
              <option value="coral">Coral</option>
              <option value="blue">Blue</option>
            </AdminField>
            <AdminField label="Project URL" type="url" inputMode="url" value={draft.url || ''} onChange={(event) => update('url', event.target.value)} placeholder="https://" />
            <AdminField label="Link label" value={draft.cta || ''} onChange={(event) => update('cta', event.target.value)} maxLength={80} />
          </div>
        </SectionCard>

        <SectionCard eyebrow="Card reverse" title="Project proof">
          <div className="admin-form-grid">
            <AdminField label="Preview eyebrow" value={draft.preview?.eyebrow || ''} onChange={(event) => updatePreview('eyebrow', event.target.value)} maxLength={80} />
            <AdminField label="Preview title" value={draft.preview?.title || ''} onChange={(event) => updatePreview('title', event.target.value)} maxLength={180} />
          </div>

          <div className="admin-subsection-heading">
            <div><p className="admin-kicker">Journey</p><h3>Preview steps</h3></div>
            <button type="button" className="admin-small-button" onClick={() => updatePreview('steps', [...(draft.preview?.steps || []), ''])}>+ Add step</button>
          </div>
          <div className="admin-inline-list">
            {(draft.preview?.steps || []).map((step, index) => (
              <div className="admin-inline-row" key={`step-${index}`}>
                <AdminField label={`Step ${index + 1}`} value={step} onChange={(event) => updateStep(index, event.target.value)} maxLength={100} />
                <button type="button" className="admin-icon-danger" onClick={() => removeStep(index)} aria-label={`Remove step ${index + 1}`}>×</button>
              </div>
            ))}
          </div>

          <div className="admin-subsection-heading">
            <div><p className="admin-kicker">Evidence</p><h3>Project facts</h3></div>
            <button type="button" className="admin-small-button" onClick={() => update('facts', [...(draft.facts || []), { label: '', value: '' }])}>+ Add fact</button>
          </div>
          <div className="admin-inline-list">
            {(draft.facts || []).map((fact, index) => (
              <div className="admin-fact-row" key={`fact-${index}`}>
                <AdminField label="Fact label" value={fact.label || ''} onChange={(event) => updateFact(index, 'label', event.target.value)} maxLength={60} />
                <AdminField label="Fact value" value={fact.value || ''} onChange={(event) => updateFact(index, 'value', event.target.value)} maxLength={120} />
                <button type="button" className="admin-icon-danger" onClick={() => removeFact(index)} aria-label={`Remove fact ${index + 1}`}>×</button>
              </div>
            ))}
          </div>
        </SectionCard>

        {error && <p className="admin-form-error admin-project-error" role="alert">{error}</p>}
        <div className="admin-editor-actions">
          <button type="button" className="admin-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="admin-primary">Save project</button>
        </div>
      </form>
    </section>
  )
}

function ProjectsEditor({ value, onChange, requestConfirm, notify }) {
  const projects = Array.isArray(value) ? value : []
  const [editing, setEditing] = useState(null)
  const [undo, setUndo] = useState(null)
  const undoTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(undoTimer.current), [])

  const commit = (next) => onChange(renumberProjects(next))
  const saveProject = (project) => {
    const exists = projects.some((item) => item.id === project.id)
    commit(exists ? projects.map((item) => item.id === project.id ? project : item) : [...projects, project])
    setEditing(null)
    notify(exists ? 'Project changes added to the draft.' : 'Project added to the draft.')
  }
  const move = (index, amount) => {
    const target = index + amount
    if (target < 0 || target >= projects.length) return
    const next = [...projects]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    commit(next)
  }
  const duplicate = (project, index) => {
    const copy = { ...clone(project), id: createId('project'), title: `${project.title} copy` }
    const next = [...projects]
    next.splice(index + 1, 0, copy)
    commit(next)
    notify('Project duplicated. Edit the copy when you are ready.')
  }
  const requestDelete = (project, index) => requestConfirm({
    title: `Remove “${project.title}”?`,
    description: 'This removes the project from your draft. The live portfolio stays unchanged until you publish.',
    confirmLabel: 'Remove project',
    danger: true,
    onConfirm: () => {
      commit(projects.filter((item) => item.id !== project.id))
      window.clearTimeout(undoTimer.current)
      setUndo({ project, index })
      undoTimer.current = window.setTimeout(() => setUndo(null), 10000)
    },
  })
  const restore = () => {
    if (!undo) return
    const next = [...projects]
    next.splice(Math.min(undo.index, next.length), 0, undo.project)
    commit(next)
    window.clearTimeout(undoTimer.current)
    setUndo(null)
    notify('Project restored.')
  }

  if (editing) return <ProjectForm project={editing} onSave={saveProject} onCancel={() => setEditing(null)} />

  return (
    <SectionCard
      eyebrow="04 / Projects"
      title="Selected work"
      description="Change the order with the move buttons. Reordering works reliably on touchscreens and with a keyboard."
    >
      <div className="admin-section-toolbar">
        <p>{projects.length} saved project{projects.length === 1 ? '' : 's'}</p>
        <button type="button" className="admin-primary admin-add-button" onClick={() => setEditing(createProject())}>+ Add project</button>
      </div>
      <div className="admin-project-list">
        {projects.map((project, index) => (
          <article className={project.enabled === false ? 'admin-project-card is-disabled' : 'admin-project-card'} key={project.id || project.number || index}>
            <div className={`admin-project-accent is-${project.accent || 'lime'}`} aria-hidden="true" />
            <div className="admin-project-card-heading">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><p>{project.category || 'Uncategorised project'}</p><h3>{project.title || 'Untitled project'}</h3></div>
            </div>
            <ToggleField label="Visible" checked={project.enabled !== false} onChange={(enabled) => commit(projects.map((item, itemIndex) => itemIndex === index ? { ...item, enabled } : item))} />
            <div className="admin-project-actions">
              <button type="button" onClick={() => setEditing(project)}>Edit</button>
              <button type="button" onClick={() => duplicate(project, index)}>Duplicate</button>
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${project.title} up`}>↑</button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === projects.length - 1} aria-label={`Move ${project.title} down`}>↓</button>
              <button type="button" className="is-danger" onClick={() => requestDelete(project, index)}>Delete</button>
            </div>
          </article>
        ))}
        {!projects.length && <div className="admin-empty"><strong>No projects yet.</strong><p>Add the first project when you are ready.</p></div>}
      </div>
      {undo && (
        <div className="admin-undo" role="status">
          <span>“{undo.project.title}” removed from the draft.</span>
          <button type="button" onClick={restore}>Undo</button>
        </div>
      )}
    </SectionCard>
  )
}

function ResumeEditor({ value, onChange, requestConfirm, notify }) {
  const resume = value || {}
  const uploaded = (asset) => {
    onChange({
      ...resume,
      downloadUrl: asset.downloadUrl,
      storagePath: asset.storagePath,
      originalName: asset.originalName,
      size: asset.size,
      updatedAt: asset.updatedAt,
    })
    notify('Resume uploaded. Save the draft, then publish it when ready.')
  }
  const requestRemove = () => requestConfirm({
    title: 'Remove the resume link?',
    description: 'The resume disappears from your draft. Visitors can still download the current live resume until you publish.',
    confirmLabel: 'Remove from draft',
    danger: true,
    onConfirm: () => onChange({ ...resume, downloadUrl: '', storagePath: '', originalName: '', size: 0, updatedAt: '' }),
  })

  return (
    <SectionCard eyebrow="05 / Files" title="Public resume" description="PDFs are uploaded as Cloudinary raw files so the returned URL can open directly.">
      <AdminField label="Button label" value={resume.label || ''} onChange={(event) => onChange({ ...resume, label: event.target.value })} maxLength={60} />
      <AssetUploader
        kind="resume"
        current={{ url: resume.downloadUrl, name: resume.originalName }}
        onUploaded={uploaded}
        onRequestRemove={requestRemove}
      />
      {resume.downloadUrl && <AdminField label="Resume URL" hint="This is the direct Cloudinary delivery URL saved after upload." value={resume.downloadUrl} readOnly />}
      {resume.updatedAt && <p className="admin-file-meta">Last replaced {new Date(resume.updatedAt).toLocaleString()}</p>}
    </SectionCard>
  )
}

function AdminStudio({ user, initialContent, initialPublished, onLogout }) {
  const [content, setContent] = useState(initialContent)
  const [publishedContent, setPublishedContent] = useState(initialPublished)
  const [activeTab, setActiveTab] = useState('hero')
  const [dirty, setDirty] = useState(false)
  const [working, setWorking] = useState('')
  const [status, setStatus] = useState({ tone: 'neutral', message: 'Draft ready' })
  const [lastSaved, setLastSaved] = useState(null)
  const [dialog, setDialog] = useState(null)
  const dialogTrigger = useRef(null)

  useEffect(() => {
    const warn = (event) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const changedSections = useMemo(() => tabs.filter(({ id }) => (
    JSON.stringify(content?.[id === 'files' ? 'resume' : id])
      !== JSON.stringify(publishedContent?.[id === 'files' ? 'resume' : id])
  )).map(({ label }) => label), [content, publishedContent])

  const notify = (message, tone = 'success') => setStatus({ tone, message })
  const requestConfirm = (config) => {
    dialogTrigger.current = document.activeElement
    setDialog(config)
  }
  const dismissDialog = () => {
    setDialog(null)
    window.requestAnimationFrame(() => {
      const target = dialogTrigger.current
      if (target instanceof HTMLElement && target.isConnected) target.focus()
      else document.getElementById(`admin-tab-${activeTab}`)?.focus()
      dialogTrigger.current = null
    })
  }
  const updateSection = (section, nextValue) => {
    setContent((current) => ({ ...current, [section]: nextValue }))
    setDirty(true)
    setStatus({ tone: 'warning', message: 'Unsaved changes' })
  }

  const saveDraft = async () => {
    setWorking('saving')
    setStatus({ tone: 'neutral', message: 'Saving draft…' })
    try {
      const payload = toPlainContent(content)
      await setDoc(doc(db, 'portfolio', 'draft'), {
        ...payload,
        updatedAt: serverTimestamp(),
      })
      const savedAt = new Date()
      setLastSaved(savedAt)
      setDirty(false)
      setStatus({ tone: 'success', message: `Draft saved at ${formatClockTime(savedAt)}` })
      return true
    } catch (error) {
      console.error('Could not save portfolio draft', error)
      setStatus({ tone: 'error', message: 'Could not save the draft. Check your connection and retry.' })
      return false
    } finally {
      setWorking('')
    }
  }

  const validateForPublish = () => {
    if (!content.hero?.headingLineOne?.trim() || !content.hero?.headingAccent?.trim()) {
      setActiveTab('hero')
      notify('Add both hero heading fields before publishing.', 'error')
      return false
    }
    const invalidProject = (content.projects || []).find((project) => project.enabled !== false && !project.title?.trim())
    if (invalidProject) {
      setActiveTab('projects')
      notify('Every visible project needs a title before publishing.', 'error')
      return false
    }
    return true
  }

  const publishNow = async () => {
    setWorking('publishing')
    setStatus({ tone: 'neutral', message: 'Publishing changes…' })
    try {
      const payload = toPlainContent(content)
      const batch = writeBatch(db)
      batch.set(doc(db, 'portfolio', 'draft'), { ...payload, updatedAt: serverTimestamp() })
      batch.set(doc(db, 'portfolio', 'published'), {
        ...payload,
        updatedAt: serverTimestamp(),
        publishedAt: serverTimestamp(),
      })
      await batch.commit()
      setPublishedContent(clone(payload))
      setDirty(false)
      const savedAt = new Date()
      setLastSaved(savedAt)
      setStatus({ tone: 'success', message: 'Live now — the portfolio has been published.' })
    } catch (error) {
      console.error('Could not publish portfolio', error)
      setStatus({ tone: 'error', message: 'Publishing failed. Nothing live was replaced; please retry.' })
      throw error
    } finally {
      setWorking('')
    }
  }

  const requestPublish = () => {
    if (!validateForPublish()) return
    requestConfirm({
      title: 'Publish this draft?',
      description: changedSections.length
        ? `This will update ${changedSections.join(', ')} on the public portfolio.`
        : 'The saved content already matches the public portfolio.',
      confirmLabel: 'Publish now',
      onConfirm: publishNow,
    })
  }

  const requestLogout = () => {
    if (!dirty) {
      onLogout()
      return
    }
    requestConfirm({
      title: 'Leave with unsaved changes?',
      description: 'Changes made since your last save will be lost when you sign out.',
      confirmLabel: 'Discard and sign out',
      danger: true,
      onConfirm: onLogout,
    })
  }

  const handleTabKeyDown = (event, index) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    const nextTab = tabs[nextIndex]
    setActiveTab(nextTab.id)
    window.requestAnimationFrame(() => document.getElementById(`admin-tab-${nextTab.id}`)?.focus())
  }

  return (
    <main className="admin-root">
      <header className="admin-topbar">
        <div className="admin-brand"><span>TA</span><div><strong>Portfolio studio</strong><small>Private admin</small></div></div>
        <div className="admin-top-actions">
          <span className={`admin-sync-state is-${status.tone}`}><i aria-hidden="true" />{dirty ? 'Draft changed' : 'Up to date'}</span>
          <button type="button" className="admin-logout" onClick={requestLogout}>Log out</button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Portfolio editor sections">
        <div role="tablist" aria-orientation="horizontal">
          {tabs.map((tab, index) => (
            <button
              type="button"
              role="tab"
              id={`admin-tab-${tab.id}`}
              aria-controls={`admin-panel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              key={tab.id}
            >
              <span>{String(tabs.indexOf(tab) + 1).padStart(2, '0')}</span>{tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="admin-content">
        <div className="admin-welcome-row">
          <div><p className="admin-kicker">Editing live portfolio</p><h1>{tabs.find((tab) => tab.id === activeTab)?.label}</h1></div>
          <p>Signed in as <strong>{user.email}</strong></p>
        </div>

        <section
          role="tabpanel"
          id={`admin-panel-${activeTab}`}
          aria-labelledby={`admin-tab-${activeTab}`}
          tabIndex="0"
          className="admin-tab-panel"
        >
          {activeTab === 'hero' && <HeroEditor value={content.hero} onChange={(value) => updateSection('hero', value)} />}
          {activeTab === 'profile' && <ProfileEditor value={content.profile} onChange={(value) => updateSection('profile', value)} requestConfirm={requestConfirm} notify={notify} />}
          {activeTab === 'skills' && <SkillsEditor value={content.skills} onChange={(value) => updateSection('skills', value)} />}
          {activeTab === 'projects' && <ProjectsEditor value={content.projects} onChange={(value) => updateSection('projects', value)} requestConfirm={requestConfirm} notify={notify} />}
          {activeTab === 'files' && <ResumeEditor value={content.resume} onChange={(value) => updateSection('resume', value)} requestConfirm={requestConfirm} notify={notify} />}
        </section>
      </div>

      <div className="admin-savebar">
        <div className={`admin-save-status is-${status.tone}`} role="status" aria-live="polite">
          <i aria-hidden="true" />
          <span><strong>{status.message}</strong>{lastSaved && <small>Last saved {formatClockTime(lastSaved)}</small>}</span>
        </div>
        <div className="admin-save-actions">
          <button type="button" className="admin-secondary" onClick={saveDraft} disabled={!dirty || Boolean(working)}>
            {working === 'saving' ? 'Saving…' : 'Save draft'}
          </button>
          <button type="button" className="admin-primary" onClick={requestPublish} disabled={Boolean(working)}>
            {working === 'publishing' ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      <ConfirmDialog config={dialog} onDismiss={dismissDialog} />
    </main>
  )
}

export function AdminApp() {
  const [authReady, setAuthReady] = useState(false)
  const [user, setUser] = useState(null)
  const [authorized, setAuthorized] = useState(false)
  const [authError, setAuthError] = useState('')
  const [contentState, setContentState] = useState(null)
  const [contentLoadError, setContentLoadError] = useState('')
  const [contentLoadAttempt, setContentLoadAttempt] = useState(0)

  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]')
    const previousRobots = existingRobots?.getAttribute('content')
    const robots = existingRobots || document.createElement('meta')
    const createdRobots = !existingRobots
    const previousTitle = document.title

    robots.setAttribute('name', 'robots')
    robots.setAttribute('content', 'noindex, nofollow, noarchive')
    if (createdRobots) document.head.appendChild(robots)
    document.title = 'Portfolio Studio · Private'

    return () => {
      document.title = previousTitle
      if (createdRobots) robots.remove()
      else if (previousRobots) robots.setAttribute('content', previousRobots)
      else robots.removeAttribute('content')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        if (!cancelled) {
          setUser(null)
          setAuthorized(false)
          setContentState(null)
          setContentLoadError('')
          setAuthReady(true)
        }
        return
      }

      setAuthReady(false)
      try {
        const adminRecord = await getDoc(doc(db, 'admins', nextUser.uid))
        if (!adminRecord.exists() || adminRecord.data()?.active !== true) {
          if (!cancelled) setAuthError('This account does not have admin access.')
          await signOut(auth)
          return
        }
        if (!cancelled) {
          setAuthError('')
          setUser(nextUser)
          setAuthorized(true)
          setAuthReady(true)
        }
      } catch (error) {
        console.error('Could not verify admin access', error)
        if (!cancelled) {
          setAuthError('Admin access could not be verified. Check your connection and try again.')
          setUser(null)
          setAuthorized(false)
          setAuthReady(true)
        }
      }
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!authorized || !user) return undefined
    let cancelled = false
    setContentState(null)
    setContentLoadError('')

    const loadContent = async () => {
      try {
        const [draftSnapshot, publishedSnapshot] = await Promise.all([
          getDoc(doc(db, 'portfolio', 'draft')),
          getDoc(doc(db, 'portfolio', 'published')),
        ])
        const published = normalizePortfolioContent(
          publishedSnapshot.exists() ? publishedSnapshot.data() : defaultPortfolioContent,
        )
        const draft = normalizePortfolioContent(
          draftSnapshot.exists() ? draftSnapshot.data() : published,
        )
        if (!cancelled) setContentState({ draft, published })
      } catch (error) {
        console.error('Could not load portfolio content', error)
        if (!cancelled) {
          setContentLoadError('Your saved content could not be loaded safely. Check your internet connection and Firebase rules, then try again.')
        }
      }
    }

    loadContent()
    return () => { cancelled = true }
  }, [authorized, user, contentLoadAttempt])

  const login = async (email, password) => {
    setAuthError('')
    try {
      await setPersistence(auth, browserSessionPersistence)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setAuthError(describeAuthError(error))
    }
  }

  if (!authReady) return <LoadingScreen />
  if (!user || !authorized) return <AdminLogin error={authError} onSubmit={login} />
  if (contentLoadError) return <ContentLoadError message={contentLoadError} onRetry={() => setContentLoadAttempt((value) => value + 1)} onLogout={() => signOut(auth)} />
  if (!contentState) return <LoadingScreen label="Loading your portfolio draft…" />

  return (
    <AdminStudio
      user={user}
      initialContent={clone(contentState.draft)}
      initialPublished={clone(contentState.published)}
      onLogout={() => signOut(auth)}
    />
  )
}

export default AdminApp
