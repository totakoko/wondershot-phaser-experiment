import log from 'loglevel'

import { config, getPlayerColors } from '@/game/config'
import { Battle } from '@/game/lib/Battle'
import { PlayerConfig } from '@/game/lib/PlayerConfig'

const logger = log.getLogger('CharacterSelection') // eslint-disable-line no-unused-vars

const linesColor = 0x555555
export class CharacterSelectionScene extends Phaser.Scene {
  activePlayers: Map<number, boolean> = new Map()
  playerStateIndicators: Map<number, Phaser.GameObjects.Text> = new Map()

  startBattleButton!: Phaser.GameObjects.Text

  constructor () {
    super({
      key: 'CharacterSelectionScene'
    })
  }

  create () {
    this.cameras.main.setBackgroundColor('#91d49c')
    this.add.text(config.centerX, config.yp(10), 'Character Selection', { font: '42px Arial', color: '#000' }).setOrigin()
    this.add.rectangle(config.centerX, config.centerY, config.xp(1), config.xp(50), linesColor)
    this.add.rectangle(config.centerX, config.centerY, config.xp(50), config.xp(1), linesColor)

    this.activePlayers = new Map()

    // grid with the readiness of players
    this.playerStateIndicators = new Map()
    this.playerStateIndicators.set(1, this.add.text(config.xp(35), config.yp(40), '', { font: '60px Arial', color: getPlayerColors(1).hex }).setOrigin())
    this.add.text(config.xp(35), config.yp(30), 'Press (A) to join', { font: '30px Arial', color: getPlayerColors(1).hex }).setOrigin()

    this.playerStateIndicators.set(2, this.add.text(config.xp(65), config.yp(40), '', { font: '60px Arial', color: getPlayerColors(2).hex }).setOrigin())
    this.add.text(config.xp(65), config.yp(30), 'Press (A) to join', { font: '30px Arial', color: getPlayerColors(2).hex }).setOrigin()

    this.playerStateIndicators.set(3, this.add.text(config.xp(35), config.yp(70), '', { font: '60px Arial', color: getPlayerColors(3).hex }).setOrigin())
    this.add.text(config.xp(35), config.yp(60), 'Press (A) to join', { font: '30px Arial', color: getPlayerColors(3).hex }).setOrigin()

    this.playerStateIndicators.set(4, this.add.text(config.xp(65), config.yp(70), '', { font: '60px Arial', color: getPlayerColors(4).hex }).setOrigin())
    this.add.text(config.xp(65), config.yp(60), 'Press (A) to join', { font: '30px Arial', color: getPlayerColors(4).hex }).setOrigin()

    this.startBattleButton = this.add.text(config.centerX, config.yp(92), 'Go', { font: '24px Arial', color: '#000' })
      .setOrigin()
      .setPadding(20)
      .setBackgroundColor('#dddddd')
      .setInteractive()
      .setVisible(false) // hide by default
      .on('pointerover', () => {
        this.startBattleButton.setBackgroundColor('#777777')
        this.input.setDefaultCursor('pointer')
      })
      .on('pointerout', () => {
        this.startBattleButton.setBackgroundColor('#dddddd')
        this.input.setDefaultCursor('default')
      })
      .on('pointerdown', () => {
        const players = [...this.activePlayers.entries()]
          .filter(([_, ready]) => ready)
          .map<PlayerConfig>(([playerId]) => ({
          id: playerId,
          type: 'gamepad'
        }))
        logger.info('start battle with', players)
        const battle = new Battle(players)
        this.scene.start('RoundScene', {
          battle
        })
      })

    this.input.gamepad.addListener('down', (pad: Phaser.Input.Gamepad.Gamepad) => {
      this.togglePlayer(pad.index + 1)
    })
  }

  togglePlayer (playerId: number) {
    const ready = !(this.activePlayers.get(playerId) ?? false)
    this.activePlayers.set(playerId, ready)
    logger.info(`P${playerId} ${ready}`)
    this.playerStateIndicators.get(playerId)!.text = ready ? 'X' : ''
    this.startBattleButton.setVisible([...this.activePlayers.entries()].filter(([_, ready]) => ready).length >= 2)
  }
}
