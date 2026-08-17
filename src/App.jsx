import { useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Profile from './components/Profile'
import Education from './components/Education'
import Experience from './components/Experience'
import Work from './components/Work'
import Contact from './components/Contact'
import Icon from './components/Icon'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const revealItems = document.querySelectorAll('.about-grid, .profile-photo, .profile-details, .education-heading, .qualification, .experience-top, .role, .work-heading, .project, .contact > *:not(.contact-line)')
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' })

    revealItems.forEach((item, index) => {
      item.classList.add('scroll-reveal')
      item.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`)
      revealObserver.observe(item)
    })

    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0)
      setShowScrollTop(window.scrollY > 560)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      revealObserver.disconnect()
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return <main><div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" /><Header /><Hero /><About /><Profile /><Work /><Education /><Experience /><Contact /><button className={showScrollTop ? 'scroll-top is-visible' : 'scroll-top'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top"><Icon name="arrow" size={19} /></button></main>
}
