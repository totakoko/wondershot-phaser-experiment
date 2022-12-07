import Phaser from 'phaser'

import { config, depths, getPlayerColors } from '@/game/config'
import { Arena } from '@/game/entities/Arena'
import { PauseMenu } from '@/game/entities/PauseMenu'
import { Player } from '@/game/entities/Player'
import { ScoreBoard } from '@/game/entities/ScoreBoard'
import { WeaponCarriedHammer, WeaponOnGroundHammer } from '@/game/entities/weapons/WeaponHammer'
import { WeaponCarriedSlingshot, WeaponOnGroundSlingshot } from '@/game/entities/weapons/WeaponSlingshot'
import { ROUND_START, PLAYER_KILLED, ROUND_END } from '@/game/events'
import { Battle } from '@/game/lib/Battle'
import { AbstractInput } from '@/game/lib/input/AbstractInput'
import { BotInput } from '@/game/lib/input/BotInput'
import { GamepadInput } from '@/game/lib/input/GamepadInput'
import { KeyboardInput } from '@/game/lib/input/KeyboardInput'
import { PlayerConfig } from '@/game/lib/PlayerConfig'
import { Position } from '@/game/lib/Position'
import { getRandomInteger, getRandomNumber, shuffleArray } from '@/util'

interface Groups {
  Menus: Phaser.GameObjects.Group
  Game: Phaser.GameObjects.Group
  UI: Phaser.GameObjects.Group
  Arena: Phaser.GameObjects.Group
  Objects: Phaser.GameObjects.Group
  PlayerItems: Phaser.GameObjects.Group
  Projectiles: Phaser.GameObjects.Group
  Players: Phaser.GameObjects.Group
}

export class RoundScene extends Phaser.Scene {
  public battle!: Battle

  pauseMenu!: PauseMenu
  arena!: Arena

  startLocations: Position[] = []

  Groups!: Groups

  private fps!: Phaser.GameObjects.Text

  constructor () {
    super({
      key: 'RoundScene'
    })
  }

  init (data: { battle: Battle }) {
    this.battle = data.battle
    this.battle.scene = this
  }

  create () {
    this.matter.world.pause()
    this.matter.world.setBounds(
      config.ArenaBordersWidth,
      config.ArenaBordersWidth,
      config.ArenaWidth - 2 * config.ArenaBordersWidth,
      config.ArenaHeight - 2 * config.ArenaBordersWidth
    )

    this.setupGroups()

    this.battle.reset()

    this.arena = this.battle.stage.register(new Arena({
      scene: this
    }))

    // shuffle the locations to easily pop the next available location
    this.startLocations = shuffleArray(this.arena.getStartPositions())
    if (this.battle.players.length > this.startLocations.length) {
      throw new Error(`The world has only ${this.startLocations.length} start locations while there are ${this.battle.alivePlayers.length} active players.`)
    }

    this.createPlayers()

    // DEBUG
    this.createLetsFightText()

    this.fps = this.add.text(config.ArenaWidth - 25, 10, '', {
      color: '#0f0'
    })

    this.pauseMenu = this.battle.stage.register(new PauseMenu({
      scene: this
    }))

    this.setupDepths()

    // events
    this.events.on(ROUND_START, this.onRoundStart)
    this.events.on(PLAYER_KILLED, this.onPlayerKilled)
    this.events.on(ROUND_END, this.onRoundEnd)

    // DEBUG
    // for (let i = 0; i < 2; i++) {
    //   this.createRandomWeaponOnGround()
    // }
    // this.events.emit(GAME_START)
    // this.matter.world.resume()
    // setTimeout(() => {
    //   (this.Groups.Players.getChildren()[1].getData('player') as Player).kill()
    // }, 3500)
  }

  destroy () {
    this.events.off(ROUND_START, this.onRoundStart)
    this.events.off(PLAYER_KILLED, this.onPlayerKilled)
    this.events.off(ROUND_END, this.onRoundEnd)
    this.battle.stage.destroy()
  }

  setupGroups () {
    const Arena = this.add.group()
    const Objects = this.add.group()
    const Players = this.add.group()
    const PlayerItems = this.add.group()
    const Projectiles = this.add.group()
    const UI = this.add.group()
    const Game = this.add.group([
      Arena,
      Objects,
      Players,
      Projectiles,
      PlayerItems,
      UI
    ])
    const Menus = this.add.group()

    this.Groups = {
      Menus,
      Game,
      UI,
      Arena,
      Objects,
      Projectiles,
      PlayerItems,
      Players
    }
  }

  // not so useful as components created within groups do not get the depth of the group afterwards
  setupDepths () {
    this.Groups.Arena.setDepth(depths.Arena)
    this.Groups.Players.setDepth(depths.Players)
    this.Groups.Objects.setDepth(depths.Objects)
    this.Groups.Projectiles.setDepth(depths.Projectiles)
    this.Groups.PlayerItems.setDepth(depths.PlayerItems)
    this.Groups.UI.setDepth(depths.UI)
    // Menus is in another camera
  }

  createPlayers () {
    this.battle.players.forEach(playerConfig => {
      const player = this.createPlayer(playerConfig)

      this.createPlayerInput(playerConfig, player)

      // DEBUG
      // this.battle.stage.register(new WeaponCarriedSlingshot({
      this.battle.stage.register(new (getRandomWeaponCarried())({
        scene: this,
        player
      }))
    })
  }

  createRandomWeaponOnGround () {
    this.battle.stage.register(new (getRandomWeaponOnGround())({
      scene: this,
      position: {
        x: config.xp(getRandomNumber(25, 75)),
        y: config.yp(getRandomNumber(45, 55))
      }
    }))
  }

  createPlayer (playerConfig: PlayerConfig) {
    const player = new Player({
      scene: this,
      id: playerConfig.id,
      color: getPlayerColors(playerConfig.id),
      startLocation: this.getNextStartLocation()
    })
    this.battle.stage.register(player)
    return player
  }

  createPlayerInput (playerConfig: PlayerConfig, player: Player): AbstractInput | undefined {
    switch (playerConfig.type) {
      case 'bot':
        return new BotInput({
          scene: this,
          player
        })
      case 'keyboard':
        return new KeyboardInput({
          scene: this,
          player
        })
      case 'gamepad':
        return new GamepadInput({
          scene: this,
          player
        }, this.input.gamepad.getPad(playerConfig.id - 1))
    }
  }

  createLetsFightText () {
    const letsFightText = this.add.bitmapText(-config.centerX, config.centerY, 'desyrel', "Let's fight!", 72).setOrigin()
    this.Groups.UI.add(letsFightText)

    this.tweens.timeline({
      targets: letsFightText,
      completeDelay: 200,
      tweens: [{
        x: config.centerX,
        ease: (v: number) => Phaser.Math.Easing.Elastic.Out(v, 0.1, 0.8),
        duration: 800,
        delay: 300
      }, {
        x: 3 * config.centerX,
        ease: (v: number) => Phaser.Math.Easing.Elastic.In(v, 0.1, 0.8),
        duration: 800,
        delay: 600
      }]
    })
      .once(Phaser.Tweens.Events.TIMELINE_COMPLETE, () => {
        this.events.emit(ROUND_START)
      })
  }

  update () {
    this.battle.stage.update()

    this.fps.setText(`${Math.round(this.game.loop.actualFps)}`)
  }

  pauseUpdate () {
    this.battle.stage.pauseUpdate()
  }

  private getNextStartLocation () {
    return this.startLocations.splice(0, 1)[0]
  }

  private readonly onRoundStart = () => {
    this.matter.world.resume()
    this.input.manager.enabled = true
    this.time.delayedCall(2000, () => {
      for (let i = 0; i < 2; i++) {
        this.createRandomWeaponOnGround()
      }
    })
  }

  private readonly onPlayerKilled = (playerId: number) => {
    this.battle.killPlayer(playerId)
  }

  // when a round ends, stop the game then show the score board
  private readonly onRoundEnd = () => {
    this.time.delayedCall(1000, async () => {
      this.matter.world.pause()
      this.input.manager.enabled = false
      this.tweens.pauseAll()
      this.battle.stage.register(new ScoreBoard({
        scene: this
      }))

      this.time.delayedCall(4000, () => {
        // clean up everything and listeners
        this.destroy()

        // start the next round
        this.scene.start('RoundScene', {
          battle: this.battle
        })
      })
    })
  }
}

function getRandomWeaponOnGround (): typeof WeaponOnGroundSlingshot | typeof WeaponOnGroundHammer {
  if (getRandomInteger(0, 2) === 0) {
    return WeaponOnGroundSlingshot
  } else {
    return WeaponOnGroundHammer
  }
}

function getRandomWeaponCarried (): typeof WeaponCarriedSlingshot | typeof WeaponCarriedHammer {
  if (getRandomInteger(0, 2) === 0) {
    return WeaponCarriedHammer
  } else {
    return WeaponCarriedSlingshot
  }
}
