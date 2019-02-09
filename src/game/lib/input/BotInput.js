import logger from 'loglevel'
import AbstractInput from './AbstractInput.js'
import * as _ from '@/util'
const log = logger.getLogger('BotInput') // eslint-disable-line no-unused-vars

export default class BotInput extends AbstractInput {
  constructor (options) {
    super(options)
    this.player = options.player
    this.axes = [0, 0]
    this.movement = {
      axes: this.axes
    }

    // this.player.onKilledEvent.add(this.shutdownBot, this)
    // this.player.on('killed', () => this.shutdownBot)
    setTimeout(() => {
      this.updateBotDirection()
    })
    // this.time.delayedCall(3000, onEvent, [], this)
    // this.fireRandomlyEvent = this.scene.time.addEvent({
    //   delay: util.getRandomNumber(1000, 5000, true),
    //   callback: this.fireRandomly,
    //   callbackScope: this
    // })
    this.jumpRandomlyEvent = this.scene.time.addEvent({
      delay: _.getRandomNumber(1000, 5000, true),
      callback: this.jumpRandomly,
      callbackScope: this
    })
  }
  shutdownBot () {
    this.updateBotDirectionEvent.timer.remove(this.updateBotDirectionEvent)
    this.fireRandomlyEvent.timer.remove(this.fireRandomlyEvent)
    this.jumpRandomlyEvent.timer.remove(this.jumpRandomlyEvent)
  }
  updateBotDirection () {
    this.axes[0] = _.getRandomNumber(-1, 1, true)
    this.axes[1] = _.getRandomNumber(-1, 1, true)
    const nextActionDelay = _.getRandomNumber(500, 1500, true)
    this.updateBotDirectionEvent = this.scene.time.addEvent({
      delay: nextActionDelay,
      callback: this.updateBotDirection,
      callbackScope: this
    })
  }
  fireRandomly () {
    this.player.fireWeapon(_.getRandomNumber(0, 100))
    const nextActionDelay = _.getRandomNumber(1000, 5000, true)
    this.fireRandomlyEvent = this.scene.time.addEvent({
      delay: nextActionDelay,
      callback: this.fireRandomly,
      callbackScope: this
    })
  }
  jumpRandomly () {
    this.player.jump()
    const nextActionDelay = _.getRandomNumber(1000, 5000, true)
    this.jumpRandomlyEvent = this.scene.time.addEvent({
      delay: nextActionDelay,
      callback: this.jumpRandomly,
      callbackScope: this
    })
  }
}
