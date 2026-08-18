import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

export default function CursorDot() {
  const reduceMotion = useReducedMotion()
  const [cursorState, setCursorState] = useState({ active: false, label: '' })
  const lastState = useRef({ active: false, label: '' })
  const pointerX = useMotionValue(-100)
  const pointerY = useMotionValue(-100)
  const ringSize = useMotionValue(38)
  const dotScale = useMotionValue(1)
  const pointerOpacity = useMotionValue(0)
  const ringX = useSpring(pointerX, { stiffness: 420, damping: 34, mass: 0.22 })
  const ringY = useSpring(pointerY, { stiffness: 420, damping: 34, mass: 0.22 })
  const size = useSpring(ringSize, { stiffness: 360, damping: 27, mass: 0.25 })
  const scale = useSpring(dotScale, { stiffness: 500, damping: 30 })
  const opacity = useSpring(pointerOpacity, { stiffness: 350, damping: 32 })

  useEffect(() => {
    const supportsCursor = !reduceMotion && window.matchMedia('(pointer: fine)').matches
    if (!supportsCursor) return undefined

    document.documentElement.classList.add('has-custom-cursor')

    const updateState = (target) => {
      const labelledTarget = target?.closest('[data-cursor]')
      const interactiveTarget = target?.closest('a, button, [role="button"], .project, .skill-list span')
      const nextState = {
        active: Boolean(labelledTarget || interactiveTarget),
        label: labelledTarget?.getAttribute('data-cursor') || '',
      }

      ringSize.set(nextState.label ? 72 : nextState.active ? 52 : 38)
      dotScale.set(nextState.active ? 0.55 : 1)

      if (nextState.active !== lastState.current.active || nextState.label !== lastState.current.label) {
        lastState.current = nextState
        setCursorState(nextState)
      }
    }

    const move = (event) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
      pointerOpacity.set(1)
      updateState(event.target instanceof Element ? event.target : null)
    }

    const press = () => {
      dotScale.set(1.8)
      ringSize.set(30)
    }

    const release = (event) => updateState(event.target instanceof Element ? event.target : null)
    const leave = () => pointerOpacity.set(0)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', press, { passive: true })
    window.addEventListener('pointerup', release, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [dotScale, pointerOpacity, pointerX, pointerY, reduceMotion, ringSize])

  if (reduceMotion) return null

  return (
    <>
      <motion.div className="cursor-dot" style={{ left: pointerX, top: pointerY, scale, opacity }} aria-hidden="true" />
      <motion.div
        className={`cursor-ring${cursorState.active ? ' is-active' : ''}${cursorState.label ? ' has-label' : ''}`}
        style={{ left: ringX, top: ringY, width: size, height: size, opacity }}
        aria-hidden="true"
      >
        <span>{cursorState.label}</span>
      </motion.div>
    </>
  )
}
