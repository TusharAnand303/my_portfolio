import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

const clamp = (minimum, value, maximum) => Math.min(maximum, Math.max(minimum, value))

const physics = {
  viewportMargin: 56,
  bodyLimit: 44,
  leadIn: 460,
  travelSpeed: 1.85,
  maxTravelTime: 560,
  waveDuration: 1050,
  stiffness: 190,
  dampingRatio: 0.28,
  minAmplitude: 4.5,
  maxAmplitude: 12,
  distanceDecay: 1800,
  foldFactor: 0.22,
  horizontalFactor: 0.14,
  rotationFactor: 0.18,
  frameInterval: 1000 / 45,
}

export default function PageRipple({ pulse }) {
  const frameRef = useRef(null)
  const wordsRef = useRef([])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const restoreWords = () => {
      wordsRef.current.forEach(({ element, originalTransform }) => {
        element.style.transform = originalTransform
      })
      wordsRef.current = []
    }

    if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    restoreWords()

    if (!pulse || reduceMotion) return undefined

    const startedAt = performance.now()
    let lastPaintAt = startedAt - physics.frameInterval

    const bodies = [...document.querySelectorAll('[data-wave-word]')]
      .map((element) => {
        const bounds = element.getBoundingClientRect()
        if (
          bounds.width <= 0
          || bounds.height <= 0
          || bounds.bottom <= -physics.viewportMargin
          || bounds.top >= window.innerHeight + physics.viewportMargin
        ) return null

        const centerX = bounds.left + bounds.width / 2
        const centerY = bounds.top + bounds.height / 2
        const deltaX = centerX - pulse.clientX
        const deltaY = centerY - pulse.clientY
        const distance = Math.hypot(deltaX, deltaY)
        const areaRoot = Math.sqrt(Math.max(1, bounds.width * bounds.height))
        const mass = clamp(0.78, areaRoot / 58, 1.32)
        const amplitude = clamp(
          physics.minAmplitude,
          physics.maxAmplitude * Math.exp(-distance / physics.distanceDecay) / Math.sqrt(mass),
          physics.maxAmplitude,
        )
        const omega0 = Math.sqrt(physics.stiffness / mass)
        const decay = physics.dampingRatio * omega0
        const omegaD = omega0 * Math.sqrt(1 - physics.dampingRatio ** 2)

        return {
          element,
          distance,
          amplitude,
          decay,
          omegaD,
          horizontalDirection: distance > 1 ? deltaX / distance : 0,
          originalTransform: element.style.transform,
          settled: false,
        }
      })
      .filter(Boolean)
      .sort((first, second) => first.distance - second.distance)
      .slice(0, physics.bodyLimit)
      .map((body) => ({
        ...body,
        arrival: physics.leadIn + Math.min(body.distance / physics.travelSpeed, physics.maxTravelTime),
      }))

    wordsRef.current = bodies

    const animateWave = (now) => {
      if (now - lastPaintAt < physics.frameInterval) {
        frameRef.current = window.requestAnimationFrame(animateWave)
        return
      }

      lastPaintAt = now
      const elapsed = now - startedAt
      let moving = false

      bodies.forEach((body) => {
        const localTime = elapsed - body.arrival

        if (localTime < 0) {
          moving = true
          return
        }

        if (localTime > physics.waveDuration) {
          if (!body.settled) {
            body.element.style.transform = body.originalTransform
            body.settled = true
          }
          return
        }

        moving = true
        const seconds = localTime / 1000
        const envelope = Math.exp(-body.decay * seconds)
        const phase = body.omegaD * seconds
        const displacement = body.amplitude * envelope * Math.sin(phase)
        const fold = body.amplitude * physics.foldFactor * envelope * Math.cos(phase)
        const x = body.horizontalDirection * fold * physics.horizontalFactor
        const rotation = -displacement * physics.rotationFactor

        body.element.style.transform = `translate(${x.toFixed(2)}px, ${displacement.toFixed(2)}px) rotate(${rotation.toFixed(2)}deg) skewY(${fold.toFixed(2)}deg)`
      })

      if (moving) {
        frameRef.current = window.requestAnimationFrame(animateWave)
      } else {
        frameRef.current = null
        wordsRef.current = []
      }
    }

    frameRef.current = window.requestAnimationFrame(animateWave)

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      restoreWords()
    }
  }, [pulse, reduceMotion])

  return null
}
