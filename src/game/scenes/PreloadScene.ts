import { config } from '@/game/config'

export class PreloadScene extends Phaser.Scene {
  private gameStarted = false

  constructor () {
    super({
      key: 'PreloadScene'
    })
  }

  preload () {
    const progress = this.add.graphics()
    this.load.on('progress', (value: number) => {
      progress.clear()
      progress.fillStyle(0x000000, 1)
      progress.fillRect(0, 270, 800 * value, 60)
    })
    this.load.on('complete', () => {
      progress.destroy()
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
  }

  create () {
    this.input.mouse.disableContextMenu()

    // DEBUG
    // this.startGame()

    if (this.input.gamepad.total === 0) {
      this.add.bitmapText(config.centerX, config.centerY, 'desyrel', 'Press a gamepad button...', 36).setOrigin()

      // wait for a gamepad input to continue
      this.input.gamepad.once('connected', this.startGame)
      this.input.keyboard.once('keydown', this.startGame)
    } else {
      this.startGame()
    }
  }

  startGame = () => {
    if (this.gameStarted) {
      return
    }
    this.gameStarted = true
    this.scene.start('MenuScene')

    // DEBUG
    // this.scene.start('CharacterSelectionScene')
    // this.scene.start('RoundScene', {
    //   battle: new Battle([{
    //     id: 1,
    //     type: 'gamepad'
    //   }, {
    //     id: 2,
    //     type: 'keyboard'
    //   }, {
    //     id: 3,
    //     type: 'bot'
    //   }])
    // })
  }
}
