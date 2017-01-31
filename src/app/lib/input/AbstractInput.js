import WS from '../../WS';

export default WS.Lib.Input.AbstractInput = class AbstractInput {
  constructor(options) {
    this.movement = options.movement;
    this.fireWeapon = options.fireWeapon;
    this.jump = options.jump;
    this.togglePauseMenu = options.togglePauseMenu;
  }
};
