export default class WeaponState {
  constructor(weapon) {
    this.weapon = weapon;
    console.log(`${this.weapon.id} > Changing state to ${this.constructor.name}`);
  }
  cleanup() {
  }
}
