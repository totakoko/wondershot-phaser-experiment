import WS from '../WS';
const log = require('misc/loglevel').getLogger('WeaponSlingshot'); // eslint-disable-line no-unused-vars

export default WS.Components.WeaponSlingshot = class WeaponSlingshot extends WS.Components.Weapon {
    static preload() {
      WS.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    constructor(options) {
      super(options);
      this.state = new WeaponSlingshotOnGroundState(this, options.position || {x: 0, y: 0}); // par défaut au sol mais non accessible
    }
    fire() {
      this.state.fire();
    }
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
    WS.game.physics.p2.enable(projectileSprite, WS.Config.Debug);
    projectileSprite.body.setCircle(10);
    projectileSprite.body.damping = 1; // Damping is specified as a value between 0 and 1, which is the proportion of velocity lost per second.
    projectileSprite.body.data.shapes[0].sensor = true;
    projectileSprite.body.fixedRotation = true;

    // Impact event handling is disabled by default. Enable it before any impact events will be dispatched.
    // In a busy world hundreds of impact events can be generated every step, so only enable this if you cannot do what you need via beginContact or collision masks.
    // WS.game.physics.p2.setImpactEvents(false);
    const projectilePhysics = WS.Services.PhysicsManager.Objects;
    projectileSprite.body.setCollisionGroup(projectilePhysics.id);
    projectileSprite.body.collides(projectilePhysics.Players);
    projectileSprite.body.collides(projectilePhysics.Arena);
    projectileSprite.body.onBeginContact.add(this.onBeginContact, this);
  }
  cleanup() {
    this.projectileSprite.destroy();
  }
  onBeginContact(contactBody, data, shapeA, shapeB, contactEquations) {
    log.debug(`weapon ${this.name} touches ${contactBody.sprite.key}`);
    // on fait bouger l'arme si un mur la pousse
    if (contactBody.sprite.key === 'wall') {
      const movement = {
        x: contactBody.sprite.position.x - contactBody.sprite.previousPosition.x,
        y: contactBody.sprite.position.y - contactBody.sprite.previousPosition.y,
      };
      log.debug(`diff = {${movement.x}, ${movement.y} }`);
      this.projectileSprite.body.x += movement.x * 2; // MAGIC NUMBER !!
      this.projectileSprite.body.y += movement.y * 2;
    } else
    // un joueur n'ayant pas d'arme prend l'arme au sol
    if (contactBody.sprite.key === 'player') {
      if (contactBody.sprite.data.owner.weapon === null) {
        contactBody.sprite.data.owner.pickupWeapon(this.weapon);
      }
    }
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

    const projectileSprite = this.projectileSprite = WS.game.Groups.Projectiles.create(
      ownerPosition.x + Math.cos(ownerRotation) * WS.Config.RockProjectileOffset,
      ownerPosition.y + Math.sin(ownerRotation) * WS.Config.RockProjectileOffset,
      'weapon-slingshot-projectile'
    );
    projectileSprite.tint = this.owner.playerColor.tint;
    projectileSprite.scale.setTo(0.3);
    WS.game.physics.p2.enable(projectileSprite, WS.Config.Debug);
    projectileSprite.body.setCircle(10);
    projectileSprite.body.fixedRotation = true;
    projectileSprite.body.rotation = ownerRotation;
    const projectileSpeed = this.getProjectileSpeed(power);
    projectileSprite.body.velocity.x = Math.cos(ownerRotation) * projectileSpeed;
    projectileSprite.body.velocity.y = Math.sin(ownerRotation) * projectileSpeed;
    projectileSprite.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot);

    const projectilePhysics = WS.Services.PhysicsManager[`Projectile${this.owner.playerNumber}`];
    projectileSprite.body.setCollisionGroup(projectilePhysics.id);
    projectileSprite.body.collides(projectilePhysics.Arena, this.projectileArenaHitHandler, this);
    projectileSprite.body.collides(projectilePhysics.OtherPlayers, this.projectilePlayerHitHandler, this);
  }
  cleanup() {
    this.projectileSprite.destroy();
  }
  getProjectileSpeed(power) {
    return power * (WS.Config.ArrowMaxSpeed - WS.Config.ArrowMinSpeed) / 100 + WS.Config.ArrowMinSpeed;
  }

  projectileArenaHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
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
      this.owner.pickupWeapon(this.weapon); // rechargement de l'arme
  }
}
