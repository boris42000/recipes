import type { IngredientGroup } from '../lib/schema'
import { formatAmount, scaleIngredient } from '../lib/format'
import styles from './IngredientList.module.css'

export const ingredientKey = (group: number, item: number) => `${group}-${item}`

type Props = {
  groups: IngredientGroup[]
  factor: number
  checked: string[]
  onToggle: (key: string) => void
  large?: boolean
}

export function IngredientList({ groups, factor, checked, onToggle, large }: Props) {
  return (
    <div className={`${styles.list} ${large ? styles.large : ''}`}>
      {groups.map((group, gi) => (
        <section key={gi}>
          {group.group && <h3>{group.group}</h3>}
          <ul>
            {group.items.map((ing, ii) => {
              const key = ingredientKey(gi, ii)
              const isChecked = checked.includes(key)
              const scaled = scaleIngredient(ing, factor)
              const amount = formatAmount(scaled.qty, scaled.unit)
              return (
                <li key={key}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    className={styles.item}
                    onClick={() => onToggle(key)}
                  >
                    <span className={styles.box} aria-hidden="true" />
                    <span className={styles.text}>
                      {amount && <strong className={styles.amount}>{amount}</strong>} {ing.item}
                      {ing.note && <span className={styles.note}>, {ing.note}</span>}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
