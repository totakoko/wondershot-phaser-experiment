import Phaser from 'phaser'
import logger from 'loglevel'
const log = logger.getLogger('Preload') // eslint-disable-line no-unused-vars

export default class PreloadScene extends Phaser.Scene {
  preload () {
    const progress = this.add.graphics()
    this.load.on('progress', function (value) {
      progress.clear()
      progress.fillStyle(0x000000, 1)
      progress.fillRect(0, 270, 800 * value, 60)
    })
    this.load.on('complete', function () {
      setTimeout(() => {
        progress.destroy()
      }, 2000)
    })

    this.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml')

    // this.preloadBar = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'preload-bar')
    // this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preload-bar')
    // this.preloadBar.anchor.setTo(0.5, 0.5)
    // this.load.setPreloadSprite(this.preloadBar)

    // Arena
    this.load.image('wall', 'assets/images/wall.png')

    // Player
    this.load.image('player', 'assets/images/player.png')
    this.load.spritesheet('controller-indicator', 'assets/images/controller-indicator.png', 16, 16)
    this.load.image('player-death-marker', 'assets/images/player-death-marker.png')
    this.preloadBar = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'player')

    // for (const entityName of Object.keys(WS.Components)) {
    //   log.info(`preloading ${entityName}`)
    //   WS.Components[entityName].preload()
    // }
  }
  create () {
    // WS.Services.PadManager.init()
    // this.state.start('main');

    // DEBUG
    // this.scene.start('round', true, false, {
    //   battle: new WS.Lib.Battle({
    //     players: [{
    //       id: 1,
    //       type: 'Keyboard'
    //     }, {
    //       id: 2,
    //       type: 'Bot'
    //     }, {
    //       id: 3,
    //       type: 'Bot'
    //     }, {
    //       id: 4,
    //       type: 'Bot'
    //     }]
    //   })
    // })
  }
}
