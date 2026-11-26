import { Link } from 'react-router'
import { CategoryIcon, chipStyle, tagHue } from '../components/CategoryIcon'
import { COURSES, FLAVOR_TAGS, inCourse } from '../lib/courses'
import { recipes } from '../lib/recipes'
import { s } from '../strings'
import type { CSSProperties } from 'react'
import styles from './CourseTiles.module.css'

export function CourseTiles() {
  const flavors = FLAVOR_TAGS.map((tag) => [tag, recipes.filter((r) => r.tags.includes(tag)).length] as const).filter(
    ([, n]) => n > 0,
  )

  return (
    <>
      <ul className={styles.tiles}>
        {COURSES.map((course, i) => {
          const count = recipes.filter((r) => inCourse(r, course)).length
          return (
            <li key={course.id}>
              <Link
                to={`/?kategoria=${course.id}`}
                className={styles.tile}
                style={{ '--hue': tagHue(course.icon), '--i': i } as CSSProperties}
              >
                <CategoryIcon tag={course.icon} size="46%" className={styles.tileIcon} />
                <span className={styles.tileText}>
                  <span className={styles.tileTitle}>{course.title}</span>
                  <span className={styles.tileTagline}>{course.tagline}</span>
                </span>
                <span className={styles.count}>{count}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <h2 className={styles.subhead}>{s.byFlavor}</h2>
      <ul className={styles.flavors}>
        {flavors.map(([tag, n]) => (
          <li key={tag}>
            <Link to={`/?tag=${encodeURIComponent(tag)}`} className={styles.flavor} style={chipStyle(tag)}>
              <CategoryIcon tag={tag} size={28} />
              <span>{tag}</span>
              <small>{n}</small>
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/?vsetko" className={`button ${styles.all}`}>
        {s.allRecipes(recipes.length)} →
      </Link>
    </>
  )
}
