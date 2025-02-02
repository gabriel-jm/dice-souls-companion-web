import './style.css'

import DiceBox from '@3d-dice/dice-box';
import { diceToRollCard } from './roll-display/dice-to-roll'

moneyInput.addEventListener('input', () => {
  const value = moneyInput.value.replace(/\D/g, '')

  if (!value) {
    moneyInput.value = ''
    return
  }

  const moneyAmount = Number(value) / 100
  moneyInput.value = moneyAmount.toFixed(2).replace('.', ',')
})

const diceBox = new DiceBox({
  assetPath: '/assets/',
  container: '#app',
  scale: 4.2,
})

export const stats = {
  totalAmount: 0,
  redDiceRolled: 0
}

moneyForm.addEventListener('submit', event => {
  event.preventDefault()
  const donateOwner = moneyForm.donateOwner
  const moneyInCents = Number(moneyInput.value.replace(',', ''))

  if (moneyInCents === 0) return

  if (moneyInCents >= 200000) {
    moneyForm.reset()
    return
  }

  const moneyValue = moneyInCents / 100

  stats.totalAmount = stats.totalAmount + moneyInCents

  const blueOrBlackDiceToRoll = Math.min(Math.floor(moneyValue / 50), 2)
  const redDice = (stats.totalAmount / 100) / 50

  diceBox.clear()

  const redDiceToRoll = Math.floor(redDice - Math.floor(stats.redDiceRolled))

  if (blueOrBlackDiceToRoll > 0 || redDiceToRoll > 0) {
    diceToRollDiv.replaceChildren(
      diceToRollCard({
        amount: moneyInput.value,
        donateOwner: donateOwner.value,
        dice: {
          red: redDiceToRoll,
          blackOrBlue: blueOrBlackDiceToRoll
        },
        rollDice,
      })
    )
  }

  totalAmountP.innerHTML = `
    <span class="total-amount-span">
      💸 Valor Total: R$ ${(stats.totalAmount / 100).toFixed(2).replace('.', ',')}
    </span>
  `

  moneyForm.reset()
})

export type DieTypes = 'black' | 'blue' | 'red'

const diceColors: Record<DieTypes, string> = {
  black: '#242424',
  red: '#ad2510',
  blue: '#1a30a9'
}

function rollDice(quantity: number, type: DieTypes) {
  const diceCount = Math.floor(quantity)
  const results = diceBox.add(
    `${diceCount}d20`,
    { themeColor: diceColors[type] }
  )

  return results
}

diceBox.init().catch(console.log)
