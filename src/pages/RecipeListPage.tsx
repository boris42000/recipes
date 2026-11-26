import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router'
import { recipes, searchRecipes, totalTime } from '../lib/recipes'
import { getCourse, inCourse } from '../lib/courses'
import { RecipeImage } from '../components/RecipeImage'
import { CategoryIcon, chipStyle, tagHue } from '../components/CategoryIcon'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDuration, s } from '../strings'
import { HomeHero } from './HomeHero'
import { CourseTiles } from './CourseTiles'
import styles from './RecipeListPage.module.css'

/** Tags sorted by how often they occur in the given recipes, then alphabetically. */
function tagsOf(list: typeof recipes): string[] {
  const counts = new Map<string, number>()
  for (const r of list) for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'sk')).map(([t]) => t)
}

export function RecipeListPage() {
  // Search, course and tag live in the URL so "back" from a recipe restores them.
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const tag = params.get('tag')
  const course = getCourse(params.get('kategoria'))
  const showAll = params.has('vsetko')
  const isHome = !query && !tag && !course && !showAll
  // The input keeps its own text: router updates to ?q= land asynchronously, and binding the input to the
  // URL directly would drop letters typed in between. The URL just follows along.
  const [text, setText] = useState(query)
  useEffect(() => {
    if (!query) setText('') // e.g. clicking the site title or "Zrušiť filtre"
  }, [query])
  useDocumentTitle(course?.title ?? tag ?? undefined)

  // Recipes in the current course (or all), before search and tag narrow them down.
  const inScope = useMemo(() => (course ? recipes.filter((r) => inCourse(r, course)) : recipes), [course])
  const chips = useMemo(() => tagsOf(inScope).filter((t) => !course?.tags.includes(t)), [inScope, course])

  const results = useMemo(() => {
    const matched = query.trim() ? searchRecipes(query).filter((r) => inScope.includes(r)) : inScope
    return tag ? matched.filter((r) => r.tags.includes(tag)) : matched
  }, [query, tag, inScope])

  const update = (changes: Record<string, string | null>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(changes)) {
          if (value === null) next.delete(key)
          else next.set(key, value)
        }
        // Clearing every filter outside a course would land on the home page; keep showing the full list.
        if (!next.get('q') && !next.has('tag') && !next.has('kategoria')) next.set('vsetko', '')
        return next
      },
      { replace: true },
    )

  if (recipes.length === 0) return <p className="message">{s.emptyCollection}</p>

  const heading = course?.title ?? tag ?? (query ? s.searchResults : s.allRecipesTitle)
  const headingIcon = course?.icon ?? tag ?? undefined

  return (
    <>
      {isHome && <HomeHero />}

      {!isHome && (
        <div className={styles.listHead} style={{ '--hue': tagHue(headingIcon ?? 'všetko') } as CSSProperties}>
          <Link to="/" className={styles.homeLink}>
            ← {s.categories}
          </Link>
          <h1>
            {headingIcon && <CategoryIcon tag={headingIcon} size={44} />}
            {heading}
          </h1>
        </div>
      )}

      {/* Same position in both views, so typing on the home page doesn't lose focus when the list appears. */}
      <search className={styles.controls}>
        <label className={styles.searchBox}>
          <span className="visually-hidden">{s.searchLabel}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M10 4a6 6 0 1 0 3.9 10.6l4.7 4.7 1.4-1.4-4.7-4.7A6 6 0 0 0 10 4Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
            />
          </svg>
          <input
            type="search"
            value={text}
            placeholder={s.searchPlaceholder}
            onChange={(e) => {
              setText(e.target.value)
              if (isHome) setParams({ q: e.target.value }, { replace: true })
              else update({ q: e.target.value || null })
            }}
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>

        {!isHome && chips.length > 0 && (
          <div className={styles.tags} role="group" aria-label={s.tagsLabel}>
            <button type="button" aria-pressed={!tag} onClick={() => update({ tag: null })}>
              <CategoryIcon tag={course?.icon} />
              {s.allTags}
            </button>
            {chips.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                style={chipStyle(t)}
                onClick={() => update({ tag: tag === t ? null : t })}
              >
                <CategoryIcon tag={t} />
                {t}
              </button>
            ))}
          </div>
        )}
      </search>

      {isHome ? (
        <CourseTiles />
      ) : results.length === 0 ? (
        <div className="message">
          <p>{s.noResults}</p>
          <button type="button" className="button" onClick={() => update({ q: null, tag: null })}>
            {s.clearFilters}
          </button>
        </div>
      ) : (
        <>
          <p className={styles.count} aria-live="polite">
            {s.recipeCount(results.length)}
          </p>
          <ul className={styles.grid}>
            {results.map((r) => {
              const time = totalTime(r)
              return (
                <li key={r.slug}>
                  <Link to={`/recept/${r.slug}`} className={styles.card}>
                    <RecipeImage recipe={r} />
                    <div className={styles.cardBody}>
                      <h2>{r.title}</h2>
                      {time !== undefined && <p className={styles.time}>⏱ {formatDuration(time)}</p>}
                      {r.tags.length > 0 && (
                        <ul className={styles.cardTags}>
                          {r.tags.map((t) => (
                            <li key={t} style={chipStyle(t)}>
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </>
  )
}
