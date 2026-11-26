// Vite plugin that turns /recipes/*.md into the `virtual:recipes` module.
// Runs in Node at build/dev time, so invalid recipes fail `vite build` with a clear message.
import fs from 'node:fs'
import path from 'node:path'
import { marked, type Token, type Tokens } from 'marked'
import { parse as parseYaml } from 'yaml'
import type { Plugin } from 'vite'
import { recipeFrontmatterSchema, type Recipe } from '../src/lib/schema.ts'

const VIRTUAL_ID = 'virtual:recipes'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

// Recipe bodies are plain Markdown; drop any raw HTML so the rendered output is safe to inject.
marked.use({ renderer: { html: () => '' } })

export function recipesPlugin(options: { dir: string; publicDir: string }): Plugin {
  let recipesDir = ''
  let publicDir = ''

  return {
    name: 'recipes',
    configResolved(config) {
      recipesDir = path.resolve(config.root, options.dir)
      publicDir = path.resolve(config.root, options.publicDir)
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      this.addWatchFile(recipesDir)
      const recipes = loadRecipes(recipesDir, publicDir)
      return `export default ${JSON.stringify(recipes)}`
    },
    configureServer(server) {
      // Reload the browser when a recipe is added, edited or removed.
      server.watcher.add(recipesDir)
      const onChange = (file: string) => {
        if (!file.startsWith(recipesDir)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange).on('change', onChange).on('unlink', onChange)
    },
  }
}

export function loadRecipes(recipesDir: string, publicDir: string): Recipe[] {
  const files = fs
    .readdirSync(recipesDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
  const errors: string[] = []
  const recipes: Recipe[] = []

  for (const file of files) {
    const rel = path.join(path.basename(recipesDir), file)
    const fail = (msg: string) => errors.push(`  ✗ ${rel}: ${msg}`)
    const slug = file.slice(0, -'.md'.length)

    if (!SLUG_RE.test(slug)) {
      fail(`filename must be lowercase ASCII words joined by "-" (e.g. bryndzove-halusky.md)`)
      continue
    }

    const raw = fs.readFileSync(path.join(recipesDir, file), 'utf8')
    const match = FRONTMATTER_RE.exec(raw)
    if (!match) {
      fail('missing YAML frontmatter (the file must start with a "---" block)')
      continue
    }
    const [, yamlSource = '', body = ''] = match

    let data: unknown
    try {
      data = parseYaml(yamlSource)
    } catch (e) {
      fail(`invalid YAML: ${(e as Error).message}`)
      continue
    }

    const result = recipeFrontmatterSchema.safeParse(data)
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path.length ? issue.path.join('.') : '(frontmatter)'
        fail(`field "${field}": ${issue.message}`)
      }
      continue
    }
    const fm = result.data

    if (fm.image && !/^https?:\/\//.test(fm.image)) {
      const imagePath = path.join(publicDir, fm.image.replace(/^\/+/, ''))
      if (!fs.existsSync(imagePath)) fail(`field "image": file not found at ${path.relative(process.cwd(), imagePath)}`)
    }

    const { steps, notesHtml } = parseBody(body)
    // No numbered list is fine: the recipe shows its ingredients and a "method missing" note.

    recipes.push({ slug, ...fm, steps, notesHtml })
  }

  if (errors.length) {
    throw new Error(`Invalid recipe(s):\n${errors.join('\n')}\n`)
  }
  return recipes.sort((a, b) => a.title.localeCompare(b.title, 'sk'))
}

/** The first ordered list in the body is the steps; everything else is rendered as notes. */
function parseBody(body: string): { steps: string[]; notesHtml: string } {
  const tokens = marked.lexer(body)
  const stepsList = tokens.find((t): t is Tokens.List => t.type === 'list' && (t as Tokens.List).ordered)
  const steps = stepsList ? stepsList.items.map((item) => marked.parseInline(item.text.trim()) as string) : []

  const rest = tokens.filter((t: Token) => t !== stepsList && t.type !== 'space') as Token[] & {
    links: typeof tokens.links
  }
  rest.links = tokens.links
  const notesHtml = rest.length ? (marked.parser(rest) as string) : ''
  return { steps, notesHtml }
}
