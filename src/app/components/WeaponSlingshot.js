import WS from '../WS';
const log = require('loglevel').getLogger('player');

export default WS.Components.WeaponSlingshot = class WeaponSlingshot extends WS.Components.Weapon {
    static preload() {
      WS.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    constructor(options) {
      super(options);
      this.state = new WeaponSlingshotOnGroundState(this, {x: 0, y: 0}); // par défaut au sol mais non accessible
    }
    fire() {
      this.state.fire();
    }
    // pickup(owner) {
    //   this.state.pickup(owner);
    // }
    pickup(owner) {
      this.changeState(new WeaponSlingshotCarriedState(this, owner));
    }
};

class WeaponSlingshotOnGroundState extends WS.Lib.WeaponState {
  constructor(weapon, position) {
    super(weapon);
    log.debug(`${this.weapon.id} > Changing state to ${this.constructor.name}`);

    const projectileSprite = this.projectileSprite = WS.game.Groups.Objects.create(
      position.x,
      position.y,
      'weapon-slingshot-projectile'
    );
    // projectileSprite.visible = true;
    projectileSprite.tint = WS.Config.PlayerColors.neutral.tint;
    projectileSprite.scale.setTo(0.3);
    projectileSprite.body.setCircle(10);
    projectileSprite.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot);

    const projectilePhysics = WS.Services.PhysicsManager.Objects;
    projectileSprite.body.setCollisionGroup(projectilePhysics.id);
    projectileSprite.body.collides(projectilePhysics.Players, this.playerPickupHandler, this);
  }
  cleanup() {
    this.projectileSprite.destroy();
  }
  playerPickupHandler(weaponBody, playerBody, shapeA, shapeB, equation) {
    log.debug(`Weapon ${this.weapon.id} will be picked-up player ${playerBody.sprite.data.owner.playerNumber}`);
    playerBody.sprite.data.owner.pickupWeapon(this.weapon);
  }
}

class WeaponSlingshotCarriedState extends WS.Lib.WeaponState {
  constructor(weapon, owner) {
    super(weapon);
    this.owner = owner;
  }
  fire() {
    log.debug('Firing weapon !');
    const power = Math.floor(Math.random() * 101);
    this.weapon.changeState(new WeaponSlingshotFiredState(this.weapon, this.owner, power));
  }
}

class WeaponSlingshotFiredState extends WS.Lib.WeaponState {
  constructor(weapon, owner, power) {
    super(weapon);
    this.owner = owner;

    this.bounceLeft = 3;
    const ownerPosition = this.owner.sprite.position;
    const ownerRotation = this.owner.sprite.rotation;

    const projectile = this.projectileSprite = WS.game.Groups.Projectiles.create(
      ownerPosition.x + Math.cos(ownerRotation) * WS.Config.RockProjectileOffset,
      ownerPosition.y + Math.sin(ownerRotation) * WS.Config.RockProjectileOffset,
      'weapon-slingshot-projectile'
    );
    projectile.tint = this.owner.playerColor.tint;
    projectile.scale.setTo(0.3);
    projectile.body.setCircle(10);
    projectile.body.fixedRotation = true;
    projectile.body.rotation = ownerRotation;
    const projectileSpeed = this.getProjectileSpeed(power);
    projectile.body.velocity.x = Math.cos(ownerRotation) * projectileSpeed;
    projectile.body.velocity.y = Math.sin(ownerRotation) * projectileSpeed;
    projectile.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot);

    const projectilePhysics = WS.Services.PhysicsManager[`Projectile${this.owner.playerNumber}`];
    projectile.body.setCollisionGroup(projectilePhysics.id);
    projectile.body.collides(projectilePhysics.World, this.projectileWorldHitHandler, this);
    projectile.body.collides(projectilePhysics.OtherPlayers, this.projectilePlayerHitHandler, this);
  }
  cleanup() {
    this.projectileSprite.destroy();
  }
  getProjectileSpeed(power) {
    return power * (WS.Config.ArrowMaxSpeed - WS.Config.ArrowMinSpeed) / 100 + WS.Config.ArrowMinSpeed;
  }

  projectileWorldHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
      // log.info('bounceLeft', this.bounceLeft);
      if (this.bounceLeft > 0) {
          this.bounceLeft--;
          return;
      }
      this.weapon.changeState(new WeaponSlingshotOnGroundState(this.weapon, {
        x: projectileBody.x,
        y: projectileBody.y,
      }));
  }
  projectilePlayerHitHandler(projectileBody, playerBody, shapeA, shapeB, equation) {
      log.info(`Player ${this.owner.playerNumber} just hit ${playerBody.sprite.data.owner.playerNumber}`);
      playerBody.sprite.data.owner.kill();
      // this.weapon.changeState(new WeaponSlingshotOnGroundState(this.weapon, {
      //   x: projectileBody.x,
      //   y: projectileBody.y,
      // }));
      this.owner.pickupWeapon(this.weapon); // rechargement de l'arme
  }
}
