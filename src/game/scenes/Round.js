import Phaser from 'phaser'
import _ from 'lodash'
import logger from 'loglevel'

const log = logger.getLogger('Round') // eslint-disable-line no-unused-vars

// import Arena from '@/game/components/Arena.js'
// import PauseMenu from '@/game/components/PauseMenu.js'
// import Player from '@/game/components/PauseMenu.js'
// import GamepadInput from '@/game/lib/input/GamepadInput.js'
// import Config from '@/game/config.js'

export default class Round extends Phaser.Scene {
  init (stateOptions) {
    this.battle = stateOptions.battle
  }
  create () {
    log.info('create')
    WS.Services.PhysicsManager.init()

    this.battle.reset()

    this.pauseMenu = new PauseMenu()
    this.battle.stage.register(this.pauseMenu)
    const arena = new Arena()
    this.battle.stage.register(arena)

    // positions triées pour être dépilées simplement
    this.startLocations = _.chain(arena.getStartPositions()).shuffle().value()
    if (this.battle.players.length > this.startLocations.length) {
      throw new Error(`The world has only ${this.startLocations.length} start locations while there are ${this.activePlayers.length} active players.`)
    }

    this.players = {}
    _.each(this.battle.players, player => {
      this[`assign${player.type}Player`](player.id)
    })

    const letsFightText = this.add.bitmapText(-this.world.centerX, this.world.centerY, 'desyrel', "Let's fight!", 72)
    letsFightText.anchor.setTo(0.5)

    this.textAnimation = this.add.tween(letsFightText)
      .to({
        x: this.world.centerX
      }, 500, WS.Phaser.Easing.Elastic.Out, false, 300)
      .to({
        x: 3 * this.world.centerX
      }, 500, WS.Phaser.Easing.Elastic.In, false, 300)
      .start()

    WS.Services.PhysicsManager.pause()
    setTimeout(() => {
      letsFightText.destroy()
      WS.Services.PhysicsManager.resume()
    }, 1600)
    for (let i = 0; i < 4; i++) {
      const weapon = this.battle.stage.register(new WS.Components[this.getRandomWeapon()]())
      weapon.drop({
        x: _.random(WS.Services.ScaleManager.xp(25), WS.Services.ScaleManager.xp(75)),
        y: _.random(WS.Services.ScaleManager.yp(45), WS.Services.ScaleManager.yp(55))
      })
    }
  }
  getRandomWeapon () {
    return (_.random(0, 2) % 2 === 0) ? 'WeaponSlingshot' : 'WeaponHammer'
  }
  assignGamepadPlayer (playerNumber) {
    const player = this.createPlayer(playerNumber)
    player.setInput(new WS.Lib.Input.GamepadInput({
      pad: WS.Services.PadManager.getGamepad(playerNumber)
    }))
  }
  assignKeyboardPlayer (playerNumber) {
    const player = this.createPlayer(playerNumber)
    player.setInput(new WS.Lib.Input.KeyboardInput())
  }
  assignBotPlayer (playerNumber) {
    const player = this.createPlayer(playerNumber)
    player.setInput(new WS.Lib.Input.BotInput({
      player: player
    }))
  }
  createPlayer (playerNumber) {
    const player = this.players[playerNumber] = new Player({
      playerNumber: playerNumber,
      color: Config.PlayerColors[playerNumber],
      startLocation: this.getNextStartLocation()
    })
    const weapon = new WS.Components[this.getRandomWeapon()]({
      owner: player
    })
    player.pickupWeapon(weapon)
    this.battle.stage.register(weapon)
    this.battle.stage.register(player)
    return player
  }
  getNextStartLocation () {
    return this.startLocations.splice(0, 1)[0]
  }
  update () {
    this.battle.stage.update()
  }
  pauseUpdate () {
    this.battle.stage.pauseUpdate()
  }
  render () {
    this.battle.stage.render()
    // FPS
    this.debug.text(this.time.fps, this.world.width - 25, 14, '#f00')
  }
  shutdown () {
    log.info('shutdown')
  }
}
