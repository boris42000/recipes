import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getRecipe } from '../lib/recipes'
import { GitHubError, getFile, getToken, putFile, setToken } from '../lib/github'
import { parseRecipeSource } from '../lib/validateRecipe'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { s } from '../strings'
import styles from './EditRecipePage.module.css'

type Loaded = { content: string; sha: string }

function errorMessage(e: unknown): string {
  if (e instanceof GitHubError) {
    if (e.status === 401) return s.editTokenInvalid
    if (e.status === 403 || e.status === 404) return s.editNoAccess
    if (e.status === 409) return s.editConflict
    return `GitHub: ${e.message}`
  }
  return s.editNetworkError
}

export function EditRecipePage() {
  const { slug = '' } = useParams()
  const recipe = getRecipe(slug)
  useDocumentTitle(recipe ? s.editTitle(recipe.title) : s.editRecipe)
  const [token, setTokenState] = useState(getToken)

  if (!token) return <TokenForm onSave={(t) => (setToken(t), setTokenState(t))} />
  return (
    <Editor
      key={slug}
      slug={slug}
      title={recipe?.title ?? slug}
      token={token}
      onSignOut={() => (setToken(null), setTokenState(undefined))}
    />
  )
}

function TokenForm({ onSave }: { onSave: (token: string) => void }) {
  const [value, setValue] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSave(value.trim())
  }
  return (
    <form className={styles.tokenCard} onSubmit={submit}>
      <h1>🔑 {s.editSignInTitle}</h1>
      <p>{s.editSignInText}</p>
      <label>
        <span>{s.editTokenLabel}</span>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="github_pat_…"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <button type="submit" className="button button-primary" disabled={!value.trim()}>
        {s.editSignIn}
      </button>
    </form>
  )
}

function Editor({
  slug,
  title,
  token,
  onSignOut,
}: {
  slug: string
  title: string
  token: string
  onSignOut: () => void
}) {
  const navigate = useNavigate()
  const path = `recipes/${slug}.md`
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    getFile(token, path)
      .then((file) => {
        if (cancelled) return
        if (!file) return setError(s.notFoundText)
        setLoaded(file)
        setText(file.content)
      })
      .catch((e) => !cancelled && setError(errorMessage(e)))
    return () => {
      cancelled = true
    }
  }, [token, path])

  const dirty = loaded !== null && text !== loaded.content
  const parsed = useMemo(() => (loaded ? parseRecipeSource(text) : null), [loaded, text])

  // Ask before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    addEventListener('beforeunload', warn)
    return () => removeEventListener('beforeunload', warn)
  }, [dirty])

  const save = async () => {
    if (!loaded || !parsed?.ok || !dirty) return
    setSaving(true)
    setError(null)
    try {
      const sha = await putFile(token, path, text, `Update recipe “${slug}”`, loaded.sha)
      setLoaded({ content: text, sha })
      navigate(`/recept/${slug}`, { state: { saved: true } })
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={styles.editor}>
      <div className={styles.topBar}>
        <Link to={`/recept/${slug}`}>← {s.editBack}</Link>
        <button type="button" className={styles.signOut} onClick={onSignOut}>
          {s.editSignOut}
        </button>
      </div>
      <h1>
        ✏️ {title}
      </h1>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {!loaded && !error && <p className={styles.loading}>{s.editLoading}</p>}

      {loaded && (
        <>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label={s.editRecipe}
            aria-invalid={parsed?.ok === false}
          />

          {parsed && !parsed.ok && (
            <ul className={styles.problems} aria-live="polite">
              {parsed.errors.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}

          <div className={styles.actions}>
            <p className={styles.status} aria-live="polite">
              {parsed?.ok === false ? s.editInvalid : dirty ? s.editUnsaved : s.editNoChanges}
            </p>
            <button
              type="button"
              className="button button-primary"
              disabled={!dirty || !parsed?.ok || saving}
              onClick={save}
            >
              {saving ? s.editSaving : s.editSave}
            </button>
          </div>
          <p className={styles.help}>{s.editHelp}</p>
        </>
      )}
    </section>
  )
}
