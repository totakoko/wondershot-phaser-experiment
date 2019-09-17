import Phaser from 'phaser'
import logger from 'loglevel'
import config from '@/game/config.js'
import Battle from '@/game/lib/Battle.js'
import PadManager from '@/game/services/PadManager.js'
const log = logger.getLogger('CharacterSelection') // eslint-disable-line no-unused-vars

export default class CharacterSelectionScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'CharacterSelectionScene'
    })
  }
  create () {
    this.add.text(config.centerX, 42, 'Character Selection', { font: '42px Arial', fill: '#000' }).setOrigin()

    this.activePlayers = {}

    PadManager.setPadsCallback(padNumber => {
      this.activePlayers[padNumber] = !this.activePlayers[padNumber]
      log.info(`P${padNumber} ${this.activePlayers[padNumber]}`)
    })

    // grille des états des joueurs
    this.playerStateIndicators = {}

    this.playerStateIndicators[1] = this.add.text(config.centerX * 2 / 3, config.centerY * 2 / 3, '', { font: '60px Arial', fill: config.PlayerColors[1].hex }).setOrigin()

    this.playerStateIndicators[2] = this.add.text(config.centerX * 4 / 3, config.centerY * 2 / 3, '', { font: '60px Arial', fill: config.PlayerColors[2].hex }).setOrigin()

    this.playerStateIndicators[3] = this.add.text(config.centerX * 2 / 3, config.centerY * 4 / 3, '', { font: '60px Arial', fill: config.PlayerColors[3].hex }).setOrigin()

    this.playerStateIndicators[4] = this.add.text(config.centerX * 4 / 3, config.centerY * 4 / 3, '', { font: '60px Arial', fill: config.PlayerColors[4].hex }).setOrigin()

    this.add.text(config.centerX, config.ArenaHeight - 50, 'Go', { font: '24px Arial', fill: '#000' })
      .setOrigin()
      .setPadding(20)
      .setBackgroundColor('#dddddd')
      .setInteractive()
      .on('pointerover', function () {
        this.setBackgroundColor('#777777')
      })
      .on('pointerout', function () {
        this.setBackgroundColor('#dddddd')
      })
      .on('pointerdown', () => {
        const players = Object.keys(this.activePlayers)
          .map(key => this.activePlayers[key] || false)
          .filter(val => !!val)
        const battle = new Battle({
          players
        })
        this.scene.start('RoundScene', {
          battle
        })
      }, this)
    // startBattleButton.inputEnabled = true
    // startBattleButton.events.onInputUp.add(this.startBattleButtonSelected, this)
  }
  startBattleButtonSelected () {
    // const activePlayers = _.chain(this.activePlayers)
    //   .map((val, key) => {
    //     return val ? key : false
    //   })
    //   .filter()
    //   .value()
    // log.info('CharacterSelection: selected players %s', activePlayers)

    // this.state.start('round', true, false, {
    //   battle: new WS.Lib.Battle({
    //     players: activePlayers
    //   })
    // })
  }
  update () {
    // for (const playerNumber of Object.keys(this.activePlayers)) {
    //   this.playerStateIndicators[playerNumber].text = this.activePlayers[playerNumber] ? 'X' : ''
    // }
  }
}
