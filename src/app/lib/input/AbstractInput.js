import WS from '../../WS';
const log = require('misc/loglevel').getLogger('AbstractInput'); // eslint-disable-line no-unused-vars

export default WS.Lib.Input.AbstractInput = class AbstractInput {
  constructor(options) {
    this.movement = options.movement;
    this.fireWeapon = options.fireWeapon;
    this.jump = options.jump;
    this.togglePauseMenu = options.togglePauseMenu;
  }
};
