import { AbstractInput, InputOptions } from './AbstractInput'

import { TOGGLE_PAUSE } from '@/game/events'

// see https://github.com/photonstorm/phaser/blob/v3.51.0/src/input/gamepad/configs/XBox360_Controller.js#L7

const XBox360Config = Phaser.Input.Gamepad.Configs.XBOX_360 as any

export class GamepadInput extends AbstractInput {
  constructor (options: InputOptions, private readonly pad: Phaser.Input.Gamepad.Gamepad) {
    super(options)

    this.player.setMovementAxes(pad.leftStick)

    this.pad.on('down', (index: number) => {
      switch (index) {
        case XBox360Config.A:
          this.player.loadWeapon()
          break
        case XBox360Config.Y:
          this.player.dropWeapon()
          break
        case XBox360Config.B:
          this.player.jump()
          break
        case XBox360Config.START:
          this.scene.events.emit(TOGGLE_PAUSE)
          break
      }
    })
    this.pad.on('up', (index: number) => {
      switch (index) {
        case XBox360Config.A:
          this.player.releaseWeapon()
          break
      }
    })
  }
}
