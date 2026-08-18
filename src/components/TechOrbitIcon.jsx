import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { VscCode } from 'react-icons/vsc'
import {
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiReact,
} from 'react-icons/si'

export const techMeta = {
  vscode: { label: 'VS Code', color: '#1688d4', Icon: VscCode },
  laravel: { label: 'Laravel', color: '#ff2d20', Icon: SiLaravel },
  nodejs: { label: 'Node.js', color: '#5fa04e', Icon: SiNodedotjs },
  express: { label: 'Express', color: '#11130f', accent: '#d9fb63', Icon: SiExpress },
  mongodb: { label: 'MongoDB', color: '#47a248', Icon: SiMongodb },
  github: { label: 'GitHub', color: '#181717', accent: '#747a72', Icon: SiGithub },
  mysql: { label: 'MySQL', color: '#00758f', Icon: SiMysql },
  react: { label: 'React', color: '#149eca', Icon: SiReact },
  postgresql: { label: 'PostgreSQL', color: '#336791', Icon: SiPostgresql },
  javascript: { label: 'JavaScript', color: '#c9ad00', Icon: SiJavascript },
  php: { label: 'PHP', color: '#777bb4', Icon: SiPhp },
  html: { label: 'HTML5', color: '#e34f26', Icon: SiHtml5 },
  css: { label: 'CSS', color: '#1572b6', Icon: SiCss },
  git: { label: 'Git', color: '#f05033', Icon: SiGit },
}

export default function TechOrbitIcon({
  name,
  label,
  className = '',
  active = false,
  onActivate,
  onDragStart,
  onDragEnd,
  onReturnComplete,
  onPressStart,
  onPressEnd,
  onPressCancel,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}) {
  const reduceMotion = useReducedMotion()
  const didDrag = useRef(false)
  const returning = useRef(false)
  const returnTimer = useRef(null)
  const tech = techMeta[name]
  const Glyph = tech.Icon
  const displayLabel = label || tech.label

  useEffect(() => () => {
    if (returnTimer.current) window.clearTimeout(returnTimer.current)
  }, [])

  const completeReturn = () => {
    if (!returning.current) return
    if (returnTimer.current) window.clearTimeout(returnTimer.current)
    returning.current = false
    didDrag.current = false
    onReturnComplete(name)
  }

  const handleDragStart = () => {
    if (returnTimer.current) window.clearTimeout(returnTimer.current)
    didDrag.current = true
    returning.current = false
    onDragStart(name)
  }

  const handleDragEnd = () => {
    returning.current = true
    onDragEnd(name)
    returnTimer.current = window.setTimeout(completeReturn, 800)
  }

  return (
    <motion.button
      type="button"
      className={`tech-orbit-icon tech-${name} ${className}${active ? ' is-active' : ''}`}
      style={{ '--tech-color': tech.color }}
      drag={!reduceMotion}
      dragSnapToOrigin
      dragMomentum={false}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 520, bounceDamping: 24 }}
      onClick={() => { if (!didDrag.current) onActivate(name) }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragTransitionEnd={completeReturn}
      onPointerDown={(event) => onPressStart(name, event)}
      onPointerUp={onPressEnd}
      onPointerCancel={onPressCancel}
      onLostPointerCapture={onPressCancel}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') onPointerEnter(event) }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') onPointerLeave(event) }}
      onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) onFocus() }}
      onBlur={onBlur}
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      whileDrag={reduceMotion ? undefined : { scale: 1.34, zIndex: 30 }}
      aria-label={reduceMotion ? `${displayLabel}. Tap to select.` : `${displayLabel}. Tap to select or drag and release to return it to the orbit.`}
      aria-pressed={active}
      title={displayLabel}
      data-cursor="DRAG"
    >
      <span className="tech-orbit-disc" aria-hidden="true"><Glyph /></span>
      <span className="orbit-tooltip" aria-hidden="true">{displayLabel}</span>
    </motion.button>
  )
}
