import logger from 'loglevel'
import AbstractInput from './AbstractInput'

const log = logger.getLogger('GamepadInput') // eslint-disable-line no-unused-vars

export default class GamepadInput extends AbstractInput {
  constructor (options) {
    super({
      movement: options.pad._rawPad,
      fireWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_A),
      dropWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_Y),
      jump: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_B),
      togglePauseMenu: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_START)
    })
  }
}
