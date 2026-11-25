import MiniSearch from 'minisearch'
import type { Recipe } from './schema'

/** Lowercase and strip diacritics: "Halušky" → "halusky", "Ľadový čaj" → "ladovy caj". */
export const normalize = (text: string) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function createSearch(recipes: Recipe[]) {
  const index = new MiniSearch<Recipe>({
    idField: 'slug',
    fields: ['title', 'tags', 'ingredients'],
    extractField: (recipe, field) => {
      if (field === 'tags') return recipe.tags.join(' ')
      if (field === 'ingredients')
        return recipe.ingredients.flatMap((g) => g.items.map((i) => i.item)).join(' ')
      return String(recipe[field as keyof Recipe] ?? '')
    },
    processTerm: (term) => normalize(term),
    searchOptions: {
      boost: { title: 3, tags: 2 },
      prefix: true,
      fuzzy: 0.2,
      combineWith: 'AND',
    },
  })
  index.addAll(recipes)

  const bySlug = new Map(recipes.map((r) => [r.slug, r]))
  return (query: string): Recipe[] =>
    index.search(query).flatMap((hit) => bySlug.get(hit.id as string) ?? [])
}
