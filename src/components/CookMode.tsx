import { useEffect, useRef, useState } from 'react'
import type { Recipe } from '../lib/schema'
import { useWakeLock } from '../hooks/useWakeLock'
import { IngredientList } from './IngredientList'
import { s } from '../strings'
import styles from './CookMode.module.css'

type Props = {
  recipe: Recipe
  factor: number
  checked: string[]
  onToggle: (key: string) => void
  onClose: () => void
}

export function CookMode({ recipe, factor, checked, onToggle, onClose }: Props) {
  const [step, setStep] = useState(0)
  const [showIngredients, setShowIngredients] = useState(false)
  const wakeLock = useWakeLock(true)
  const dialogRef = useRef<HTMLDivElement>(null)
  const total = recipe.steps.length
  const isLast = step === total - 1

  const next = () => (isLast ? onClose() : setStep((i) => i + 1))
  const prev = () => setStep((i) => Math.max(0, i - 1))

  // Lock page scroll behind the overlay and move focus into it.
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (showIngredients) return
      else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div
      ref={dialogRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${s.cookMode}: ${recipe.title}`}
      tabIndex={-1}
    >
      <header className={styles.top}>
        <button type="button" className={styles.close} onClick={onClose} aria-label={s.close}>
          ✕
        </button>
        <div className={styles.title}>
          <strong>{recipe.title}</strong>
          <span>{s.stepOf(step + 1, total)}</span>
        </div>
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={showIngredients}
          onClick={() => setShowIngredients((v) => !v)}
        >
          {showIngredients ? s.hideIngredients : s.showIngredients}
        </button>
      </header>

      <div className={styles.progress} aria-hidden="true">
        <div style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      {showIngredients ? (
        <div className={styles.ingredients}>
          <IngredientList groups={recipe.ingredients} factor={factor} checked={checked} onToggle={onToggle} large />
        </div>
      ) : (
        // The whole step area is one big tap target: wet hands, no precision needed.
        <button type="button" className={styles.step} onClick={next} aria-live="polite">
          <span className={styles.stepNumber}>{step + 1}</span>
          <span className={styles.stepText} dangerouslySetInnerHTML={{ __html: recipe.steps[step] ?? '' }} />
          <span className={styles.tapHint}>{s.tapForNext}</span>
        </button>
      )}

      <footer className={styles.bottom}>
        <button type="button" className="button" onClick={prev} disabled={step === 0 || showIngredients}>
          ← {s.prevStep}
        </button>
        <button type="button" className="button button-primary" onClick={next} disabled={showIngredients}>
          {isLast ? s.finish : `${s.nextStep} →`}
        </button>
        <p className={styles.wake}>
          {wakeLock === 'unsupported' ? s.wakeLockUnsupported : wakeLock === 'active' ? `☀ ${s.wakeLockActive}` : ''}
        </p>
      </footer>
    </div>
  )
}
