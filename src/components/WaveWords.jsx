import { Children, cloneElement, isValidElement } from 'react'

const whitespaceOnly = /^\s+$/

function wrapWords(children, path = 'wave') {
  return Children.toArray(children).flatMap((child, childIndex) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child)
        .split(/(\s+)/)
        .filter(Boolean)
        .map((token, tokenIndex) => (
          whitespaceOnly.test(token)
            ? token
            : (
              <span className="page-wave-word" data-wave-word key={`${path}-${childIndex}-${tokenIndex}`}>
                {token}
              </span>
            )
        ))
    }

    if (!isValidElement(child)) return child

    const shouldSkip = (
      typeof child.type !== 'string'
      || child.type === 'br'
      || child.type === 'svg'
      || child.props['aria-hidden'] === true
    )

    if (shouldSkip) return child

    return cloneElement(
      child,
      undefined,
      wrapWords(child.props.children, `${path}-${childIndex}`),
    )
  })
}

export default function WaveWords({ children }) {
  return wrapWords(children)
}
