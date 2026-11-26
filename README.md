# Naše recepty

Our personal recipe site. Live at **https://boris42000.github.io/recipes/**.

The git repo *is* the database. Every recipe is one Markdown file in [`recipes/`](recipes/). There is no backend: the site is static, built with Vite + React + TypeScript, deployed to GitHub Pages, and works offline as a PWA. The UI is in Slovak, and all of its text lives in [`src/strings.ts`](src/strings.ts).

## Adding a recipe

### Via the editor (no git needed)

1. Open **https://boris42000.github.io/recipes/admin/**.
2. Click **Sign In with Token** and paste your GitHub token (see [one-time setup](#one-time-setup)). The token stays in your browser.
3. Click **Recepty → Nový recept**, fill in the form, and save.

Saving commits straight to `main`. GitHub Actions then rebuilds the site, and it's live in about a minute. Uploaded photos are converted to WebP (at most 1200 px wide) in the browser before they are committed.

The editor UI follows the browser language (Slovak is supported). To change it, open the account menu → Settings.

### By hand

Create `recipes/<slug>.md`. The filename must be lowercase ASCII with dashes, without diacritics: `bryndzove-halusky.md`. Commit and push.

```markdown
---
title: Bryndzové halušky
description: Klasika zo zemiakového cesta s bryndzou a chrumkavou slaninou.
servings: 4         # optional
prepTime: 25        # optional, minutes
cookTime: 20        # optional, minutes
tags: [slovenské, hlavné jedlo]
image: /images/bryndzove-halusky.webp   # optional, file in public/images/
source: https://example.com/recept      # optional, URL or free text ("babka")
ingredients:
  - group: Halušky            # optional group heading
    items:
      - { qty: 1, unit: kg, item: zemiaky, note: múčnaté }
      - { qty: 1, unit: ks, item: vajce }
      - { item: soľ, note: podľa chuti }   # no qty → never scaled
---

1. Steps go here as a **numbered list**.
2. Each list item is one step in cook mode.

## Poznámky
- Anything after the list (notes, tips) is shown below the steps.
```

### Frontmatter schema

| Field | Type | Required |
|---|---|---|
| `title` | string | ✓ |
| `description` | string | ✓ |
| `servings` | integer ≥ 1 (without it the portion stepper is hidden) | |
| `prepTime`, `cookTime` | integer minutes ≥ 0 (shown only when set) | |
| `tags` | list of strings | |
| `image` | path like `/images/x.webp`, or a full URL | |
| `source` | string (URL or text) | |
| `ingredients` | list of groups `{ group?, items }` | ✓ (≥ 1) |
| `ingredients[].items[]` | `{ qty?, unit?, item, note? }` | `item` ✓ |

Allowed units: `g`, `kg`, `ml`, `l`, `ks`, `lyžica`, `lyžička`, `štipka`, `strúčik`, `hrnček`, `hrsť`, `plechovka`, `balenie`. To add one, edit `UNITS` in [`src/lib/schema.ts`](src/lib/schema.ts), the `unit` options in [`public/admin/config.yml`](public/admin/config.yml), the plural forms in `src/strings.ts`, and the rounding in `src/lib/format.ts`.

### Categories and icons

Tags double as categories. These tags have their own colorful icon and color (defined in [`src/components/CategoryIcon.tsx`](src/components/CategoryIcon.tsx)): `polievka`, `cestoviny`, `ryby`, `kuracie`, `mäso`, `tacos`, `ázijské`, `šalát`, `raňajky`, `dezert`, `pečenie`, `omáčka`, `vegetariánske`, `rýchlovka`, `slovenské`, `vianoce`, `hlavné jedlo`. A recipe without a photo shows the icon of its most specific category. Any other tag gets a cooking pot.

Recipes that still need a method are listed in [`TODO-RECEPTY.md`](TODO-RECEPTY.md).

The body must contain the steps as a numbered list. Unknown fields are rejected, so typos like `servngs` are caught.

**Validation:** `npm run build` (and therefore every deploy) fails if any recipe is invalid, and the error names the file and field:

```
Error: Invalid recipe(s):
  ✗ recipes/zly-recept.md: field "servings": Invalid input: expected number, received string
  ✗ recipes/zly-recept.md: field "ingredients.0.items.0.unit": Invalid option: expected one of "g"|"kg"|…
```

A recipe saved from the editor with a mistake won't break the live site. The deploy fails, and the previous version stays up until the file is fixed.

### Photos

Put them in `public/images/` and reference them as `/images/name.webp`. A pre-commit hook (installed automatically by `npm install`) resizes staged photos wider than 1200 px, or larger than 350 kB, in place using sharp. Run `npm run images` to process the whole folder.

## Local development

```sh
npm install
npm run dev        # http://localhost:5173/recipes/  (editor: /recipes/admin/)
npm run build      # typecheck + validate recipes + build into dist/
npm run preview    # serve dist/ at http://localhost:4173/recipes/
```

Requires Node 22+. Recipe edits hot-reload in dev. In Chrome or Edge, the local `/admin` can also edit your checked-out files directly: choose "Work with Local Repository" on the sign-in screen.

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): `npm ci` → `npm run build` → publish `dist/` to GitHub Pages.

## One-time setup

1. **Create the repo.** Make a GitHub repo named `recipes` under `boris42000` and push `main`. The name must match `base` in `vite.config.ts` and `repo` in `public/admin/config.yml`.
2. **Enable Pages.** Go to Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. **Give your partner access.** Settings → Collaborators → invite her GitHub account with write access.
4. **Create an editor token** (each person does this once):
   - GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
   - Repository access: **Only select repositories** → `recipes`. As a collaborator, choose `boris42000` as the resource owner if asked.
   - Repository permissions: **Contents: Read and write** (Metadata: read is added automatically).
   - Pick an expiration (up to a year) and generate the token. Paste it into `/admin` → *Sign In with Token*.
   - When it expires, generate a new one and sign in again.

No OAuth app or auth server is needed.

## How it works

- **Recipes → app:** [`build/recipes-plugin.ts`](build/recipes-plugin.ts) is a small Vite plugin. It reads `recipes/*.md`, validates the frontmatter with zod ([`src/lib/schema.ts`](src/lib/schema.ts)), pre-renders the Markdown, and exposes everything as the `virtual:recipes` module. Recipe text ships inside the JS bundle, so neither zod nor a Markdown parser reaches the browser.
- **Routing:** `BrowserRouter` with clean URLs (`/recipes/recept/kapustnica`). GitHub Pages has no SPA rewrites, so the build copies `index.html` to `404.html`, and deep links still boot the app (with a harmless 404 status on the very first load). Once the service worker is installed, it serves the app for every route, offline too. We chose this over `HashRouter` so links stay clean and shareable.
- **Search:** MiniSearch over title, tags and ingredient names. Text is NFD-normalised with diacritics stripped on both sides, so `halusky` finds *halušky*.
- **Offline:** vite-plugin-pwa precaches the app shell, which contains every recipe's text. Photos are cached the first time they are viewed.
- **Cook mode:** `?varenie` in the URL, so the phone's back gesture closes it. It uses the Screen Wake Lock API, re-acquired whenever the tab becomes visible again.

## Planned (not built yet)

- **Import from URL:** a script in `scripts/` that fetches a page, reads its schema.org `Recipe` JSON-LD and writes `recipes/<slug>.md`, maybe triggered from a GitHub Action.
- **Shopping list** combining ingredients from several recipes. `scaleIngredient` in `src/lib/format.ts` is reusable for this.
- **"Uvarené" log and ratings** as new optional frontmatter fields: add them to the zod schema and the CMS config.
