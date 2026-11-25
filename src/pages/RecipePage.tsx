import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { getRecipe } from '../lib/recipes'
import type { Recipe } from '../lib/schema'
import { RecipeImage } from '../components/RecipeImage'
import { IngredientList } from '../components/IngredientList'
import { CookMode } from '../components/CookMode'
import { useSessionState } from '../hooks/useSessionState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDuration, s } from '../strings'
import { NotFoundPage } from './NotFoundPage'
import styles from './RecipePage.module.css'

export function RecipePage() {
  const { slug = '' } = useParams()
  const recipe = getRecipe(slug)
  // key: reset all per-recipe state when navigating between recipes
  return recipe ? <RecipeView key={recipe.slug} recipe={recipe} /> : <NotFoundPage />
}

function RecipeView({ recipe }: { recipe: Recipe }) {
  useDocumentTitle(recipe.title)
  const [servings, setServings] = useSessionState(`servings:${recipe.slug}`, recipe.servings)
  const [checked, setChecked] = useSessionState<string[]>(`checked:${recipe.slug}`, [])
  const factor = servings / recipe.servings

  // Cook mode is part of the URL (?varenie) so the phone's back button/gesture exits it.
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const cooking = params.has('varenie')
  const openCookMode = () => setParams({ varenie: '' }, { state: { fromRecipe: true } })
  const closeCookMode = () =>
    location.state?.fromRecipe ? navigate(-1) : setParams({}, { replace: true })

  const toggle = (key: string) =>
    setChecked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  const isUrl = recipe.source && /^https?:\/\//.test(recipe.source)

  return (
    <article className={styles.recipe}>
      <Link to="/" className={styles.back}>
        ← {s.backToList}
      </Link>

      <RecipeImage recipe={recipe} className={styles.hero} />

      <header className={styles.header}>
        <h1>{recipe.title}</h1>
        <p className={styles.description}>{recipe.description}</p>
        <dl className={styles.times}>
          <div>
            <dt>{s.prepTime}</dt>
            <dd>{formatDuration(recipe.prepTime)}</dd>
          </div>
          <div>
            <dt>{s.cookTime}</dt>
            <dd>{formatDuration(recipe.cookTime)}</dd>
          </div>
          <div>
            <dt>{s.totalTime}</dt>
            <dd>{formatDuration(recipe.prepTime + recipe.cookTime)}</dd>
          </div>
        </dl>
        {recipe.tags.length > 0 && (
          <ul className={styles.tags}>
            {recipe.tags.map((t) => (
              <li key={t}>
                <Link to={`/?tag=${encodeURIComponent(t)}`}>{t}</Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      <button type="button" className={`button button-primary ${styles.cookButton}`} onClick={openCookMode}>
        {s.cookMode}
      </button>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>{s.ingredients}</h2>
          <div className={styles.stepper} role="group" aria-label={s.servings(servings)}>
            <button
              type="button"
              aria-label={s.fewerServings}
              disabled={servings <= 1}
              onClick={() => setServings((n) => Math.max(1, n - 1))}
            >
              −
            </button>
            <output aria-live="polite">{s.servings(servings)}</output>
            <button
              type="button"
              aria-label={s.moreServings}
              disabled={servings >= 99}
              onClick={() => setServings((n) => Math.min(99, n + 1))}
            >
              +
            </button>
          </div>
        </div>
        {servings !== recipe.servings && (
          <button type="button" className={styles.linkButton} onClick={() => setServings(recipe.servings)}>
            {s.resetServings} ({s.servings(recipe.servings)})
          </button>
        )}
        <IngredientList groups={recipe.ingredients} factor={factor} checked={checked} onToggle={toggle} />
        <p className={styles.hint}>
          {checked.length > 0 ? (
            <button type="button" className={styles.linkButton} onClick={() => setChecked([])}>
              {s.uncheckAll}
            </button>
          ) : (
            s.checkedHint
          )}
        </p>
      </section>

      <section className={styles.section}>
        <h2>{s.steps}</h2>
        <ol className={styles.steps}>
          {recipe.steps.map((html, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </ol>
      </section>

      {recipe.notesHtml && (
        <section className={`${styles.section} ${styles.notes}`} dangerouslySetInnerHTML={{ __html: recipe.notesHtml }} />
      )}

      {recipe.source && (
        <p className={styles.source}>
          {s.source}:{' '}
          {isUrl ? (
            <a href={recipe.source} target="_blank" rel="noreferrer">
              {new URL(recipe.source).hostname.replace(/^www\./, '')}
            </a>
          ) : (
            recipe.source
          )}
        </p>
      )}

      {cooking && (
        <CookMode
          recipe={recipe}
          factor={factor}
          checked={checked}
          onToggle={toggle}
          onClose={closeCookMode}
        />
      )}
    </article>
  )
}
