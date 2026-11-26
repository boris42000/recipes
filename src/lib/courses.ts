// The big tiles on the landing page. A course groups one or more tags ("Sladké" = dezert + pečenie).
import type { Recipe } from './schema'

export type Course = {
  id: string
  title: string
  tagline: string
  /** Tag whose icon and color the tile uses. */
  icon: string
  tags: string[]
}

export const COURSES: Course[] = [
  { id: 'hlavne-jedla', title: 'Hlavné jedlá', tagline: 'Na poriadny obed aj večeru', icon: 'hlavné jedlo', tags: ['hlavné jedlo'] },
  { id: 'polievky', title: 'Polievky', tagline: 'Hrnček niečoho teplého', icon: 'polievka', tags: ['polievka'] },
  { id: 'sladke', title: 'Sladké', tagline: 'Dezerty, koláče a cookies', icon: 'dezert', tags: ['dezert', 'pečenie'] },
  { id: 'ranajky', title: 'Raňajky', tagline: 'Dobré ráno začína tu', icon: 'raňajky', tags: ['raňajky'] },
]

/** Smaller "by taste" chips under the tiles, in display order (only those with recipes are shown). */
export const FLAVOR_TAGS = [
  'kuracie',
  'mäso',
  'ryby',
  'cestoviny',
  'vegetariánske',
  'ázijské',
  'tacos',
  'šalát',
  'rýchlovka',
  'slovenské',
  'omáčka',
]

export const getCourse = (id: string | null) => COURSES.find((c) => c.id === id)

export const inCourse = (recipe: Recipe, course: Course) => recipe.tags.some((t) => course.tags.includes(t))
