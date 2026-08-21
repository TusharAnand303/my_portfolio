import { useEffect, useState } from 'react'
import Icon from './Icon'
import WaveWords from './WaveWords'
import { usePortfolioContent } from '../context/PortfolioContentContext'

const baseLinks = [
  { label: 'About', id: 'about' },
  { label: 'Education', id: 'education' },
  { label: 'Experience', id: 'experience' },
  { label: 'Work', id: 'work' },
  { label: 'Contact', id: 'contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { content } = usePortfolioContent()

  const hasCertificates = (content.certificates?.items || [])
    .some((item) => item.enabled !== false && (item.title || '').trim())

  const links = hasCertificates
    ? baseLinks.flatMap((link) => (
      link.id === 'education'
        ? [link, { label: 'Certificates', id: 'certificates' }]
        : [link]
    ))
    : baseLinks

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Tushar Anand home"><span><WaveWords>TA</WaveWords></span><i /></a>
      <nav id="site-navigation" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
        {links.map((link, index) => <a key={link.id} href={'#' + link.id} onClick={() => setOpen(false)}><em><WaveWords>{String(index + 1).padStart(2, '0')}</WaveWords></em><WaveWords>{link.label}</WaveWords></a>)}
      </nav>
      <a className="header-cta" href="mailto:tusharanand303@gmail.com" data-cursor="MAIL"><span><WaveWords>Contact me</WaveWords></span><Icon name="arrow" size={16} /></a>
      <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="site-navigation"><Icon name={open ? 'close' : 'menu'} size={22} /></button>
    </header>
  )
}
