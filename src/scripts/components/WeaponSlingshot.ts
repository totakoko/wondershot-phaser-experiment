module Wondershot.Components {
  export class WeaponSlingshot extends Weapon {

    WeaponSlingshotProjectile = Wondershot.Components.WeaponSlingshotProjectile;

    static init(game) {
      this.game = game;
      return this;
    }

    constructor(options) {
      super(options);
      this.material = Wondershot.Components.CollisionManager.materials.WeaponSlingShot;
    }

    fire() {
      console.log('Firing weapon !');
      new WeaponSlingshotProjectile(this.owner);
    }
  }
}
