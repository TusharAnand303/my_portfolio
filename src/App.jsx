import { lazy, Suspense, useEffect, useState } from 'react'
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Profile from './components/Profile'
import Education from './components/Education'
import Certificates from './components/Certificates'
import Experience from './components/Experience'
import Work from './components/Work'
import Playground from './components/Playground'
import Contact from './components/Contact'
import Icon from './components/Icon'
import CursorDot from './components/CursorDot'
import PageRipple from './components/PageRipple'
import { PortfolioContentProvider, usePortfolioContent } from './context/PortfolioContentContext'

const AdminApp = lazy(() => import('./admin/AdminApp'))

const isAdminRoute = () => {
  if (typeof window === 'undefined') return false
  return window.location.pathname.replace(/\/$/, '').toLowerCase() === '/admin'
    || ['#admin', '#/admin'].includes(window.location.hash.toLowerCase())
}

function PortfolioSite() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [pageRipple, setPageRipple] = useState(null)
  const { content } = usePortfolioContent()
  const { scrollYProgress } = useScroll()
  const smoothScrollProgress = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.25 })
  const launchWave = (origin) => {
    setPageRipple((current) => ({ ...origin, id: (current?.id || 0) + 1 }))
  }

  // Content arrives from Firestore after mount, so sections such as certificates
  // may not exist on the first pass. Re-scan whenever the countable content changes.
  const revealSignature = [
    content.education?.qualifications?.length || 0,
    content.certificates?.items?.length || 0,
    content.projects?.length || 0,
  ].join(':')

  useEffect(() => {
    const revealItems = document.querySelectorAll('.about-grid, .profile-photo, .profile-details, .education-heading, .edu-entry, .certificates-heading, .certificate-card, .experience-top, .role, .work-heading, .playground-heading, .playground-shell, .contact > *:not(.contact-line)')
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' })

    revealItems.forEach((item, index) => {
      if (item.classList.contains('is-visible')) return
      item.classList.add('scroll-reveal')
      item.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`)
      revealObserver.observe(item)
    })

    const updateScrollTop = () => setShowScrollTop(window.scrollY > 560)

    updateScrollTop()
    window.addEventListener('scroll', updateScrollTop, { passive: true })

    return () => {
      revealObserver.disconnect()
      window.removeEventListener('scroll', updateScrollTop)
    }
  }, [revealSignature])

  return (
    <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 240, damping: 28 }}>
      <main>
        <CursorDot />
        <PageRipple pulse={pageRipple} />
        <motion.div className="scroll-progress" style={{ scaleX: smoothScrollProgress }} aria-hidden="true" />
        <Header />
        <Hero onPageRipple={launchWave} />
        <About />
        <Profile />
        <Education />
        <Certificates />
        <Experience />
        <Work />
        <Playground />
        <Contact />
        <motion.button
          className={showScrollTop ? 'scroll-top is-visible' : 'scroll-top'}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -4, rotate: -7 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
        >
          <Icon name="arrow" size={19} />
        </motion.button>
      </main>
    </MotionConfig>
  )
}

export default function App() {
  const [adminMode, setAdminMode] = useState(isAdminRoute)

  useEffect(() => {
    const handleRouteChange = () => setAdminMode(isAdminRoute())
    window.addEventListener('hashchange', handleRouteChange)
    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('hashchange', handleRouteChange)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  if (adminMode) {
    return (
      <Suspense fallback={<div className="admin-loading" role="status">Opening private studio...</div>}>
        <AdminApp />
      </Suspense>
    )
  }

  return (
    <PortfolioContentProvider>
      <PortfolioSite />
    </PortfolioContentProvider>
  )
}
