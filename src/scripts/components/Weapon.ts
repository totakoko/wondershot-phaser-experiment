module Wondershot.Components {
  export class Weapon {

    static init(game) {
      this.game = game;
      Wondershot.Components.WeaponSlingshot.init(game);
      Wondershot.Components.WeaponSlingshotProjectile.init(game);
      return this;
    }

    static preload() {
      // Wondershot.Components.WeaponSlingshot.preload();
      Wondershot.Components.WeaponSlingshotProjectile.preload();
    }

    static create() {
      Wondershot.Components.WeaponSlingshotProjectile.create();
    }

    constructor(options) {
      this.game = Weapon.game;
    }

    setOwner(owner) {
      this.owner = owner;
    }

  }
}
