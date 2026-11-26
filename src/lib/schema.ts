// Recipe frontmatter schema. Shared by the build-time loader (Node) and the app (types).
// Keep UNITS in sync with the `unit` select options in public/admin/config.yml.
import { z } from 'zod'

export const UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'ks',
  'lyžica',
  'lyžička',
  'štipka',
  'strúčik',
  'hrnček',
  'hrsť',
  'plechovka',
  'balenie',
] as const
export type Unit = (typeof UNITS)[number]

// The CMS may write `null` or '' for empty optional fields; normalise both to undefined.
const optionalText = z
  .string()
  .trim()
  .nullish()
  .transform((v) => v || undefined)

// Optional: many family recipes are written "od oka" without times or a portion count.
const minutes = z
  .number()
  .int()
  .nonnegative()
  .nullish()
  .transform((v) => v ?? undefined)

export const ingredientSchema = z.strictObject({
  qty: z
    .number()
    .positive()
    .nullish()
    .transform((v) => v ?? undefined),
  unit: z
    .enum(UNITS)
    .nullish()
    .transform((v) => v ?? undefined),
  item: z.string().trim().min(1),
  note: optionalText,
})

export const ingredientGroupSchema = z.strictObject({
  group: optionalText,
  items: z.array(ingredientSchema).min(1),
})

export const recipeFrontmatterSchema = z.strictObject({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  servings: z
    .number()
    .int()
    .positive()
    .nullish()
    .transform((v) => v ?? undefined),
  prepTime: minutes,
  cookTime: minutes,
  tags: z
    .array(z.string().trim().min(1))
    .nullish()
    .transform((v) => v ?? []),
  image: optionalText,
  source: optionalText,
  ingredients: z.array(ingredientGroupSchema).min(1),
  // Planned (not yet used): cooked log, rating — add them here when needed.
})

export type RecipeFrontmatter = z.output<typeof recipeFrontmatterSchema>
export type Ingredient = z.output<typeof ingredientSchema>
export type IngredientGroup = z.output<typeof ingredientGroupSchema>

/** What the app receives from `virtual:recipes`. */
export type Recipe = RecipeFrontmatter & {
  slug: string
  /** Each numbered step pre-rendered to inline HTML. */
  steps: string[]
  /** Everything in the body except the steps list (e.g. "Poznámky"), as HTML. */
  notesHtml: string
}
