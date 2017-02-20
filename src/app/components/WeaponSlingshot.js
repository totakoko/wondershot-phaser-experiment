import WS from '../WS';
const log = require('misc/loglevel').getLogger('WeaponSlingshot'); // eslint-disable-line no-unused-vars

export default WS.Components.WeaponSlingshot = class WeaponSlingshot extends WS.Lib.Weapon.Weapon {
    static preload() {
      WS.game.load.image('weapon-slingshot', 'assets/images/weapon-slingshot.png');
      WS.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    constructor(options) {
      super({
        states: {
          Carried: WeaponCarriedState,
          Flying: WeaponFlyingState,
          Ground: WeaponOnGroundState
        },
        startOptions: options
      });
    }
};

const ProjectileMinimumSpeed = 500;
const ProjectileMaximumSpeed = 1000;
const ProjectileMinimumSize = 8;
const ProjectileMaximumSize = 16;
const ProjectileMaximumBounces = 3;
const ProjectileSpriteSizeRadio = 24;
const WeaponCarriedDistance = 30;

class WeaponOnGroundState extends WS.Lib.Weapon.WeaponOnGroundState {
  constructor(weapon, options) {
    super(weapon, {
      position: options.position,
      spriteName: 'weapon-slingshot'
    });
  }
}

class WeaponCarriedState extends WS.Lib.Weapon.WeaponCarriedState {
  constructor(weapon, options) {
    super(weapon, {
      owner: options.owner,
      spriteName: 'weapon-slingshot'
    });

    this.update();
  }
  fire(power) {
    log.debug('Firing weapon !');
    this.weapon.changeStateToFlying({
      owner: this.owner,
      power: power
    });
    this.owner.weapon = null;
  }
  update() {
    // on place l'arme légèrement devant le joueur
    const targetWeaponPositionRotation = this.owner.sprite.rotation + 0.2; // petit décalage pour ne pas être au milieu du joueur
    this.sprite.x = this.owner.sprite.body.x + Math.cos(targetWeaponPositionRotation) * WeaponCarriedDistance;
    this.sprite.y = this.owner.sprite.body.y + Math.sin(targetWeaponPositionRotation) * WeaponCarriedDistance;
    this.sprite.angle = this.owner.sprite.angle + 90; // orientation par rapport à celle du joueur
  }
  cleanup() {
    this.sprite.destroy();
    this.spawnAnimation.manager.remove(this.spawnAnimation);
  }
}

/*
En fonction de la puissance power [0, 100]
On fait varier la vitesse de 500 à 1000 et la taille de 20 à 8
*/
class WeaponFlyingState extends WS.Lib.Weapon.WeaponFlyingState {
  constructor(weapon, options) {
    super(weapon, {
      owner: options.owner,
      power: options.power,
      spriteName: 'weapon-slingshot-projectile',
      projectileOffset: WS.Config.RockProjectileOffset,
    });

    const projectileSize = getProjectileSize(this.power);
    this.sprite.scale.setTo(projectileSize / ProjectileSpriteSizeRadio);
    this.sprite.body.setCircle(projectileSize);
    const ownerRotation = this.owner.sprite.rotation;
    const projectileSpeed = getProjectileSpeed(this.power);
    this.sprite.body.rotation = ownerRotation;
    this.sprite.body.velocity.x = Math.cos(ownerRotation) * projectileSpeed;
    this.sprite.body.velocity.y = Math.sin(ownerRotation) * projectileSpeed;
    this.sprite.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot);

    this.bounceLeft = ProjectileMaximumBounces;
    this.setupImpactHandlers();
  }
  projectileArenaHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
      if (this.bounceLeft > 0) {
          this.bounceLeft--;
          return;
      }
      this.weapon.changeStateToGround({
        position: {
          x: projectileBody.x,
          y: projectileBody.y,
        }
      });
  }
  projectilePlayerHitHandler(projectileBody, playerBody, shapeA, shapeB, equation) {
      log.info(`Player ${this.owner.playerNumber} just hit ${playerBody.sprite.data.owner.playerNumber}`);
      playerBody.sprite.data.owner.kill();
      this.owner.pickupWeapon(this.weapon); // rechargement de l'arme
  }
}

function getProjectileSpeed(power) {
  return power * (ProjectileMaximumSpeed - ProjectileMinimumSpeed) / 100 + ProjectileMinimumSpeed;
}
function getProjectileSize(power) {
  return 20 - power * (ProjectileMaximumSize - ProjectileMinimumSize) / 100;
}
