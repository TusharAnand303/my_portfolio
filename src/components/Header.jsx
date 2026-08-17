import { useState } from 'react'
import Icon from './Icon'

const links = ['About', 'Education', 'Experience', 'Work', 'Contact']

export default function Header() {
  const [open, setOpen] = useState(false)
  const goTo = (label) => {
    setOpen(false)
    document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Tushar Anand home"><span>TA</span><i /></a>
      <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
        {links.map((link, index) => <button key={link} onClick={() => goTo(link)}><em>0{index + 1}</em>{link}</button>)}
      </nav>
      <a className="header-cta" href="mailto:tusharanand303@gmai.com">Let's talk <Icon name="arrow" size={16} /></a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><Icon name={open ? 'close' : 'menu'} size={22} /></button>
    </header>
  )
}
