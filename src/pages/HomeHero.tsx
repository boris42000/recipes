import { useNavigate } from 'react-router'
import { CategoryIcon } from '../components/CategoryIcon'
import { recipes } from '../lib/recipes'
import { s } from '../strings'
import styles from './HomeHero.module.css'

// Stickers scattered around the headline: [tag, position class].
const STICKERS: [string, string][] = [
  ['polievka', styles.s1],
  ['cestoviny', styles.s2],
  ['dezert', styles.s3],
  ['tacos', styles.s4],
  ['šalát', styles.s5],
  ['pečenie', styles.s6],
]

export function HomeHero() {
  const navigate = useNavigate()
  const surprise = () => {
    const pick = recipes[Math.floor(Math.random() * recipes.length)]
    if (pick) navigate(`/recept/${pick.slug}`)
  }

  return (
    <div className={styles.hero}>
      {STICKERS.map(([tag, cls]) => (
        <CategoryIcon key={tag} tag={tag} size={56} className={`${styles.sticker} ${cls}`} />
      ))}
      <p className={styles.kicker}>{s.homeKicker(recipes.length)}</p>
      <h1 className={styles.title}>
        {s.homeTitleStart} <span className={styles.highlight}>{s.homeTitleHighlight}</span>
      </h1>
      <button type="button" className={styles.surprise} onClick={surprise}>
        <span aria-hidden="true">🎲</span> {s.surprise}
      </button>
    </div>
  )
}
