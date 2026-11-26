import recipes from 'virtual:recipes'
import { createSearch } from './search'
import type { Recipe } from './schema'

export { recipes }
export const searchRecipes = createSearch(recipes)
export const getRecipe = (slug: string) => recipes.find((r) => r.slug === slug)

/** Tags sorted by how many recipes use them, then alphabetically. */
export const allTags: string[] = (() => {
  const counts = new Map<string, number>()
  for (const r of recipes) for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'sk')).map(([t]) => t)
})()

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
