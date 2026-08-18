import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

const clamp = (minimum, value, maximum) => Math.min(maximum, Math.max(minimum, value))

const physics = {
  viewportMargin: 56,
  leadIn: 460,
  travelSpeed: 1.85,
  maxTravelTime: 560,
  waveDuration: 1050,
  sessionDuration: 6500,
  stiffness: 190,
  dampingRatio: 0.28,
  minAmplitude: 4.5,
  maxAmplitude: 12,
  distanceDecay: 1800,
  desktopIntensity: 1.45,
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
    const intensity = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      ? physics.desktopIntensity
      : 1
    const bodies = []
    const scheduledElements = new Set()
    let visibilityObserver = null
    let mutationObserver = null
    let sessionTimer = null
    let sessionOpen = true
    let lastPaintAt = startedAt - physics.frameInterval

    wordsRef.current = bodies

    const animateWave = (now) => {
      if (now - lastPaintAt < physics.frameInterval) {
        frameRef.current = window.requestAnimationFrame(animateWave)
        return
      }

      lastPaintAt = now
      const elapsed = now - startedAt

      for (let index = bodies.length - 1; index >= 0; index -= 1) {
        const body = bodies[index]
        const localTime = elapsed - body.arrival

        if (localTime < 0) continue

        if (localTime > physics.waveDuration) {
          body.element.style.transform = body.originalTransform
          bodies.splice(index, 1)
          continue
        }

        const seconds = localTime / 1000
        const envelope = Math.exp(-body.decay * seconds)
        const phase = body.omegaD * seconds
        const displacement = body.amplitude * envelope * Math.sin(phase)
        const fold = body.amplitude * physics.foldFactor * envelope * Math.cos(phase)
        const x = body.horizontalDirection * fold * physics.horizontalFactor
        const rotation = -displacement * physics.rotationFactor

        body.element.style.transform = `translate(${x.toFixed(2)}px, ${displacement.toFixed(2)}px) rotate(${rotation.toFixed(2)}deg) skewY(${fold.toFixed(2)}deg)`
      }

      if (bodies.length > 0) {
        frameRef.current = window.requestAnimationFrame(animateWave)
      } else {
        frameRef.current = null
      }
    }

    const startAnimation = () => {
      if (frameRef.current === null && bodies.length > 0) {
        lastPaintAt = performance.now() - physics.frameInterval
        frameRef.current = window.requestAnimationFrame(animateWave)
      }
    }

    const enqueueWords = (elements, followsScroll = false) => {
      const elapsed = performance.now() - startedAt
      const candidates = elements
        .filter((element) => !scheduledElements.has(element) && element.isConnected)
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
            physics.minAmplitude * intensity,
            physics.maxAmplitude * intensity * Math.exp(-distance / physics.distanceDecay) / Math.sqrt(mass),
            physics.maxAmplitude * intensity,
          )
          const omega0 = Math.sqrt(physics.stiffness / mass)

          return {
            element,
            distance,
            amplitude,
            decay: physics.dampingRatio * omega0,
            omegaD: omega0 * Math.sqrt(1 - physics.dampingRatio ** 2),
            horizontalDirection: distance > 1 ? deltaX / distance : 0,
            originalTransform: element.style.transform,
          }
        })
        .filter(Boolean)

      const headingWords = candidates.filter(({ element }) => element.closest('h1, h2, h3'))
      const copyWords = candidates.filter(({ element }) => !element.closest('h1, h2, h3'))

      ;[...headingWords, ...copyWords]
        .sort((first, second) => first.distance - second.distance)
        .forEach((body) => {
          scheduledElements.add(body.element)
          bodies.push({
            ...body,
            arrival: (followsScroll ? elapsed + 80 : physics.leadIn)
              + Math.min(body.distance / physics.travelSpeed, physics.maxTravelTime),
          })
        })

      startAnimation()
    }

    const allWords = [...document.querySelectorAll('[data-wave-word]')]
    enqueueWords(allWords)

    if ('IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver((entries) => {
        if (!sessionOpen) return
        enqueueWords(entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target), true)
      }, { rootMargin: `${physics.viewportMargin}px 0px`, threshold: 0 })

      allWords.forEach((element) => visibilityObserver.observe(element))

      mutationObserver = new MutationObserver((mutations) => {
        if (!sessionOpen) return
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return
            if (node.matches('[data-wave-word]')) visibilityObserver.observe(node)
            node.querySelectorAll('[data-wave-word]').forEach((element) => visibilityObserver.observe(element))
          })
        })
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }

    sessionTimer = window.setTimeout(() => {
      sessionOpen = false
      visibilityObserver?.disconnect()
      mutationObserver?.disconnect()
    }, physics.sessionDuration)

    return () => {
      sessionOpen = false
      if (sessionTimer) window.clearTimeout(sessionTimer)
      visibilityObserver?.disconnect()
      mutationObserver?.disconnect()
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      restoreWords()
    }
  }, [pulse, reduceMotion])

  return null
}
