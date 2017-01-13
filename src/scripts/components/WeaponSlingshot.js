const WeaponSlingshot = WS.Components.WeaponSlingshot = class WeaponSlingshot extends WS.Components.Weapon {
    constructor(options) {
        super(options);
        this.projectile = WS.Components.WeaponSlingshotProjectile;
        // this.material = WS.Services.PhysicsManager.materials.WeaponSlingShot;
    }
    fire() {
        if (this.state === 'ready') {
          console.log('Firing weapon !');
          this.state = 'projectile_shot';
          const power = Math.floor(Math.random() * 101);
          this.stage.register(new this.projectile({
            owner: this.owner,
            power: power,
            weapon: this,
          }));
        }
    }
}
