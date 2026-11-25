// All user-facing text lives here (Slovak).
import type { Unit } from './lib/schema'

/** Slovak plural: 1 → one, 2–4 → few, 0 / 5+ → many. Non-integers use "few" (1,5 lyžice). */
export function plural(n: number, one: string, few: string, many: string): string {
  if (!Number.isInteger(n)) return few
  if (n === 1) return one
  if (n >= 2 && n <= 4) return few
  return many
}

const unitForms: Record<Unit, [string, string, string]> = {
  g: ['g', 'g', 'g'],
  kg: ['kg', 'kg', 'kg'],
  ml: ['ml', 'ml', 'ml'],
  l: ['l', 'l', 'l'],
  ks: ['ks', 'ks', 'ks'],
  lyžica: ['lyžica', 'lyžice', 'lyžíc'],
  lyžička: ['lyžička', 'lyžičky', 'lyžičiek'],
  štipka: ['štipka', 'štipky', 'štipiek'],
}

export const unitLabel = (unit: Unit, qty: number) => plural(qty, ...unitForms[unit])

export const s = {
  appName: 'Naše recepty',
  pageTitle: (title: string) => `${title} · Naše recepty`,

  // List page
  searchLabel: 'Hľadať recept',
  searchPlaceholder: 'Hľadať recept alebo surovinu…',
  clearSearch: 'Vymazať hľadanie',
  tagsLabel: 'Filtrovať podľa štítku',
  allTags: 'Všetko',
  recipeCount: (n: number) => `${n} ${plural(n, 'recept', 'recepty', 'receptov')}`,
  emptyCollection: 'Zatiaľ tu nie sú žiadne recepty. Pridaj prvý cez /admin.',
  noResults: 'Nič sme nenašli. Skús iné slovo alebo zruš filter.',
  clearFilters: 'Zrušiť filtre',
  addRecipe: 'Pridať recept',

  // Recipe page
  backToList: 'Všetky recepty',
  prepTime: 'Príprava',
  cookTime: 'Varenie',
  totalTime: 'Spolu',
  source: 'Zdroj',
  ingredients: 'Suroviny',
  steps: 'Postup',
  servings: (n: number) => `${n} ${plural(n, 'porcia', 'porcie', 'porcií')}`,
  fewerServings: 'Menej porcií',
  moreServings: 'Viac porcií',
  resetServings: 'Pôvodný počet',
  uncheckAll: 'Odznačiť suroviny',
  checkedHint: 'Ťuknutím na surovinu ju odškrtneš.',

  // Cook mode
  cookMode: 'Režim varenia',
  stepOf: (i: number, n: number) => `Krok ${i} z ${n}`,
  prevStep: 'Späť',
  nextStep: 'Ďalej',
  finish: 'Hotovo',
  close: 'Zavrieť',
  showIngredients: 'Suroviny',
  hideIngredients: 'Späť na kroky',
  tapForNext: 'Ťukni kamkoľvek pre ďalší krok',
  wakeLockActive: 'Obrazovka zostane zapnutá',
  wakeLockUnsupported: 'Tento prehliadač nevie udržať obrazovku zapnutú.',

  // Errors
  notFoundTitle: 'Recept sa nenašiel',
  notFoundText: 'Tento recept neexistuje alebo bol premenovaný.',
  errorTitle: 'Niečo sa pokazilo',
  errorText: 'Skús stránku obnoviť.',
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
