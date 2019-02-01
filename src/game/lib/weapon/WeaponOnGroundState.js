import _ from 'lodash'
import WS from '../../WS'
import logger from 'loglevel'
const log = logger.getLogger('WeaponOnGroundState') // eslint-disable-line no-unused-vars

const ProjectileOnGroundSize = 20

/*
Etat des armes au sol avec en commun :
- l'animation de spawn (constructor)
- l'animation de l'icone (update)
- la détection de collision avec un joueur
- la détection de collision avec le décors
- le pickup par un joueur et cleanup
*/
export default WS.Lib.Weapon.WeaponOnGroundState = class WeaponOnGroundState extends WS.Lib.Weapon.WeaponState {
  /*
  options = {
    spriteName
  }
  */
  constructor (weapon, options) {
    super(weapon)

    const sprite = this.sprite = WS.game.Groups.Objects.create(
      options.position.x,
      options.position.y,
      options.spriteName
    )
    sprite.angle = _.random(-180, 180)
    WS.game.physics.p2.enable(sprite, WS.Config.Debug)
    sprite.body.setCircle(ProjectileOnGroundSize)
    sprite.body.data.shapes[0].sensor = true
    sprite.body.fixedRotation = true

    const projectilePhysics = WS.Services.PhysicsManager.Objects
    sprite.body.setCollisionGroup(projectilePhysics.id)
    sprite.body.collides(projectilePhysics.Players)
    sprite.body.collides(projectilePhysics.Arena)
    sprite.body.onBeginContact.add(this.onBeginContact, this)

    sprite.scale.setTo(0)
    this.spawnAnimation = WS.game.add.tween(sprite.scale)
      .to({ x: 1, y: 1 }, 300, WS.Phaser.Easing.Linear.None)
      .start()
  }
  cleanup () {
    this.sprite.destroy()
    this.spawnAnimation.manager.remove(this.spawnAnimation)
  }
  onBeginContact (contactBody, data, shapeA, shapeB, contactEquations) {
    // log.debug(`weapon ${this.name} touches ${contactBody.sprite.key}`);
    // on fait bouger l'arme si un mur la pousse
    if (contactBody.sprite.key === 'wall') {
      const movement = {
        x: contactBody.sprite.position.x - contactBody.sprite.previousPosition.x,
        y: contactBody.sprite.position.y - contactBody.sprite.previousPosition.y
      }
      // log.debug(`diff = {${movement.x}, ${movement.y} }`);
      this.sprite.body.x += movement.x * 2 // MAGIC NUMBER !!
      this.sprite.body.y += movement.y * 2
    } else
    // un joueur n'ayant pas d'arme prend l'arme au sol
    if (contactBody.sprite.key === 'player') {
      contactBody.sprite.data.owner.pickupWeapon(this.weapon)
    }
  }
  update () {
    this.sprite.angle += 1
  }
}
