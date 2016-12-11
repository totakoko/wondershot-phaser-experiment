const WeaponSlingshot = WS.Components.WeaponSlingshot = class WeaponSlingshot extends WS.Components.Weapon {
    constructor() {
        super();
        this.WeaponSlingshotProjectile = WS.Components.WeaponSlingshotProjectile;
        this.material = WS.Services.CollisionManager.materials.WeaponSlingShot;
    }
    fire() {
        console.log('Firing weapon !');
        new Components.WeaponSlingshotProjectile(this.owner);
    }
}
