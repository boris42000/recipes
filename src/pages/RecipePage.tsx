import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { getRecipe, totalTime } from '../lib/recipes'
import type { Recipe } from '../lib/schema'
import { RecipeImage } from '../components/RecipeImage'
import { CategoryIcon, chipStyle } from '../components/CategoryIcon'
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
  // Recipes without a stated portion count can't be scaled, so the stepper is hidden for them.
  const baseServings = recipe.servings
  const [servings, setServings] = useSessionState(`servings:${recipe.slug}`, baseServings ?? 1)
  const [checked, setChecked] = useSessionState<string[]>(`checked:${recipe.slug}`, [])
  const factor = baseServings ? servings / baseServings : 1
  const total = totalTime(recipe)
  const times = [
    [s.prepTime, recipe.prepTime],
    [s.cookTime, recipe.cookTime],
    [s.totalTime, recipe.prepTime !== undefined && recipe.cookTime !== undefined ? total : undefined],
  ].filter((t): t is [string, number] => t[1] !== undefined)

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
      <div className={styles.topBar}>
        <Link
          to="/"
          className={styles.back}
          onClick={(e) => {
            // Came here from a list inside the app: go back to it (with its category and filters).
            if (location.key !== 'default') {
              e.preventDefault()
              navigate(-1)
            }
          }}
        >
          ← {s.backToList}
        </Link>
        <Link to={`/recept/${recipe.slug}/upravit`} className={styles.edit}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="currentColor"
              d="M15.2 4.6a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1 0 2.8L9.2 19H5v-4.2L15.2 4.6ZM7 15.6V17h1.4l8.6-8.6-1.4-1.4L7 15.6Z"
            />
          </svg>
          {s.editRecipe}
        </Link>
      </div>

      {location.state?.saved && (
        <p className={styles.saved} role="status">
          {s.editSaved}
        </p>
      )}

      <RecipeImage recipe={recipe} className={styles.hero} />

      <header className={styles.header}>
        <h1>{recipe.title}</h1>
        <p className={styles.description}>{recipe.description}</p>
        {times.length > 0 && (
          <dl className={styles.times}>
            {times.map(([label, minutes]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{formatDuration(minutes)}</dd>
              </div>
            ))}
          </dl>
        )}
        {recipe.tags.length > 0 && (
          <ul className={styles.tags}>
            {recipe.tags.map((t) => (
              <li key={t}>
                <Link to={`/?tag=${encodeURIComponent(t)}`} style={chipStyle(t)}>
                  <CategoryIcon tag={t} size={18} />
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      {recipe.steps.length > 0 && (
        <button type="button" className={`button button-primary ${styles.cookButton}`} onClick={openCookMode}>
          {s.cookMode}
        </button>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>{s.ingredients}</h2>
          {baseServings !== undefined && (
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
          )}
        </div>
        {baseServings !== undefined && servings !== baseServings && (
          <button type="button" className={styles.linkButton} onClick={() => setServings(baseServings)}>
            {s.resetServings} ({s.servings(baseServings)})
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
        {recipe.steps.length > 0 ? (
          <ol className={styles.steps}>
            {recipe.steps.map((html, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </ol>
        ) : (
          <p className={styles.hint}>{s.noSteps}</p>
        )}
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

      {cooking && recipe.steps.length > 0 && (
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
