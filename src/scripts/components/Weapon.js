const Weapon = Wondershot.Components.Weapon = class Weapon {
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
    setOwner(owner) {
        this.owner = owner;
    }
}
