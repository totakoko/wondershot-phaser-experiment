import Phaser from 'phaser'
import logger from 'loglevel'
import config from '@/game/config.js'
const log = logger.getLogger('Main') // eslint-disable-line no-unused-vars

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'MenuScene'
    })
  }
  create () {
    this.add.text(config.centerX, 150, 'Main Menu', { font: '42px Arial', fill: '#000' }).setOrigin()
    this.add.text(config.centerX, 250, 'Battle', { font: '24px Arial', fill: '#000' })
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
        this.scene.start('CharacterSelectionScene')
      })
  }
  update () {
    // for (let component of this.components) {
    //     if (component.update) {
    //         component.update();
    //     }
    // }
  }
  render () {
    // for (let component of this.components) {
    //     if (component.render) {
    //         component.render();
    //     }
    // }
    console.log('render')
    // FPS
    this.debug.text(this.time.fps, config.ArenaWidth - 25, 14, '#f00')
  }
}
