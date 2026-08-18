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
  className = '',
  active = false,
  onActivate,
  onDragStart,
  onDragEnd,
  onPointerEnter,
  onPointerLeave,
}) {
  const reduceMotion = useReducedMotion()
  const tech = techMeta[name]
  const Glyph = tech.Icon

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
      onClick={() => onActivate(name)}
      onDragStart={() => onDragStart(name)}
      onDragEnd={onDragEnd}
      onPointerEnter={() => onPointerEnter(name)}
      onPointerLeave={onPointerLeave}
      onFocus={() => onPointerEnter(name)}
      onBlur={onPointerLeave}
      whileHover={reduceMotion ? undefined : { scale: 1.14, y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      whileDrag={reduceMotion ? undefined : { scale: 1.34, zIndex: 30 }}
      aria-label={`${tech.label}. Click to select or drag and release to return it to the orbit.`}
      aria-pressed={active}
      title={tech.label}
      data-cursor="DRAG"
    >
      <Glyph aria-hidden="true" />
      <span className="orbit-tooltip" aria-hidden="true">{tech.label}</span>
    </motion.button>
  )
}
