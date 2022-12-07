import { Position } from '../Position'

import { AbstractInput, InputOptions } from './AbstractInput'

import { PLAYER_KILLED } from '@/game/events'
import { getRandomNumber } from '@/util'

export class BotInput extends AbstractInput {
  updateBotDirectionEvent?: Phaser.Time.TimerEvent
  fireRandomlyEvent?: Phaser.Time.TimerEvent
  jumpRandomlyEvent?: Phaser.Time.TimerEvent

  movementAxes: Position = {
    x: 0,
    y: 0
  }

  constructor (options: InputOptions) {
    super(options)
    this.player.setMovementAxes(this.movementAxes)

    this.updateBotDirectionEvent = this.options.scene.time.delayedCall(50, () => {
      this.updateBotDirection()
    })
    this.jumpRandomlyEvent = this.options.scene.time.delayedCall(getRandomNumber(1000, 5000), () => {
      this.jumpRandomly()
    })
    this.fireRandomlyEvent = this.options.scene.time.delayedCall(getRandomNumber(1000, 5000), () => {
      this.fireRandomly()
    })

    this.options.scene.events.on(PLAYER_KILLED, (playerId: number) => {
      if (playerId === this.player.getPlayerId()) {
        this.shutdownBot()
      }
    })
  }

  shutdownBot () {
    this.updateBotDirectionEvent?.remove()
    this.jumpRandomlyEvent?.remove()
    this.fireRandomlyEvent?.remove()
  }

  updateBotDirection () {
    this.movementAxes.x = getRandomNumber(-1, 1)
    this.movementAxes.y = getRandomNumber(-1, 1)

    this.updateBotDirectionEvent = this.options.scene.time.delayedCall(getRandomNumber(500, 1500), () => {
      this.updateBotDirection()
    })
  }

  jumpRandomly () {
    this.player.jump()

    this.jumpRandomlyEvent = this.options.scene.time.delayedCall(getRandomNumber(1000, 5000), () => {
      this.jumpRandomly()
    })
  }

  fireRandomly () {
    this.player.loadWeapon()
    this.player.releaseWeapon()

    this.fireRandomlyEvent = this.options.scene.time.delayedCall(getRandomNumber(1000, 5000), () => {
      this.fireRandomly()
    })
  }
}
