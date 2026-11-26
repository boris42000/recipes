import type { CSSProperties } from 'react'
import type { Recipe } from '../lib/schema'
import { imageUrl } from '../lib/recipes'
import { CategoryIcon, primaryCategory, tagHue } from './CategoryIcon'
import styles from './RecipeImage.module.css'

/** Stable small tilt per recipe, so the stickers look hand-placed but don't jump between visits. */
function tilt(slug: string) {
  let h = 0
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) % 997
  return (h % 17) - 8
}

export function RecipeImage({ recipe, className = '' }: { recipe: Recipe; className?: string }) {
  if (recipe.image) {
    return (
      <img
        className={`${styles.image} ${className}`}
        src={imageUrl(recipe.image)}
        alt=""
        loading="lazy"
        decoding="async"
      />
    )
  }
  const category = primaryCategory(recipe.tags)
  const hue = category ? tagHue(category) : tagHue(recipe.slug)
  return (
    <div
      className={`${styles.placeholder} ${className}`}
      style={{ '--hue': hue, '--tilt': `${tilt(recipe.slug)}deg` } as CSSProperties}
      aria-hidden="true"
    >
      <CategoryIcon tag={category} size="42%" className={styles.icon} />
    </div>
  )
}
