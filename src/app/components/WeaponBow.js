const WeaponBow = WS.Components.WeaponBow = class WeaponBow extends WS.Components.Weapon {
    constructor(options) {
        super(options);
        this.projectile = WS.Components.WeaponBowProjectile;
        // this.material = WS.Services.PhysicsManager.materials.WeaponSlingShot;
    }
    fire() {
        if (this.state === 'ready') {
          console.log('Firing weapon !');
          this.state = 'projectile_shot';
          const power = Math.floor(Math.random() * 101);
          new this.projectile({
            owner: this.owner,
            power: power,
            weapon: this,
          });
        }
    }
}
