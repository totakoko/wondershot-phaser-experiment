import WS from '../../WS';

export default WS.Lib.Input.GamepadInput = class GamepadInput extends WS.Lib.Input.AbstractInput {
  constructor(options) {
    super({
      movement: options.pad._rawpad,
      fireWeapon: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_A),
      jump: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_B),
      togglePauseMenu: options.pad.getButton(WS.Phaser.Gamepad.XBOX360_START),
    });
  }
};
