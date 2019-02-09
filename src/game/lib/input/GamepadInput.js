import Phaser from 'phaser'
import logger from 'loglevel'
import AbstractInput from './AbstractInput'

const log = logger.getLogger('GamepadInput') // eslint-disable-line no-unused-vars

export default class GamepadInput extends AbstractInput {
  constructor (options) {
    super({
      scene: options.scene,
      movement: options.pad._rawPad,
      // fireWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_A),
      // dropWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_Y),
      // jump: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_B),
      // togglePauseMenu: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_START)
      fireWeapon: options.pad.getButton(Phaser.Input.Gamepad.Configs.XBOX_360.A),
      dropWeapon: options.pad.getButton(Phaser.Input.Gamepad.Configs.XBOX_360.Y),
      jump: options.pad.getButton(Phaser.Input.Gamepad.Configs.XBOX_360.B),
      togglePauseMenu: options.pad.getButton(Phaser.Input.Gamepad.Configs.XBOX_360.START)

    })
  }
}
