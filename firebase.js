import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase's web configuration identifies this public client; it is not an
// administrator credential. VITE_* overrides make the project portable while
// the checked-in fallbacks keep the existing deployment working.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBliQW9xN-w-EZ7kx8skKrO20Hxven4eBE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'myportfolio26-e4dea.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'myportfolio26-e4dea',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'myportfolio26-e4dea.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '246607527386',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:246607527386:web:1d6d0de87cbade919714e3',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-X025CM6YHX',
}

// Reuse the initialized app during Vite hot reloads.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Analytics is optional and may be unavailable in privacy-focused browsers.
// Keeping it behind an async support check prevents it from blocking the app.
const analyticsPromise = typeof window === 'undefined'
  ? Promise.resolve(null)
  : isAnalyticsSupported()
      .then((supported) => (supported ? getAnalytics(app) : null))
      .catch(() => null)

export { analyticsPromise, app, auth, db, storage }
