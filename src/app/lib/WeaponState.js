import WS from '../WS';
const log = require('loglevel').getLogger('player');

export default WS.Lib.WeaponState = class WeaponState {
  constructor(weapon) {
    this.weapon = weapon;
    log.debug(`${this.weapon.id} > Changing state to ${this.constructor.name}`);
  }
  cleanup() {
  }
};
