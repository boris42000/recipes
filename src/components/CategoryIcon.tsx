// Playful sticker-style icons for recipe categories (= tags).
// Every icon is drawn on a 48×48 grid with a shared dark outline; fills are per shape.
import type { CSSProperties, ReactNode } from 'react'

const INK = '#3b2418'

type Category = { hue: number; art: ReactNode }

/**
 * Ordered from most to least specific: a recipe's placeholder uses the first category it has,
 * so "Kapustnica" [slovenské, polievka] gets the soup bowl, not the folk heart.
 */
const CATEGORIES: [string, Category][] = [
  [
    'polievka',
    {
      hue: 25,
      art: (
        <>
          <path fill="none" d="M17 4c-2 3 2 5 0 8M24 2c-2 3 2 5 0 8M31 4c-2 3 2 5 0 8" />
          <path fill="#fb923c" d="M5 20h38a19 18 0 0 1-38 0z" />
          <ellipse cx="24" cy="20" rx="19" ry="3.5" fill="#fde047" />
          <circle cx="16" cy="19.5" r="1.6" fill="#22c55e" stroke="none" />
          <circle cx="27" cy="20.5" r="1.6" fill="#ef4444" stroke="none" />
          <path fill="#fdba74" d="M17 37h14l-1 5H18z" />
        </>
      ),
    },
  ],
  [
    'cestoviny',
    {
      hue: 45,
      art: (
        <>
          <path fill="none" stroke="#9ca3af" d="M36 3l-6 20" />
          <ellipse cx="24" cy="34" rx="21" ry="9" fill="#fff" />
          <path fill="#fcd34d" d="M9 32c0-9 7-14 15-14s15 5 15 14z" />
          <path fill="none" d="M13 28c3-3 5 1 8-2s5 1 8-2 4 1 6 0M15 23c3-2 5 1 8-1s4 1 7-1" />
          <circle cx="19" cy="21" r="3.5" fill="#ef4444" />
          <circle cx="29" cy="24" r="3" fill="#ef4444" />
          <path fill="#22c55e" d="M23 17c2-3 5-3 6-1-2 2-4 2-6 1z" />
        </>
      ),
    },
  ],
  [
    'ryby',
    {
      hue: 200,
      art: (
        <>
          <path fill="#0ea5e9" d="M35 24l9-9v18z" />
          <path fill="#38bdf8" d="M4 24c7-11 24-13 32 0-8 13-25 11-32 0z" />
          <path fill="none" d="M24 15c-3 6-3 12 0 18" />
          <circle cx="12" cy="22" r="2" fill={INK} stroke="none" />
          <path fill="#7dd3fc" d="M18 12c3-4 8-4 10 0z" />
          <circle cx="42" cy="6" r="2" fill="#e0f2fe" />
          <circle cx="37" cy="9" r="1.3" fill="#e0f2fe" />
        </>
      ),
    },
  ],
  [
    'kuracie',
    {
      hue: 32,
      art: (
        <>
          <path fill="#fff7ed" d="M21 27l-9 9" strokeWidth="6" stroke={INK} />
          <path fill="none" d="M21 27l-9 9" strokeWidth="3" stroke="#fff7ed" />
          <circle cx="9" cy="35" r="3.5" fill="#fff7ed" />
          <circle cx="13" cy="39.5" r="3.5" fill="#fff7ed" />
          <ellipse cx="29" cy="19" rx="14" ry="11" fill="#d97706" transform="rotate(-45 29 19)" />
          <path fill="none" stroke="#fde68a" d="M24 12c3-3 8-3 11 0" />
        </>
      ),
    },
  ],
  [
    'mäso',
    {
      hue: 350,
      art: (
        <>
          <path fill="#fecdd3" d="M5 26C5 14 17 7 28 9c10 2 16 8 14 17-2 10-14 13-23 12C11 37 5 32 5 26z" />
          <path fill="#e11d48" d="M9 26c0-9 9-14 18-13 8 1 12 6 11 12-1 8-10 10-18 9-6-1-11-4-11-8z" />
          <circle cx="29" cy="21" r="4.5" fill="#fff7ed" />
          <path fill="none" stroke="#fda4af" d="M14 27c3 2 7 2 9 0M17 20c2-1 4-1 5 1" />
        </>
      ),
    },
  ],
  [
    'tacos',
    {
      hue: 50,
      art: (
        <>
          <path fill="#22c55e" d="M7 20c1-5 5-6 7-3 1-5 6-6 8-2 2-4 7-4 8 0 3-3 7-2 8 2 2-1 4 1 3 3z" />
          <circle cx="16" cy="17" r="2.5" fill="#ef4444" />
          <circle cx="31" cy="16" r="2.5" fill="#ef4444" />
          <circle cx="24" cy="15" r="2" fill="#fde047" />
          <path fill="#facc15" d="M5 20a19 19 0 0 0 38 0z" />
          <path fill="none" stroke="#ca8a04" d="M12 27h2M20 33h2M30 29h2M24 25h2" />
        </>
      ),
    },
  ],
  [
    'ázijské',
    {
      hue: 5,
      art: (
        <>
          <path fill="none" stroke="#a16207" strokeWidth="2.5" d="M25 3l13 19M31 2l9 17" />
          <path fill="none" stroke="#fbbf24" strokeWidth="2.5" d="M13 22c0-6 4-6 4 0s4 6 4 0 4-6 4 0 4 6 4 0 4-6 4 0" />
          <path fill="#ef4444" d="M5 22h38a19 17 0 0 1-38 0z" />
          <path fill="none" stroke="#fff" d="M11 30c3-2 5 2 8 0s5 2 8 0 5 2 8 0" />
          <path fill="#fca5a5" d="M18 38h12l-1 4H19z" />
        </>
      ),
    },
  ],
  [
    'šalát',
    {
      hue: 110,
      art: (
        <>
          <ellipse cx="15" cy="17" rx="8" ry="5" fill="#4ade80" transform="rotate(-30 15 17)" />
          <ellipse cx="33" cy="16" rx="8" ry="5" fill="#86efac" transform="rotate(25 33 16)" />
          <ellipse cx="24" cy="13" rx="5" ry="8" fill="#22c55e" />
          <circle cx="29" cy="20" r="3.5" fill="#ef4444" />
          <circle cx="18" cy="21" r="3" fill="#fde047" />
          <path fill="#fef3c7" d="M5 22h38a19 17 0 0 1-38 0z" />
          <path fill="none" stroke="#84cc16" d="M12 30h24" />
        </>
      ),
    },
  ],
  [
    'raňajky',
    {
      hue: 42,
      art: (
        <>
          <path fill="#64748b" d="M36 30l10 6-2 3-10-6z" />
          <circle cx="21" cy="25" r="17" fill="#475569" />
          <path fill="#fff" d="M10 24c0-7 6-10 11-9s7-2 10 1 3 8 0 12-8 7-13 6-8-4-8-10z" />
          <circle cx="21" cy="24" r="5" fill="#fbbf24" />
          <path fill="none" stroke="#fff" d="M19 22c1-1 2-1 3-1" />
        </>
      ),
    },
  ],
  [
    'dezert',
    {
      hue: 330,
      art: (
        <>
          <path fill="#fbcfe8" d="M7 22h34v18H7z" />
          <path fill="#fff" d="M7 30h34v3H7z" />
          <path fill="#fff1f2" d="M7 22l22-11 12 11z" />
          <path fill="none" d="M29 9c1-3 3-5 6-5" />
          <circle cx="29" cy="10" r="4" fill="#ef4444" />
          <circle cx="15" cy="37" r="1.2" fill="#ec4899" stroke="none" />
          <circle cx="26" cy="26" r="1.2" fill="#ec4899" stroke="none" />
          <circle cx="35" cy="37" r="1.2" fill="#ec4899" stroke="none" />
        </>
      ),
    },
  ],
  [
    'pečenie',
    {
      hue: 265,
      art: (
        <>
          <path fill="#818cf8" d="M11 26h26l-3 17H14z" />
          <path fill="none" stroke="#c7d2fe" d="M18 28l1 13M24 28v13M30 28l-1 13" />
          <path fill="#a16207" d="M8 27c0-9 7-16 16-16s16 7 16 16z" />
          <path fill="#fde68a" d="M19 11c2-4 8-4 10 0" />
          <circle cx="17" cy="21" r="2.2" fill="#6366f1" />
          <circle cx="27" cy="18" r="2.2" fill="#6366f1" />
          <circle cx="31" cy="24" r="2.2" fill="#6366f1" />
        </>
      ),
    },
  ],
  [
    'omáčka',
    {
      hue: 15,
      art: (
        <>
          <rect x="13" y="4" width="22" height="7" rx="2" fill="#fbbf24" />
          <path fill="#f87171" d="M11 14c0-2 2-3 4-3h18c2 0 4 1 4 3v24c0 3-2 5-5 5H16c-3 0-5-2-5-5z" />
          <rect x="15" y="21" width="18" height="11" rx="2" fill="#fff" />
          <path fill="none" stroke="#f87171" d="M19 27c2-2 4 2 6 0s3 1 4 0" />
        </>
      ),
    },
  ],
  [
    'vegetariánske',
    {
      hue: 85,
      art: (
        <>
          <path fill="#22c55e" d="M30 10c-1-5 2-8 6-8-1 4-2 6-6 8zM32 12c3-4 8-4 11-1-4 2-7 3-11 1zM31 11c1-3 1-7-2-9" />
          <path fill="#fb923c" d="M8 41c2-9 12-23 19-28 5 1 8 4 8 8-4 7-17 17-27 20z" />
          <path fill="none" stroke="#c2410c" d="M18 28l4 2M14 34l4 1M24 21l3 2" />
        </>
      ),
    },
  ],
  [
    'rýchlovka',
    {
      hue: 52,
      art: <path fill="#facc15" d="M27 3L9 27h13l-4 18 21-26H26z" />,
    },
  ],
  [
    'slovenské',
    {
      hue: 0,
      art: (
        <>
          <path fill="#ef4444" d="M24 42S5 30 5 17a9.5 9.5 0 0 1 19-3 9.5 9.5 0 0 1 19 3c0 13-19 25-19 25z" />
          <circle cx="24" cy="23" r="4" fill="#fde047" />
          <path fill="#fff" stroke="none" d="M24 13.5a3 3 0 1 1 0 5 3 3 0 1 1 0-5zM24 27.5a3 3 0 1 1 0 5 3 3 0 1 1 0-5z" />
          <circle cx="16" cy="23" r="2" fill="#fff" stroke="none" />
          <circle cx="32" cy="23" r="2" fill="#fff" stroke="none" />
        </>
      ),
    },
  ],
  [
    'vianoce',
    {
      hue: 140,
      art: (
        <path
          fill="#fbbf24"
          d="M24 3l6 13 14 1.5-10.5 9.5 3 14L24 34l-12.5 7 3-14L4 17.5 18 16z"
        />
      ),
    },
  ],
  [
    'hlavné jedlo',
    {
      hue: 18,
      art: (
        <>
          <circle cx="24" cy="24" r="16" fill="#fff" />
          <circle cx="24" cy="24" r="10" fill="#fed7aa" />
          <path fill="none" stroke="#94a3b8" strokeWidth="2.5" d="M4 8v8c0 2 1 3 2 3v22M8 8v8M45 8c-4 2-4 10-1 12v21" />
        </>
      ),
    },
  ],
]

const BY_TAG = new Map(CATEGORIES)

/** Cooking pot: used for "Všetko" and for tags without their own icon. */
const FALLBACK: Category = {
  hue: 22,
  art: (
    <>
      <path fill="none" d="M18 6c-2 3 2 4 0 7M30 6c-2 3 2 4 0 7" />
      <path fill="#94a3b8" d="M3 24h5v4H3zM40 24h5v4h-5z" />
      <path fill="#f97316" d="M8 20h32v16c0 4-3 6-6 6H14c-3 0-6-2-6-6z" />
      <rect x="6" y="16" width="36" height="5" rx="2.5" fill="#fdba74" />
      <rect x="21" y="13" width="6" height="3" rx="1.5" fill="#fdba74" />
      <path fill="none" stroke="#fed7aa" d="M13 26v8" />
    </>
  ),
}

function hashHue(text: string) {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) % 360
  return h
}

/** Hue for a tag chip: the category's own color, or a stable hash for free-form tags. */
export function tagHue(tag: string): number {
  return BY_TAG.get(tag)?.hue ?? hashHue(tag)
}

/** The most specific known category among a recipe's tags, if any. */
export function primaryCategory(tags: string[]): string | undefined {
  return CATEGORIES.find(([tag]) => tags.includes(tag))?.[0]
}

export function CategoryIcon({
  tag,
  size = 20,
  className,
  style,
}: {
  tag?: string
  size?: number | string
  className?: string
  style?: CSSProperties
}) {
  const category = (tag && BY_TAG.get(tag)) || FALLBACK
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      stroke={INK}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {category.art}
    </svg>
  )
}

/** Inline style that tints a chip with its tag's hue (consumed as --chip-hue in CSS). */
export const chipStyle = (tag: string) => ({ '--chip-hue': tagHue(tag) }) as CSSProperties
