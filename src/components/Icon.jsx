const icons = {
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  github: <><path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.08-.34 6.32-1.51 6.32-6.83A5.35 5.35 0 0 0 19 5a5 5 0 0 0-.13-3.75s-1.13-.36-3.75 1.43a12.86 12.86 0 0 0-6.84 0C5.66.89 4.53 1.25 4.53 1.25A5 5 0 0 0 4.4 5a5.35 5.35 0 0 0-1.38 3.69c0 5.31 3.23 6.5 6.31 6.84A3.08 3.08 0 0 0 8.4 18v4" /><path d="M8.4 19c-2.8.87-3.4-1.36-3.4-1.36-.46-1.16-1.12-1.47-1.12-1.47" /></>,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></>,
  mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  external: <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
}

export default function Icon({ name, size = 18, stroke = 1.8 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}
