import WS from '../WS';
const log = require('misc/loglevel').getLogger('WeaponState'); // eslint-disable-line no-unused-vars

export default WS.Lib.WeaponState = class WeaponState {
  constructor(weapon) {
    this.weapon = weapon;
    log.debug(`${this.weapon.id} > Changing state to ${this.constructor.name}`);
  }
  cleanup() {
  }
  update() {
  }
};
