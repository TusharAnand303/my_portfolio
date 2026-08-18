import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  defaultPortfolioContent,
  normalizePortfolioContent,
} from '../data/defaultPortfolioContent'

const fallbackContextValue = {
  content: defaultPortfolioContent,
  loading: false,
  error: null,
}

const PortfolioContentContext = createContext(fallbackContextValue)

const asError = (cause) => {
  if (cause instanceof Error) return cause
  return new Error('Portfolio content could not be loaded from Firestore.')
}

export function PortfolioContentProvider({ children, firestore = null }) {
  const [content, setContent] = useState(() => normalizePortfolioContent())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    let unsubscribe = null
    setLoading(true)

    const subscribe = async () => {
      try {
        const [{ doc, onSnapshot }, firebaseServices] = await Promise.all([
          import('firebase/firestore'),
          firestore ? Promise.resolve({ db: firestore }) : import('../../firebase.js'),
        ])
        if (!active) return

        const database = firestore || firebaseServices.db
        if (!database) throw new Error('Firestore is unavailable.')

        const publishedContent = doc(database, 'portfolio', 'published')
        unsubscribe = onSnapshot(
          publishedContent,
          (snapshot) => {
            if (!active) return
            setContent(snapshot.exists()
              ? normalizePortfolioContent(snapshot.data())
              : normalizePortfolioContent())
            setError(null)
            setLoading(false)
          },
          (cause) => {
            if (!active) return
            setError(asError(cause))
            setLoading(false)
          },
        )
      } catch (cause) {
        if (!active) return
        setError(asError(cause))
        setLoading(false)
      }
    }

    subscribe()
    return () => {
      active = false
      unsubscribe?.()
    }
  }, [firestore])

  const value = useMemo(() => ({ content, loading, error }), [content, loading, error])

  return (
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  )
}

export function usePortfolioContent() {
  return useContext(PortfolioContentContext)
}

export { PortfolioContentContext }
