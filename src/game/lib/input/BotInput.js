import _ from 'lodash'
import WS from '../../WS'
import logger from 'loglevel'
const log = logger.getLogger('BotInput') // eslint-disable-line no-unused-vars

export default WS.Lib.Input.BotInput = class BotInput extends WS.Lib.Input.AbstractInput {
  constructor (options) {
    super({})
    this.player = options.player
    this.axes = [0, 0]
    this.movement = {
      axes: this.axes
    }

    this.player.onKilledEvent.add(this.shutdownBot, this)
    setTimeout(() => {
      this.updateBotDirection()
    })
    this.fireRandomlyEvent = WS.game.time.events.add(WS.Phaser.Timer.SECOND * _.random(1, 5, true), this.fireRandomly, this)
    this.jumpRandomlyEvent = WS.game.time.events.add(WS.Phaser.Timer.SECOND * _.random(1, 5, true), this.jumpRandomly, this)
  }
  shutdownBot () {
    this.updateBotDirectionEvent.timer.remove(this.updateBotDirectionEvent)
    this.fireRandomlyEvent.timer.remove(this.fireRandomlyEvent)
    this.jumpRandomlyEvent.timer.remove(this.jumpRandomlyEvent)
  }
  updateBotDirection () {
    this.axes[0] = _.random(-1, 1, true)
    this.axes[1] = _.random(-1, 1, true)
    const nextActionDelay = _.random(500, 1500, true)
    this.updateBotDirectionEvent = WS.game.time.events.add(nextActionDelay, this.updateBotDirection, this)
  }
  fireRandomly () {
    this.player.fireWeapon(_.random(0, 100))
    const nextActionDelay = _.random(1, 5, true)
    this.fireRandomlyEvent = WS.game.time.events.add(WS.Phaser.Timer.SECOND * nextActionDelay, this.fireRandomly, this)
  }
  jumpRandomly () {
    this.player.jump()
    const nextActionDelay = _.random(1, 5, true)
    this.jumpRandomlyEvent = WS.game.time.events.add(WS.Phaser.Timer.SECOND * nextActionDelay, this.jumpRandomly, this)
  }
}
