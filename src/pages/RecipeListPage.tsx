import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { allTags, recipes, searchRecipes } from '../lib/recipes'
import { RecipeImage } from '../components/RecipeImage'
import { CategoryIcon, chipStyle } from '../components/CategoryIcon'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDuration, s } from '../strings'
import { totalTime } from '../lib/recipes'
import styles from './RecipeListPage.module.css'

export function RecipeListPage() {
  useDocumentTitle()
  // Search and tag live in the URL so "back" from a recipe restores them.
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const tag = params.get('tag')

  const results = useMemo(() => {
    const matched = query.trim() ? searchRecipes(query) : recipes
    return tag ? matched.filter((r) => r.tags.includes(tag)) : matched
  }, [query, tag])

  const update = (key: 'q' | 'tag', value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )

  if (recipes.length === 0) return <p className="message">{s.emptyCollection}</p>

  return (
    <>
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
            value={query}
            placeholder={s.searchPlaceholder}
            onChange={(e) => update('q', e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
          />
        </label>

        {allTags.length > 0 && (
          <div className={styles.tags} role="group" aria-label={s.tagsLabel}>
            <button type="button" aria-pressed={!tag} onClick={() => update('tag', null)}>
              <CategoryIcon />
              {s.allTags}
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                style={chipStyle(t)}
                onClick={() => update('tag', tag === t ? null : t)}
              >
                <CategoryIcon tag={t} />
                {t}
              </button>
            ))}
          </div>
        )}
      </search>

      {results.length === 0 ? (
        <div className="message">
          <p>{s.noResults}</p>
          <button type="button" className="button" onClick={() => setParams({}, { replace: true })}>
            {s.clearFilters}
          </button>
        </div>
      ) : (
        <>
          <p className={styles.count} aria-live="polite">
            {s.recipeCount(results.length)}
          </p>
          <ul className={styles.grid}>
            {results.map((r) => (
              <li key={r.slug}>
                <Link to={`/recept/${r.slug}`} className={styles.card}>
                  <RecipeImage recipe={r} />
                  <div className={styles.cardBody}>
                    <h2>{r.title}</h2>
                    {totalTime(r) !== undefined && (
                      <p className={styles.time}>⏱ {formatDuration(totalTime(r)!)}</p>
                    )}
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
            ))}
          </ul>
        </>
      )}
    </>
  )
}
