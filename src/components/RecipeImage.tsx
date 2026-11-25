import type { CSSProperties } from 'react'
import type { Recipe } from '../lib/schema'
import { imageUrl } from '../lib/recipes'
import styles from './RecipeImage.module.css'

/** Stable hue per recipe, so placeholders differ but don't change between visits. */
function hue(slug: string) {
  let h = 0
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) % 360
  return h
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
  return (
    <div
      className={`${styles.placeholder} ${className}`}
      style={{ '--hue': hue(recipe.slug) } as CSSProperties}
      aria-hidden="true"
    >
      <span>{recipe.title.charAt(0)}</span>
    </div>
  )
}
