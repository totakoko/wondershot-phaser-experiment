import WS from '../../WS'
import logger from 'loglevel'
const log = logger.getLogger('WeaponFlyingState') // eslint-disable-line no-unused-vars

/*
Etat des armes portées par un joueur avec en commun :
- l'animation de pickup/spawn (constructor)
- le déplacement de l'arme avec le joueur (update)
- l'animation de l'attaque (update)
- la détection de collision avec un joueur
- le tir de projectile
*/
export default WS.Lib.Weapon.WeaponFlyingState = class WeaponFlyingState extends WS.Lib.Weapon.WeaponState {
  constructor (weapon, options) {
    super(weapon)
    this.owner = options.owner
    this.power = options.power

    const ownerPosition = this.owner.sprite.position
    const ownerRotation = this.owner.sprite.rotation

    this.sprite = WS.game.Groups.Projectiles.create(
      ownerPosition.x + Math.cos(ownerRotation) * options.projectileOffset,
      ownerPosition.y + Math.sin(ownerRotation) * options.projectileOffset,
      'weapon-slingshot-projectile'
    )
    WS.game.physics.p2.enable(this.sprite, WS.Config.Debug)
  }
  setupImpactHandlers () {
    const projectilePhysics = WS.Services.PhysicsManager[`Projectile${this.owner.playerNumber}`]
    this.sprite.body.setCollisionGroup(projectilePhysics.id)
    this.sprite.body.collides(projectilePhysics.Arena, this.projectileArenaHitHandler, this)
    this.sprite.body.collides(projectilePhysics.OtherPlayers, this.projectilePlayerHitHandler, this)
  }
  cleanup () {
    this.sprite.destroy()
  }
  projectileArenaHitHandler (projectileBody, bodyB, shapeA, shapeB, equation) {
    throw new Error('Not implemented')
  }
  projectilePlayerHitHandler (projectileBody, playerBody, shapeA, shapeB, equation) {
    log.info(`Player ${this.owner.playerNumber} just hit ${playerBody.sprite.data.owner.playerNumber}`)
    playerBody.sprite.data.owner.kill()
    this.owner.pickupWeapon(this.weapon) // rechargement de l'arme
  }
}
