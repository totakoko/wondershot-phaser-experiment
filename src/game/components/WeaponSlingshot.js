import logger from 'loglevel'
import config from '@/game/config.js'
import Weapon from '@/game/lib/weapon/Weapon.js'
import WeaponOnGroundState from '@/game/lib/weapon/WeaponOnGroundState.js'
import WeaponCarriedState from '@/game/lib/weapon/WeaponCarriedState.js'
import WeaponFlyingState from '@/game/lib/weapon/WeaponFlyingState.js'
const log = logger.getLogger('WeaponSlingshot') // eslint-disable-line no-unused-vars

export default class WeaponSlingshot extends Weapon {
  constructor (options) {
    super({
      states: {
        Carried: CarriedState,
        Flying: FlyingState,
        Ground: OnGroundState
      },
      startOptions: options
    })
  }
}

const ProjectileMinimumSpeed = 500
const ProjectileMaximumSpeed = 1000
const ProjectileMinimumSize = 8
const ProjectileMaximumSize = 16
const ProjectileMaximumBounces = 3
const ProjectileSpriteSizeRadio = 24
const WeaponCarriedDistance = 30

class OnGroundState extends WeaponOnGroundState {
  constructor (weapon, options) {
    super(weapon, {
      position: options.position,
      spriteName: 'weapon-slingshot'
    })
  }
}

class CarriedState extends WeaponCarriedState {
  constructor (weapon, options) {
    super(weapon, {
      owner: options.owner,
      spriteName: 'weapon-slingshot'
    })

    this.update()
  }
  fire (power) {
    log.debug('Firing weapon !')
    this.weapon.changeStateToFlying({
      owner: this.owner,
      power: power
    })
    this.owner.weapon = null
  }
  update () {
    // on place l'arme légèrement devant le joueur
    const targetWeaponPositionRotation = this.owner.sprite.rotation + 0.2 // petit décalage pour ne pas être au milieu du joueur
    this.sprite.x = this.owner.sprite.body.x + Math.cos(targetWeaponPositionRotation) * WeaponCarriedDistance
    this.sprite.y = this.owner.sprite.body.y + Math.sin(targetWeaponPositionRotation) * WeaponCarriedDistance
    this.sprite.angle = this.owner.sprite.angle + 90 // orientation par rapport à celle du joueur
  }
}

/*
En fonction de la puissance power [0, 100]
On fait varier la vitesse de 500 à 1000 et la taille de 20 à 8
*/
class FlyingState extends WeaponFlyingState {
  constructor (weapon, options) {
    super(weapon, {
      owner: options.owner,
      power: options.power,
      spriteName: 'weapon-slingshot-projectile',
      projectileOffset: config.RockProjectileOffset
    })

    const projectileSize = getProjectileSize(this.power)
    this.sprite.scale.setTo(projectileSize / ProjectileSpriteSizeRadio)
    this.sprite.body.setCircle(projectileSize)
    const ownerRotation = this.owner.sprite.rotation
    const projectileSpeed = getProjectileSpeed(this.power)
    this.sprite.body.rotation = ownerRotation
    this.sprite.body.velocity.x = Math.cos(ownerRotation) * projectileSpeed
    this.sprite.body.velocity.y = Math.sin(ownerRotation) * projectileSpeed
    // this.sprite.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot)

    this.bounceLeft = ProjectileMaximumBounces
    this.setupImpactHandlers()
  }
  projectileArenaHitHandler (projectileBody, bodyB, shapeA, shapeB, equation) {
    if (this.bounceLeft > 0) {
      this.bounceLeft--
      return
    }
    this.weapon.changeStateToGround({
      position: {
        x: projectileBody.x,
        y: projectileBody.y
      }
    })
  }
  projectilePlayerHitHandler (projectileBody, playerBody, shapeA, shapeB, equation) {
    log.info(`Player ${this.owner.playerNumber} just hit ${playerBody.sprite.data.owner.playerNumber}`)
    playerBody.sprite.data.owner.kill()
    this.owner.pickupWeapon(this.weapon) // rechargement de l'arme
  }
}

function getProjectileSpeed (power) {
  return power * (ProjectileMaximumSpeed - ProjectileMinimumSpeed) / 100 + ProjectileMinimumSpeed
}
function getProjectileSize (power) {
  return 20 - power * (ProjectileMaximumSize - ProjectileMinimumSize) / 100
}
