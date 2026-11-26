// Validation shared by the build (build/recipes-plugin.ts) and the in-site editor.
import { parse as parseYaml } from 'yaml'
import { recipeFrontmatterSchema, type RecipeFrontmatter } from './schema'

export const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export type ParsedRecipe =
  | { ok: true; frontmatter: RecipeFrontmatter; body: string }
  | { ok: false; errors: string[] }

export function parseRecipeSource(raw: string): ParsedRecipe {
  const match = FRONTMATTER_RE.exec(raw)
  if (!match) return { ok: false, errors: ['missing YAML frontmatter (the file must start with a "---" block)'] }
  const [, yamlSource = '', body = ''] = match

  let data: unknown
  try {
    data = parseYaml(yamlSource)
  } catch (e) {
    return { ok: false, errors: [`invalid YAML: ${(e as Error).message}`] }
  }

  const result = recipeFrontmatterSchema.safeParse(data)
  if (!result.success) {
    return {
      ok: false,
      errors: result.error.issues.map((issue) => {
        const field = issue.path.length ? issue.path.join('.') : '(frontmatter)'
        return `field "${field}": ${issue.message}`
      }),
    }
  }
  return { ok: true, frontmatter: result.data, body }
}
