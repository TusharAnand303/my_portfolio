const icons = {
  vscode: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#28a8ea" d="m23.7 2.5-11.1 10-6.3-4.8L3.5 9.1v13.8l2.8 1.4 6.3-4.8 11.1 10 4.8-2.1V4.6l-4.8-2.1Zm.2 18.7-8.4-5.2 8.4-5.2v10.4Z" />
    </svg>
  ),
  laravel: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#ff2d20" d="M5 7.7 10.1 5l5 2.8v5.8l4.8 2.7 4.9-2.7V8l5.1-2.8V19l-5.1 2.8-4.9-2.8-4.8 2.8v5.5L10.1 30 5 27.2V13.3l5.1 2.8v8.1l2.5-1.4v-8.2L5 10.5V7.7Z" />
    </svg>
  ),
  postgresql: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="7.2" rx="10.5" ry="4.2" fill="#336791" />
      <path fill="#336791" d="M5.5 7.2v12.3c0 2.3 4.7 4.2 10.5 4.2s10.5-1.9 10.5-4.2V7.2c0 2.3-4.7 4.2-10.5 4.2S5.5 9.5 5.5 7.2Z" />
      <path fill="#fff" d="M11.2 15.2h4.5c2.5 0 4.1 1.3 4.1 3.5 0 2.3-1.7 3.7-4.3 3.7h-1.3v3h-3v-9.2Zm3 2.4v2.5h1.1c.9 0 1.5-.5 1.5-1.3s-.6-1.2-1.5-1.2h-1.1Z" />
    </svg>
  ),
  react: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <g fill="none" stroke="#149eca" strokeWidth="1.7"><ellipse cx="16" cy="16" rx="12" ry="4.8" /><ellipse cx="16" cy="16" rx="12" ry="4.8" transform="rotate(60 16 16)" /><ellipse cx="16" cy="16" rx="12" ry="4.8" transform="rotate(120 16 16)" /></g>
      <circle cx="16" cy="16" r="2.5" fill="#149eca" />
    </svg>
  ),
  php: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="13" ry="8.5" fill="#777bb4" />
      <text x="16" y="19.1" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">PHP</text>
    </svg>
  ),
  html: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#e34f26" d="M5 3h22l-2 23.5L16 29l-9-2.5L5 3Z" />
      <path fill="#fff" d="m10.3 9 1 12.1 4.7 1.3v-3.1l-2-.5-.2-2.1h2.2v-2.9h-5l.2 2.8h2.5l.2 2.2-1 .3-1.1-.3-.2-2.3H8.8L9.2 22l6.8 1.9v-15h-5.7Z" />
    </svg>
  ),
  css: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#1572b6" d="M5 3h22l-2 23.5L16 29l-9-2.5L5 3Z" />
      <path fill="#fff" d="m10 9 .6 13 5.4 1.5v-3.1l-2.1-.6-.1-2.1h2.2v-2.8h-5.1l.2 2.8h2.5l.1 2.2-1.1.3-1-.3-.2-2.3H8.8l.4 5.4 6.8 1.9V9H10Zm11.2 0-.2 2.9h-5v2.8h4.8l-.4 5.5-4.4 1.2v-3l1.8-.5.1-1.9H16v-2.8h5l.2-2.4H16V9h5.2Z" />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="26" height="26" x="3" y="3" fill="#f7df1e" rx="2" />
      <text x="16" y="23" textAnchor="middle" fill="#111" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">JS</text>
    </svg>
  ),
  github: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#181717" d="M16 3.3a12.7 12.7 0 0 0-4 24.7c.6.1.8-.3.8-.6v-2.3c-3.2.7-3.9-1.4-3.9-1.4-.5-1.4-1.3-1.7-1.3-1.7-1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12.7 12.7 0 0 0 16 3.3Z" />
    </svg>
  ),
  git: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#f05033" d="M3.7 16 16 3.7a2.4 2.4 0 0 1 3.4 0l8.9 8.9a2.4 2.4 0 0 1 0 3.4L16 28.3a2.4 2.4 0 0 1-3.4 0L3.7 19.4a2.4 2.4 0 0 1 0-3.4Z" />
      <path fill="#fff" d="M18 20.4v-4.9a2.7 2.7 0 1 0-1.8 0v2l-3.5-3.5a2.7 2.7 0 1 0-1.2 1.2l4.1 4.1v1.1a2.7 2.7 0 1 0 2.4 0Z" />
    </svg>
  ),
  mysql: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="8" rx="10.5" ry="4" fill="#00618a" />
      <path fill="#00618a" d="M5.5 8v11.4c0 2.2 4.7 4.1 10.5 4.1s10.5-1.9 10.5-4.1V8c0 2.2-4.7 4-10.5 4S5.5 10.2 5.5 8Z" />
      <text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">SQL</text>
    </svg>
  ),
}

export default function TechOrbitIcon({ name, className = '' }) {
  return <span className={`tech-orbit-icon tech-${name} ${className}`}>{icons[name]}</span>
}
