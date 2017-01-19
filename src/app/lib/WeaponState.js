import WS from '../WS';

export default WS.Lib.WeaponState = class WeaponState {
  constructor(weapon) {
    this.weapon = weapon;
    console.log(`${this.weapon.id} > Changing state to ${this.constructor.name}`);
  }
  cleanup() {
  }
};
