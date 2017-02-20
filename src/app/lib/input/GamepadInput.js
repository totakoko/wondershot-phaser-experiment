import WS from '../../WS';
const log = require('misc/loglevel').getLogger('GamepadInput'); // eslint-disable-line no-unused-vars

export default WS.Lib.Input.GamepadInput = class GamepadInput extends WS.Lib.Input.AbstractInput {
  constructor(options) {
    super({
      movement: options.pad._rawPad,
      fireWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_A),
      dropWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_Y),
      jump: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_B),
      togglePauseMenu: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_START),
    });
  }
};
