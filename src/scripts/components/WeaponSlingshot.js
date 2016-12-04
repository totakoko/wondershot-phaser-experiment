const WeaponSlingshot = Wondershot.Components.WeaponSlingshot = class WeaponSlingshot extends Wondershot.Components.Weapon {
    constructor(options) {
        super(options);
        this.WeaponSlingshotProjectile = Wondershot.Components.WeaponSlingshotProjectile;
        this.material = Wondershot.Components.CollisionManager.materials.WeaponSlingShot;
    }
    fire() {
        console.log('Firing weapon !');
        new Components.WeaponSlingshotProjectile(this.owner);
    }
}
