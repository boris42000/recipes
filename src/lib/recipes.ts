import recipes from 'virtual:recipes'
import { createSearch } from './search'
import type { Recipe } from './schema'

export { recipes }
export const searchRecipes = createSearch(recipes)
export const getRecipe = (slug: string) => recipes.find((r) => r.slug === slug)


/** Frontmatter stores "/images/x.webp"; prefix with the site base ("/recipes/"). */
export function imageUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src
  return import.meta.env.BASE_URL + src.replace(/^\/+/, '')
}

/** Prep + cook minutes, or undefined when the recipe states neither. */
export function totalTime(r: Pick<Recipe, 'prepTime' | 'cookTime'>): number | undefined {
  if (r.prepTime === undefined && r.cookTime === undefined) return undefined
  return (r.prepTime ?? 0) + (r.cookTime ?? 0)
}
