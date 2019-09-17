import Phaser from 'phaser'
import logger from 'loglevel'
import Battle from '@/game/lib/Battle.js'
import config from '@/game/config.js'
import { BlurPipeline } from '@/game/Pipelines.js'
const log = logger.getLogger('Preload') // eslint-disable-line no-unused-vars

export default class PreloadScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'PreloadScene'
    })
  }
  preload () {
    const progress = this.add.graphics()
    this.load.on('progress', function (value) {
      progress.clear()
      progress.fillStyle(0x000000, 1)
      progress.fillRect(0, 270, 800 * value, 60)
    })
    this.load.on('complete', function () {
      // setTimeout(() => {
      progress.destroy()
      // }, 2000)
    })

    this.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml')

    // Arena
    this.load.image('wall', 'assets/images/wall.png')

    // Player
    this.load.image('player', 'assets/images/player.png')
    this.load.image('player-death-marker', 'assets/images/player-death-marker.png')
    this.load.spritesheet('controller-indicator', 'assets/images/controller-indicator.png', {
      frameWidth: 16,
      frameHeight: 16
    })

    // Weapons
    this.load.image('weapon-hammer', 'assets/images/weapon-hammer.png')
    this.load.image('weapon-slingshot', 'assets/images/weapon-slingshot.png')
    this.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png')

    const blurPipeline = this.game.renderer.addPipeline('Blur', new BlurPipeline(this.game))
    blurPipeline.setFloat1('uBlur', 1 / 512)
  }

  create () {
    this.input.mouse.disableContextMenu()
    this.input.gamepad.refreshPads()

    if (this.input.gamepad.total === 0) {
      // wait for a gamepad input to continue
      this.input.gamepad.on('down', (pad) => {
        // pad.setAxisThreshold(0.3) ??
        this.startGame()
      })
      this.add.bitmapText(config.centerX, config.centerY, 'desyrel', 'Press a gamepad button...', 36).setOrigin()
    } else {
      this.startGame()
    }
  }
  startGame () {
    // this.scene.start('MenuScene')
    this.scene.start('RoundScene', {
      battle: new Battle({
        players: [{
          id: 1,
          type: 'Gamepad'
        }, {
          id: 2,
          type: 'Keyboard'
        }, {
          id: 3,
          type: 'Bot'
        }]
      })
    })
  }
}
