import './dice-to-roll.css'
import { html, signal } from 'lithen-fns'
import { d20Icon } from '../common/icons'
import { DieTypes, stats } from '../main'
import { DiceGroupRollResult } from '@3d-dice/dice-box'
import { parseRollResults } from '../roll-results/parse-roll-results'

export type DiceToRollCardProps = {
  amount: string
  donateOwner?: string
  dice: {
    red: number
    blackOrBlue: number
  }
  rollDice(quantity: number, type: DieTypes): Promise<DiceGroupRollResult[]>
}

export function diceToRollCard(props: DiceToRollCardProps) {
  const { dice } = props
  
  return html`
    <div class="glass-container dice-to-roll-container">
      <span class="money-display">
        R$ ${props.amount}
      </span>
      
      ${props.donateOwner && html`
        <p title="${props.donateOwner}">
          ${props.donateOwner}
        </p>  
      `}

      <div class="dice-to-roll-dice-btns">
        <div>
          ${diceButton('red', dice.red, props.rollDice)}
        </div>

        <div class="dice-btn-group">
          ${diceButton('black/blue', dice.blackOrBlue, props.rollDice)}
        </div>
      </div>
    </div>
  `
}

function diceButton(
  type: 'red' | 'black/blue',
  quantity: number,
  rollDice: DiceToRollCardProps['rollDice']
) {
  if (quantity <= 0) return

  const diceQuantity = signal(quantity)

  function playRollDice(type: DieTypes) {
    return () => {
      if (diceQuantity.data() === 0) return;

      diceQuantity.set(0)
      
      if (type === 'red') {
        stats.redDiceRolled += quantity
      }
      
      rollDice(quantity, type)
        .then(results => parseRollResults(type, results))
    }
  }
  
  if (type === 'red') {
    return html`
      <button
        class="dice-to-roll-btn ${type}"
        on-click=${playRollDice('red')}
      >
        ${d20Icon()}
        <span>${diceQuantity}</span>
      </button>
    `
  }
  
  return html`
    <button
      class="dice-to-roll-btn black"
      on-click=${playRollDice('black')}
    >
      ${d20Icon()}
      <span>${diceQuantity}</span>
    </button>
    <button
      class="dice-to-roll-btn blue"
      on-click=${playRollDice('blue')}
    >
      ${d20Icon()}
      <span>${diceQuantity}</span>
    </button>
  `
}
