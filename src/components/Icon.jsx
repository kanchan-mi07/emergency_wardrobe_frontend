// Small inline icon set (stroke icons, 24x24) so we don't need an icon library.
const PATHS = {
  hanger: <><path d="M12 7.5a2.2 2.2 0 1 0-2.2-2.2" /><path d="M12 7.5V10l9 6.2a1 1 0 0 1-.6 1.8H3.6a1 1 0 0 1-.6-1.8L12 10" /></>,
  droplet: <path d="M12 3s6 6.3 6 10.6a6 6 0 0 1-12 0C6 9.3 12 3 12 3z" />,
  needle: <><path d="M4 20 18 6" /><path d="M16 4l4 4" /><circle cx="19" cy="5" r="0.6" /><path d="M5 19c2-3 4-1 6-4" /></>,
  sparkle: <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />,
  plane: <path d="M21 3 3 10.5l7 2.5 2.5 7z M10 13 21 3" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  shield: <path d="M12 3 4.5 6v5.5c0 4.4 3 8 7.5 9.5 4.5-1.5 7.5-5.1 7.5-9.5V6z M9 12l2.2 2.2L15.5 10" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  bag: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  shoe: <path d="M3 17c0-3 1-6 2-9l3 2c1 2 3 3 5 3l6 2c1 .4 2 1 2 2.5V19H3z" />,
  gem: <path d="M6 4h12l3 5-9 11L3 9z M3 9h18M9 4l-1 5 4 11 4-11-1-5" />,
  kit: <><rect x="3.5" y="7" width="17" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M12 11v5M9.5 13.5h5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c1-4 4-6 8-6s7 2 8 6" /></>,
}

function Icon({ name, size = 22, strokeWidth = 1.7, className }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true" focusable="false"
    >
      {PATHS[name] ?? PATHS.hanger}
    </svg>
  )
}

export default Icon