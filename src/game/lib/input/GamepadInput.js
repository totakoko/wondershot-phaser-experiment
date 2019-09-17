import Phaser from 'phaser'
import logger from 'loglevel'
import AbstractInput from './AbstractInput'

const log = logger.getLogger('GamepadInput') // eslint-disable-line no-unused-vars

export default class GamepadInput extends AbstractInput {
  constructor (options) {
    super({
      scene: options.scene,
      // movement: options.pad._rawPad,
      movement: options.pad.pad,
      // fireWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_A),
      // dropWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_Y),
      // jump: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_B),
      // togglePauseMenu: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_START)
      // fireWeapon: options.pad.getButton(Phaser.Input.Gamepad.Configs.XBOX_360.A),
      // dropWeapon: options.pad.getButton(Phaser.Input.Gamepad.Configs.XBOX_360.Y),
      // jump: options.pad.buttons[Phaser.Input.Gamepad.Configs.XBOX_360.B],
      // togglePauseMenu: options.pad.getButton(Phaser.Input.Gamepad.Configs.XBOX_360.START)
      fireWeapon: new Phaser.Events.EventEmitter(),
      dropWeapon: new Phaser.Events.EventEmitter(),
      jump: new Phaser.Events.EventEmitter(),
      togglePauseMenu: new Phaser.Events.EventEmitter()
    })
    options.pad.on('down', (index, value) => {
      switch (index) {
        case Phaser.Input.Gamepad.Configs.XBOX_360.A:
          this.fireWeapon.emit('down')
          break
        case Phaser.Input.Gamepad.Configs.XBOX_360.Y:
          this.dropWeapon.emit('down')
          break
        case Phaser.Input.Gamepad.Configs.XBOX_360.B:
          this.jump.emit('down')
          break
        case Phaser.Input.Gamepad.Configs.XBOX_360.START:
          this.togglePauseMenu.emit('down')
          break
      }
    })
    options.pad.on('up', (index, value) => {
      switch (index) {
        case Phaser.Input.Gamepad.Configs.XBOX_360.A:
          this.fireWeapon.emit('up')
          break
        case Phaser.Input.Gamepad.Configs.XBOX_360.Y:
          this.dropWeapon.emit('up')
          break
        case Phaser.Input.Gamepad.Configs.XBOX_360.B:
          this.jump.emit('up')
          break
        case Phaser.Input.Gamepad.Configs.XBOX_360.START:
          this.togglePauseMenu.emit('up')
          break
      }
    })
  }
}
