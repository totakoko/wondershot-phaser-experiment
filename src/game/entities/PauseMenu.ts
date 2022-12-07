import log from 'loglevel'

import { config } from '@/game/config'
import { TOGGLE_PAUSE } from '@/game/events'
import { Entity } from '@/game/lib/Entity'
import { RoundScene } from '@/game/scenes/RoundScene'
import { throttle } from '@/util'

const logger = log.getLogger('PauseMenu') // eslint-disable-line no-unused-vars

const XBox360Config = Phaser.Input.Gamepad.Configs.XBOX_360 as any

export class PauseMenu extends Entity<RoundScene> {
  declare scene: RoundScene

  paused = false

  pauseOverlay!: Phaser.GameObjects.Rectangle
  pauseBar!: Phaser.GameObjects.Rectangle
  pauseText!: Phaser.GameObjects.Text
  mainCamera!: Phaser.Cameras.Scene2D.Camera
  menuCamera!: Phaser.Cameras.Scene2D.Camera

  globalUnpauseRoutine = 0

  create () {
    this.pauseOverlay = this.scene.add.rectangle(0, 0, config.ArenaWidth, config.ArenaHeight, 0x000000, 0.2).setOrigin(0)
    this.scene.Groups.Menus.add(this.pauseOverlay)
    this.pauseBar = this.scene.add.rectangle(0, config.centerY - 50, config.ArenaWidth, 100, 0x000000, 0.2).setOrigin(0)
    this.scene.Groups.Menus.add(this.pauseBar)

    this.pauseText = this.scene.add.text(config.centerX, config.centerY, 'PAUSE', {
      font: 'bold 32px Arial',
      color: '#fff'
    }).setOrigin()
    this.scene.Groups.Menus.add(this.pauseText)

    // the main camera should not render the menu items
    this.mainCamera = this.scene.cameras.main
    this.mainCamera.ignore([this.pauseOverlay, this.pauseBar, this.pauseText])
    // add a new camera to render the pause menu
    this.menuCamera = this.scene.cameras.add()
    this.menuCamera.setName('pauseMenu')
    this.menuCamera.ignore(this.scene.Groups.Game)

    this.scene.events.on(TOGGLE_PAUSE, this.togglePause)

    this.updateVisibility()
    document.addEventListener('keydown', this.onEscapeDown)
  }

  checkForGlobalUnpause = () => {
    for (const pad of navigator.getGamepads().filter(pad => !(pad == null))) {
      const startButtonPressed = pad!.buttons[XBox360Config.START].value === 1
      if (startButtonPressed) {
        this.togglePause()
      }
    }
    this.globalUnpauseRoutine = requestAnimationFrame(this.checkForGlobalUnpause)
  }

  destroy () {
    document.removeEventListener('keydown', this.onEscapeDown)
    this.scene.events.off(TOGGLE_PAUSE, this.togglePause)
    cancelAnimationFrame(this.globalUnpauseRoutine)
  }

  private updateVisibility () {
    if (this.paused) {
      this.mainCamera.setPostPipeline('BlurPostFX')
    } else {
      this.mainCamera.resetPostPipeline()
    }
    this.menuCamera.setVisible(this.paused)
  }

  // actions
  togglePause = throttle(() => {
    this.paused = !this.paused
    if (this.paused) {
      logger.info('pause')
      this.scene.scene.pause()
      this.checkForGlobalUnpause()
    } else {
      logger.info('resume')
      this.scene.scene.resume()
      cancelAnimationFrame(this.globalUnpauseRoutine)
    }
    // this.scene.input.gamepad.pad1._buttons[Phaser.Gamepad.XBOX360_START].isDown = false
    this.updateVisibility()
  }, 500)

  // we can't use Phaser KeyboardManager because it is paused
  private readonly onEscapeDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.togglePause()
    }
  }
}
