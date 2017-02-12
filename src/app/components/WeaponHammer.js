import _ from 'lodash';
import WS from '../WS';
const log = require('misc/loglevel').getLogger('WeaponHammer'); // eslint-disable-line no-unused-vars

export default WS.Components.WeaponHammer = class WeaponHammer extends WS.Components.Weapon {
    static preload() {
      WS.game.load.image('weapon-hammer', 'assets/images/weapon-hammer.png');
    }
    constructor(options) {
      super(options);
      this.state = new WeaponHammerOnGroundState(this, options.position || {x: 0, y: 0}); // par défaut au sol mais non accessible
    }
    fire(power) {
      this.state.fire(power);
    }
    pickup(owner) {
      this.changeState(new WeaponHammerCarriedState(this, owner));
    }
    update() {
      if (!WS.game.physics.p2.paused) {
        this.state.update();
      }
    }
};

const ProjectileOnGroundSize = 20;
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

class WeaponHammerOnGroundState extends WS.Lib.WeaponState {
  constructor(weapon, position) {
    super(weapon);
    log.debug(`${this.weapon.id} > Changing state to ${this.constructor.name}`);

    const projectileSprite = this.projectileSprite = WS.game.Groups.Objects.create(
      position.x,
      position.y,
      'weapon-hammer'
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

    projectileSprite.scale.setTo(0);
    this.spawnAnimation = WS.game.add.tween(projectileSprite.scale)
      .to({x: 1, y: 1}, 300, WS.Phaser.Easing.Linear.None)
      .start();
  }
  cleanup() {
    this.projectileSprite.destroy();
    this.spawnAnimation.manager.remove(this.spawnAnimation);
  }
  onBeginContact(contactBody, data, shapeA, shapeB, contactEquations) {
    // log.debug(`weapon ${this.name} touches ${contactBody.sprite.key}`);
    // on fait bouger l'arme si un mur la pousse
    if (contactBody.sprite.key === 'wall') {
      const movement = {
        x: contactBody.sprite.position.x - contactBody.sprite.previousPosition.x,
        y: contactBody.sprite.position.y - contactBody.sprite.previousPosition.y,
      };
      // log.debug(`diff = {${movement.x}, ${movement.y} }`);
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

class WeaponHammerCarriedState extends WS.Lib.WeaponState {
  constructor(weapon, owner) {
    super(weapon);
    this.owner = owner;

    this.sprite = WS.game.Groups.Objects.create(
      this.owner.sprite.body.x,
      this.owner.sprite.body.y,
      'weapon-hammer'
    );
    this.sprite.anchor.setTo(0.5, 0.8);

    this.spawnAnimation = WS.game.add.tween(this.sprite.scale)
      .to({x: 1.5, y: 1.5}, 150, WS.Phaser.Easing.Linear.None)
      .to({x: 1, y: 1}, 200, WS.Phaser.Easing.Linear.None)
      .start();

    this.owner.onKilledEvent.add(this.drop, this);

    this.attackAnimationData = {
      weaponAngle: AttackAnimationIdleAngle,
      weaponAttachmentAngle: WeaponAttachmentIdleAngle,
      weaponAttachmentDistance: WeaponAttachmentIdleDistance
    };
    this.update();
  }
  fire(power) {
    if (this.weaponInUse) {
      log.debug('Weapon in use');
      return;
    }
    this.weaponInUse = true;

    // this.weapon.changeState(new WeaponHammerFiredState(this.weapon, this.owner, power));
    if (power > 70) {
      // saut + lancer du marteau au sol
      this.longAttack();
    } else {
      // attaque simple
      this.shortAttack();
    }
  }
  shortAttack() {
    log.debug('shortAttack');
    /*
    * The angle of the Body in radians.
    * If you wish to work in degrees instead of radians use the Body.angle property instead. Working in radians is faster as it doesn't have to convert values.
    *
    body rotation -> this.data.angle (rad)
    body angle -> wrapAngle radToDef(this.data.angle)) (deg)

    sprite rotation = radiant
    */
    // Animation en deux temps, d'abord, le marteau part en avant et tue les joueurs présents dans la zone
    // puis le marteau se replace et devient à nouveau utilisable
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
      hitAreaBody.collides(projectilePhysics.OtherPlayers, this.playerHitHandler, this);
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
  longAttack() {
    log.debug('shortAttack');
    /*
    * The angle of the Body in radians.
    * If you wish to work in degrees instead of radians use the Body.angle property instead. Working in radians is faster as it doesn't have to convert values.
    *
    body rotation -> this.data.angle (rad)
    body angle -> wrapAngle radToDef(this.data.angle)) (deg)

    sprite rotation = radiant
    */
    // Animation en deux temps, d'abord, le marteau part en avant et tue les joueurs présents dans la zone
    // puis le marteau se replace et devient à nouveau utilisable
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
      hitAreaBody.collides(projectilePhysics.OtherPlayers, this.playerHitHandler, this);
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
  playerHitHandler(projectileBody, playerBody, shapeA, shapeB, equation) {
      log.info(`Player ${this.owner.playerNumber} just hit ${playerBody.sprite.data.owner.playerNumber}`);
      playerBody.sprite.data.owner.kill();
      // this.owner.pickupWeapon(this.weapon); // rechargement de l'arme
  }
  update() {
    // on place l'arme légèrement devant le joueur
    const targetWeaponPositionRotation = this.owner.sprite.rotation + this.attackAnimationData.weaponAttachmentAngle; // petit décalage pour ne pas être au milieu du joueur
    this.sprite.x = this.owner.sprite.body.x + Math.cos(targetWeaponPositionRotation) * this.attackAnimationData.weaponAttachmentDistance;
    this.sprite.y = this.owner.sprite.body.y + Math.sin(targetWeaponPositionRotation) * this.attackAnimationData.weaponAttachmentDistance;
    this.sprite.rotation = this.owner.sprite.rotation + this.attackAnimationData.weaponAngle; // orientation par rapport à celle du joueur
  }
  drop() {
    this.weapon.changeState(new WeaponHammerOnGroundState(this.weapon, {
      x: this.owner.sprite.x,
      y: this.owner.sprite.y,
    }));
  }
  cleanup() {
    this.sprite.destroy();
    this.owner.onKilledEvent.remove(this.drop, this);
    this.spawnAnimation.manager.remove(this.spawnAnimation);
    this.spawnAnimation.manager.remove(this.attackAnimation);
  }
}
