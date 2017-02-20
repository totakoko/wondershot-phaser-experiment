import WS from '../WS';
const log = require('misc/loglevel').getLogger('WeaponHammer'); // eslint-disable-line no-unused-vars

/*
Arme marteau :

*/
export default WS.Components.WeaponHammer = class WeaponHammer extends WS.Lib.Weapon.Weapon {
    static preload() {
      WS.game.load.image('weapon-hammer', 'assets/images/weapon-hammer.png');
    }
    constructor(options) {
      super({
        states: {
          Carried: WeaponCarriedState,
          Ground: WeaponOnGroundState
        },
        startOptions: options
      });
    }
};

class WeaponOnGroundState extends WS.Lib.Weapon.WeaponOnGroundState {
  constructor(weapon, options) {
    super(weapon, {
      position: options.position,
      spriteName: 'weapon-hammer'
    });
  }
}

const AttackAnimationIdleAngle = Math.PI * 5 / 4;
const AttackAnimationEndAngle = Math.PI / 3;
const WeaponAttachmentIdleAngle = Math.PI / 1.5;
const WeaponAttachmentEndAngle = 0;
const WeaponAttachmentIdleDistance = 20;
const WeaponAttachmentEndDistance = 30;
const LongAttackWeaponAttachmentDistance = 70;
const WeaponHitAreaDistance = 50;
const LongAttackHitAreaDistance = 100;
const WeaponHitAreaSize = 25;

class WeaponCarriedState extends WS.Lib.Weapon.WeaponCarriedState {
  constructor(weapon, options) {
    super(weapon, {
      owner: options.owner,
      spriteName: 'weapon-hammer'
    });
    this.sprite.anchor.setTo(0.5, 0.8);

    this.attackAnimationData = {
      weaponAngle: AttackAnimationIdleAngle,
      weaponAttachmentAngle: WeaponAttachmentIdleAngle,
      weaponAttachmentDistance: WeaponAttachmentIdleDistance
    };
    this.alternateAttackPowerThreshold = 70;

    this.update();
  }
  fire(power) {
    if (this.weaponInUse) {
      log.debug('Weapon in use');
      return;
    }
    this.weaponInUse = true;

    // this.weapon.changeState(new WeaponHammerFiredState(this.weapon, this.owner, power));
    if (power < this.alternateAttackPowerThreshold) {
        // attaque simple
      this.mainAttack(power);
    } else {
      // saut + lancer du marteau au sol
      this.alternateAttack(power);
    }
  }
  // Animation en deux temps, d'abord, le marteau part en avant et tue les joueurs présents dans la zone
  // puis le marteau se replace et devient à nouveau utilisable
  mainAttack(power) {
    log.debug('mainAttack');
    this.attackAnimation = WS.game.add.tween(this.attackAnimationData)
      .to({
        weaponAngle: AttackAnimationEndAngle,
        weaponAttachmentAngle: WeaponAttachmentEndAngle,
        weaponAttachmentDistance: WeaponAttachmentEndDistance
      }, 100, WS.Phaser.Easing.Linear.None);
    this.reloadAnimation = WS.game.add.tween(this.attackAnimationData)
      .to({
        weaponAngle: AttackAnimationIdleAngle,
        weaponAttachmentAngle: WeaponAttachmentIdleAngle,
        weaponAttachmentDistance: WeaponAttachmentIdleDistance
      }, 100, WS.Phaser.Easing.Linear.None);

    this.attackAnimation.chain(this.reloadAnimation).start();
    this.attackAnimation.onComplete.add(() => {
      log.debug('Hammer hit the ground');
      const hitAreaBody = WS.game.physics.p2.createBody(
        this.owner.sprite.body.x + Math.cos(this.owner.sprite.rotation) * WeaponHitAreaDistance,
        this.owner.sprite.body.y + Math.sin(this.owner.sprite.rotation) * WeaponHitAreaDistance,
        0,
        true // addToWorld
      );
      hitAreaBody.setCircle(WeaponHitAreaSize);
      const projectilePhysics = WS.Services.PhysicsManager[`Projectile${this.owner.playerNumber}`];
      hitAreaBody.setCollisionGroup(projectilePhysics.id);
      hitAreaBody.collides(projectilePhysics.OtherPlayers, this.playerHitKillHandler, this);
      hitAreaBody.debug = WS.Config.Debug;
      setTimeout(() => {
        hitAreaBody.destroy();
      }, 50);
    });
    this.reloadAnimation.onComplete.add(() => {
      log.debug('Weapon ready');
      this.weaponInUse = false;
    });
  }
  // Animation en deux temps, d'abord, le marteau est jeté bien en avant, le joueur saute et lance le marteau
  alternateAttack(power) {
    log.debug('alternateAttack');
    this.attackAnimation = WS.game.add.tween(this.attackAnimationData)
      .to({
        weaponAngle: AttackAnimationEndAngle,
        weaponAttachmentAngle: WeaponAttachmentEndAngle,
        weaponAttachmentDistance: LongAttackWeaponAttachmentDistance
      }, 100, WS.Phaser.Easing.Linear.None);
    this.reloadAnimation = WS.game.add.tween(this.attackAnimationData)
      .to({
        weaponAngle: AttackAnimationIdleAngle,
        weaponAttachmentAngle: WeaponAttachmentIdleAngle,
        weaponAttachmentDistance: WeaponAttachmentIdleDistance
      }, 100, WS.Phaser.Easing.Linear.None);

    this.attackAnimation.chain(this.reloadAnimation).start();
    this.attackAnimation.onComplete.add(() => {
      log.debug('Hammer hit the ground');
      const hitAreaBody = WS.game.physics.p2.createBody(
        this.owner.sprite.body.x + Math.cos(this.owner.sprite.rotation) * LongAttackHitAreaDistance,
        this.owner.sprite.body.y + Math.sin(this.owner.sprite.rotation) * LongAttackHitAreaDistance,
        0,
        true // addToWorld
      );
      hitAreaBody.setCircle(WeaponHitAreaSize);
      const projectilePhysics = WS.Services.PhysicsManager[`Projectile${this.owner.playerNumber}`];
      hitAreaBody.setCollisionGroup(projectilePhysics.id);
      hitAreaBody.collides(projectilePhysics.OtherPlayers, this.playerHitKillHandler, this);
      hitAreaBody.debug = WS.Config.Debug;
      setTimeout(() => {
        hitAreaBody.destroy();
      }, 50);
    });
    this.reloadAnimation.onComplete.add(() => {
      log.debug('Weapon ready');
      this.weaponInUse = false;
    });
  }
  update() {
    // on place l'arme légèrement devant le joueur
    const targetWeaponPositionRotation = this.owner.sprite.rotation + this.attackAnimationData.weaponAttachmentAngle; // petit décalage pour ne pas être au milieu du joueur
    this.sprite.x = this.owner.sprite.body.x + Math.cos(targetWeaponPositionRotation) * this.attackAnimationData.weaponAttachmentDistance;
    this.sprite.y = this.owner.sprite.body.y + Math.sin(targetWeaponPositionRotation) * this.attackAnimationData.weaponAttachmentDistance;
    this.sprite.rotation = this.owner.sprite.rotation + this.attackAnimationData.weaponAngle; // orientation par rapport à celle du joueur
  }
  cleanup() {
    super.cleanup();
    this.spawnAnimation.manager.remove(this.attackAnimation);
  }
}
