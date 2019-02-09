import Phaser from 'phaser'
import _ from 'lodash'
import logger from 'loglevel'
import config from '@/game/config.js'
import Arena from '@/game/components/Arena.js'
import Player from '@/game/components/Player.js'
import BotInput from '@/game/lib/input/BotInput.js'
import KeyboardInput from '@/game/lib/input/KeyboardInput.js'
import GamepadInput from '@/game/lib/input/GamepadInput.js'
// import WeaponHammer from '@/game/components/WeaponHammer.js'
// import WeaponSlingshot from '@/game/components/WeaponSlingshot.js'
import PauseMenu from '@/game/components/PauseMenu.js'
// import PhysicsManager from '@/game/services/PhysicsManager.js'
// import util from '@/util'

const log = logger.getLogger('Round') // eslint-disable-line no-unused-vars

// import Player from '@/game/components/PauseMenu.js'
// import GamepadInput from '@/game/lib/input/GamepadInput.js'
// import Config from '@/game/config.js'

export default class RoundScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'RoundScene'
    })
  }
  init (data) {
    this.battle = data.battle
    if (!this.battle) {
      throw new Error('Missing battle option')
    }
  }
  create () {
    // WS.Services.PhysicsManager.init()
    // this.matter.world.setBounds(0, 0, config.ArenaWidth, config.ArenaHeight, 32, true, true, false, true)
    this.matter.world.setBounds(
      config.ArenaBordersWidth,
      config.ArenaBordersWidth,
      config.ArenaWidth - 2 * config.ArenaBordersWidth,
      config.ArenaHeight - 2 * config.ArenaBordersWidth
    )
    this.matter.add.mouseSpring()

    // PhysicsManager.init()
    this.setupGroups()

    this.battle.reset()

    this.pauseMenu = this.battle.stage.register(new PauseMenu({
      scene: this
    }))
    this.arena = this.battle.stage.register(new Arena({
      scene: this
    }))

    // positions mélangées pour être dépilées simplement
    this.startLocations = _.chain(this.arena.getStartPositions()).shuffle().value()
    if (this.battle.players.length > this.startLocations.length) {
      throw new Error(`The orld has only ${this.startLocations.length} start locations while there are ${this.activePlayers.length} active players.`)
    }

    // this.players = {}
    // _.each(this.battle.players, player => {
    //   this[`assign${player.type}Player`](player.id)
    // })

    const letsFightText = this.add.bitmapText(-config.centerX, config.centerY, 'desyrel', "Let's fight!", 72).setOrigin()
    // letsFightText.anchor.setTo(0.5)
    this.setupPlayers()

    this.tweens.timeline({
      targets: letsFightText,
      tweens: [{
        x: config.centerX,
        ease: 'Linear',
        duration: 500,
        delay: 300
      }, {
        x: 3 * config.centerX,
        ease: 'Linear',
        duration: 500,
        delay: 1000
      }]
    })
    // this.textAnimation = this.add.tween(letsFightText)
    //   .to({
    //     x: this.world.centerX
    //   }, 500, Phaser.Easing.Elastic.Out, false, 300)
    //   .to({
    //     x: 3 * this.world.centerX
    //   }, 500, Phaser.Easing.Elastic.In, false, 300)
    //   .start()

    // WS.Services.PhysicsManager.pause()
    // setTimeout(() => {
    //   letsFightText.destroy()
    //   WS.Services.PhysicsManager.resume()
    // }, 1600)
    // for (let i = 0; i < 4; i++) {
    //   const weapon = this.battle.stage.register(new WS.Components[this.getRandomWeapon()]())
    //   weapon.drop({
    //     x: _.random(WS.Services.ScaleManager.xp(25), WS.Services.ScaleManager.xp(75)),
    //     y: _.random(WS.Services.ScaleManager.yp(45), WS.Services.ScaleManager.yp(55))
    //   })
    // }
  }
  setupGroups () {
    // triés par z-index
    this.Groups = {}
    // this.Groups.Game = this.add.group(this.world, 'game')
    // this.Groups.Arena = this.add.group(this.Groups.Game, 'arena')
    // this.Groups.Objects = this.add.group(this.Groups.Game, 'objects')
    // this.Groups.Players = this.add.group(this.Groups.Game, 'players')
    // this.Groups.Projectiles = this.add.group(this.Groups.Game, 'projectiles')
    // this.Groups.UI = this.add.group(this.Groups.Game, 'ui')
    // this.Groups.Menus = this.add.group(this.world, 'menus')

    this.Groups.UI = this.add.group()
    this.Groups.Arena = this.add.group()
    this.Groups.Objects = this.add.group()
    this.Groups.Players = this.add.group()
    this.Groups.Projectiles = this.add.group()
    this.Groups.Game = this.add.group([
      this.Groups.Arena,
      this.Groups.Arena,
      this.Groups.Players,
      this.Groups.Projectiles,
      this.Groups.UI
    ])
    this.Groups.Menus = this.add.group()
  }
  setupPlayers () {
    this.players = {}
    this.battle.players.forEach(playerConfig => {
      const player = this.players[playerConfig.id] = new Player({
        scene: this,
        playerNumber: playerConfig.id,
        color: config.PlayerColors[playerConfig.id],
        startLocation: this.getNextStartLocation()
      })
      this.battle.stage.register(player)

      // const weapon = this.assignRandomWeapon(player)
      // this.battle.stage.register(weapon)
      // player.pickupWeapon(weapon)
      // this[`assign${player.type}Player`](player.id)

      let input
      switch (playerConfig.type) {
        case 'Bot':
          input = new BotInput({ scene: this, player })
          break
        case 'Keyboard':
          input = new KeyboardInput({ scene: this })
          break
        case 'Gamepad':
          input = new GamepadInput({ scene: this })
          break
        default:
          throw new Error(`unknown player type '${playerConfig.type}'`)
      }
      player.setInput(input)
    })
  }
  // assignRandomWeapon (owner) {
  //   if (util.getRandomNumber(0, 2) === 0) {
  //     return new WeaponSlingshot({
  //       owner
  //     })
  //   } else {
  //     return new WeaponHammer({
  //       owner
  //     })
  //   }
  // }
  getPlayerController (player) {
  }

  // assignGamepadPlayer (playerNumber) {
  //   const player = this.createPlayer(playerNumber)
  //   player.setInput(new WS.Lib.Input.GamepadInput({
  //     pad: WS.Services.PadManager.getGamepad(playerNumber)
  //   }))
  // }
  // assignKeyboardPlayer (playerNumber) {
  //   const player = this.createPlayer(playerNumber)
  //   player.setInput(new WS.Lib.Input.KeyboardInput())
  // }
  // assignBotPlayer (playerNumber) {
  //   const player = this.createPlayer(playerNumber)
  //   player.setInput(new WS.Lib.Input.BotInput({
  //     player: player
  //   }))
  // }
  // createPlayer (playerNumber) {
  //   const player = this.players[playerNumber] = new Player({
  //     playerNumber: playerNumber,
  //     color: config.PlayerColors[playerNumber],
  //     startLocation: this.getNextStartLocation()
  //   })
  //   const weapon = new WS.Components[this.getRandomWeapon()]({
  //     owner: player
  //   })
  //   player.pickupWeapon(weapon)
  //   this.battle.stage.register(weapon)
  //   this.battle.stage.register(player)
  //   return player
  // }
  getNextStartLocation () {
    return this.startLocations.splice(0, 1)[0]
  }
  update () {
    this.battle.stage.update()

    // this.scene.game.loop.actualFps
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
