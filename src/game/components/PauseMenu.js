import Phaser from 'phaser'
import logger from 'loglevel'
import Entity from '@/game/lib/Entity.js'
import config from '@/game/config.js'
const log = logger.getLogger('PauseMenu') // eslint-disable-line no-unused-vars

export default class PauseMenu extends Entity {
  constructor (options) {
    super(options)
    this.paused = false
  }
  create () {
    this.pauseOverlay = this.scene.add.rectangle(0, 0, config.ArenaWidth, config.ArenaHeight, 0x000000, 0.2).setOrigin(0)
    this.scene.Groups.Menus.add(this.pauseOverlay)
    this.pauseBar = this.scene.add.rectangle(0, config.centerY - 50, config.ArenaWidth, 100, 0x000000, 0.2).setOrigin(0)
    this.scene.Groups.Menus.add(this.pauseBar)

    this.pauseText = this.scene.add.text(config.centerX, config.centerY, 'PAUSE', {
      font: 'bold 32px Arial',
      fill: '#fff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    }).setOrigin()
    this.scene.Groups.Menus.add(this.pauseText)
    this.updateVisibility()

    this.scene.events.on('togglePause', this.togglePause, this)
  }
  updateVisibility () {
    if (this.paused) {
      this.pauseOverlay.setPipeline('Blur')
      this.pauseText.setPipeline('Blur')
      // this.scene.Groups.Game.setPipeline('Blur')
      // this.scene.Groups.Game.filters = [this.blurX, this.blurY]
      this.pauseOverlay.visible = true
      this.pauseBar.visible = true
      this.pauseText.visible = true
    } else {
      this.pauseOverlay.resetPipeline()
      this.pauseText.resetPipeline()
      // this.scene.Groups.Game.resetPipeline()
      // this.scene.Groups.Game.filters = null
      this.pauseOverlay.visible = false
      this.pauseBar.visible = false
      this.pauseText.visible = false
    }
  }
  // actions
  togglePause () {
    log.info('pause')
    this.paused = !this.paused
    if (this.paused) {
      this.scene.scene.pause()
      // this.scene.scene.launch('PauseMenu')
      // this.scene.matter.pause()
    } else {
      this.scene.scene.resume()
      // TODO la touche échap ne permet plus de unpause
      // this.scene.scene.resume('RoundScene')
      // this.scene.matter.resume()
    }
    // this.scene.input.gamepad.pad1._buttons[Phaser.Gamepad.XBOX360_START].isDown = false
    this.updateVisibility()
  }
}
