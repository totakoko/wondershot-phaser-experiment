const WeaponState = WS.Lib.WeaponState = class WeaponState {
  constructor(weapon) {
    this.weapon = weapon;
    console.log(`${this.weapon.id} > Changing state to ${this.constructor.name}`);
  }
  cleanup() {
  }
}