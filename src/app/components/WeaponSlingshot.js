import _ from 'lodash';
import WS from '../WS';
const log = require('misc/loglevel').getLogger('WeaponSlingshot'); // eslint-disable-line no-unused-vars

export default WS.Components.WeaponSlingshot = class WeaponSlingshot extends WS.Components.Weapon {
    static preload() {
      WS.game.load.image('weapon-slingshot', 'assets/images/weapon-slingshot.png');
      WS.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    constructor(options) {
      super(options);
      this.state = new WeaponSlingshotOnGroundState(this, options.position || {x: 0, y: 0}); // par défaut au sol mais non accessible
    }
    fire(power) {
      this.state.fire(power);
    }
    pickup(owner) {
      this.changeState(new WeaponSlingshotCarriedState(this, owner));
    }
    update() {
      this.state.update();
    }
};

const ProjectileMinimumSpeed = 500;
const ProjectileMaximumSpeed = 1000;
const ProjectileMinimumSize = 8;
const ProjectileMaximumSize = 16;
const ProjectileOnGroundSize = 20;
const ProjectileMaximumBounces = 3;
const ProjectileSpriteSizeRadio = 24;

function getProjectileSpeed(power) {
  return power * (ProjectileMaximumSpeed - ProjectileMinimumSpeed) / 100 + ProjectileMinimumSpeed;
}
function getProjectileSize(power) {
  return 20 - power * (ProjectileMaximumSize - ProjectileMinimumSize) / 100;
}

class WeaponSlingshotOnGroundState extends WS.Lib.WeaponState {
  constructor(weapon, position) {
    super(weapon);
    log.debug(`${this.weapon.id} > Changing state to ${this.constructor.name}`);

    const projectileSprite = this.projectileSprite = WS.game.Groups.Objects.create(
      position.x,
      position.y,
      'weapon-slingshot'
    );
    this.projectileSprite.angle = _.random(-180, 180);
    WS.game.physics.p2.enable(projectileSprite, WS.Config.Debug);
    projectileSprite.body.setCircle(ProjectileOnGroundSize);
    projectileSprite.body.data.shapes[0].sensor = true;
    projectileSprite.body.fixedRotation = true;

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
  update() {
    this.projectileSprite.angle += 1;
  }
}

class WeaponSlingshotCarriedState extends WS.Lib.WeaponState {
  constructor(weapon, owner) {
    super(weapon);
    this.owner = owner;
  }
  fire(power) {
    log.debug('Firing weapon !');
    // const power = Math.floor(Math.random() * 101);
    this.weapon.changeState(new WeaponSlingshotFiredState(this.weapon, this.owner, power));
  }
}

/*
En fonction de la puissance power [0, 100]
On fait varier la vitesse de 500 à 1000 et la taille de 20 à 8
*/
class WeaponSlingshotFiredState extends WS.Lib.WeaponState {
  constructor(weapon, owner, power) {
    super(weapon);
    this.owner = owner;

    this.bounceLeft = ProjectileMaximumBounces;
    const ownerPosition = this.owner.sprite.position;
    const ownerRotation = this.owner.sprite.rotation;

    const projectileSprite = this.projectileSprite = WS.game.Groups.Projectiles.create(
      ownerPosition.x + Math.cos(ownerRotation) * WS.Config.RockProjectileOffset,
      ownerPosition.y + Math.sin(ownerRotation) * WS.Config.RockProjectileOffset,
      'weapon-slingshot-projectile'
    );
    projectileSprite.tint = this.owner.playerColor.tint;
    WS.game.physics.p2.enable(projectileSprite, WS.Config.Debug);
    projectileSprite.scale.setTo(getProjectileSize(power) / ProjectileSpriteSizeRadio);
    // log.debug(`projectile power ${power}`);
    // log.debug(`projectile size ${this.getProjectileSize(power)}`);
    // log.debug(`projectile speed ${this.getProjectileSpeed(power)}`);
    projectileSprite.body.setCircle(getProjectileSize(power));
    projectileSprite.body.fixedRotation = true;
    projectileSprite.body.rotation = ownerRotation;
    const projectileSpeed = getProjectileSpeed(power);
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
