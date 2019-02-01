import Phaser from 'phaser'
// import ScaleManager from '@/game/services/ScaleManager.js'
import logger from 'loglevel'
const log = logger.getLogger('Boot') // eslint-disable-line no-unused-vars

export default class BootScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'BootScene'
    })
  }
  preload () {
    this.load.image('preload-bar', 'assets/images/preloader.gif')
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml')
  }
  create () {
    this.preloadBar = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'preload-bar')
    // this.preloadBar.anchor.setTo(0.5, 0.5)
    // debugger
    this.preloadBar.setOrigin(0.5, 0.5)
    this.load.setPreloadSprite(this.preloadBar)
    // this.stage.backgroundColor = 0xFFFFFF
    // this.stage.disableVisibilityChange = true
    // this.input.maxPointers = 1
    // ScaleManager.init({
    //   width: this.width,
    //   height: this.height
    // })
    // this.state.start('preload')
    // this.scene.add('preload', Preload)
    this.scene.start('preload')
  }
}
